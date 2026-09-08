import { randomBytes, randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireAgent } from "@/lib/agent-auth";
import { prisma } from "@/lib/prisma";
import { AlertSeverity, DeviceStatus } from "@/app/generated/prisma/client";

const STATUS_LABEL: Record<DeviceStatus, "Online" | "Delayed" | "Offline"> = {
  ONLINE: "Online",
  DELAYED: "Delayed",
  OFFLINE: "Offline",
};

const SEVERITY_LABEL: Record<AlertSeverity, "critical" | "high" | "medium" | "none"> = {
  CRITICAL: "critical",
  HIGH: "high",
  MEDIUM: "medium",
  NONE: "none",
};

function formatHeartbeat(lastSeen: Date | null) {
  if (!lastSeen) return "Never";
  const diffSec = Math.max(0, Math.floor((Date.now() - lastSeen.getTime()) / 1000));
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  return `${Math.floor(diffHour / 24)}d ago`;
}

export function serializeDevice(device: {
  id: string;
  name: string;
  location: string | null;
  model: string;
  status: DeviceStatus;
  firmwareVersion: string | null;
  storagePercent: number | null;
  lastSeen: Date | null;
  alertsCount: number;
  alertsSeverity: AlertSeverity;
  installId: string | null;
  platform: "LINUX" | "WINDOWS" | null;
  playerRegistrationId: string | null;
  screenResolution?: string | null;
  displayCount?: number | null;
  timezone?: string | null;
  macAddress?: string | null;
  appInstallPath?: string | null;
  lastHeartbeatAt?: Date | null;
  group: { name: string } | null;
  playlist: { name: string } | null;
}) {
  return {
    id: device.id,
    name: device.name,
    location: device.location ?? "",
    group: device.group?.name ?? "Unassigned",
    model: device.model,
    status: STATUS_LABEL[device.status],
    content: device.playlist?.name ?? "No Content Assigned",
    firmware: device.firmwareVersion ?? "—",
    storage: `${device.storagePercent ?? 0}%`,
    heartbeat: formatHeartbeat(device.lastSeen),
    alertsCount: device.alertsCount,
    alertsSeverity: SEVERITY_LABEL[device.alertsSeverity],
    installId: device.installId,
    platform: device.platform,
    playerRegistrationId: device.playerRegistrationId,
    screenResolution: device.screenResolution ?? null,
    displayCount: device.displayCount ?? null,
    timezone: device.timezone ?? null,
    macAddress: device.macAddress ?? null,
    appInstallPath: device.appInstallPath ?? null,
    lastHeartbeatAt: device.lastHeartbeatAt?.toISOString() ?? null,
  };
}

export async function GET(request: NextRequest) {
  const auth = await requireAgent(request);
  if (auth.response) return auth.response;

  try {
    const devices = await prisma.device.findMany({
      where: { tenantId: auth.agent.tenantId },
      include: { group: true, playlist: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(devices.map(serializeDevice));
  } catch (error) {
    console.error("Error fetching screens:", error);
    return NextResponse.json({ error: "Failed to fetch screens" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAgent(request);
  if (auth.response) return auth.response;

  try {
    const body = await request.json();

    if (!body.name || !body.model) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (body.groupId) {
      const group = await prisma.deviceGroup.findFirst({
        where: { id: body.groupId, tenantId: auth.agent.tenantId },
        select: { id: true },
      });
      if (!group) {
        return NextResponse.json({ error: "Screen group not found" }, { status: 404 });
      }
    }

    const device = await prisma.device.create({
      data: {
        tenantId: auth.agent.tenantId,
        name: body.name,
        model: body.model,
        location: body.location || null,
        groupId: body.groupId || null,
        serialNumber: `SN-${randomUUID()}`,
        deviceToken: randomBytes(32).toString("hex"),
      },
      include: { group: true, playlist: true },
    });

    return NextResponse.json(serializeDevice(device), { status: 201 });
  } catch (error) {
    console.error("Error creating screen:", error);
    return NextResponse.json({ error: "Failed to create screen" }, { status: 500 });
  }
}
