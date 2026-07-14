import { CLIP_TYPE_COLORS } from "./constants";
import { ClipType, LibraryAsset, MediaStatus, PlaylistSummary } from "./types";

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

interface RawMedia {
  id: string;
  name: string;
  type: ClipType;
  size: string;
  width: number | null;
  height: number | null;
  durationSec: number | null;
  cdnUrl: string;
  status: MediaStatus;
}

interface RawPlaylistItem {
  id: string;
  mediaId: string;
  position: number;
  durationSec: number;
}

interface RawPlaylist {
  id: string;
  name: string;
  description: string | null;
  updatedAt: string;
  playlistItems: RawPlaylistItem[];
}

function formatUpdatedAt(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function mapMediaToLibraryAsset(m: RawMedia): LibraryAsset {
  const thumb =
    m.status === "Ready" && m.type === "Image" && m.cdnUrl
      ? `url(${m.cdnUrl}) center/cover no-repeat`
      : CLIP_TYPE_COLORS[m.type] || CLIP_TYPE_COLORS.Image;

  return {
    id: m.id,
    name: m.name,
    type: m.type,
    w: m.width ?? 0,
    h: m.height ?? 0,
    size: m.size,
    dur: m.durationSec ?? 10,
    thumb,
    src: m.cdnUrl,
    status: m.status,
  };
}

function mapPlaylistToSummary(p: RawPlaylist): PlaylistSummary {
  return {
    id: p.id,
    name: p.name,
    itemCount: p.playlistItems.length,
    totalDuration: p.playlistItems.reduce((sum, it) => sum + it.durationSec, 0),
    updatedAt: formatUpdatedAt(p.updatedAt),
  };
}

export interface PlaylistDetail {
  id: string;
  name: string;
  items: { mediaId: string; position: number; durationSec: number }[];
}

function toPlaylistDetail(p: RawPlaylist): PlaylistDetail {
  return {
    id: p.id,
    name: p.name,
    items: p.playlistItems
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((it) => ({ mediaId: it.mediaId, position: it.position, durationSec: it.durationSec })),
  };
}

export interface SavePlaylistPayload {
  name: string;
  items: { mediaId: string; position: number; durationSec: number }[];
}

export async function fetchMediaLibrary(): Promise<LibraryAsset[]> {
  const raw = await request<RawMedia[]>("/api/media");
  return raw.map(mapMediaToLibraryAsset);
}

export async function fetchPlaylists(): Promise<PlaylistSummary[]> {
  const raw = await request<RawPlaylist[]>("/api/playlist");
  return raw.map(mapPlaylistToSummary);
}

export async function fetchPlaylist(id: string): Promise<PlaylistDetail> {
  const raw = await request<RawPlaylist>(`/api/playlist/${id}`);
  return toPlaylistDetail(raw);
}

export async function createPlaylist(payload: SavePlaylistPayload): Promise<PlaylistDetail> {
  const raw = await request<RawPlaylist>("/api/playlist", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return toPlaylistDetail(raw);
}

export async function updatePlaylist(id: string, payload: SavePlaylistPayload): Promise<PlaylistDetail> {
  const raw = await request<RawPlaylist>(`/api/playlist/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return toPlaylistDetail(raw);
}

export async function deletePlaylist(id: string): Promise<void> {
  await request(`/api/playlist/${id}`, { method: "DELETE" });
}
