import { NextRequest } from "next/server";
import { apiError } from "@/lib/api";
import { hashToken, SESSION_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/rbac";

/**
 * The one session lookup. lib/admin-auth.ts and lib/agent-auth.ts used to hold
 * two copies of it that differed only in the key they returned (`admin` vs
 * `agent`), which meant a route's guard also decided how much of the user it
 * could see. Both now re-export from here.
 *
 * Three questions get asked of a request, and they are independent:
 *
 *   requireAdmin      — is this a platform operator?     (role scope)
 *   requirePermission — may this user do X?              (RBAC, lib/rbac.ts)
 *   requireFeature    — does this workspace have X?      (plans, lib/features.ts)
 *
 * A route needing more than one calls each. See docs/rbac-completion-plan.md
 * and docs/plans-and-features-plan.md.
 */
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

  return {
    ...session.user,
    permissions: session.user.role.permissions.map((permission) => permission.key),
  };
}

export type AuthenticatedUser = NonNullable<Awaited<ReturnType<typeof getAuthenticatedUser>>>;

/**
 * Platform operator gate for /admin routes, optionally narrowed to one permission.
 *
 * Scope, never role name: roles are unique per (tenantId, name), so a tenant can
 * create a role literally called "SUPER_ADMIN". Only scope is trustworthy here.
 */
export async function requireAdmin(request: NextRequest, requiredPermission?: string) {
  const user = await getAuthenticatedUser(request);
  if (!user) return { response: apiError("Authentication required.", 401) };

  if (user.role.scope !== "SYSTEM") {
    return { response: apiError("Platform administrator access required.", 403) };
  }

  if (requiredPermission && !hasPermission(user.permissions, requiredPermission)) {
    return {
      response: apiError(`Permission denied: Missing '${requiredPermission}' capability.`, 403),
    };
  }

  return { admin: user, user };
}

/** Requires one permission key, whatever the caller's scope. */
export async function requirePermission(request: NextRequest, requiredPermission: string) {
  const user = await getAuthenticatedUser(request);
  if (!user) return { response: apiError("Authentication required.", 401) };

  if (!hasPermission(user.permissions, requiredPermission)) {
    return {
      response: apiError(`Permission denied: Missing '${requiredPermission}' capability.`, 403),
    };
  }

  return { user };
}

/**
 * Authenticated, no permission required. Kept under the `agent` key so the
 * player and assistant routes that predate RBAC keep compiling; new code should
 * prefer requirePermission with a real key.
 */
export async function requireAgent(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return { response: apiError("Authentication required.", 401) };
  return { agent: user, user };
}
