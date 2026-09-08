import { NextRequest, NextResponse } from "next/server";
import { apiError, databaseError, readJson } from "@/lib/api";
import { readInt, readPlayerTelemetry, readText, tokensMatch } from "@/lib/player-telemetry";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await readJson(request);
  const deviceId = readText(body?.deviceId, 80);
  const deviceToken = readText(body?.deviceToken, 256);

  if (!deviceId || !deviceToken) {
    return apiError("deviceId and deviceToken are required.", 422);
  }

  try {
    const device = await prisma.device.findUnique({
      where: { id: deviceId },
      select: { id: true, deviceToken: true, currentPlaylistId: true },
    });

    if (!device || !tokensMatch(device.deviceToken, deviceToken)) {
      return apiError("Invalid device credentials.", 401);
    }

    const telemetry = readPlayerTelemetry(body);
    const storagePercent = readInt(body?.storagePercent, 0, 100);
    const now = new Date();

    await prisma.device.update({
      where: { id: device.id },
      data: {
        lastSeen: now,
        lastHeartbeatAt: now,
        status: "ONLINE",
        ...(storagePercent !== null ? { storagePercent } : {}),
        ...(telemetry.appVersion ? { firmwareVersion: telemetry.appVersion } : {}),
        ...(telemetry.screenResolution ? { screenResolution: telemetry.screenResolution } : {}),
        ...(telemetry.displayCount !== null ? { displayCount: telemetry.displayCount } : {}),
        ...(telemetry.timezone ? { timezone: telemetry.timezone } : {}),
        ...(telemetry.macAddress ? { macAddress: telemetry.macAddress } : {}),
        ...(telemetry.appInstallPath ? { appInstallPath: telemetry.appInstallPath } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        deviceId: device.id,
        serverNow: now.toISOString(),
        currentPlaylistId: device.currentPlaylistId,
      },
    });
  } catch (error) {
    return databaseError(error);
  }
}
