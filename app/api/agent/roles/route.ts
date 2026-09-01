import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import { apiError, readJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/rbac";
import { RoleScope } from "@/app/generated/prisma/client";

export async function GET(request: NextRequest) {
  const auth = await requirePermission(request, PERMISSIONS.TENANT_ROLES_READ);
  if (auth.response) return auth.response;

  const tenantId = auth.user.tenantId;

  // Include custom roles created by tenant as well as template system roles for reference
  const roles = await prisma.role.findMany({
    where: {
      OR: [
        { tenantId, scope: RoleScope.TENANT },
        { tenantId: "", scope: RoleScope.TENANT, isSystem: true },
      ],
    },
    include: {
      permissions: true,
      _count: { select: { users: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    success: true,
    data: roles,
  });
}

export async function POST(request: NextRequest) {
  const auth = await requirePermission(request, PERMISSIONS.TENANT_ROLES_CREATE);
  if (auth.response) return auth.response;

  const tenantId = auth.user.tenantId;
  const body = await readJson(request);

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";
  const permissionIds = Array.isArray(body?.permissionIds) ? (body.permissionIds as string[]) : [];

  if (!name) {
    return apiError("Role name is required.", 422);
  }

  const existing = await prisma.role.findFirst({
    where: { tenantId, name },
  });

  if (existing) {
    return apiError("A custom role with this name already exists in your workspace.", 409);
  }

  const role = await prisma.role.create({
    data: {
      tenantId,
      name,
      description,
      scope: RoleScope.TENANT,
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
      message: "Custom agent role created successfully.",
      data: role,
    },
    { status: 201 },
  );
}
