import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { apiError, readJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/rbac";
import { RoleScope } from "@/app/generated/prisma/client";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request, PERMISSIONS.ADMIN_ROLES_READ);
  if (auth.response) return auth.response;

  const roles = await prisma.role.findMany({
    where: { scope: RoleScope.SYSTEM },
    include: {
      permissions: true,
      _count: { select: { users: true } },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({
    success: true,
    data: roles,
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request, PERMISSIONS.ADMIN_ROLES_WRITE);
  if (auth.response) return auth.response;

  const body = await readJson(request);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";
  const permissionIds = Array.isArray(body?.permissionIds) ? (body.permissionIds as string[]) : [];

  if (!name) {
    return apiError("Role name is required.", 422);
  }

  const existing = await prisma.role.findFirst({
    where: { tenantId: null, name, scope: RoleScope.SYSTEM },
  });

  if (existing) {
    return apiError("A platform admin role with this name already exists.", 409);
  }

  const role = await prisma.role.create({
    data: {
      tenantId: null,
      name,
      description,
      scope: RoleScope.SYSTEM,
      isSystem: false,
      permissions: {
        connect: permissionIds.map((id) => ({ id })),
      },
    },
    include: { permissions: true },
  });

  return NextResponse.json(
    {
      success: true,
      message: "Platform Admin Role created successfully.",
      data: role,
    },
    { status: 201 },
  );
}
