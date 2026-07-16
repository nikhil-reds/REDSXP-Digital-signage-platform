import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TicketStatus, TicketPriority } from "@/app/generated/prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const userId = searchParams.get("userId");
    const assignedToId = searchParams.get("assignedToId");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    // Build the dynamic where filter
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (userId) where.userId = userId;
    if (assignedToId) where.assignedToId = assignedToId;

    if (status) {
      const parsedStatus = status.toUpperCase();
      if (Object.values(TicketStatus).includes(parsedStatus as TicketStatus)) {
        where.status = parsedStatus as TicketStatus;
      } else {
        return NextResponse.json({ error: `Invalid status: ${status}` }, { status: 400 });
      }
    }

    if (priority) {
      const parsedPriority = priority.toUpperCase();
      if (Object.values(TicketPriority).includes(parsedPriority as TicketPriority)) {
        where.priority = parsedPriority as TicketPriority;
      } else {
        return NextResponse.json({ error: `Invalid priority: ${priority}` }, { status: 400 });
      }
    }

    const tickets = await prisma.ticket.findMany({
      where,
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
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Multi-tenant fallback resolution
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

    // 2. Validate required inputs
    if (!body.title || typeof body.title !== "string" || body.title.trim() === "") {
      return NextResponse.json({ error: "Ticket title is required" }, { status: 400 });
    }

    // 3. Validate status if provided
    let status: TicketStatus = TicketStatus.OPEN;
    if (body.status) {
      const parsedStatus = body.status.toUpperCase();
      if (Object.values(TicketStatus).includes(parsedStatus as TicketStatus)) {
        status = parsedStatus as TicketStatus;
      } else {
        return NextResponse.json({ error: `Invalid status: ${body.status}` }, { status: 400 });
      }
    }

    // 4. Validate priority if provided
    let priority: TicketPriority = TicketPriority.MEDIUM;
    if (body.priority) {
      const parsedPriority = body.priority.toUpperCase();
      if (Object.values(TicketPriority).includes(parsedPriority as TicketPriority)) {
        priority = parsedPriority as TicketPriority;
      } else {
        return NextResponse.json({ error: `Invalid priority: ${body.priority}` }, { status: 400 });
      }
    }

    // 5. Validate optional associations (userId, assignedToId)
    if (body.userId) {
      const userExists = await prisma.user.findUnique({ where: { id: body.userId } });
      if (!userExists) {
        return NextResponse.json({ error: "Submitting User not found" }, { status: 404 });
      }
    }

    if (body.assignedToId) {
      const assignedUserExists = await prisma.user.findUnique({ where: { id: body.assignedToId } });
      if (!assignedUserExists) {
        return NextResponse.json({ error: "Assigned User not found" }, { status: 404 });
      }
    }

    // 6. Create the ticket
    const ticket = await prisma.ticket.create({
      data: {
        title: body.title,
        description: body.description || null,
        status,
        priority,
        tenantId: resolvedTenantId,
        userId: body.userId || null,
        assignedToId: body.assignedToId || null,
      },
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

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}
