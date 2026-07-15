import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeGroup } from "../route";
import { serializeDevice } from "@/app/api/screens/route";

const GROUP_INCLUDE = {
  playlist: true,
  devices: { include: { group: true, playlist: true } },
} as const;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const group = await prisma.deviceGroup.findUnique({ where: { id }, include: GROUP_INCLUDE });

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

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (Array.isArray(body.deviceIds)) {
      await prisma.$transaction([
        prisma.device.updateMany({
          where: { groupId: id, id: { notIn: body.deviceIds } },
          data: { groupId: null },
        }),
        ...(body.deviceIds.length > 0
          ? [prisma.device.updateMany({ where: { id: { in: body.deviceIds } }, data: { groupId: id } })]
          : []),
      ]);
    }

    const group = await prisma.deviceGroup.update({
      where: { id },
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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const group = await prisma.deviceGroup.findUnique({ where: { id } });
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
