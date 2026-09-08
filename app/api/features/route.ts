import { NextRequest, NextResponse } from "next/server";
import { apiError, databaseError } from "@/lib/api";
import { getTenantFeatures } from "@/lib/features";
import { getAuthenticatedUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

/**
 * The caller's own effective feature set, plus the plan limits behind it — what
 * useFeatures() reads, the way /api/auth/me serves usePermissions().
 *
 * Resolved server-side: the client is told what it has, never the rules that
 * produced it. Rollout percentages and other tenants' overrides stay private.
 */
export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return apiError("Unauthenticated", 401);

  try {
    const [features, subscription, defaultPlan] = await Promise.all([
      getTenantFeatures(user.tenantId),
      prisma.subscription.findFirst({
        where: { tenantId: user.tenantId, status: { in: ["ACTIVE", "TRIAL", "PAST_DUE"] } },
        orderBy: { createdAt: "desc" },
        select: {
          status: true,
          plan: {
            select: {
              name: true,
              maxDevices: true,
              maxStorageGb: true,
              maxUsers: true,
              maxRules: true,
              analyticsRetentionDays: true,
            },
          },
        },
      }),
      prisma.plan.findFirst({
        where: { isDefault: true },
        select: {
          name: true,
          maxDevices: true,
          maxStorageGb: true,
          maxUsers: true,
          maxRules: true,
          analyticsRetentionDays: true,
        },
      }),
    ]);

    const plan = subscription?.plan ?? defaultPlan ?? null;

    return NextResponse.json({
      success: true,
      data: {
        features: [...features].sort(),
        plan: plan ? { ...plan, subscribed: Boolean(subscription) } : null,
      },
    });
  } catch (error) {
    return databaseError(error);
  }
}
