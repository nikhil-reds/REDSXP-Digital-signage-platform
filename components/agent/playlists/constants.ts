import { DeviceProfile, DisplayProfile, LibraryAsset, PlaylistClip } from "./types";

export const LIBRARY_ASSETS: LibraryAsset[] = [
  { name: "Monsoon_Cold_Coffee_15s.mp4", type: "Video", w: 1920, h: 1080, size: "42.8 MB", dur: 15, thumb: "linear-gradient(135deg, #8A5A3B, #4A2E1D)" },
  { name: "Breakfast_Combo_Landscape.jpg", type: "Image", w: 1920, h: 1080, size: "4.2 MB", dur: 8, thumb: "linear-gradient(135deg, #E8B34B, #C97A2B)" },
  { name: "Rewards_QR_July.html", type: "HTML5", w: 0, h: 0, size: "8.7 MB", dur: 20, thumb: "linear-gradient(135deg, #243447, #101825)" },
  { name: "Mango_Frappe_Promo_10s.mp4", type: "Video", w: 1080, h: 1920, size: "31.6 MB", dur: 10, thumb: "linear-gradient(135deg, #E9A13B, #C4611F)" },
  { name: "Store_Menu_July_v3.png", type: "Image", w: 2160, h: 3840, size: "12.4 MB", dur: 12, thumb: "linear-gradient(135deg, #4C7A5E, #2C4A3A)" },
  { name: "Independence_Day_Teaser.mp4", type: "Video", w: 1920, h: 1080, size: "86.1 MB", dur: 12, thumb: "linear-gradient(135deg, #2E4A8A, #1A2A50)" },
  { name: "Summer_Blend_Promotion.mp4", type: "Video", w: 1920, h: 1080, size: "38.2 MB", dur: 10, thumb: "linear-gradient(135deg, #C46A3A, #8A3F1E)" },
  { name: "Espresso_Macchiato_Still.jpg", type: "Image", w: 1920, h: 1080, size: "2.1 MB", dur: 8, thumb: "linear-gradient(135deg, #5A3A28, #2E1D13)" },
  { name: "Loyalty_Banner_Lowres.jpg", type: "Image", w: 960, h: 540, size: "0.4 MB", dur: 8, thumb: "linear-gradient(135deg, #6A4A7A, #3A2A45)" },
];

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

export const INITIAL_PLAYLIST_NAME = "Monsoon Café Promotions";

export const INITIAL_PLAYLIST_ITEMS: PlaylistClip[] = [
  { id: 1, name: "Breakfast_Combo_Landscape.jpg", type: "Image", w: 1920, h: 1080, size: "4.2 MB", duration: 8, transition: "Fade", transDur: 1, thumb: "linear-gradient(135deg, #E8B34B, #C97A2B)", fit: "Fill" },
  { id: 2, name: "Monsoon_Cold_Coffee_15s.mp4", type: "Video", w: 1920, h: 1080, size: "42.8 MB", duration: 15, transition: "Crossfade", transDur: 1.5, thumb: "linear-gradient(135deg, #8A5A3B, #4A2E1D)", fit: "Fill" },
  { id: 3, name: "Rewards_QR_July.html", type: "HTML5", w: 0, h: 0, size: "8.7 MB", duration: 20, transition: "Cut", transDur: 0, thumb: "linear-gradient(135deg, #243447, #101825)", fit: "Fit" },
  { id: 4, name: "Store_Menu_July_v3.png", type: "Image", w: 2160, h: 3840, size: "12.4 MB", duration: 12, transition: "Fade", transDur: 1, thumb: "linear-gradient(135deg, #4C7A5E, #2C4A3A)", fit: "Fit" },
];

export const INITIAL_DISPLAY: DisplayProfile = { name: "Landscape 16:9", w: 1920, h: 1080 };
export const INITIAL_DEVICE = "BrightSign XC4055";
export const INITIAL_FALLBACK = "Default Corporate Loop";

export const FALLBACK_OPTIONS = [
  "Default Corporate Loop",
  "Default Emergency Loop",
  "Corporate Standard Loop",
  "None (black screen)",
];
