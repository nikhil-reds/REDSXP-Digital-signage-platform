export type ClipType = "Video" | "Image" | "HTML5";
export type Transition = "Fade" | "Crossfade" | "Cut";
export type Fit = "Fit" | "Fill";
export type ViewMode = "grid" | "list";
export type CompatLevel = "ok" | "warn";

export interface PlaylistClip {
  id: number;
  name: string;
  type: ClipType;
  w: number;
  h: number;
  size: string;
  duration: number;
  transition: Transition;
  transDur: number;
  thumb: string;
  fit: Fit;
}

export interface LibraryAsset {
  name: string;
  type: ClipType;
  w: number;
  h: number;
  size: string;
  dur: number;
  thumb: string;
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

export type PlaylistOrientation = "Landscape" | "Portrait";
export type PlaylistStatus = "Draft" | "Published";

export interface PlaylistSummary {
  id: string;
  name: string;
  itemCount: number;
  totalDuration: number;
  orientation: PlaylistOrientation;
  status: PlaylistStatus;
  updatedAt: string;
}
