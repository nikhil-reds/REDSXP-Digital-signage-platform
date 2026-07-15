import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeDevice } from "@/app/api/screens/route";

type GroupWithRelations = {
  id: string;
  name: string;
  scheduleLabel: string | null;
  currentPlaylistId: string | null;
  updatedAt: Date;
  playlist: { name: string } | null;
  devices: { status: string; location: string | null; alertsCount: number }[];
};

export function serializeGroup(group: GroupWithRelations) {
  const devices = group.devices;
  const screensCount = devices.length;
  const onlineCount = devices.filter((d) => d.status === "ONLINE").length;
  const onlinePercentage = screensCount > 0 ? Math.round((onlineCount / screensCount) * 100) : 100;
  const locationsCount = new Set(devices.map((d) => d.location).filter(Boolean)).size;
  const alertsCount = devices.reduce((sum, d) => sum + d.alertsCount, 0);

  return {
    id: group.id,
    name: group.name,
    screensCount,
    onlinePercentage,
    playlist: group.playlist?.name ?? "No Playlist Assigned",
    schedule: group.scheduleLabel ?? "No Schedule Assigned",
    scheduleLabel: group.scheduleLabel,
    currentPlaylistId: group.currentPlaylistId,
    locationsCount,
    alertsCount,
    lastDeployment: group.updatedAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");

    const groups = await prisma.deviceGroup.findMany({
      where: tenantId ? { tenantId } : undefined,
      include: {
        playlist: true,
        devices: { select: { status: true, location: true, alertsCount: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(groups.map(serializeGroup));
  } catch (error) {
    console.error("Error fetching screen groups:", error);
    return NextResponse.json({ error: "Failed to fetch screen groups" }, { status: 500 });
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

    if (!body.name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const group = await prisma.deviceGroup.create({
      data: {
        tenantId: resolvedTenantId,
        name: body.name,
        scheduleLabel: body.scheduleLabel || null,
        currentPlaylistId: body.currentPlaylistId || null,
      },
    });

    if (Array.isArray(body.deviceIds) && body.deviceIds.length > 0) {
      await prisma.device.updateMany({
        where: { id: { in: body.deviceIds } },
        data: { groupId: group.id },
      });
    }

    const created = await prisma.deviceGroup.findUniqueOrThrow({
      where: { id: group.id },
      include: {
        playlist: true,
        devices: { include: { group: true, playlist: true } },
      },
    });

    return NextResponse.json(
      {
        ...serializeGroup(created),
        devices: created.devices.map(serializeDevice),
        deviceIds: created.devices.map((d) => d.id),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating screen group:", error);
    return NextResponse.json({ error: "Failed to create screen group" }, { status: 500 });
  }
}
