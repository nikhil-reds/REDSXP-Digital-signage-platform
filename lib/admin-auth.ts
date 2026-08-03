import { NextRequest } from "next/server";
import { apiError } from "@/lib/api";
import { hashToken, SESSION_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/rbac";

export async function getAuthenticatedUser(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    select: {
      expiresAt: true,
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          status: true,
          tenantId: true,
          tenant: { select: { id: true, name: true, slug: true } },
          role: {
            select: {
              id: true,
              name: true,
              scope: true,
              isSystem: true,
              permissions: { select: { key: true } },
            },
          },
        },
      },
    },
  });

  if (!session || session.expiresAt <= new Date() || session.user.status !== "ACTIVE") {
    return null;
  }

  const permissions = session.user.role.permissions.map((p) => p.key);

  return {
    ...session.user,
    permissions,
  };
}

/**
 * Requires user to be authenticated and have SYSTEM scope or specific admin permission for /admin panel routes.
 */
export async function requireAdmin(request: NextRequest, requiredPermission?: string) {
  const user = await getAuthenticatedUser(request);
  if (!user) return { response: apiError("Authentication required.", 401) };

  const isSystemScope = user.role.scope === "SYSTEM" || user.role.name === "SUPER_ADMIN";
  if (!isSystemScope) {
    return { response: apiError("Platform administrator access required.", 403) };
  }

  if (requiredPermission && !hasPermission(user.permissions, requiredPermission)) {
    return { response: apiError(`Permission denied: Missing '${requiredPermission}' capability.`, 403) };
  }

  return { admin: user, user };
}

/**
 * Requires user to be authenticated and have a specific tenant permission key for /agent or general API routes.
 */
export async function requirePermission(request: NextRequest, requiredPermission: string) {
  const user = await getAuthenticatedUser(request);
  if (!user) return { response: apiError("Authentication required.", 401) };

  if (!hasPermission(user.permissions, requiredPermission)) {
    return { response: apiError(`Permission denied: Missing '${requiredPermission}' capability.`, 403) };
  }

  return { user };
}
