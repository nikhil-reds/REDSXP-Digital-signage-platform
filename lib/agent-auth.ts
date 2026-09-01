/**
 * Re-export shim. See lib/session.ts — requireAgent is now the no-permission
 * case of the same session lookup, and returns the full user rather than the
 * three columns this file used to select.
 */
export { requireAgent } from "@/lib/session";
