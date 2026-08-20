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

export interface PlayerRegistration {
  id: string;
  platform: "LINUX" | "WINDOWS";
  status: "DOWNLOADED" | "INSTALLED" | "CLAIMED" | "EXPIRED";
  installId: string | null;
  hostname: string | null;
  osVersion: string | null;
  appVersion: string | null;
  ipAddress: string | null;
  deviceId: string | null;
  deviceName: string | null;
  installedAt: string | null;
  claimedAt: string | null;
  downloadedAt: string;
  registeredBy: string | null;
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

export async function createPlayerDownload(platform: "LINUX" | "WINDOWS"): Promise<{
  id: string;
  platform: "LINUX" | "WINDOWS";
  label: string;
  expiresAt: string;
  downloadUrl: string;
}> {
  const response = await request<{
    success: boolean;
    data: {
      id: string;
      platform: "LINUX" | "WINDOWS";
      label: string;
      expiresAt: string;
      downloadUrl: string;
    };
  }>("/api/player-downloads", { method: "POST", body: JSON.stringify({ platform }) });
  return response.data;
}

export async function fetchInstalledPlayers(): Promise<PlayerRegistration[]> {
  const response = await request<{ success: boolean; data: PlayerRegistration[] }>(
    "/api/player-registrations?status=INSTALLED",
  );
  return response.data;
}

export async function claimPlayerRegistration(
  id: string,
  payload: { name: string; location?: string; groupId?: string },
): Promise<ScreenDevice> {
  const response = await request<{ success: boolean; data: ScreenDevice }>(
    `/api/player-registrations/${id}/claim`,
    { method: "PATCH", body: JSON.stringify(payload) },
  );
  return response.data;
}

export async function updateScreen(id: string, payload: UpdateScreenPayload): Promise<ScreenDevice> {
  return request<ScreenDevice>(`/api/screens/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
}

export async function deleteScreen(id: string): Promise<void> {
  await request(`/api/screens/${id}`, { method: "DELETE" });
}
