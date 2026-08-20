import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { apiError, databaseError, readJson } from "@/lib/api";
import { hashToken } from "@/lib/auth";
import { enqueuePlayerInstalledJob } from "@/lib/player-registration-queue";
import { prisma } from "@/lib/prisma";

function readText(value: unknown, maxLength = 160) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

export async function POST(request: NextRequest) {
  const body = await readJson(request);
  const registrationId = readText(body?.registrationId, 80);
  const installToken = readText(body?.installToken, 256);
  const installId = readText(body?.installId, 160);
  const hostname = readText(body?.hostname);
  const osVersion = readText(body?.osVersion);
  const appVersion = readText(body?.appVersion);

  if (!registrationId || !installToken || !installId) {
    return apiError("registrationId, installToken, and installId are required.", 422);
  }

  try {
    const registration = await prisma.playerRegistration.findUnique({
      where: { id: registrationId },
      include: { device: true },
    });

    if (!registration || registration.installTokenHash !== hashToken(installToken)) {
      return apiError("Invalid player registration credentials.", 401);
    }
    if (registration.expiresAt <= new Date() || registration.status === "EXPIRED") {
      await prisma.playerRegistration.update({
        where: { id: registrationId },
        data: { status: "EXPIRED" },
      });
      return apiError("Player registration expired.", 410);
    }
    if (registration.installId && registration.installId !== installId) {
      return apiError("This player download is already installed on another device.", 409);
    }

    const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    const model = registration.platform === "LINUX" ? "Linux Player" : "Windows Player";

    const result = await prisma.$transaction(async (tx) => {
      const existingDevice =
        registration.device ??
        (await tx.device.findUnique({
          where: { installId },
        }));

      const device = existingDevice
        ? await tx.device.update({
            where: { id: existingDevice.id },
            data: {
              tenantId: registration.tenantId,
              installId,
              platform: registration.platform,
              model,
              firmwareVersion: appVersion,
              lastSeen: new Date(),
              status: "ONLINE",
              playerRegistrationId: registration.id,
            },
          })
        : await tx.device.create({
            data: {
              tenantId: registration.tenantId,
              serialNumber: `PLAYER-${installId}`,
              deviceToken: randomBytes(32).toString("hex"),
              model,
              name: hostname || `Unclaimed ${model}`,
              location: null,
              firmwareVersion: appVersion,
              lastSeen: new Date(),
              status: "ONLINE",
              installId,
              platform: registration.platform,
              playerRegistrationId: registration.id,
            },
          });

      const updatedRegistration = await tx.playerRegistration.update({
        where: { id: registration.id },
        data: {
          installId,
          deviceId: device.id,
          hostname,
          osVersion,
          appVersion,
          ipAddress,
          status: registration.status === "CLAIMED" ? "CLAIMED" : "INSTALLED",
          installedAt: registration.installedAt ?? new Date(),
        },
      });

      return { device, registration: updatedRegistration };
    });

    await enqueuePlayerInstalledJob({
      registrationId: registration.id,
      installId,
      platform: registration.platform,
      hostname,
      osVersion,
      appVersion,
      ipAddress,
    }).catch((error) => {
      console.error("Failed to enqueue player registration worker job:", error);
    });

    return NextResponse.json({
      success: true,
      data: {
        registrationId: result.registration.id,
        deviceId: result.device.id,
        deviceToken: result.device.deviceToken,
        status: result.registration.status,
      },
    });
  } catch (error) {
    return databaseError(error);
  }
}
