import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { apiError, readJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/rbac";
import { RoleScope } from "@/app/generated/prisma/client";

const userFields = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  status: true,
  roleId: true,
} as const;

export async function GET(request: NextRequest, { params }: RouteContext<"/api/admin/roles/[id]/members">) {
  const auth = await requireAdmin(request, PERMISSIONS.ADMIN_ROLES_READ);
  if (auth.response) return auth.response;
  const { id } = await params;
  const role = await prisma.role.findFirst({ where: { id, scope: RoleScope.SYSTEM }, select: { id: true } });
  if (!role) return apiError("Role not found.", 404);

  const [members, availableUsers, roles] = await Promise.all([
    prisma.user.findMany({ where: { roleId: id }, select: userFields, orderBy: [{ firstName: "asc" }, { email: "asc" }] }),
    prisma.user.findMany({ where: { role: { scope: RoleScope.SYSTEM }, roleId: { not: id } }, select: userFields, orderBy: [{ firstName: "asc" }, { email: "asc" }] }),
    prisma.role.findMany({ where: { scope: RoleScope.SYSTEM }, select: { id: true, name: true, isSystem: true }, orderBy: { name: "asc" } }),
  ]);
  return NextResponse.json({ success: true, data: { members, availableUsers, roles } });
}

export async function PUT(request: NextRequest, { params }: RouteContext<"/api/admin/roles/[id]/members">) {
  const auth = await requireAdmin(request, PERMISSIONS.ADMIN_ROLES_UPDATE);
  if (auth.response) return auth.response;
  const { id } = await params;
  const body = await readJson(request);
  const addUserIds = Array.isArray(body?.addUserIds) ? body.addUserIds.filter((value): value is string => typeof value === "string") : [];
  const reassignments = Array.isArray(body?.reassignments) ? body.reassignments.filter((value): value is { userId: string; roleId: string } => typeof value?.userId === "string" && typeof value?.roleId === "string") : [];
  if (reassignments.some(({ userId }) => userId === auth.admin.id)) return apiError("You cannot remove yourself from this role.", 409);

  const role = await prisma.role.findFirst({ where: { id, scope: RoleScope.SYSTEM }, select: { id: true, name: true, isSystem: true } });
  if (!role) return apiError("Role not found.", 404);
  if (role.isSystem) return apiError("System protected roles cannot be modified.", 403);

  const userIds = [...new Set([...addUserIds, ...reassignments.map(({ userId }) => userId)])];
  const targetRoleIds = [...new Set(reassignments.map(({ roleId }) => roleId))];
  const [users, targetRoles] = await Promise.all([
    prisma.user.findMany({ where: { id: { in: userIds }, role: { scope: RoleScope.SYSTEM } }, select: { id: true, email: true } }),
    prisma.role.findMany({ where: { id: { in: targetRoleIds }, scope: RoleScope.SYSTEM }, select: { id: true } }),
  ]);
  if (users.length !== userIds.length || targetRoles.length !== targetRoleIds.length) return apiError("One or more selected users or replacement roles are invalid.", 422);
  if (reassignments.some(({ roleId }) => roleId === id)) return apiError("Choose a different role when removing a user.", 422);

  await prisma.$transaction(async (tx) => {
    if (addUserIds.length) await tx.user.updateMany({ where: { id: { in: addUserIds } }, data: { roleId: id } });
    await Promise.all(reassignments.map(({ userId, roleId }) => tx.user.update({ where: { id: userId }, data: { roleId } })));
    await tx.auditLog.create({
      data: {
        tenantId: auth.admin.tenantId,
        userId: auth.admin.id,
        action: "ADMIN_ROLE_MEMBERS_UPDATED",
        description: `Updated members of platform role ${role.name}: added ${addUserIds.length}, reassigned ${reassignments.length}.`,
        ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
        userAgent: request.headers.get("user-agent"),
      },
    });
  });
  return NextResponse.json({ success: true, message: "Role members updated." });
}
