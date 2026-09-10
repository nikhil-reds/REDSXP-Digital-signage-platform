import { ScreenDevice } from "./screens-table";

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = (data && (data.error || data.message)) || `Request failed (${res.status})`;
    throw new ApiRequestError(message, res.status);
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
  arch: string | null;
  buildVersion: string | null;
  status: "DOWNLOADED" | "INSTALLED" | "CLAIMED" | "EXPIRED";
  installId: string | null;
  hostname: string | null;
  osVersion: string | null;
  appVersion: string | null;
  ipAddress: string | null;
  screenResolution: string | null;
  displayCount: number | null;
  timezone: string | null;
  macAddress: string | null;
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

export type PlayerArch = "x64" | "arm64";

export interface PlayerDownload {
  id: string;
  platform: "LINUX" | "WINDOWS";
  arch: PlayerArch;
  buildVersion: string;
  pairingCode: string;
  label: string;
  expiresAt: string;
  downloadUrl: string;
}

export async function createPlayerDownload(
  platform: "LINUX" | "WINDOWS",
  arch: PlayerArch = "x64",
): Promise<PlayerDownload> {
  const response = await request<{ success: boolean; data: PlayerDownload }>(
    "/api/player-downloads",
    { method: "POST", body: JSON.stringify({ platform, arch }) },
  );
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
