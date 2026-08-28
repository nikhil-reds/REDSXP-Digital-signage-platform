import { prisma } from "@/lib/prisma";

// Read-only tool catalog for the CMS Assistant. Every executor is scoped by
// tenantId derived from the authenticated session — never from model input.

export const ASSISTANT_TOOLS = [
  {
    toolSpec: {
      name: "list_screens",
      description:
        "List screens/devices for the tenant, optionally filtered by status, location, low storage, or presence of alerts. Use for questions like 'which screens are offline' or 'show screens at Phoenix Mall'.",
      inputSchema: {
        json: {
          type: "object",
          properties: {
            status: { type: "string", enum: ["ONLINE", "DELAYED", "OFFLINE"] },
            location: { type: "string", description: "Case-insensitive substring match on location/name" },
            minStoragePercent: { type: "number", description: "Only screens at or above this storage percent" },
            onlyWithAlerts: { type: "boolean", description: "Only screens with an active alert (severity != NONE)" },
            staleHours: { type: "number", description: "Only screens not seen in at least this many hours" },
          },
        },
      },
    },
  },
  {
    toolSpec: {
      name: "list_schedules",
      description:
        "List schedules (calendars) for the tenant, optionally filtered by date, screen name, or playlist name. Use for questions like 'what is playing tomorrow' or 'find the weekend campaign schedule'.",
      inputSchema: {
        json: {
          type: "object",
          properties: {
            date: { type: "string", description: "ISO date (YYYY-MM-DD) the schedule must be active on" },
            screenName: { type: "string", description: "Case-insensitive substring match on device name/location" },
            playlistName: { type: "string", description: "Case-insensitive substring match on playlist name" },
          },
        },
      },
    },
  },
  {
    toolSpec: {
      name: "find_schedule_conflicts",
      description:
        "Find schedules that overlap on the same screen (same day-of-week and overlapping time window). Use for questions like 'find schedule conflicts' or 'are there any overlapping schedules'.",
      inputSchema: { json: { type: "object", properties: {} } },
    },
  },
  {
    toolSpec: {
      name: "list_playlists",
      description:
        "List playlists for the tenant, optionally filtered by playlist name or by a media file name they contain. Use for 'find playlists' or 'which playlists use this file'.",
      inputSchema: {
        json: {
          type: "object",
          properties: {
            name: { type: "string", description: "Case-insensitive substring match on playlist name" },
            mediaName: { type: "string", description: "Case-insensitive substring match on a media file name used in the playlist" },
          },
        },
      },
    },
  },
  {
    toolSpec: {
      name: "list_media_issues",
      description:
        "List media items that failed to process or are still processing. Use for 'find failed uploads' or 'show media problems'.",
      inputSchema: {
        json: {
          type: "object",
          properties: {
            status: { type: "string", enum: ["FAILED", "PROCESSING"] },
          },
        },
      },
    },
  },
  {
    toolSpec: {
      name: "list_alerts",
      description:
        "List active device alerts and open support tickets for the tenant, optionally filtered by minimum severity/priority. Use for 'explain these alerts' or 'show critical items first'.",
      inputSchema: {
        json: {
          type: "object",
          properties: {
            minSeverity: { type: "string", enum: ["MEDIUM", "HIGH", "CRITICAL"] },
          },
        },
      },
    },
  },
  {
    toolSpec: {
      name: "dashboard_summary",
      description:
        "Get an overall operational summary for the tenant: screen counts by status, critical alerts, open tickets, and media issues. Use for 'what needs my attention' or 'give me a morning summary'.",
      inputSchema: { json: { type: "object", properties: {} } },
    },
  },
] as const;

export type AssistantToolName = (typeof ASSISTANT_TOOLS)[number]["toolSpec"]["name"];

type Card = { title: string; subtitle?: string; badge?: string; href?: string };

type ToolResult = { data: unknown; cards: Card[] };

function daysOverlap(a: number[], b: number[]) {
  return a.some((d) => b.includes(d));
}

function timeRangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  const toMinutes = (d: Date) => d.getUTCHours() * 60 + d.getUTCMinutes();
  const [as, ae, bs, be] = [toMinutes(aStart), toMinutes(aEnd), toMinutes(bStart), toMinutes(bEnd)];
  return as < be && bs < ae;
}

