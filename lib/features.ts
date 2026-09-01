import { createHash } from "node:crypto";
import { NextRequest } from "next/server";
import { apiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/session";

/**
 * Feature resolution. Mirrors lib/rbac.ts on purpose — same shape, same naming,
 * so nobody has to learn two systems.
 *
 * A permission answers "may this user do X"; a feature answers "does this
 * workspace have X at all". They are independent and a gated route asks both.
 * See docs/plans-and-features-plan.md.
 */

/** Every feature key. Keeps bare strings out of call sites. */
export const FEATURES = {
  // Entitlements — billing owns these, they live on plans.
  CUSTOM_BRANDING: "custom_branding",
  CUSTOM_DOMAIN: "custom_domain",
  API_ACCESS: "api_access",
  PROOF_OF_PLAY_EXPORT: "proof_of_play_export",
  PRIORITY_SUPPORT: "priority_support",

  // Flags — engineering owns these, they are deleted once fully rolled out.
  SENSOR_TRIGGERED_CONTENT: "sensor_triggered_content",
  AI_CONTENT_SUGGESTIONS: "ai_content_suggestions",
  BULK_DEVICE_COMMANDS: "bulk_device_commands",
  ADVANCED_ANALYTICS_V2: "advanced_analytics_v2",
  WHITE_LABEL_EMAIL: "white_label_email",
} as const;

export type FeatureKey = (typeof FEATURES)[keyof typeof FEATURES];

export type QuotaResource = "devices" | "users" | "rules" | "storageGb";

/**
 * Stable rollout bucket. Hashing the tenant id — never Math.random(), never the
 * user id — is what keeps a workspace on one side of a rollout across requests
 * and across the people in it.
 */
export function rolloutBucket(tenantId: string, key: string): number {
  const digest = createHash("sha256").update(`${key}:${tenantId}`).digest();
  return digest.readUInt32BE(0) % 100;
}

/**
 * The effective feature set for a tenant, resolved per the precedence in
 * docs/plans-and-features-plan.md §2.1:
 *
 *   1. flag kill switch   — beats everything, including a paying Enterprise
 *   2. tenant override    — explicit on/off for this workspace
 *   3. rollout percentage — stable bucket on the tenant id
 *   4. plan entitlement   — is it attached to the tenant's plan
 *   5. default            — off
 *
 * One query for the catalogue, one for the tenant's own state. Not one per key.
 */
export async function getTenantFeatures(tenantId: string): Promise<Set<string>> {
  const [features, overrides, subscription, defaultPlan] = await Promise.all([
    prisma.feature.findMany({
      select: {
        key: true,
        kind: true,
        enabled: true,
        rolloutPct: true,
        plans: { select: { planId: true } },
      },
    }),
    prisma.tenantFeature.findMany({
      where: { tenantId },
      select: { enabled: true, feature: { select: { key: true } } },
    }),
    prisma.subscription.findFirst({
      where: { tenantId, status: { in: ["ACTIVE", "TRIAL", "PAST_DUE"] } },
      orderBy: { createdAt: "desc" },
      select: { planId: true },
    }),
    // A tenant with no subscription falls back to the default plan rather than
    // to nothing — otherwise every unsubscribed workspace loses everything the
    // moment gating ships.
    prisma.plan.findFirst({ where: { isDefault: true }, select: { id: true } }),
  ]);

  const planId = subscription?.planId ?? defaultPlan?.id ?? null;
  const overrideByKey = new Map(overrides.map((o) => [o.feature.key, o.enabled]));
  const enabled = new Set<string>();

  for (const feature of features) {
    // 1. kill switch
    if (feature.kind === "FLAG" && feature.enabled === false) continue;

    // 2. tenant override
    const override = overrideByKey.get(feature.key);
    if (override !== undefined) {
      if (override) enabled.add(feature.key);
      continue;
    }

    // 3. rollout — only narrows; a tenant outside the bucket does not get it yet
    if (feature.rolloutPct !== null && feature.rolloutPct !== undefined) {
      if (rolloutBucket(tenantId, feature.key) >= feature.rolloutPct) continue;
    }

    // 4. plan entitlement
    if (planId && feature.plans.some((link) => link.planId === planId)) {
      enabled.add(feature.key);
      continue;
    }

    // A flag that is globally on and attached to no plan is on for everyone it
    // rolled out to; that is what "kind = FLAG" means.
    if (feature.kind === "FLAG" && feature.enabled === true && feature.plans.length === 0) {
      enabled.add(feature.key);
    }

    // 5. default off — fall through
  }

  return enabled;
}

export function hasFeature(features: Set<string> | undefined | null, key: string): boolean {
  return features instanceof Set && features.has(key);
}

/**
 * Route guard. Returns the same `{ response }` / `{ user }` shape as
 * requireAdmin and requirePermission so handlers keep one idiom.
 *
 * 402 for a missing entitlement — the client can turn that into an upgrade
 * prompt. 404 for a flag that is off, so a dark feature is indistinguishable
 * from a route that does not exist.
 */
export async function requireFeature(request: NextRequest, key: FeatureKey) {
  const user = await getAuthenticatedUser(request);
  if (!user) return { response: apiError("Authentication required.", 401) };

  const features = await getTenantFeatures(user.tenantId);
  if (hasFeature(features, key)) return { user, features };

  const feature = await prisma.feature.findUnique({
    where: { key },
    select: { kind: true, name: true },
  });

  if (feature?.kind === "FLAG") {
    return { response: apiError("Not found.", 404) };
  }

  return {
    response: apiError(
      `${feature?.name ?? "This feature"} is not included in your current plan.`,
      402,
    ),
  };
}

const BYTES_PER_GB = 1024 ** 3;

/** Plan limits for a tenant. Null on any field means unlimited. */
async function getTenantLimits(tenantId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: { tenantId, status: { in: ["ACTIVE", "TRIAL", "PAST_DUE"] } },
    orderBy: { createdAt: "desc" },
    select: {
      plan: {
        select: { name: true, maxDevices: true, maxStorageGb: true, maxUsers: true, maxRules: true },
      },
    },
  });
  if (subscription) return subscription.plan;

  return prisma.plan.findFirst({
    where: { isDefault: true },
    select: { name: true, maxDevices: true, maxStorageGb: true, maxUsers: true, maxRules: true },
  });
}

