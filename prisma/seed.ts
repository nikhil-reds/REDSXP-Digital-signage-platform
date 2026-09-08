import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { FeatureKind, PrismaClient, RoleScope, TenantStatus, UserStatus } from "../app/generated/prisma/client";

import fs from "node:fs";
import path from "node:path";

function loadEnv() {
  if (!process.env.DATABASE_URL) {
    const envPath = path.resolve(__dirname, "../.env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
          const [key, ...valParts] = trimmed.split("=");
          const value = valParts.join("=").replace(/^["']|["']$/g, "");
          if (key && !process.env[key.trim()]) {
            process.env[key.trim()] = value;
          }
        }
      }
    }
  }
}

loadEnv();

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is required.");
  }
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

const prisma = createPrismaClient();

/** Dev-only fallback. Anything other than development must supply its own. */
const DEV_FALLBACK_PASSWORD = "SuperAdmin@123456";

function resolveSuperAdminPassword(): string {
  const fromEnv = process.env.SEED_SUPERADMIN_PASSWORD?.trim();
  if (fromEnv) {
    if (fromEnv.length < 12) {
      throw new Error("SEED_SUPERADMIN_PASSWORD must be at least 12 characters.");
    }
    return fromEnv;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SEED_SUPERADMIN_PASSWORD is required when NODE_ENV=production. " +
        "Refusing to seed the platform super administrator with a known default.",
    );
  }
  console.warn(
    "⚠  SEED_SUPERADMIN_PASSWORD is unset — falling back to the development default. " +
      "Set it in .env before seeding anything shared.",
  );
  return DEV_FALLBACK_PASSWORD;
}

export const SYSTEM_PERMISSIONS = [
  { key: "admin:tenants:read", name: "Read Tenants", resource: "tenants", action: "read", description: "View workspace tenants and organization metadata" },
  { key: "admin:tenants:write", name: "Manage Tenants", resource: "tenants", action: "write", description: "Create, update, or suspend workspace tenants" },
  { key: "admin:tenants:delete", name: "Delete Tenants", resource: "tenants", action: "delete", description: "Delete workspace tenants" },

  { key: "admin:plans:read", name: "Read Plans", resource: "plans", action: "read", description: "View subscription plans and quota limits" },
  { key: "admin:plans:write", name: "Manage Plans", resource: "plans", action: "write", description: "Create and modify subscription plans" },

  { key: "admin:billing:read", name: "Read System Billing", resource: "billing", action: "read", description: "View system-wide revenue, payments, and invoices" },
  { key: "admin:billing:write", name: "Manage System Billing", resource: "billing", action: "write", description: "Modify billing records and payment gateways" },

  { key: "admin:users:read", name: "Read System Users", resource: "users", action: "read", description: "View platform users across all tenants" },
  { key: "admin:users:write", name: "Manage System Users", resource: "users", action: "write", description: "Create and edit platform administrators" },

  { key: "admin:roles:read", name: "Read Admin Roles", resource: "roles", action: "read", description: "View platform administrator roles and permissions" },
  { key: "admin:roles:write", name: "Manage Admin Roles", resource: "roles", action: "write", description: "Create and edit custom platform administrator roles" },

  { key: "admin:audit:read", name: "Read System Audit Logs", resource: "audit", action: "read", description: "View system audit logs across all tenants" },
];

