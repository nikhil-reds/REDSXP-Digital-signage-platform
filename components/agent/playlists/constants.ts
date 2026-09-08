import { DeviceProfile, DisplayProfile, PlaylistZone } from "./types";

export const DISPLAY_PRESETS: DisplayProfile[] = [
  { name: "Landscape 16:9", w: 1920, h: 1080 },
  { name: "Portrait 9:16", w: 1080, h: 1920 },
  { name: "4K Landscape", w: 3840, h: 2160 },
  { name: "4K Portrait", w: 2160, h: 3840 },
  { name: "Square", w: 1080, h: 1080 },
  { name: "Ultra Wide", w: 3440, h: 1440 },
  { name: "LED Wall", w: 3840, h: 1080 },
  { name: "Video Wall 2×2", w: 3840, h: 2160 },
  { name: "Kiosk Display", w: 1080, h: 1920 },
  { name: "Menu Board", w: 1920, h: 1080 },
  { name: "Stretched Display", w: 1920, h: 540 },
];

export const DEVICE_PROFILES: DeviceProfile[] = [
  { name: "Samsung Display QM55", category: "Commercial Display", w: 1920, h: 1080, bitrate: "25 Mbps", formats: "MP4 · JPG · PNG · HTML5" },
  { name: "LG Signage 55UH5N", category: "Commercial Display", w: 3840, h: 2160, bitrate: "40 Mbps", formats: "MP4 · HEVC · JPG · HTML5" },
  { name: "BrightSign HD225", category: "Media Player", w: 1920, h: 1080, bitrate: "25 Mbps", formats: "MP4 · MOV · JPG · PNG" },
  { name: "BrightSign XD1035", category: "Media Player", w: 3840, h: 2160, bitrate: "60 Mbps", formats: "MP4 · HEVC · JPG · HTML5" },
  { name: "BrightSign XC4055", category: "Media Player · Multi-out", w: 3840, h: 2160, bitrate: "80 Mbps", formats: "MP4 · HEVC · AV1 · HTML5" },
  { name: "Android Signage Player", category: "Android", w: 1920, h: 1080, bitrate: "20 Mbps", formats: "MP4 · WebM · JPG · HTML5" },
  { name: "Windows Player", category: "PC", w: 1920, h: 1080, bitrate: "50 Mbps", formats: "MP4 · MOV · PNG · HTML5" },
  { name: "Raspberry Pi 5", category: "SBC", w: 1920, h: 1080, bitrate: "15 Mbps", formats: "MP4 (H.264) · JPG" },
  { name: "LED Controller NovaStar", category: "LED Wall", w: 3840, h: 1080, bitrate: "30 Mbps", formats: "MP4 · PNG sequences" },
  { name: 'Interactive Kiosk 21.5"', category: "Touch Kiosk", w: 1080, h: 1920, bitrate: "20 Mbps", formats: "MP4 · HTML5 (touch)" },
  { name: "Menu Board Duo", category: "QSR Menu Board", w: 1920, h: 1080, bitrate: "25 Mbps", formats: "MP4 · JPG · HTML5" },
];

// Approved family only (Green -> Teal -> Blue), with dark stops so the light
// clip label on the timeline clears 4.5:1. Was orange / brown / bright blue.
export const CLIP_TYPE_COLORS: Record<string, string> = {
  Image: "linear-gradient(180deg, #06792D, #023112)",
  Video: "linear-gradient(180deg, #04531F, #023112)",
  HTML5: "linear-gradient(180deg, #474B52, #212121)",
};

export const LOCKED_TRACKS = [{ name: "Audio" }, { name: "Widgets" }];

export const DEFAULT_ZONE_ID = "full-screen";

/**
 * Zone identity colours. Each is dark enough that the light zone label and clip
 * text clear 4.5:1 (13.4 / 8.6 / 5.1 / 14.9 / 11.4 / 8.1 / 5.8 : 1 on off-white).
 * Brand Blue and Teal are deliberately absent: a light label on them measures
 * 3.96 and 2.18, so they cannot carry the label. Replaces the previous
 * purple / pink / orange / indigo set, which the brand book forbids.
 */
