import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getAuthenticatedUser } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return apiError("Unauthenticated", 401);
  }

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
    },
  });
}
