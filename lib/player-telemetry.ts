import { timingSafeEqual } from "crypto";

export function readText(value: unknown, maxLength = 160) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

export function readInt(value: unknown, min: number, max: number) {
  const parsed = typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(parsed)) return null;
  const rounded = Math.trunc(parsed);
  if (rounded < min || rounded > max) return null;
  return rounded;
}

/** "1920x1080" — anything else is dropped rather than stored as junk. */
export function readResolution(value: unknown) {
  const text = readText(value, 32);
  if (!text) return null;
  return /^\d{2,6}x\d{2,6}$/.test(text) ? text : null;
}

export function readMacAddress(value: unknown) {
  const text = readText(value, 32);
  if (!text) return null;
  const normalized = text.toUpperCase().replace(/-/g, ":");
  return /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/.test(normalized) ? normalized : null;
}

export interface PlayerTelemetry {
  hostname: string | null;
  osVersion: string | null;
  appVersion: string | null;
  screenResolution: string | null;
  displayCount: number | null;
  timezone: string | null;
  macAddress: string | null;
  appInstallPath: string | null;
}

/** Shared shape sent by the player on both install and heartbeat. */
export function readPlayerTelemetry(body: Record<string, unknown> | null): PlayerTelemetry {
  return {
    hostname: readText(body?.hostname),
    osVersion: readText(body?.osVersion),
    appVersion: readText(body?.appVersion, 64),
    screenResolution: readResolution(body?.screenResolution),
    displayCount: readInt(body?.displayCount, 1, 64),
    timezone: readText(body?.timezone, 64),
    macAddress: readMacAddress(body?.macAddress),
    appInstallPath: readText(body?.appInstallPath, 512),
  };
}

/** Constant-time compare so device tokens cannot be probed byte by byte. */
export function tokensMatch(expected: string, provided: string) {
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(provided, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
