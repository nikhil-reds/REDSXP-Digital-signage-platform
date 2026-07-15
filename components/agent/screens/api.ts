import { ScreenDevice } from "./screens-table";

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

export interface CreateScreenPayload {
  name: string;
  model: string;
  location?: string;
  groupId?: string;
}

export interface UpdateScreenPayload {
  name?: string;
  location?: string;
  model?: string;
  firmwareVersion?: string;
  status?: "Online" | "Delayed" | "Offline";
  groupId?: string | null;
  currentPlaylistId?: string | null;
  storagePercent?: number;
  alertsCount?: number;
  alertsSeverity?: "critical" | "high" | "medium" | "none";
}

export async function fetchScreens(): Promise<ScreenDevice[]> {
  return request<ScreenDevice[]>("/api/screens");
}

export async function fetchScreen(id: string): Promise<ScreenDevice> {
  return request<ScreenDevice>(`/api/screens/${id}`);
}

export async function createScreen(payload: CreateScreenPayload): Promise<ScreenDevice> {
  return request<ScreenDevice>("/api/screens", { method: "POST", body: JSON.stringify(payload) });
}

export async function updateScreen(id: string, payload: UpdateScreenPayload): Promise<ScreenDevice> {
  return request<ScreenDevice>(`/api/screens/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
}

export async function deleteScreen(id: string): Promise<void> {
  await request(`/api/screens/${id}`, { method: "DELETE" });
}
