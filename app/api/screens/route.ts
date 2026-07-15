import { randomBytes, randomUUID } from "crypto";
import { NextResponse } from "next/server";
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
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");

    const devices = await prisma.device.findMany({
      where: tenantId ? { tenantId } : undefined,
      include: { group: true, playlist: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(devices.map(serializeDevice));
  } catch (error) {
    console.error("Error fetching screens:", error);
    return NextResponse.json({ error: "Failed to fetch screens" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    let resolvedTenantId = body.tenantId;
    if (!resolvedTenantId) {
      let tenant = await prisma.tenant.findFirst();
      if (!tenant) {
        tenant = await prisma.tenant.create({ data: { name: "Default Tenant", slug: "default-tenant" } });
      }
      resolvedTenantId = tenant.id;
    }

    if (!body.name || !body.model) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const device = await prisma.device.create({
      data: {
        tenantId: resolvedTenantId,
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
