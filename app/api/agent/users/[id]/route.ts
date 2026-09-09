import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import { apiError, readJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/rbac";

const USER_SELECT = { id: true, firstName: true, lastName: true, email: true, status: true, createdAt: true, role: { select: { id: true, name: true } } } as const;

export async function PUT(request: NextRequest, { params }: RouteContext<"/api/agent/users/[id]">) {
  const auth = await requirePermission(request, PERMISSIONS.TENANT_USERS_UPDATE); if (auth.response) return auth.response;
  const { id } = await params; const user = await prisma.user.findFirst({ where: { id, tenantId: auth.user.tenantId }, select: { id: true } }); if (!user) return apiError("Workspace user not found.", 404);
  const body = await readJson(request); const name = typeof body?.name === "string" ? body.name.trim() : ""; const roleId = typeof body?.roleId === "string" ? body.roleId : ""; const status = body?.status;
  if (!name || !roleId || !["ACTIVE", "INACTIVE", "SUSPENDED"].includes(String(status))) return apiError("Name, role, and valid status are required.", 422);
  if (id === auth.user.id && (roleId !== auth.user.role.id || status !== "ACTIVE")) return apiError("You cannot change your own role or deactivate your account.", 409);
  const role = await prisma.role.findFirst({ where: { id: roleId, tenantId: auth.user.tenantId, scope: "TENANT" }, select: { id: true } }); if (!role) return apiError("Choose a workspace role.", 422);
  const password = typeof body?.password === "string" ? body.password : ""; if (password && password.length < 8) return apiError("Password must be at least 8 characters.", 422);
  const updated = await prisma.$transaction(async (tx) => { const result = await tx.user.update({ where: { id }, data: { firstName: name, roleId, status: status as "ACTIVE" | "INACTIVE" | "SUSPENDED", ...(password ? { passwordHash: await bcrypt.hash(password, 12) } : {}) }, select: USER_SELECT }); await tx.auditLog.create({ data: { tenantId: auth.user.tenantId, userId: auth.user.id, action: "TENANT_USER_UPDATED", description: `Updated workspace user ${result.email}` } }); return result; });
  return NextResponse.json({ success: true, message: "Workspace user updated.", data: updated });
}

export async function DELETE(request: NextRequest, { params }: RouteContext<"/api/agent/users/[id]">) {
  const auth = await requirePermission(request, PERMISSIONS.TENANT_USERS_DELETE); if (auth.response) return auth.response;
  const { id } = await params; if (id === auth.user.id) return apiError("You cannot delete your own account.", 409);
  const user = await prisma.user.findFirst({ where: { id, tenantId: auth.user.tenantId }, select: { id: true, email: true } }); if (!user) return apiError("Workspace user not found.", 404);
  const activeUsers = await prisma.user.count({ where: { tenantId: auth.user.tenantId, status: "ACTIVE" } }); if (activeUsers <= 1) return apiError("The final active workspace user cannot be deleted.", 409);
  await prisma.$transaction([prisma.session.deleteMany({ where: { userId: id } }), prisma.user.delete({ where: { id } }), prisma.auditLog.create({ data: { tenantId: auth.user.tenantId, userId: auth.user.id, action: "TENANT_USER_DELETED", description: `Deleted workspace user ${user.email}` } })]);
  return NextResponse.json({ success: true, message: "Workspace user deleted." });
}