export const TENANT_PERMISSIONS = [
  { key: "media:read", name: "Read Media", resource: "media", action: "read", description: "View media library assets" },
  { key: "media:create", name: "Upload Media", resource: "media", action: "create", description: "Upload new media assets" },
  { key: "media:update", name: "Update Media", resource: "media", action: "update", description: "Edit media asset details" },
  { key: "media:delete", name: "Delete Media", resource: "media", action: "delete", description: "Delete media assets" },

  { key: "playlist:read", name: "Read Playlists", resource: "playlist", action: "read", description: "View playlist content" },
  { key: "playlist:create", name: "Create Playlist", resource: "playlist", action: "create", description: "Create new content playlists" },
  { key: "playlist:update", name: "Update Playlist", resource: "playlist", action: "update", description: "Edit playlists and reorder items" },
  { key: "playlist:delete", name: "Delete Playlist", resource: "playlist", action: "delete", description: "Delete playlists" },

  { key: "schedule:read", name: "Read Schedules", resource: "schedule", action: "read", description: "View playlist calendars and schedules" },
  { key: "schedule:create", name: "Create Schedule", resource: "schedule", action: "create", description: "Create calendar schedules" },
  { key: "schedule:update", name: "Update Schedule", resource: "schedule", action: "update", description: "Edit calendar schedule timing and priority" },
  { key: "schedule:delete", name: "Delete Schedule", resource: "schedule", action: "delete", description: "Remove calendar schedules" },

  { key: "device:read", name: "Read Devices", resource: "device", action: "read", description: "View digital signage display devices" },
  { key: "device:create", name: "Register Device", resource: "device", action: "create", description: "Register new signage devices" },
  { key: "device:update", name: "Update Device", resource: "device", action: "update", description: "Modify device settings and assigned playlists" },
  { key: "device:delete", name: "Unregister Device", resource: "device", action: "delete", description: "Delete signage display devices" },
  { key: "device:reboot", name: "Reboot Device", resource: "device", action: "reboot", description: "Send remote reboot command to devices" },

  { key: "tenant:users:read", name: "Read Workspace Users", resource: "users", action: "read", description: "View workspace team members" },
  { key: "tenant:users:create", name: "Invite Workspace Users", resource: "users", action: "create", description: "Invite new team members" },
  { key: "tenant:users:update", name: "Update Workspace Users", resource: "users", action: "update", description: "Edit team member details and roles" },
  { key: "tenant:users:delete", name: "Remove Workspace Users", resource: "users", action: "delete", description: "Remove team members from workspace" },

  { key: "tenant:roles:read", name: "Read Custom Roles", resource: "roles", action: "read", description: "View workspace custom roles" },
  { key: "tenant:roles:create", name: "Create Custom Roles", resource: "roles", action: "create", description: "Create new workspace custom roles" },
  { key: "tenant:roles:update", name: "Update Custom Roles", resource: "roles", action: "update", description: "Modify permissions of custom roles" },
  { key: "tenant:roles:delete", name: "Delete Custom Roles", resource: "roles", action: "delete", description: "Delete unassigned custom roles" },

  { key: "tenant:audit:read", name: "Read Workspace Audit Logs", resource: "audit", action: "read", description: "View activity audit logs for this workspace" },
];

