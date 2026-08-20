import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { apiError, databaseError } from "@/lib/api";
import { hashToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const CONTENT_TYPE_BY_PLATFORM = {
  LINUX: "application/x-sh",
  WINDOWS: "application/json",
} as const;

const PLAYER_TEMPLATE_BY_PLATFORM = {
  LINUX: "rubenius-linux-player.sh",
  WINDOWS: "rubenius-windows-player.json",
} as const;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = request.nextUrl.searchParams.get("token") || "";
  const installToken = request.nextUrl.searchParams.get("installToken") || "";
  if (!token) return apiError("Download token is required.", 401);
  if (!installToken) return apiError("Install token is required.", 401);

  try {
    const registration = await prisma.playerRegistration.findUnique({
      where: { id },
      select: {
        id: true,
        platform: true,
        installTokenHash: true,
        downloadTokenHash: true,
        expiresAt: true,
        status: true,
      },
    });

    if (!registration || registration.downloadTokenHash !== hashToken(token)) {
      return apiError("Invalid download token.", 401);
    }
    if (registration.expiresAt <= new Date() || registration.status === "EXPIRED") {
      await prisma.playerRegistration.update({
        where: { id: registration.id },
        data: { status: "EXPIRED" },
      });
      return apiError("Download token expired.", 410);
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    const templatePath = path.join(
      process.cwd(),
      "public",
      "players",
      PLAYER_TEMPLATE_BY_PLATFORM[registration.platform],
    );
    const installEndpoint = `${apiBaseUrl}/api/player-registrations/install`;
    const template = await readFile(templatePath, "utf8");
    const playerFile = template
      .replaceAll("__REGISTRATION_ID__", registration.id)
      .replaceAll("__INSTALL_TOKEN__", installToken)
      .replaceAll("__API_BASE_URL__", apiBaseUrl)
      .replaceAll("__INSTALL_ENDPOINT__", installEndpoint);

    const filename =
      registration.platform === "LINUX"
        ? `rubenius-player-${registration.id}.sh`
        : `rubenius-player-${registration.id}.json`;

    return new NextResponse(playerFile, {
      headers: {
        "Content-Type": CONTENT_TYPE_BY_PLATFORM[registration.platform],
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return databaseError(error);
  }
}