async function listScreens(
  tenantId: string,
  input: { status?: string; location?: string; minStoragePercent?: number; onlyWithAlerts?: boolean; staleHours?: number },
): Promise<ToolResult> {
  const where: Record<string, unknown> = { tenantId };
  if (input.status) where.status = input.status;
  if (input.location) where.OR = [
    { location: { contains: input.location, mode: "insensitive" } },
    { name: { contains: input.location, mode: "insensitive" } },
  ];
  if (typeof input.minStoragePercent === "number") where.storagePercent = { gte: input.minStoragePercent };
  if (input.onlyWithAlerts) where.alertsSeverity = { not: "NONE" };
  if (typeof input.staleHours === "number") {
    where.lastSeen = { lte: new Date(Date.now() - input.staleHours * 60 * 60 * 1000) };
  }

  const devices = await prisma.device.findMany({
    where,
    select: {
      id: true,
      name: true,
      location: true,
      status: true,
      lastSeen: true,
      storagePercent: true,
      alertsSeverity: true,
      alertsCount: true,
      playlist: { select: { name: true } },
    },
    orderBy: { name: "asc" },
    take: 50,
  });

  return {
    data: devices,
    cards: devices.map((d) => ({
      title: d.name,
      subtitle: [d.location, d.playlist?.name ? `Playing: ${d.playlist.name}` : null].filter(Boolean).join(" • "),
      badge: d.status,
      href: `/agent/screens?screenId=${d.id}`,
    })),
  };
}

async function listSchedules(
  tenantId: string,
  input: { date?: string; screenName?: string; playlistName?: string },
): Promise<ToolResult> {
  const where: Record<string, unknown> = { tenantId };
  if (input.playlistName) where.playlist = { name: { contains: input.playlistName, mode: "insensitive" } };
  if (input.screenName) {
    where.devices = {
      some: {
        OR: [
          { name: { contains: input.screenName, mode: "insensitive" } },
          { location: { contains: input.screenName, mode: "insensitive" } },
        ],
      },
    };
  }

  let calendars = await prisma.calendar.findMany({
    where,
    select: {
      id: true,
      name: true,
      startTime: true,
      endTime: true,
      daysOfWeek: true,
      priority: true,
      status: true,
      playlist: { select: { name: true } },
      devices: { select: { id: true, name: true } },
    },
    orderBy: { startTime: "asc" },
    take: 50,
  });

  if (input.date) {
    const targetDay = new Date(`${input.date}T00:00:00Z`).getUTCDay();
    const isoDay = targetDay === 0 ? 7 : targetDay;
    calendars = calendars.filter((c) => c.daysOfWeek.includes(isoDay));
  }

  return {
    data: calendars,
    cards: calendars.map((c) => ({
      title: c.name,
      subtitle: `${c.playlist.name} • ${c.devices.map((d) => d.name).join(", ") || "No screens"}`,
      badge: c.status,
      href: `/agent/schedules?scheduleId=${c.id}`,
    })),
  };
}

async function findScheduleConflicts(tenantId: string): Promise<ToolResult> {
  const calendars = await prisma.calendar.findMany({
    where: { tenantId, status: "ACTIVE" },
    select: {
      id: true,
      name: true,
      startTime: true,
      endTime: true,
      daysOfWeek: true,
      priority: true,
      playlist: { select: { name: true } },
      devices: { select: { id: true, name: true } },
    },
  });

  const conflicts: { a: string; b: string; device: string; days: number[] }[] = [];
  for (let i = 0; i < calendars.length; i++) {
    for (let j = i + 1; j < calendars.length; j++) {
      const a = calendars[i];
      const b = calendars[j];
      if (!daysOverlap(a.daysOfWeek, b.daysOfWeek)) continue;
      if (!timeRangesOverlap(a.startTime, a.endTime, b.startTime, b.endTime)) continue;
      const sharedDevices = a.devices.filter((da) => b.devices.some((db) => db.id === da.id));
      for (const device of sharedDevices) {
        conflicts.push({
          a: a.name,
          b: b.name,
          device: device.name,
          days: a.daysOfWeek.filter((d) => b.daysOfWeek.includes(d)),
        });
      }
    }
  }

  return {
    data: conflicts,
    cards: conflicts.map((c) => ({
      title: `${c.a} vs ${c.b}`,
      subtitle: `Overlap on ${c.device}`,
      badge: "CONFLICT",
    })),
  };
}

