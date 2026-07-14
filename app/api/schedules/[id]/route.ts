import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CalendarStatus } from "@/app/generated/prisma/client";

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
  
  return serialized;
};

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const calendar = await prisma.calendar.findUnique({
      where: { id },
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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existingCalendar = await prisma.calendar.findUnique({
      where: { id },
    });

    if (!existingCalendar) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    }

    // Validate if new playlist ID exists
    if (body.playlistId) {
      const playlist = await prisma.playlist.findUnique({
        where: { id: body.playlistId },
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
        devices: body.deviceIds && Array.isArray(body.deviceIds) ? {
          set: body.deviceIds.map((deviceId: string) => ({ id: deviceId })),
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
    return NextResponse.json(serializedSchedule);
  } catch (error) {
    console.error("Error updating schedule:", error);
    return NextResponse.json({ error: "Failed to update schedule" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const existingCalendar = await prisma.calendar.findUnique({
      where: { id },
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
