import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { apiError, isEmail, readJson } from "@/lib/api";
import { attachSession, normalizeEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function POST(request: Request) {
  const body = await readJson(request);
  const firstName = typeof body?.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body?.lastName === "string" ? body.lastName.trim() : "";
  const workspaceName = typeof body?.workspaceName === "string" ? body.workspaceName.trim() : "";
  const email = typeof body?.email === "string" ? normalizeEmail(body.email) : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const slug = slugify(workspaceName);

  const errors = [
    ...(!firstName || !lastName ? ["First and last name are required."] : []),
    ...(!workspaceName || !slug ? ["A valid workspace name is required."] : []),
    ...(!isEmail(email) ? ["A valid email address is required."] : []),
    ...(password.length < 8 || !/\d/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)
      ? ["Password must be at least 8 characters and include a number and special character."]
      : []),
  ];
  if (errors.length) return apiError("Validation failed.", 422, errors);

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) return apiError("An account with this email already exists.", 409);

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const user = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({ data: { name: workspaceName, slug } });
      const role = await tx.role.upsert({
        where: { name: "AGENT" },
        update: {},
        create: { name: "AGENT", description: "Tenant workspace administrator" },
      });
      return tx.user.create({
        data: { tenantId: tenant.id, roleId: role.id, email, passwordHash, firstName, lastName },
        include: { tenant: true, role: true },
      });
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        data: { user: { id: user.id, email: user.email, role: user.role.name }, redirectTo: "/agent" },
      },
      { status: 201 },
    );
    await attachSession(response, user.id, true);
    return response;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return apiError("That workspace name is already in use.", 409);
    }
    throw error;
  }
}
