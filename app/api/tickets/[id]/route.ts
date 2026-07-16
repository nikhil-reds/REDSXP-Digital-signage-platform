import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TicketStatus, TicketPriority } from "@/app/generated/prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return NextResponse.json({ error: "Failed to fetch ticket" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 1. Check if the ticket exists
    const existingTicket = await prisma.ticket.findUnique({
      where: { id },
    });
    if (!existingTicket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // 2. Build the update payload
    const updateData: any = {};

    if (body.title !== undefined) {
      if (typeof body.title !== "string" || body.title.trim() === "") {
        return NextResponse.json({ error: "Ticket title cannot be empty" }, { status: 400 });
      }
      updateData.title = body.title;
    }

    if (body.description !== undefined) {
      updateData.description = body.description || null;
    }

    if (body.status !== undefined) {
      const parsedStatus = body.status.toUpperCase();
      if (Object.values(TicketStatus).includes(parsedStatus as TicketStatus)) {
        updateData.status = parsedStatus as TicketStatus;
      } else {
        return NextResponse.json({ error: `Invalid status: ${body.status}` }, { status: 400 });
      }
    }

    if (body.priority !== undefined) {
      const parsedPriority = body.priority.toUpperCase();
      if (Object.values(TicketPriority).includes(parsedPriority as TicketPriority)) {
        updateData.priority = parsedPriority as TicketPriority;
      } else {
        return NextResponse.json({ error: `Invalid priority: ${body.priority}` }, { status: 400 });
      }
    }

    if (body.assignedToId !== undefined) {
      if (body.assignedToId !== null) {
        const assignedUserExists = await prisma.user.findUnique({ where: { id: body.assignedToId } });
        if (!assignedUserExists) {
          return NextResponse.json({ error: "Assigned User not found" }, { status: 404 });
        }
      }
      updateData.assignedToId = body.assignedToId;
    }

    // 3. Update the ticket
    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Check if the ticket exists
    const ticket = await prisma.ticket.findUnique({ where: { id } });
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // 2. Delete the ticket
    await prisma.ticket.delete({ where: { id } });

    return NextResponse.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return NextResponse.json({ error: "Failed to delete ticket" }, { status: 500 });
  }
}
