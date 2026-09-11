import { NextRequest, NextResponse } from "next/server";
import { apiError, databaseError } from "@/lib/api";
import { hashToken } from "@/lib/auth";
import { getPresignedDownloadUrl } from "@/lib/s3";
import { artifactS3Key, parseArch, resolvePlayerArtifact } from "@/lib/player-builds";
import { prisma } from "@/lib/prisma";

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
        tenantId: true,
        platform: true,
        arch: true,
        buildVersion: true,
        installTokenHash: true,
        downloadTokenHash: true,
        expiresAt: true,
        status: true,
      },
    });

    if (
      !registration ||
      registration.downloadTokenHash !== hashToken(token) ||
      registration.installTokenHash !== hashToken(installToken)
    ) {
      return apiError("Invalid download token.", 401);
    }
    if (registration.expiresAt <= new Date() || registration.status === "EXPIRED") {
      await prisma.playerRegistration.update({
        where: { id: registration.id },
        data: { status: "EXPIRED" },
      });
      return apiError("Download token expired.", 410);
    }

    const arch = parseArch(registration.arch, registration.platform);
    if (!arch) return apiError("Unsupported player architecture.", 422);

    try {
      await resolvePlayerArtifact(registration.platform, arch);
    } catch (error) {
      console.error("Player build unavailable:", error);
      return apiError(
        "The player build is not available yet. Publish a player release and try again.",
        503,
      );
    }

    // Amplify cannot reliably stream a desktop installer (often >100 MB). Redirect
    // the browser to a short-lived S3 URL instead; the installed Player uses the
    // pairing code shown in the CMS to obtain its per-device provisioning details.
    const key = artifactS3Key(registration.platform, arch, registration.buildVersion ?? undefined);
    const downloadUrl = await getPresignedDownloadUrl(key, 15 * 60);
    return NextResponse.redirect(downloadUrl);
  } catch (error) {
    return databaseError(error);
  }
}
