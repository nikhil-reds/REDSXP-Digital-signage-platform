import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { apiError, databaseError, isEmail, readJson } from "@/lib/api";
import { attachSession, normalizeEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await readJson(request);
  const email = typeof body?.email === "string" ? normalizeEmail(body.email) : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!isEmail(email) || !password) {
    return apiError("A valid email and password are required.", 422);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        tenant: true,
        role: { include: { permissions: true } },
      },
    });

    if (!user || user.status !== "ACTIVE" || !(await bcrypt.compare(password, user.passwordHash))) {
      return apiError("Invalid email or password.", 401);
    }

    // Scope, never role name: roles are unique per (tenantId, name), so a tenant
    // can create a role called "ADMIN" or "SUPER_ADMIN". Only scope is trustworthy.
    const isSystemScope = user.role.scope === "SYSTEM";
    const permissions = user.role.permissions.map((permission) => permission.key);

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role.name,
          roleScope: user.role.scope,
          permissions,
          tenant: { id: user.tenant.id, name: user.tenant.name, slug: user.tenant.slug },
        },
        redirectTo: isSystemScope ? "/admin" : "/agent",
      },
    });

    await attachSession(response, user.id, body?.rememberMe === true);
    return response;
  } catch (error) {
    return databaseError(error);
  }
}
