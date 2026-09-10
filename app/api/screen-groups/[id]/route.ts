import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeGroup } from "../route";
import { serializeDevice } from "@/app/api/screens/route";
import { PERMISSIONS } from "@/lib/rbac";
import { requirePermission } from "@/lib/session";

const GROUP_INCLUDE = {
  playlist: true,
  devices: { include: { group: true, playlist: true } },
} as const;

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission(request, PERMISSIONS.DEVICE_READ);
  if (auth.response) return auth.response;

  try {
    const { id } = await params;
    const group = await prisma.deviceGroup.findFirst({ where: { id, tenantId: auth.user.tenantId }, include: GROUP_INCLUDE });

    if (!group) {
      return NextResponse.json({ error: "Screen group not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...serializeGroup(group),
      devices: group.devices.map(serializeDevice),
      deviceIds: group.devices.map((d) => d.id),
    });
  } catch (error) {
    console.error("Error fetching screen group:", error);
    return NextResponse.json({ error: "Failed to fetch screen group" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission(request, PERMISSIONS.DEVICE_UPDATE);
  if (auth.response) return auth.response;

  try {
    const { id } = await params;
    const body = await request.json();
    const existingGroup = await prisma.deviceGroup.findFirst({ where: { id, tenantId: auth.user.tenantId }, select: { id: true } });
    if (!existingGroup) return NextResponse.json({ error: "Screen group not found" }, { status: 404 });

    if (Array.isArray(body.deviceIds)) {
      await prisma.$transaction([
        prisma.device.updateMany({
          where: { groupId: id, tenantId: auth.user.tenantId, id: { notIn: body.deviceIds } },
          data: { groupId: null },
        }),
        ...(body.deviceIds.length > 0
          ? [prisma.device.updateMany({ where: { id: { in: body.deviceIds }, tenantId: auth.user.tenantId }, data: { groupId: id } })]
          : []),
      ]);
    }

    const group = await prisma.deviceGroup.update({
      where: { id: existingGroup.id },
      data: {
        name: body.name,
        scheduleLabel: body.scheduleLabel,
        currentPlaylistId: body.currentPlaylistId === undefined ? undefined : body.currentPlaylistId,
      },
      include: GROUP_INCLUDE,
    });

    return NextResponse.json({
      ...serializeGroup(group),
      devices: group.devices.map(serializeDevice),
      deviceIds: group.devices.map((d) => d.id),
    });
  } catch (error) {
    console.error("Error updating screen group:", error);
    return NextResponse.json({ error: "Failed to update screen group" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission(request, PERMISSIONS.DEVICE_DELETE);
  if (auth.response) return auth.response;

  try {
    const { id } = await params;

    const group = await prisma.deviceGroup.findFirst({ where: { id, tenantId: auth.user.tenantId } });
    if (!group) {
      return NextResponse.json({ error: "Screen group not found" }, { status: 404 });
    }

    await prisma.deviceGroup.delete({ where: { id } });

    return NextResponse.json({ message: "Screen group deleted successfully" });
  } catch (error) {
    console.error("Error deleting screen group:", error);
    return NextResponse.json({ error: "Failed to delete screen group" }, { status: 500 });
  }
}