/**
 * Current usage of one quota. Counting matches app/api/admin/tenants/route.ts
 * so the number a tenant is blocked on is the number the admin sees.
 */
async function getUsage(tenantId: string, resource: QuotaResource): Promise<number> {
  switch (resource) {
    case "devices":
      return prisma.device.count({ where: { tenantId } });
    case "users":
      return prisma.user.count({ where: { tenantId } });
    case "rules":
      return 0; // No sensor-rules table yet; the quota is declared, not reachable.
    case "storageGb": {
      const media = await prisma.media.aggregate({
        where: { tenantId },
        _sum: { sizeBytes: true },
      });
      return Number(media._sum.sizeBytes ?? BigInt(0)) / BYTES_PER_GB;
    }
  }
}

const QUOTA_LABEL: Record<QuotaResource, string> = {
  devices: "screens",
  users: "team members",
  rules: "sensor rules",
  storageGb: "storage",
};

/**
 * Returns a 402 response when adding `adding` more of `resource` would exceed
 * the tenant's plan, or null when there is room. Null limit = unlimited.
 *
 * `adding` is in GB for storageGb — check before handing out an upload URL, not
 * after the bytes land, or every tenant overshoots by one large file.
 */
export async function assertQuota(tenantId: string, resource: QuotaResource, adding = 1) {
  const plan = await getTenantLimits(tenantId);
  if (!plan) return null; // No plan and no default configured: nothing to enforce.

  const limit =
    resource === "devices"
      ? plan.maxDevices
      : resource === "users"
        ? plan.maxUsers
        : resource === "rules"
          ? plan.maxRules
          : plan.maxStorageGb;

  if (limit === null || limit === undefined) return null;

  const used = await getUsage(tenantId, resource);
  if (used + adding <= limit) return null;

  const unit = resource === "storageGb" ? " GB" : "";
  return apiError(
    `Your ${plan.name} plan allows ${limit}${unit} of ${QUOTA_LABEL[resource]} and ${Math.round(used * 100) / 100}${unit} are in use. Upgrade to add more.`,
    402,
  );
}