export async function main() {
  console.log("🌱 Starting RBAC seed process...");

  // 1. Seed SYSTEM Scope Permissions
  for (const perm of SYSTEM_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key: perm.key },
      update: { name: perm.name, resource: perm.resource, action: perm.action, description: perm.description, scope: RoleScope.SYSTEM },
      create: { ...perm, scope: RoleScope.SYSTEM },
    });
  }

  // 2. Seed TENANT Scope Permissions
  for (const perm of TENANT_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key: perm.key },
      update: { name: perm.name, resource: perm.resource, action: perm.action, description: perm.description, scope: RoleScope.TENANT },
      create: { ...perm, scope: RoleScope.TENANT },
    });
  }

  console.log("✅ Seeded permissions (SYSTEM & TENANT).");

  // 3. Seed Default SUPER_ADMIN Role (System Scope)
  const systemPerms = await prisma.permission.findMany({ where: { scope: RoleScope.SYSTEM } });
  
  let superAdminRole = await prisma.role.findFirst({
    where: { tenantId: null, name: "SUPER_ADMIN" },
  });

  if (superAdminRole) {
    superAdminRole = await prisma.role.update({
      where: { id: superAdminRole.id },
      data: {
        scope: RoleScope.SYSTEM,
        isSystem: true,
        description: "Full Platform Super Administrator access",
        permissions: { set: systemPerms.map((p) => ({ id: p.id })) },
      },
    });
  } else {
    superAdminRole = await prisma.role.create({
      data: {
        name: "SUPER_ADMIN",
        tenantId: null,
        scope: RoleScope.SYSTEM,
        isSystem: true,
        description: "Full Platform Super Administrator access",
        permissions: { connect: systemPerms.map((p) => ({ id: p.id })) },
      },
    });
  }

  console.log(`✅ Seeded SUPER_ADMIN role (${superAdminRole.id}).`);

  // 4. Seed Template AGENT_ADMIN Role (Tenant Scope template)
  const tenantPerms = await prisma.permission.findMany({ where: { scope: RoleScope.TENANT } });
  
  let agentAdminRole = await prisma.role.findFirst({
    where: { tenantId: null, name: "AGENT_ADMIN" },
  });

  if (agentAdminRole) {
    agentAdminRole = await prisma.role.update({
      where: { id: agentAdminRole.id },
      data: {
        scope: RoleScope.TENANT,
        isSystem: true,
        description: "Workspace Administrator default role template",
        permissions: { set: tenantPerms.map((p) => ({ id: p.id })) },
      },
    });
  } else {
    agentAdminRole = await prisma.role.create({
      data: {
        name: "AGENT_ADMIN",
        tenantId: null,
        scope: RoleScope.TENANT,
        isSystem: true,
        description: "Workspace Administrator default role template",
        permissions: { connect: tenantPerms.map((p) => ({ id: p.id })) },
      },
    });
  }

  console.log(`✅ Seeded AGENT_ADMIN role template (${agentAdminRole.id}).`);

  // 5. Seed System Admin Tenant & Super Admin User
  const systemTenant = await prisma.tenant.upsert({
    where: { slug: "system-admin" },
    update: { name: "REDS System Administration", status: TenantStatus.ACTIVE },
    create: {
      name: "REDS System Administration",
      slug: "system-admin",
      status: TenantStatus.ACTIVE,
      primaryColor: "#0F172A",
    },
  });

  const superAdminEmail = process.env.SEED_SUPERADMIN_EMAIL || "superadmin@redsxp.com";
  const passwordHash = await bcrypt.hash(resolveSuperAdminPassword(), 12);

  // passwordHash is deliberately absent from `update`: re-seeding an existing
  // environment must not silently reset a password someone has since changed.
  const superAdminUser = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {
      roleId: superAdminRole.id,
      tenantId: systemTenant.id,
      status: UserStatus.ACTIVE,
    },
    create: {
      email: superAdminEmail,
      firstName: "Super",
      lastName: "Admin",
      passwordHash,
      roleId: superAdminRole.id,
      tenantId: systemTenant.id,
      status: UserStatus.ACTIVE,
    },
  });

  console.log(`✅ Seeded Super Admin User (${superAdminUser.email}).`);

  await seedPlansAndFeatures();

  console.log("🎉 Seeding completed successfully!");
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error("❌ Seeding failed:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// Plans & features — docs/plans-and-features-plan.md
// ═══════════════════════════════════════════════════════════════════════════

/** Entitlements are billing-owned. Flags are engineering-owned and temporary. */
export const FEATURE_CATALOGUE = [
  { key: "custom_branding", name: "Custom Branding", kind: FeatureKind.ENTITLEMENT, description: "Replace the REDS logo and accent colour with the workspace's own" },
  { key: "custom_domain", name: "Custom Domain", kind: FeatureKind.ENTITLEMENT, description: "Serve the workspace from its own hostname" },
  { key: "api_access", name: "API Access", kind: FeatureKind.ENTITLEMENT, description: "Programmatic access to media, playlists, and schedules" },
  { key: "proof_of_play_export", name: "Proof-of-Play Export", kind: FeatureKind.ENTITLEMENT, description: "Export per-asset playback logs for advertiser reporting" },
  { key: "priority_support", name: "Priority Support", kind: FeatureKind.ENTITLEMENT, description: "Guaranteed response times and a named contact" },

  { key: "sensor_triggered_content", name: "Sensor-Triggered Content", kind: FeatureKind.FLAG, description: "Play content based on sensor input events", enabled: true, rolloutPct: 100 },
  { key: "ai_content_suggestions", name: "AI Content Suggestions", kind: FeatureKind.FLAG, description: "AI-generated playlist recommendations", enabled: true, rolloutPct: 25 },
  { key: "bulk_device_commands", name: "Bulk Device Commands", kind: FeatureKind.FLAG, description: "Send commands to multiple devices at once", enabled: true, rolloutPct: 100 },
  { key: "advanced_analytics_v2", name: "Advanced Analytics v2", kind: FeatureKind.FLAG, description: "New analytics engine with drill-down", enabled: true, rolloutPct: 50 },
  { key: "white_label_email", name: "White-Label Email", kind: FeatureKind.FLAG, description: "Send transactional emails from the tenant domain", enabled: true, rolloutPct: 100 },
];

/**
 * Prices in paise-free rupees, matching what /admin/plans has always displayed.
 * A null quota means unlimited. "Free" is the fallback for tenants with no
 * subscription — see decision D1 in the plan: without it, every existing
 * workspace loses everything the moment gating ships.
 */
export const PLAN_CATALOGUE = [
  {
    name: "Free", description: "Default plan for workspaces without a subscription",
    priceMonthly: 0, priceYearly: 0, sortOrder: 0, isDefault: true,
    maxDevices: 2, maxStorageGb: 5, maxUsers: 2, maxRules: 0, analyticsRetentionDays: 7,
    features: [] as string[],
  },
  {
    name: "Starter", description: "For a single site getting started",
    priceMonthly: 4999, priceYearly: 49990, sortOrder: 1, isDefault: false,
    maxDevices: 5, maxStorageGb: 50, maxUsers: 2, maxRules: 0, analyticsRetentionDays: 30,
    features: [],
  },
  {
    name: "Growth", description: "For a growing network across a few locations",
    priceMonthly: 12999, priceYearly: 129990, sortOrder: 2, isDefault: false,
    maxDevices: 25, maxStorageGb: 250, maxUsers: 5, maxRules: 5, analyticsRetentionDays: 90,
    features: ["custom_branding", "api_access", "proof_of_play_export"],
  },
  {
    name: "Business", description: "For multi-site operators with reporting needs",
    priceMonthly: 29999, priceYearly: 299990, sortOrder: 3, isDefault: false,
    maxDevices: 100, maxStorageGb: 2048, maxUsers: 15, maxRules: 25, analyticsRetentionDays: 365,
    features: ["custom_branding", "custom_domain", "api_access", "priority_support"],
  },
  {
    name: "Enterprise", description: "Negotiated limits and support",
    priceMonthly: 0, priceYearly: 0, sortOrder: 4, isDefault: false,
    maxDevices: null, maxStorageGb: null, maxUsers: null, maxRules: null, analyticsRetentionDays: 1095,
    features: ["custom_branding", "custom_domain", "api_access", "proof_of_play_export", "priority_support"],
  },
];

export async function seedPlansAndFeatures() {
  console.log("🌱 Seeding plans and features...");

  for (const feature of FEATURE_CATALOGUE) {
    const { key, ...rest } = feature;
    await prisma.feature.upsert({
      where: { key },
      update: rest,
      create: { key, ...rest },
    });
  }
  console.log(`✅ Seeded ${FEATURE_CATALOGUE.length} features.`);

  const featureIdByKey = new Map(
    (await prisma.feature.findMany({ select: { id: true, key: true } })).map((f) => [f.key, f.id]),
  );

  for (const { features, ...planData } of PLAN_CATALOGUE) {
    const plan = await prisma.plan.upsert({
      where: { name: planData.name },
      update: planData,
      create: planData,
    });

    // `set` rather than `connect`: the seed owns the plan's entitlements, so a
    // re-run has to remove links it no longer declares, not just add missing ones.
    await prisma.planFeature.deleteMany({ where: { planId: plan.id } });
    if (features.length > 0) {
      await prisma.planFeature.createMany({
        data: features.map((key) => ({ planId: plan.id, featureId: featureIdByKey.get(key)! })),
        skipDuplicates: true,
      });
    }
  }
  console.log(`✅ Seeded ${PLAN_CATALOGUE.length} plans and their entitlements.`);

  // Decision D1: every tenant needs a plan, or gating locks out the whole
  // platform. Tenants with no subscription resolve to the default plan at read
  // time (lib/features.ts), so no rows are written here — but say so loudly,
  // because "6 tenants on the Free plan" is a billing fact someone should see.
  const unsubscribed = await prisma.tenant.count({
    where: { subscriptions: { none: { status: { in: ["ACTIVE", "TRIAL", "PAST_DUE"] } } } },
  });
  if (unsubscribed > 0) {
    console.log(
      `ℹ  ${unsubscribed} tenant(s) have no active subscription and resolve to the Free plan.`,
    );
  }
}
