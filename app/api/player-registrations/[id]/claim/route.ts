import { NextRequest, NextResponse } from "next/server";
import { apiError, databaseError, readJson } from "@/lib/api";
import { requireAgent } from "@/lib/agent-auth";
import { prisma } from "@/lib/prisma";
import { serializeDevice } from "@/app/api/screens/route";

function readText(value: unknown, maxLength = 160) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAgent(request);
  if (auth.response) return auth.response;

  const { id } = await params;
  const body = await readJson(request);
  const name = readText(body?.name);
  const location = readText(body?.location);
  const groupId = readText(body?.groupId, 80);

  if (!name) return apiError("Screen name is required.", 422);

  try {
    const registration = await prisma.playerRegistration.findFirst({
      where: { id, tenantId: auth.agent.tenantId },
      include: { device: true },
    });

    if (!registration) return apiError("Player registration not found.", 404);
    if (registration.status !== "INSTALLED" || !registration.device) {
      return apiError("Only installed, unclaimed players can be added as screens.", 409);
    }

    if (groupId) {
      const group = await prisma.deviceGroup.findFirst({
        where: { id: groupId, tenantId: auth.agent.tenantId },
        select: { id: true },
      });
      if (!group) return apiError("Screen group not found.", 404);
    }

    const result = await prisma.$transaction(async (tx) => {
      const device = await tx.device.update({
        where: { id: registration.device!.id },
        data: {
          name,
          location,
          groupId,
        },
        include: { group: true, playlist: true },
      });

      await tx.playerRegistration.update({
        where: { id: registration.id },
        data: { status: "CLAIMED", claimedAt: new Date() },
      });

      await tx.auditLog.create({
        data: {
          tenantId: auth.agent.tenantId,
          userId: auth.agent.id,
          action: "PLAYER_CLAIMED",
          description: `Claimed ${registration.platform.toLowerCase()} player as screen ${name}`,
          ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
          userAgent: request.headers.get("user-agent"),
        },
      });

      return device;
    });

    return NextResponse.json({ success: true, data: serializeDevice(result) });
  } catch (error) {
    return databaseError(error);
  }
}
