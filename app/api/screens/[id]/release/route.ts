import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { apiError, databaseError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/rbac";
import { requirePermission } from "@/lib/session";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requirePermission(request, PERMISSIONS.DEVICE_DELETE);
  if (auth.response) return auth.response;

  const { id } = await params;

  try {
    const device = await prisma.device.findFirst({
      where: { id, tenantId: auth.user.tenantId },
      select: { id: true, name: true, playerRegistrationId: true },
    });
    if (!device) return apiError("Screen not found.", 404);

    await prisma.$transaction(async (tx) => {
      // Invalidate the credential before freeing the machine identity. An old
      // player process must not be able to keep heartbeating after release.
      await tx.device.update({
        where: { id: device.id },
        data: {
          deviceToken: randomBytes(32).toString("hex"),
          installId: null,
          playerRegistrationId: null,
          status: "OFFLINE",
        },
      });

      if (device.playerRegistrationId) {
        await tx.playerRegistration.update({
          where: { id: device.playerRegistrationId },
          data: { status: "EXPIRED", installId: null, deviceId: null },
        });
      }

      await tx.auditLog.create({
        data: {
          tenantId: auth.user.tenantId,
          userId: auth.user.id,
          action: "PLAYER_RELEASED",
          description: `Released player registration for screen ${device.name}`,
          ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
          userAgent: request.headers.get("user-agent"),
        },
      });
    });

    return NextResponse.json({ success: true, message: "Player released successfully." });
  } catch (error) {
    return databaseError(error);
  }
}
