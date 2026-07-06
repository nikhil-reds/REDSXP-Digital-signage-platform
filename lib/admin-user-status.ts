import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function updateAdminStatus(request: NextRequest, userId: string, active: boolean) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;
  if (auth.admin.id === userId && !active) return apiError("You cannot deactivate your own account.", 409);

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: { select: { name: true } } },
  });
  if (!target || target.role.name !== "ADMIN") return apiError("Administrator not found.", 404);

  if (!active) {
    const activeAdmins = await prisma.user.count({
      where: { role: { name: "ADMIN" }, status: "ACTIVE" },
    });
    if (activeAdmins <= 1) return apiError("The final active administrator cannot be deactivated.", 409);
  }

  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { status: active ? "ACTIVE" : "INACTIVE" } }),
    prisma.auditLog.create({
      data: {
        tenantId: auth.admin.tenantId,
        userId: auth.admin.id,
        action: active ? "ADMIN_USER_ACTIVATED" : "ADMIN_USER_DEACTIVATED",
        description: `${active ? "Activated" : "Deactivated"} administrator ${target.email}`,
      },
    }),
    ...(!active ? [prisma.session.deleteMany({ where: { userId } })] : []),
  ]);

  return NextResponse.json({ success: true, message: `Administrator ${active ? "activated" : "deactivated"}.` });
}
