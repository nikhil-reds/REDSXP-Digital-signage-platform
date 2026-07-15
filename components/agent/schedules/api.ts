async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = (data && (data.error || data.message)) || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data as T;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function combineDateAndTime(date: string, time: string): string {
  return new Date(`${date}T${time}:00`).toISOString();
}

function splitDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return { date, time };
}

interface RawDevice {
  id: string;
  name: string;
}

interface RawSchedule {
  id: string;
  name: string;
  description: string | null;
  playlistId: string;
  playlist: { id: string; name: string } | null;
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
  priority: number;
  status: "ACTIVE" | "INACTIVE";
  devices: RawDevice[];
  deviceIds: string[];
}

export interface ScheduleSummary {
  id: string;
  name: string;
  description: string | null;
  playlistId: string;
  playlistName: string;
  startDate: string;
  endDate: string;
  dailyStartTime: string;
  dailyEndTime: string;
  daysOfWeek: number[];
  priority: number;
  status: "ACTIVE" | "INACTIVE";
  deviceIds: string[];
  deviceNames: string[];
  screensCount: number;
}

export interface SaveSchedulePayload {
  name: string;
  description?: string | null;
  playlistId: string;
  startDate: string;
  endDate: string;
  dailyStartTime: string;
  dailyEndTime: string;
  daysOfWeek: number[];
  priority: number;
  status: "ACTIVE" | "INACTIVE";
  deviceIds: string[];
}

function toScheduleSummary(raw: RawSchedule): ScheduleSummary {
  const { date: startDate, time: dailyStartTime } = splitDateTime(raw.startTime);
  const { date: endDate, time: dailyEndTime } = splitDateTime(raw.endTime);
  const deviceIds = raw.deviceIds ?? raw.devices.map((d) => d.id);

  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    playlistId: raw.playlistId,
    playlistName: raw.playlist?.name ?? "Unknown Playlist",
    startDate,
    endDate,
    dailyStartTime,
    dailyEndTime,
    daysOfWeek: raw.daysOfWeek,
    priority: raw.priority,
    status: raw.status,
    deviceIds,
    deviceNames: raw.devices.map((d) => d.name),
    screensCount: deviceIds.length,
  };
}

function toApiPayload(payload: SaveSchedulePayload) {
  return {
    name: payload.name,
    description: payload.description ?? null,
    playlistId: payload.playlistId,
    startTime: combineDateAndTime(payload.startDate, payload.dailyStartTime),
    endTime: combineDateAndTime(payload.endDate, payload.dailyEndTime),
    daysOfWeek: payload.daysOfWeek,
    priority: payload.priority,
    status: payload.status,
    deviceIds: payload.deviceIds,
  };
}

export async function fetchSchedules(): Promise<ScheduleSummary[]> {
  const raw = await request<RawSchedule[]>("/api/schedules");
  return raw.map(toScheduleSummary);
}

export async function fetchSchedule(id: string): Promise<ScheduleSummary> {
  const raw = await request<RawSchedule>(`/api/schedules/${id}`);
  return toScheduleSummary(raw);
}

export async function createSchedule(payload: SaveSchedulePayload): Promise<ScheduleSummary> {
  const raw = await request<RawSchedule>("/api/schedules", {
    method: "POST",
    body: JSON.stringify(toApiPayload(payload)),
  });
  return toScheduleSummary(raw);
}

export async function updateSchedule(id: string, payload: SaveSchedulePayload): Promise<ScheduleSummary> {
  const raw = await request<RawSchedule>(`/api/schedules/${id}`, {
    method: "PUT",
    body: JSON.stringify(toApiPayload(payload)),
  });
  return toScheduleSummary(raw);
}

export async function deleteSchedule(id: string): Promise<void> {
  await request(`/api/schedules/${id}`, { method: "DELETE" });
}
