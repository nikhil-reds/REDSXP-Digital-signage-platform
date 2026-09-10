import { NextRequest, NextResponse } from "next/server";
import { apiError, databaseError } from "@/lib/api";
import { getTenantFeatureSnapshot } from "@/lib/features";
import { getAuthenticatedUser } from "@/lib/session";

/**
 * Portal bootstrap data is intentionally returned together. The sidebar,
 * permission gates, and plan gates all need this same session context, so
 * splitting it into multiple endpoints created an avoidable request waterfall.
 */
export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return apiError("Unauthenticated", 401);

  try {
    const snapshot = await getTenantFeatureSnapshot(user.tenantId);

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          status: user.status,
          tenantId: user.tenantId,
          tenant: user.tenant,
          role: {
            id: user.role.id,
            name: user.role.name,
            scope: user.role.scope,
            isSystem: user.role.isSystem,
          },
          permissions: user.permissions,
        },
        features: [...snapshot.features].sort(),
        plan: snapshot.plan ? { ...snapshot.plan, subscribed: snapshot.subscribed } : null,
      },
    });
  } catch (error) {
    return databaseError(error);
  }
}
