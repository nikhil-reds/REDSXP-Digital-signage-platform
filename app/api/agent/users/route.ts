import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import { apiError, isEmail, readJson } from "@/lib/api";
import { normalizeEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/rbac";

const PAGE_SIZE = 10;
const USER_SELECT = { id: true, firstName: true, lastName: true, email: true, status: true, createdAt: true, role: { select: { id: true, name: true } } } as const;

export async function GET(request: NextRequest) {
  const auth = await requirePermission(request, PERMISSIONS.TENANT_USERS_READ);
  if (auth.response) return auth.response;
  const search = request.nextUrl.searchParams.get("search")?.trim() || "";
  const roleId = request.nextUrl.searchParams.get("roleId") || "";
  const status = request.nextUrl.searchParams.get("status") || "ALL";
  const requestedPage = Number(request.nextUrl.searchParams.get("page") || "1");
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  if (!new Set(["ALL", "ACTIVE", "INACTIVE", "SUSPENDED"]).has(status)) return apiError("Invalid status filter.", 422);
  const where = { tenantId: auth.user.tenantId, ...(roleId ? { roleId } : {}), ...(status !== "ALL" ? { status: status as "ACTIVE" | "INACTIVE" | "SUSPENDED" } : {}), ...(search ? { OR: [{ email: { contains: search, mode: "insensitive" as const } }, { firstName: { contains: search, mode: "insensitive" as const } }, { lastName: { contains: search, mode: "insensitive" as const } }] } : {}) };
  const [users, total, roles] = await prisma.$transaction([
    prisma.user.findMany({ where, select: USER_SELECT, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.user.count({ where }),
    prisma.role.findMany({ where: { tenantId: auth.user.tenantId, scope: "TENANT" }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  return NextResponse.json({ success: true, data: { users, roles, pagination: { page, pageSize: PAGE_SIZE, total, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) } } });
}

export async function POST(request: NextRequest) {
  const auth = await requirePermission(request, PERMISSIONS.TENANT_USERS_CREATE);
  if (auth.response) return auth.response;
  const body = await readJson(request); const name = typeof body?.name === "string" ? body.name.trim() : ""; const email = typeof body?.email === "string" ? normalizeEmail(body.email) : ""; const password = typeof body?.password === "string" ? body.password : ""; const roleId = typeof body?.roleId === "string" ? body.roleId : "";
  const errors = [...(!name ? ["Name is required."] : []), ...(!isEmail(email) ? ["A valid email is required."] : []), ...(password.length < 8 ? ["Password must be at least 8 characters."] : []), ...(!roleId ? ["Select a role."] : [])];
  if (errors.length) return apiError("Validation failed.", 422, errors);
  if (await prisma.user.findUnique({ where: { email }, select: { id: true } })) return apiError("An account with this email already exists.", 409);
  const role = await prisma.role.findFirst({ where: { id: roleId, tenantId: auth.user.tenantId, scope: "TENANT" }, select: { id: true, name: true } });
  if (!role) return apiError("Choose a workspace role.", 422);
  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({ data: { tenantId: auth.user.tenantId, roleId: role.id, email, passwordHash: await bcrypt.hash(password, 12), firstName: name }, select: USER_SELECT });
    await tx.auditLog.create({ data: { tenantId: auth.user.tenantId, userId: auth.user.id, action: "TENANT_USER_CREATED", description: `Created workspace user ${email} with role ${role.name}` } });
    return created;
  });
  return NextResponse.json({ success: true, message: "Workspace user created.", data: user }, { status: 201 });
}
