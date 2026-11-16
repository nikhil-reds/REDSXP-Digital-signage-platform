import { NextRequest, NextResponse } from "next/server";
import { requireAgent } from "@/lib/agent-auth";
import { prisma } from "@/lib/prisma";
import { serializeDevice } from "../route";
import { enqueueDeviceSensorConfigJob } from "@/lib/rabbitmq";

function validSensorSerialPort(value: unknown, platform: "WINDOWS" | "LINUX" | null) {
  if (value === null || value === "") return true;
  if (typeof value !== "string" || value !== value.trim() || value.includes("..")) return false;
  if (platform === "WINDOWS") return /^COM[1-9]\d*$/i.test(value);
  if (platform === "LINUX") return /^\/dev\/[A-Za-z0-9_./:-]+$/.test(value);
  return /^(?:COM[1-9]\d*|\/dev\/[A-Za-z0-9_./:-]+)$/i.test(value);
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAgent(request);
  if (auth.response) return auth.response;

  try {
    const { id } = await params;
    const device = await prisma.device.findFirst({
      where: { id, tenantId: auth.agent.tenantId },
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

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAgent(request);
  if (auth.response) return auth.response;

  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.device.findFirst({
      where: { id, tenantId: auth.agent.tenantId },
      select: { id: true, platform: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Screen not found" }, { status: 404 });
    }

    if (body.sensorSerialPort !== undefined && !validSensorSerialPort(body.sensorSerialPort, existing.platform)) {
      return NextResponse.json({ error: existing.platform === "LINUX"
        ? "Use a Linux /dev/ serial path, preferably /dev/serial/by-id/..."
        : existing.platform === "WINDOWS" ? "Use a Windows COM port such as COM3 or COM4."
          : "Use a Windows COM port or Linux /dev/ serial path." }, { status: 400 });
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
        sensorSerialPort: body.sensorSerialPort === undefined ? undefined
          : body.sensorSerialPort ? (existing.platform === "WINDOWS" ? body.sensorSerialPort.toUpperCase() : body.sensorSerialPort) : null,
      },
      include: { group: true, playlist: true },
    });

    if (body.sensorSerialPort !== undefined) {
      await enqueueDeviceSensorConfigJob({ deviceId: device.id, tenantId: auth.agent.tenantId, updatedAt: device.updatedAt })
        .catch((error) => console.error("Error enqueueing device sensor configuration:", error));
    }

    return NextResponse.json(serializeDevice(device));
  } catch (error) {
    console.error("Error updating screen:", error);
    return NextResponse.json({ error: "Failed to update screen" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAgent(request);
  if (auth.response) return auth.response;

  try {
    const { id } = await params;

    const device = await prisma.device.findFirst({
      where: { id, tenantId: auth.agent.tenantId },
      select: { id: true },
    });
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
