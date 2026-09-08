import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { apiError, isEmail, readJson } from "@/lib/api";
import { requireAdmin } from "@/lib/admin-auth";
import { normalizeEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/rbac";
import type { Prisma } from "@/app/generated/prisma/client";

const PAGE_SIZE = 10;

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request, PERMISSIONS.ADMIN_USERS_READ);
  if (auth.response) return auth.response;

  const search = request.nextUrl.searchParams.get("search")?.trim() || "";
  const status = request.nextUrl.searchParams.get("status") || "ALL";
  const requestedPage = Number(request.nextUrl.searchParams.get("page") || "1");
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  if (!new Set(["ALL", "ACTIVE", "INACTIVE", "SUSPENDED"]).has(status)) {
    return apiError("Invalid status filter.", 422);
  }

  const where: Prisma.UserWhereInput = {
    role: { scope: "SYSTEM" },
    ...(status !== "ALL" ? { status: status as "ACTIVE" | "INACTIVE" | "SUSPENDED" } : {}),
    ...(search
      ? {
          OR: [
            { email: { contains: search, mode: "insensitive" } },
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [users, total, active, inactive] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
        createdAt: true,
        role: { select: { id: true, name: true, isSystem: true } },
      },
    }),
    prisma.user.count({ where }),
    prisma.user.count({ where: { ...where, status: "ACTIVE" } }),
    prisma.user.count({ where: { ...where, status: "INACTIVE" } }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      users,
      pagination: {
        page,
        pageSize: PAGE_SIZE,
        total,
        totalPages: Math.ceil(total / PAGE_SIZE),
      },
      summary: { total, active, inactive },
      counts: { total, active, inactive },
    },
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request, PERMISSIONS.ADMIN_USERS_WRITE);
  if (auth.response) return auth.response;

  const body = await readJson(request);
  const firstName = typeof body?.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body?.lastName === "string" ? body.lastName.trim() : "";
  const email = typeof body?.email === "string" ? normalizeEmail(body.email) : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const roleId = typeof body?.roleId === "string" ? body.roleId.trim() : "";

  const errors = [
    ...(!firstName || !lastName ? ["First and last name are required."] : []),
    ...(!isEmail(email) ? ["A valid email address is required."] : []),
    ...(password.length < 8 ? ["Password must be at least 8 characters."] : []),
  ];
  if (errors.length) return apiError("Validation failed.", 422, errors);

  if (await prisma.user.findUnique({ where: { email }, select: { id: true } })) {
    return apiError("An account with this email already exists.", 409);
  }

  // Determine system role to assign
  let assignedRole = roleId
    ? await prisma.role.findFirst({ where: { id: roleId, scope: "SYSTEM" } })
    : await prisma.role.findFirst({ where: { tenantId: null, name: "SUPER_ADMIN", scope: "SYSTEM" } });

  if (!assignedRole) {
    assignedRole = await prisma.role.findFirst({ where: { scope: "SYSTEM" } });
  }

  if (!assignedRole) {
    return apiError("No platform administrator role found. Run seed script first.", 500);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        tenantId: auth.admin.tenantId,
        roleId: assignedRole.id,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
        createdAt: true,
        role: { select: { id: true, name: true, isSystem: true } },
      },
    });

    await tx.auditLog.create({
      data: {
        tenantId: auth.admin.tenantId,
        userId: auth.admin.id,
        action: "ADMIN_USER_CREATED",
        description: `Created administrator ${email} with role ${assignedRole.name}`,
        ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
        userAgent: request.headers.get("user-agent"),
      },
    });

    return created;
  });

  return NextResponse.json({ success: true, message: "Administrator user created.", data: user }, { status: 201 });
}
