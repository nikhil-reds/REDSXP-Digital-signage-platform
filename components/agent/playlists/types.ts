export type ClipType = "Video" | "Image" | "HTML5";
export type Transition = "Fade" | "Crossfade" | "Cut";
export type MediaFit = "cover" | "contain" | "fill" | "none" | "scale-down";
export type MediaPosition = "center" | "top" | "bottom" | "left" | "right";
export type ViewMode = "grid" | "list";
export type CompatLevel = "ok" | "warn";
export type PlaylistLayoutMode = "zone" | "custom-grid";

export interface PlaylistZone {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}

export interface PlaylistClip {
  /** Client-only synthetic key for React keys/selection/drag — NOT sent to the API. */
  instanceId: string;
  /** Real Media.id this clip references. */
  mediaId: string;
  name: string;
  type: ClipType;
  w: number;
  h: number;
  size: string;
  duration: number;
  /** Editor-only convenience, not persisted (no backing column on PlaylistItem). */
  transition: Transition;
  /** Editor-only convenience, not persisted. */
  transDur: number;
  thumb: string;
  /** Real playable/displayable URL (Media.cdnUrl) — used for actual preview playback. */
  src: string;
  /** Editor-only convenience, not persisted. */
  fit: MediaFit;
  /** Editor-only convenience, not persisted. */
  position: MediaPosition;
  /** Display zone assignment. */
  zoneId: string;
}

export type MediaStatus = "Ready" | "Transcoding" | "Failed";

export interface LibraryAsset {
  id: string;
  name: string;
  type: ClipType;
  w: number;
  h: number;
  size: string;
  dur: number | null;
  thumb: string;
  /** Real playable/displayable URL (Media.cdnUrl). */
  src: string;
  status: MediaStatus;
}

export interface DisplayProfile {
  name: string;
  w: number;
  h: number;
}

export interface DeviceProfile {
  name: string;
  category: string;
  w: number;
  h: number;
  bitrate: string;
  formats: string;
}

export interface CompatResult {
  level: CompatLevel;
  icon: string;
  short: string;
  label: string;
  tip: string;
}

export type DisplayConfigTab = "presets" | "devices" | "custom";

export interface PlaylistSummary {
  id: string;
  name: string;
  itemCount: number;
  totalDuration: number;
  updatedAt: string;
}
