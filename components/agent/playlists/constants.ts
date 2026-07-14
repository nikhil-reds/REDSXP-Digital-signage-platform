import { DeviceProfile, DisplayProfile } from "./types";

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

export const LOCKED_TRACKS = [{ name: "Audio" }, { name: "Zones" }, { name: "Widgets" }];

export const INITIAL_DISPLAY: DisplayProfile = { name: "Landscape 16:9", w: 1920, h: 1080 };
export const INITIAL_DEVICE = "BrightSign XC4055";
export const INITIAL_FALLBACK = "Default Corporate Loop";

export const FALLBACK_OPTIONS = [
  "Default Corporate Loop",
  "Default Emergency Loop",
  "Corporate Standard Loop",
  "None (black screen)",
];
