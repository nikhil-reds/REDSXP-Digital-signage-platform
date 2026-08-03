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

export const CLIP_TYPE_COLORS: Record<string, string> = {
  Image: "linear-gradient(180deg, #D97C1E, #A85C0E)",
  Video: "linear-gradient(180deg, #7A5236, #55361F)",
  HTML5: "linear-gradient(180deg, #2F5FD4, #1E44A8)",
};

export const LOCKED_TRACKS = [{ name: "Audio" }, { name: "Widgets" }];

export const DEFAULT_ZONE_ID = "full-screen";

export const PLAYLIST_ZONES: PlaylistZone[] = [
  { id: DEFAULT_ZONE_ID, name: "Full Screen", x: 0, y: 0, w: 100, h: 100, color: "#2859D9" },
  { id: "top-banner", name: "Top Banner", x: 0, y: 0, w: 100, h: 22, color: "#0F9F6E" },
  { id: "bottom-banner", name: "Bottom Banner", x: 0, y: 78, w: 100, h: 22, color: "#D97706" },
  { id: "left-panel", name: "Left Panel", x: 0, y: 0, w: 32, h: 100, color: "#7C3AED" },
  { id: "center-panel", name: "Center Panel", x: 32, y: 0, w: 36, h: 100, color: "#2563EB" },
  { id: "right-panel", name: "Right Panel", x: 68, y: 0, w: 32, h: 100, color: "#DB2777" },
  { id: "main-area", name: "Main Area", x: 32, y: 0, w: 68, h: 100, color: "#0891B2" },
  { id: "middle-left", name: "Middle Left", x: 0, y: 22, w: 32, h: 56, color: "#2563EB" },
  { id: "middle", name: "Middle", x: 32, y: 22, w: 36, h: 56, color: "#16A34A" },
  { id: "middle-right", name: "Middle Right", x: 68, y: 22, w: 32, h: 56, color: "#EA580C" },
  { id: "left-top", name: "Left Top", x: 0, y: 0, w: 32, h: 33.333, color: "#4F46E5" },
  { id: "left-center", name: "Left Center", x: 0, y: 33.333, w: 32, h: 33.334, color: "#7C3AED" },
  { id: "left-bottom", name: "Left Bottom", x: 0, y: 66.667, w: 32, h: 33.333, color: "#9333EA" },
  { id: "center-top", name: "Center Top", x: 32, y: 0, w: 36, h: 33.333, color: "#0284C7" },
  { id: "center-bottom", name: "Center Bottom", x: 32, y: 66.667, w: 36, h: 33.333, color: "#0D9488" },
  { id: "right-top", name: "Right Top", x: 68, y: 0, w: 32, h: 33.333, color: "#BE185D" },
  { id: "right-center", name: "Right Center", x: 68, y: 33.333, w: 32, h: 33.334, color: "#DB2777" },
  { id: "right-bottom", name: "Right Bottom", x: 68, y: 66.667, w: 32, h: 33.333, color: "#E11D48" },
  { id: "main-area-left", name: "Main Area Left", x: 32, y: 0, w: 34, h: 100, color: "#0891B2" },
  { id: "main-area-right", name: "Main Area Right", x: 66, y: 0, w: 34, h: 100, color: "#0E7490" },
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
