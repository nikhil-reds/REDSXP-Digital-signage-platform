import { NextRequest, NextResponse } from "next/server";
import { apiError, databaseError, readJson } from "@/lib/api";
import { createToken, hashToken } from "@/lib/auth";
import { normalizePairingCode } from "@/lib/pairing-code";
import { prisma } from "@/lib/prisma";

/**
 * Recovery path for a player that never received its provisioning.json (the
 * agent moved the installer away from the unzipped folder, or installed from a
 * copy). The agent reads the pairing code off the CMS and types it into the
 * player, which exchanges it for the same provisioning payload the ZIP carried.
 */
export async function POST(request: NextRequest) {
  const body = await readJson(request);
  const pairingCode = normalizePairingCode(body?.pairingCode);

  if (!pairingCode) {
    return apiError("Enter the 8-character pairing code shown in the CMS.", 422);
  }

  try {
    const registration = await prisma.playerRegistration.findUnique({
      where: { pairingCode },
      select: {
        id: true,
        tenantId: true,
        platform: true,
        arch: true,
        buildVersion: true,
        expiresAt: true,
        status: true,
      },
    });

    // Same response for unknown and expired codes so the endpoint cannot be
    // used to enumerate which codes exist.
    if (!registration || registration.expiresAt <= new Date() || registration.status === "EXPIRED") {
      return apiError("That pairing code is not valid or has expired.", 401);
    }

    // Minting a fresh install token invalidates whatever shipped in the ZIP, so
    // only one credential for this registration is ever live.
    const installToken = createToken();
    await prisma.playerRegistration.update({
      where: { id: registration.id },
      data: { installTokenHash: hashToken(installToken) },
    });

    const apiBaseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

    return NextResponse.json({
      success: true,
      data: {
        schemaVersion: 1,
        registrationId: registration.id,
        installToken,
        tenantId: registration.tenantId,
        platform: registration.platform,
        arch: registration.arch,
        buildVersion: registration.buildVersion,
        apiBaseUrl,
        installEndpoint: `${apiBaseUrl}/api/player-registrations/install`,
        heartbeatEndpoint: `${apiBaseUrl}/api/devices/heartbeat`,
        issuedAt: new Date().toISOString(),
        expiresAt: registration.expiresAt.toISOString(),
      },
    });
  } catch (error) {
    return databaseError(error);
  }
}
