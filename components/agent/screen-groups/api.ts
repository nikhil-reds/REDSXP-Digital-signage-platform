import { ScreenGroup } from "./groups-grid";
import { ScreenDevice } from "@/components/agent/screens/screens-table";

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

export interface ScreenGroupDetail extends ScreenGroup {
  scheduleLabel: string | null;
  currentPlaylistId: string | null;
  devices: ScreenDevice[];
  deviceIds: string[];
}

export interface SaveScreenGroupPayload {
  name: string;
  currentPlaylistId?: string | null;
  scheduleLabel?: string | null;
  deviceIds?: string[];
}

export async function fetchScreenGroups(): Promise<ScreenGroup[]> {
  return request<ScreenGroup[]>("/api/screen-groups");
}

export async function fetchScreenGroup(id: string): Promise<ScreenGroupDetail> {
  return request<ScreenGroupDetail>(`/api/screen-groups/${id}`);
}

export async function createScreenGroup(payload: SaveScreenGroupPayload): Promise<ScreenGroupDetail> {
  return request<ScreenGroupDetail>("/api/screen-groups", { method: "POST", body: JSON.stringify(payload) });
}

export async function updateScreenGroup(id: string, payload: SaveScreenGroupPayload): Promise<ScreenGroupDetail> {
  return request<ScreenGroupDetail>(`/api/screen-groups/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
}

export async function deleteScreenGroup(id: string): Promise<void> {
  await request(`/api/screen-groups/${id}`, { method: "DELETE" });
}
