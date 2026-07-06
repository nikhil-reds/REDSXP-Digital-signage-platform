import { NextRequest } from "next/server";
import { apiError } from "@/lib/api";
import { hashToken, SESSION_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return { response: apiError("Authentication required.", 401) };

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    select: {
      expiresAt: true,
      user: {
        select: { id: true, tenantId: true, status: true, role: { select: { name: true } } },
      },
    },
  });

  if (!session || session.expiresAt <= new Date() || session.user.status !== "ACTIVE") {
    return { response: apiError("Session expired.", 401) };
  }
  if (!session.user.role.name.includes("ADMIN")) {
    return { response: apiError("Administrator access required.", 403) };
  }

  return { admin: session.user };
}
