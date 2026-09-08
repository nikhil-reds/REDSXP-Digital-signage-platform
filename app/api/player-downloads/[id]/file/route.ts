import { Readable } from "node:stream";
import { ZipArchive } from "archiver";
import { NextRequest } from "next/server";
import { apiError, databaseError } from "@/lib/api";
import { hashToken } from "@/lib/auth";
import { formatPairingCode } from "@/lib/pairing-code";
import { parseArch, playerBuildVersion, resolvePlayerArtifact } from "@/lib/player-builds";
import { prisma } from "@/lib/prisma";

function installInstructions(
  platform: "LINUX" | "WINDOWS",
  filename: string,
  pairingCode: string | null,
) {
  const shared = [
    "Keep provisioning.json next to the installer while you install.",
    "It contains this screen's one-time registration credentials.",
    "",
    "If the player starts without finding provisioning.json, it shows a pairing",
    "screen instead. Enter this pairing code to finish setup:",
    "",
    `    ${pairingCode ? formatPairingCode(pairingCode) : "(see the CMS)"}`,
  ];

  if (platform === "WINDOWS") {
    return [
      "REDS Player - Windows install",
      "==============================",
      "",
      `1. Extract this ZIP to a folder (both ${filename} and provisioning.json).`,
      `2. Run ${filename} and complete the installer.`,
      "3. The player registers itself with the CMS on first launch.",
      "4. The screen then appears under Screens in the agent panel.",
      "",
      ...shared,
    ].join("\n");
  }

  return [
    "REDS Player - Linux install",
    "===========================",
    "",
    `1. Extract this ZIP to a folder (both ${filename} and provisioning.json).`,
    `2. chmod +x ${filename}`,
    `3. ./${filename}`,
    "4. The player registers itself with the CMS on first launch.",
    "5. The screen then appears under Screens in the agent panel.",
    "",
    ...shared,
  ].join("\n");
}

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
        pairingCode: true,
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

    const arch = parseArch(registration.arch, registration.platform);
    if (!arch) return apiError("Unsupported player architecture.", 422);

    let artifact;
    try {
      artifact = await resolvePlayerArtifact(registration.platform, arch);
    } catch (error) {
      console.error("Player build unavailable:", error);
      return apiError(
        "The player build is not available yet. Publish a player release and try again.",
        503,
      );
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    const provisioning = {
      schemaVersion: 1,
      registrationId: registration.id,
      installToken,
      tenantId: registration.tenantId,
      platform: registration.platform,
      arch,
      buildVersion: registration.buildVersion ?? playerBuildVersion(),
      apiBaseUrl,
      installEndpoint: `${apiBaseUrl}/api/player-registrations/install`,
      heartbeatEndpoint: `${apiBaseUrl}/api/devices/heartbeat`,
      issuedAt: new Date().toISOString(),
      expiresAt: registration.expiresAt.toISOString(),
    };

    // Level 1: the installer payload is already compressed, so heavy deflate
    // burns CPU on ~100MB for almost no size win.
    const archive = new ZipArchive({ zlib: { level: 1 } });
    archive.on("warning", (error: unknown) => console.warn("Player ZIP warning:", error));
    archive.on("error", (error: unknown) => console.error("Player ZIP error:", error));

    archive.append(await artifact.open(), { name: artifact.filename });
    archive.append(`${JSON.stringify(provisioning, null, 2)}\n`, { name: "provisioning.json" });
    archive.append(
      installInstructions(registration.platform, artifact.filename, registration.pairingCode),
      { name: "INSTALL.txt" },
    );
    void archive.finalize();

    const zipName = `reds-player-${registration.platform.toLowerCase()}-${arch}-${registration.id}.zip`;

    return new Response(Readable.toWeb(archive) as ReadableStream<Uint8Array>, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${zipName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return databaseError(error);
  }
}
