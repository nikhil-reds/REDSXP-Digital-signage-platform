import { NextRequest, NextResponse } from "next/server";
import { requireAgent } from "@/lib/agent-auth";
import { prisma } from "@/lib/prisma";
import { CalendarStatus } from "@/app/generated/prisma/client";
import { emitScheduleUpdatedEvent } from "@/lib/redpanda";
import { enqueueScheduleEvaluateNowJob } from "@/lib/rabbitmq";

export const runtime = "nodejs";

// Helper to serialize any nested BigInt fields in media files
const serializeSchedule = (schedule: any) => {
  if (!schedule) return null;
  const serialized = { ...schedule };

  if (serialized.playlist) {
    serialized.playlist = {
      ...serialized.playlist,
      playlistItems: serialized.playlist.playlistItems?.map((item: any) => ({
        ...item,
        media: item.media ? {
          ...item.media,
          sizeBytes: item.media.sizeBytes.toString(),
        } : null,
      })) || [],
    };
  }

  if (Array.isArray(serialized.devices)) {
    serialized.deviceIds = serialized.devices.map((d: any) => d.id);
  }

  return serialized;
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAgent(request);
  if (auth.response) return auth.response;

  try {
    const { id } = await params;

    const calendar = await prisma.calendar.findFirst({
      where: { id, tenantId: auth.agent.tenantId },
      include: {
        playlist: {
          include: {
            playlistItems: {
              include: {
                media: true,
              },
              orderBy: {
                position: "asc",
              },
            },
          },
        },
        devices: true,
      },
    });

    if (!calendar) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    }

    const serializedSchedule = serializeSchedule(calendar);
    return NextResponse.json(serializedSchedule);
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return NextResponse.json({ error: "Failed to fetch schedule" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAgent(request);
  if (auth.response) return auth.response;

  try {
    const { id } = await params;
    const body = await request.json();

    const existingCalendar = await prisma.calendar.findFirst({
      where: { id, tenantId: auth.agent.tenantId },
    });

    if (!existingCalendar) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    }

    // Validate if new playlist ID exists
    if (body.playlistId) {
      const playlist = await prisma.playlist.findFirst({
        where: { id: body.playlistId, tenantId: auth.agent.tenantId },
      });
      if (!playlist) {
        return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
      }
    }

    // Parse status if provided
    let status = undefined;
    if (body.status !== undefined) {
      const parsedStatus = body.status.toUpperCase();
      if (parsedStatus === "ACTIVE" || parsedStatus === "INACTIVE") {
        status = parsedStatus as CalendarStatus;
      }
    }

    // Update fields
    const deviceIds: string[] = Array.isArray(body.deviceIds) ? body.deviceIds : [];
    if (deviceIds.length > 0) {
      const ownedDevices = await prisma.device.findMany({
        where: { id: { in: deviceIds }, tenantId: auth.agent.tenantId },
        select: { id: true },
      });
      if (ownedDevices.length !== deviceIds.length) {
        return NextResponse.json({ error: "One or more screens were not found" }, { status: 404 });
      }
    }

    const updatedCalendar = await prisma.calendar.update({
      where: { id },
      data: {
        name: body.name !== undefined ? body.name : existingCalendar.name,
        description: body.description !== undefined ? body.description : existingCalendar.description,
        playlistId: body.playlistId !== undefined ? body.playlistId : existingCalendar.playlistId,
        startTime: body.startTime ? new Date(body.startTime) : undefined,
        endTime: body.endTime ? new Date(body.endTime) : undefined,
        daysOfWeek: Array.isArray(body.daysOfWeek) ? body.daysOfWeek : undefined,
        priority: typeof body.priority === "number" ? body.priority : undefined,
        status: status,
        devices: Array.isArray(body.deviceIds) ? {
          set: deviceIds.map((deviceId: string) => ({ id: deviceId })),
        } : undefined,
      },
      include: {
        playlist: {
          include: {
            playlistItems: {
              include: {
                media: true,
              },
              orderBy: {
                position: "asc",
              },
            },
          },
        },
        devices: true,
      },
    });

    const serializedSchedule = serializeSchedule(updatedCalendar);
    await emitScheduleUpdatedEvent({ action: "updated", schedule: updatedCalendar }).catch((error) => {
      console.error("Error emitting schedule.updated event:", error);
    });
    await enqueueScheduleEvaluateNowJob({ reason: "schedule.updated", schedule: updatedCalendar }).catch((error) => {
      console.error("Error enqueueing scheduler.evaluate.now job:", error);
    });

    return NextResponse.json(serializedSchedule);
  } catch (error) {
    console.error("Error updating schedule:", error);
    return NextResponse.json({ error: "Failed to update schedule" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAgent(request);
  if (auth.response) return auth.response;

  try {
    const { id } = await params;

    const existingCalendar = await prisma.calendar.findFirst({
      where: { id, tenantId: auth.agent.tenantId },
    });

    if (!existingCalendar) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    }

    await prisma.calendar.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return NextResponse.json({ error: "Failed to delete schedule" }, { status: 500 });
  }
}
