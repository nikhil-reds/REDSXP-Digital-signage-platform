import { randomInt } from "crypto";

// Ambiguous glyphs (0/O, 1/I/L) are excluded so an agent can read a code off a
// screen and type it into a player without transcription errors.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 8;

export function generatePairingCode() {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i += 1) {
    code += ALPHABET[randomInt(ALPHABET.length)];
  }
  return code;
}

/** Accepts user-typed input in any case, with or without separators. */
export function normalizePairingCode(value: unknown) {
  if (typeof value !== "string") return null;
  const normalized = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (normalized.length !== CODE_LENGTH) return null;
  if (![...normalized].every((char) => ALPHABET.includes(char))) return null;
  return normalized;
}

/** "K7M2P9XQ" -> "K7M2-P9XQ" for display only. */
export function formatPairingCode(code: string) {
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}
