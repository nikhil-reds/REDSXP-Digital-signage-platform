import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import { apiError, readJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/rbac";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requirePermission(request, PERMISSIONS.TENANT_ROLES_READ);
  if (auth.response) return auth.response;

  const { id } = await params;
  const tenantId = auth.user.tenantId;

  const role = await prisma.role.findFirst({
    where: {
      id,
      OR: [{ tenantId }, { tenantId: "", isSystem: true }],
    },
    include: { permissions: true, _count: { select: { users: true } } },
  });

  if (!role) {
    return apiError("Role not found.", 404);
  }

  return NextResponse.json({ success: true, data: role });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requirePermission(request, PERMISSIONS.TENANT_ROLES_UPDATE);
  if (auth.response) return auth.response;

  const { id } = await params;
  const tenantId = auth.user.tenantId;

  const role = await prisma.role.findFirst({ where: { id, tenantId } });

  if (!role) {
    return apiError("Custom role not found in your workspace.", 404);
  }

  if (role.isSystem) {
    return apiError("System default roles cannot be modified.", 403);
  }

  const body = await readJson(request);
  const name = typeof body?.name === "string" ? body.name.trim() : role.name;
  const description = typeof body?.description === "string" ? body.description.trim() : role.description;
  const permissionIds = Array.isArray(body?.permissionIds) ? (body.permissionIds as string[]) : undefined;

  const updated = await prisma.role.update({
    where: { id },
    data: {
      name,
      description,
      ...(permissionIds
        ? {
            permissions: {
              set: permissionIds.map((pid) => ({ id: pid })),
            },
          }
        : {}),
    },
    include: { permissions: true },
  });

  return NextResponse.json({
    success: true,
    message: "Custom role updated successfully.",
    data: updated,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requirePermission(request, PERMISSIONS.TENANT_ROLES_DELETE);
  if (auth.response) return auth.response;

  const { id } = await params;
  const tenantId = auth.user.tenantId;

  const role = await prisma.role.findFirst({
    where: { id, tenantId },
    include: { _count: { select: { users: true } } },
  });

  if (!role) return apiError("Role not found.", 404);

  if (role.isSystem) {
    return apiError("System default roles cannot be deleted.", 403);
  }

  if (role._count.users > 0) {
    return apiError("Cannot delete role currently assigned to workspace users.", 409);
  }

  await prisma.role.delete({ where: { id } });

  return NextResponse.json({
    success: true,
    message: "Custom role deleted successfully.",
  });
}
