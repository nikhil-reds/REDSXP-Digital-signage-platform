import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/app/generated/prisma/client";
import { apiError, apiErrorCode, databaseError, readJson } from "@/lib/api";
import { hashToken } from "@/lib/auth";
import { enqueuePlayerInstalledJob } from "@/lib/player-registration-queue";
import { readPlayerTelemetry, readText } from "@/lib/player-telemetry";
import { nextScreenName } from "@/lib/screen-naming";
import { prisma } from "@/lib/prisma";

function publicUrl(value: string | undefined): string {
  return (value || "").trim().replace(/\/$/, "");
}

export async function POST(request: NextRequest) {
  const body = await readJson(request);
  const registrationId = readText(body?.registrationId, 80);
  const installToken = readText(body?.installToken, 256);
  const installId = readText(body?.installId, 160);
  const telemetry = readPlayerTelemetry(body);
  const arch = readText(body?.arch, 32);

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

    const [deviceWithInstallId, registrationWithInstallId] = await Promise.all([
      prisma.device.findUnique({ where: { installId } }),
      prisma.playerRegistration.findUnique({
        where: { installId },
        select: { id: true, tenantId: true, deviceId: true },
      }),
    ]);

    const existingDevice = registration.device ?? deviceWithInstallId;

    // An install id is globally unique, so refuse to move a screen between
    // workspaces even if the caller holds a valid token for their own tenant.
    if (
      (existingDevice && existingDevice.tenantId !== registration.tenantId) ||
      (registrationWithInstallId && registrationWithInstallId.tenantId !== registration.tenantId)
    ) {
      return apiErrorCode(
        "This player is registered to another account. Reset it for another account or release it from the previous account.",
        "INSTALL_OWNED_BY_ANOTHER_WORKSPACE",
        409,
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // A registration can retain the unique install id after its Device link
      // has been removed. Clear that orphan as well as the device-owned link.
      if (registrationWithInstallId && registrationWithInstallId.id !== registration.id) {
        await tx.playerRegistration.update({
          where: { id: registrationWithInstallId.id },
          data: { status: "EXPIRED", deviceId: null, installId: null },
        });
      }

      // Same tenant reinstalling with a fresh download: retire the registration
      // that previously owned this device so the unique link can move over.
      if (
        existingDevice?.playerRegistrationId &&
        existingDevice.playerRegistrationId !== registration.id &&
        existingDevice.playerRegistrationId !== registrationWithInstallId?.id
      ) {
        await tx.playerRegistration.update({
          where: { id: existingDevice.playerRegistrationId },
          data: { status: "EXPIRED", deviceId: null, installId: null },
        });
      }

      const deviceMetadata = {
        tenantId: registration.tenantId,
        installId,
        platform: registration.platform,
        model,
        lastSeen: new Date(),
        lastHeartbeatAt: new Date(),
        status: "ONLINE" as const,
        playerRegistrationId: registration.id,
        ...(telemetry.appVersion ? { firmwareVersion: telemetry.appVersion } : {}),
        ...(telemetry.screenResolution ? { screenResolution: telemetry.screenResolution } : {}),
        ...(telemetry.displayCount !== null ? { displayCount: telemetry.displayCount } : {}),
        ...(telemetry.timezone ? { timezone: telemetry.timezone } : {}),
        ...(telemetry.macAddress ? { macAddress: telemetry.macAddress } : {}),
        ...(telemetry.appInstallPath ? { appInstallPath: telemetry.appInstallPath } : {}),
      };

      const device = existingDevice
        ? await tx.device.update({
            where: { id: existingDevice.id },
            data: deviceMetadata,
          })
        : await tx.device.create({
            data: {
              ...deviceMetadata,
              serialNumber: `PLAYER-${installId}`,
              deviceToken: randomBytes(32).toString("hex"),
              name: await nextScreenName(tx, registration.tenantId),
              location: null,
            },
          });

      const updatedRegistration = await tx.playerRegistration.update({
        where: { id: registration.id },
        data: {
          installId,
          deviceId: device.id,
          hostname: telemetry.hostname,
          osVersion: telemetry.osVersion,
          appVersion: telemetry.appVersion,
          screenResolution: telemetry.screenResolution,
          displayCount: telemetry.displayCount,
          timezone: telemetry.timezone,
          macAddress: telemetry.macAddress,
          ipAddress,
          ...(arch ? { arch } : {}),
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
      hostname: telemetry.hostname,
      osVersion: telemetry.osVersion,
      appVersion: telemetry.appVersion,
      ipAddress,
    }).catch((error) => {
      console.error("Failed to enqueue player registration worker job:", error);
    });

    const manifestBaseUrl = publicUrl(
      process.env.PLAYER_MANIFEST_PUBLIC_BASE_URL || process.env.PLAYER_CDN_URL,
    );
    const webSocketUrl = publicUrl(process.env.PLAYER_WEBSOCKET_URL);

    return NextResponse.json({
      success: true,
      data: {
        registrationId: result.registration.id,
        deviceId: result.device.id,
        deviceToken: result.device.deviceToken,
        deviceName: result.device.name,
        status: result.registration.status,
        manifestUrl: manifestBaseUrl
          ? `${manifestBaseUrl}/manifests/${result.device.id}.json`
          : null,
        webSocketUrl: webSocketUrl || null,
        cdnUrl: manifestBaseUrl || null,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return apiErrorCode(
        "This player installation is already registered. Reset it for another account or release the previous registration.",
        "INSTALL_ID_CONFLICT",
        409,
      );
    }
    return databaseError(error);
  }
}
