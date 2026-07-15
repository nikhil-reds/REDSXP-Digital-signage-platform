import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeDevice } from "../route";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const device = await prisma.device.findUnique({
      where: { id },
      include: { group: true, playlist: true },
    });

    if (!device) {
      return NextResponse.json({ error: "Screen not found" }, { status: 404 });
    }

    return NextResponse.json(serializeDevice(device));
  } catch (error) {
    console.error("Error fetching screen:", error);
    return NextResponse.json({ error: "Failed to fetch screen" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const device = await prisma.device.update({
      where: { id },
      data: {
        name: body.name,
        location: body.location,
        model: body.model,
        firmwareVersion: body.firmwareVersion,
        status: body.status ? body.status.toUpperCase() : undefined,
        groupId: body.groupId === undefined ? undefined : body.groupId,
        currentPlaylistId: body.currentPlaylistId === undefined ? undefined : body.currentPlaylistId,
        storagePercent: body.storagePercent,
        alertsCount: body.alertsCount,
        alertsSeverity: body.alertsSeverity ? body.alertsSeverity.toUpperCase() : undefined,
      },
      include: { group: true, playlist: true },
    });

    return NextResponse.json(serializeDevice(device));
  } catch (error) {
    console.error("Error updating screen:", error);
    return NextResponse.json({ error: "Failed to update screen" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const device = await prisma.device.findUnique({ where: { id } });
    if (!device) {
      return NextResponse.json({ error: "Screen not found" }, { status: 404 });
    }

    await prisma.device.delete({ where: { id } });

    return NextResponse.json({ message: "Screen deleted successfully" });
  } catch (error) {
    console.error("Error deleting screen:", error);
    return NextResponse.json({ error: "Failed to delete screen" }, { status: 500 });
  }
}
