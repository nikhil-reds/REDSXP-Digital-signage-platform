import { NextRequest, NextResponse } from "next/server";
import { apiError, databaseError } from "@/lib/api";
import { requireAgent } from "@/lib/agent-auth";
import { prisma } from "@/lib/prisma";

const STATUS_VALUES = new Set(["DOWNLOADED", "INSTALLED", "CLAIMED", "EXPIRED"]);

export async function GET(request: NextRequest) {
  const auth = await requireAgent(request);
  if (auth.response) return auth.response;

  const requestedStatus = request.nextUrl.searchParams.get("status")?.trim().toUpperCase();
  if (requestedStatus && !STATUS_VALUES.has(requestedStatus)) {
    return apiError("Invalid player registration status.", 422);
  }

  try {
    const registrations = await prisma.playerRegistration.findMany({
      where: {
        tenantId: auth.agent.tenantId,
        ...(requestedStatus ? { status: requestedStatus as "DOWNLOADED" | "INSTALLED" | "CLAIMED" | "EXPIRED" } : {}),
      },
      include: { device: true, agentUser: { select: { firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: registrations.map((registration) => ({
        id: registration.id,
        platform: registration.platform,
        status: registration.status,
        installId: registration.installId,
        hostname: registration.hostname,
        osVersion: registration.osVersion,
        appVersion: registration.appVersion,
        ipAddress: registration.ipAddress,
        deviceId: registration.deviceId,
        deviceName: registration.device?.name ?? null,
        installedAt: registration.installedAt?.toISOString() ?? null,
        claimedAt: registration.claimedAt?.toISOString() ?? null,
        downloadedAt: registration.downloadedAt.toISOString(),
        registeredBy:
          [registration.agentUser?.firstName, registration.agentUser?.lastName].filter(Boolean).join(" ") ||
          registration.agentUser?.email ||
          null,
      })),
    });
  } catch (error) {
    return databaseError(error);
  }
}
