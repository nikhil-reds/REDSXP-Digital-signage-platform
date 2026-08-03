import { NextResponse } from "next/server";
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");

    const calendars = await prisma.calendar.findMany({
      where: tenantId ? { tenantId } : undefined,
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
      orderBy: { createdAt: "desc" },
    });

    const serializedSchedules = calendars.map(serializeSchedule);

    return NextResponse.json(serializedSchedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return NextResponse.json({ error: "Failed to fetch schedules" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    let resolvedTenantId = body.tenantId;
    if (!resolvedTenantId) {
      let tenant = await prisma.tenant.findFirst();
      if (!tenant) {
        tenant = await prisma.tenant.create({
          data: { name: "Default Tenant", slug: "default-tenant" },
        });
      }
      resolvedTenantId = tenant.id;
    }

    // Validate inputs
    if (!body.name) {
      return NextResponse.json({ error: "Schedule name is required" }, { status: 400 });
    }
    if (!body.playlistId) {
      return NextResponse.json({ error: "Playlist ID is required" }, { status: 400 });
    }
    if (!body.startTime || !body.endTime) {
      return NextResponse.json({ error: "Start time and End time are required" }, { status: 400 });
    }

    // Validate if playlist exists
    const playlist = await prisma.playlist.findUnique({
      where: { id: body.playlistId },
    });
    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    // Parse status
    let status: CalendarStatus = CalendarStatus.ACTIVE;
    if (body.status) {
      const parsedStatus = body.status.toUpperCase();
      if (parsedStatus === "ACTIVE" || parsedStatus === "INACTIVE") {
        status = parsedStatus as CalendarStatus;
      }
    }

    // Create schedule
    const calendar = await prisma.calendar.create({
      data: {
        name: body.name,
        description: body.description || null,
        playlistId: body.playlistId,
        tenantId: resolvedTenantId,
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime),
        daysOfWeek: Array.isArray(body.daysOfWeek) ? body.daysOfWeek : [],
        priority: typeof body.priority === "number" ? body.priority : 0,
        status: status,
        devices: body.deviceIds && Array.isArray(body.deviceIds) ? {
          connect: body.deviceIds.map((id: string) => ({ id })),
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

    const serializedSchedule = serializeSchedule(calendar);
    await emitScheduleUpdatedEvent({ action: "created", schedule: calendar }).catch((error) => {
      console.error("Error emitting schedule.updated event:", error);
    });
    await enqueueScheduleEvaluateNowJob({ reason: "schedule.created", schedule: calendar }).catch((error) => {
      console.error("Error enqueueing scheduler.evaluate.now job:", error);
    });

    return NextResponse.json(serializedSchedule, { status: 201 });
  } catch (error) {
    console.error("Error creating schedule:", error);
    return NextResponse.json({ error: "Failed to create schedule" }, { status: 500 });
  }
}