export const ZONE_PALETTE = [
  "#023112", // Green 100
  "#474B52", // Cool 80
  "#04531F", // Green 90
  "#333538", // Cool 90
  "#06792D", // Green 80
  "#5B616B", // Cool 70
  "#212121", // Cool 100
] as const;

export const PLAYLIST_ZONES: PlaylistZone[] = [
  { id: DEFAULT_ZONE_ID, name: "Full Screen", x: 0, y: 0, w: 100, h: 100, color: ZONE_PALETTE[0] },
  { id: "top-banner", name: "Top Banner", x: 0, y: 0, w: 100, h: 22, color: ZONE_PALETTE[1] },
  { id: "bottom-banner", name: "Bottom Banner", x: 0, y: 78, w: 100, h: 22, color: ZONE_PALETTE[2] },
  { id: "left-panel", name: "Left Panel", x: 0, y: 0, w: 32, h: 100, color: ZONE_PALETTE[3] },
  { id: "center-panel", name: "Center Panel", x: 32, y: 0, w: 36, h: 100, color: ZONE_PALETTE[4] },
  { id: "right-panel", name: "Right Panel", x: 68, y: 0, w: 32, h: 100, color: ZONE_PALETTE[5] },
  { id: "main-area", name: "Main Area", x: 32, y: 0, w: 68, h: 100, color: ZONE_PALETTE[6] },
  { id: "middle-left", name: "Middle Left", x: 0, y: 22, w: 32, h: 56, color: ZONE_PALETTE[0] },
  { id: "middle", name: "Middle", x: 32, y: 22, w: 36, h: 56, color: ZONE_PALETTE[1] },
  { id: "middle-right", name: "Middle Right", x: 68, y: 22, w: 32, h: 56, color: ZONE_PALETTE[2] },
  { id: "left-top", name: "Left Top", x: 0, y: 0, w: 32, h: 33.333, color: ZONE_PALETTE[3] },
  { id: "left-center", name: "Left Center", x: 0, y: 33.333, w: 32, h: 33.334, color: ZONE_PALETTE[4] },
  { id: "left-bottom", name: "Left Bottom", x: 0, y: 66.667, w: 32, h: 33.333, color: ZONE_PALETTE[5] },
  { id: "center-top", name: "Center Top", x: 32, y: 0, w: 36, h: 33.333, color: ZONE_PALETTE[6] },
  { id: "center-bottom", name: "Center Bottom", x: 32, y: 66.667, w: 36, h: 33.333, color: ZONE_PALETTE[0] },
  { id: "right-top", name: "Right Top", x: 68, y: 0, w: 32, h: 33.333, color: ZONE_PALETTE[1] },
  { id: "right-center", name: "Right Center", x: 68, y: 33.333, w: 32, h: 33.334, color: ZONE_PALETTE[2] },
  { id: "right-bottom", name: "Right Bottom", x: 68, y: 66.667, w: 32, h: 33.333, color: ZONE_PALETTE[3] },
  { id: "main-area-left", name: "Main Area Left", x: 32, y: 0, w: 34, h: 100, color: ZONE_PALETTE[4] },
  { id: "main-area-right", name: "Main Area Right", x: 66, y: 0, w: 34, h: 100, color: ZONE_PALETTE[5] },
];

export const INITIAL_GRID_COLUMNS = 3;
export const INITIAL_GRID_ROWS = 3;

export const INITIAL_DISPLAY: DisplayProfile = { name: "Landscape 16:9", w: 1920, h: 1080 };
export const INITIAL_DEVICE = "BrightSign XC4055";
export const INITIAL_FALLBACK = "Default Corporate Loop";

export const FALLBACK_OPTIONS = [
  "Default Corporate Loop",
  "Default Emergency Loop",
  "Corporate Standard Loop",
  "None (black screen)",
];
