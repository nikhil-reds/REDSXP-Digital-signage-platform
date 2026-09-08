import { NextRequest, NextResponse } from "next/server";
import { PlayerPlatform } from "@/app/generated/prisma/client";
import { apiError, databaseError, readJson } from "@/lib/api";
import { requireAgent } from "@/lib/agent-auth";
import { createToken, hashToken } from "@/lib/auth";
import { formatPairingCode, generatePairingCode } from "@/lib/pairing-code";
import { parseArch, playerBuildVersion } from "@/lib/player-builds";
import { prisma } from "@/lib/prisma";

const PLATFORM_LABEL: Record<PlayerPlatform, string> = {
  LINUX: "Linux Player",
  WINDOWS: "Windows Player",
};

function parsePlatform(value: unknown): PlayerPlatform | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toUpperCase();
  return normalized === "LINUX" || normalized === "WINDOWS" ? normalized : null;
}

export async function POST(request: NextRequest) {
  const auth = await requireAgent(request);
  if (auth.response) return auth.response;

  const body = await readJson(request);
  const platform = parsePlatform(body?.platform);
  if (!platform) return apiError("Choose Linux or Windows player.", 422);

  const arch = parseArch(body?.arch, platform);
  if (!arch) return apiError("Unsupported player architecture.", 422);

  const downloadToken = createToken();
  const installToken = createToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const buildVersion = playerBuildVersion();
  const pairingCode = generatePairingCode();

  try {
    const registration = await prisma.playerRegistration.create({
      data: {
        tenantId: auth.agent.tenantId,
        agentUserId: auth.agent.id,
        platform,
        arch,
        buildVersion,
        pairingCode,
        downloadTokenHash: hashToken(downloadToken),
        installTokenHash: hashToken(installToken),
        expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: registration.id,
        platform,
        arch,
        buildVersion,
        pairingCode: formatPairingCode(pairingCode),
        label: PLATFORM_LABEL[platform],
        expiresAt: expiresAt.toISOString(),
        downloadUrl: `/api/player-downloads/${registration.id}/file?token=${downloadToken}&installToken=${installToken}`,
      },
    });
  } catch (error) {
    return databaseError(error);
  }
}