async function listPlaylists(
  tenantId: string,
  input: { name?: string; mediaName?: string },
): Promise<ToolResult> {
  const where: Record<string, unknown> = { tenantId };
  if (input.name) where.name = { contains: input.name, mode: "insensitive" };
  if (input.mediaName) {
    where.playlistItems = { some: { media: { name: { contains: input.mediaName, mode: "insensitive" } } } };
  }

  const playlists = await prisma.playlist.findMany({
    where,
    select: {
      id: true,
      name: true,
      displayName: true,
      playlistItems: { select: { durationSec: true, media: { select: { name: true } } } },
    },
    orderBy: { name: "asc" },
    take: 50,
  });

  return {
    data: playlists,
    cards: playlists.map((p) => ({
      title: p.name,
      subtitle: `${p.playlistItems.length} items • ${p.playlistItems.reduce((s, i) => s + i.durationSec, 0)}s total`,
      badge: p.displayName,
      href: `/agent/playlists?playlistId=${p.id}`,
    })),
  };
}

async function listMediaIssues(tenantId: string, input: { status?: "FAILED" | "PROCESSING" }): Promise<ToolResult> {
  const media = await prisma.media.findMany({
    where: { tenantId, status: input.status ?? { in: ["FAILED", "PROCESSING"] } },
    select: { id: true, name: true, status: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return {
    data: media,
    cards: media.map((m) => ({
      title: m.name,
      subtitle: `Uploaded ${m.createdAt.toISOString()}`,
      badge: m.status,
      href: `/agent/media?mediaId=${m.id}`,
    })),
  };
}

async function listAlerts(tenantId: string, input: { minSeverity?: "MEDIUM" | "HIGH" | "CRITICAL" }): Promise<ToolResult> {
  const severityOrder = ["NONE", "MEDIUM", "HIGH", "CRITICAL"];
  const minIndex = input.minSeverity ? severityOrder.indexOf(input.minSeverity) : 1;
  const allowedSeverities = severityOrder.slice(Math.max(minIndex, 1));

  const [devices, tickets] = await Promise.all([
    prisma.device.findMany({
      where: { tenantId, alertsSeverity: { in: allowedSeverities as never[] } },
      select: { id: true, name: true, location: true, alertsSeverity: true, alertsCount: true, status: true },
      orderBy: { alertsCount: "desc" },
      take: 30,
    }),
    prisma.ticket.findMany({
      where: { tenantId, status: { in: ["OPEN", "IN_PROGRESS"] } },
      select: { id: true, title: true, priority: true, status: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
  ]);

  return {
    data: { deviceAlerts: devices, tickets },
    cards: [
      ...devices.map((d) => ({
        title: d.name,
        subtitle: d.location ?? undefined,
        badge: d.alertsSeverity,
        href: `/agent/alerts?deviceId=${d.id}`,
      })),
      ...tickets.map((t) => ({
        title: t.title,
        subtitle: `Ticket • ${t.status}`,
        badge: t.priority,
        href: `/agent/support?ticketId=${t.id}`,
      })),
    ],
  };
}

async function dashboardSummary(tenantId: string): Promise<ToolResult> {
  const [statusCounts, criticalAlerts, openTickets, mediaIssues] = await Promise.all([
    prisma.device.groupBy({ by: ["status"], where: { tenantId }, _count: { _all: true } }),
    prisma.device.count({ where: { tenantId, alertsSeverity: { in: ["HIGH", "CRITICAL"] } } }),
    prisma.ticket.count({ where: { tenantId, status: { in: ["OPEN", "IN_PROGRESS"] } } }),
    prisma.media.count({ where: { tenantId, status: { in: ["FAILED", "PROCESSING"] } } }),
  ]);

  const data = {
    screensByStatus: Object.fromEntries(statusCounts.map((s) => [s.status, s._count._all])),
    criticalAlerts,
    openTickets,
    mediaIssues,
    generatedAt: new Date().toISOString(),
  };

  return { data, cards: [] };
}

export async function executeAssistantTool(
  name: AssistantToolName,
  input: Record<string, unknown>,
  tenantId: string,
): Promise<ToolResult> {
  switch (name) {
    case "list_screens":
      return listScreens(tenantId, input);
    case "list_schedules":
      return listSchedules(tenantId, input);
    case "find_schedule_conflicts":
      return findScheduleConflicts(tenantId);
    case "list_playlists":
      return listPlaylists(tenantId, input);
    case "list_media_issues":
      return listMediaIssues(tenantId, input as { status?: "FAILED" | "PROCESSING" });
    case "list_alerts":
      return listAlerts(tenantId, input as { minSeverity?: "MEDIUM" | "HIGH" | "CRITICAL" });
    case "dashboard_summary":
      return dashboardSummary(tenantId);
    default:
      return { data: { error: `Unknown tool: ${name}` }, cards: [] };
  }
}
