"use client";

import { useSession, type SessionUser } from "@/components/providers/session-provider";

export type UserSessionUser = SessionUser;

/**
 * "May this user do X?" — the counterpart to useFeatures(), which answers "does
 * this workspace have X at all?". A gated control needs both.
 *
 * Reads the shared provider rather than fetching /api/auth/me itself, so a page
 * full of guards is still one request. Same public shape as before.
 */
export function usePermissions() {
  const { user, permissions, loading } = useSession();

  const hasPermission = (requiredKey: string): boolean => {
    if (!permissions || !Array.isArray(permissions)) return false;
    if (permissions.includes("*") || permissions.includes("all")) return true;
    return permissions.includes(requiredKey);
  };

  return {
    user,
    permissions,
    loading,
    hasPermission,
    hasAnyPermission: (keys: string[]) => keys.some((key) => hasPermission(key)),
    hasAllPermissions: (keys: string[]) => keys.every((key) => hasPermission(key)),
    roleScope: user?.role?.scope,
    // Scope, never role name — a tenant can create a role called "SUPER_ADMIN".
    isSuperAdmin: user?.role?.scope === "SYSTEM",
  };
}
