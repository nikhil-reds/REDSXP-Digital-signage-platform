"use client";

import { useEffect, useState } from "react";
import { UserRoleInfo } from "@/lib/rbac";

export interface UserSessionUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  status?: string;
  tenantId?: string;
  tenant?: { id: string; name: string; slug: string } | null;
  role: UserRoleInfo;
  permissions: string[];
}

export function usePermissions() {
  const [user, setUser] = useState<UserSessionUser | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSessionProfile() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.user) {
            setUser(json.data.user);
            setPermissions(json.data.user.permissions || []);
          }
        }
      } catch (err) {
        console.error("Failed to load user permissions", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSessionProfile();
  }, []);

  const hasPermission = (requiredKey: string): boolean => {
    if (!permissions || !Array.isArray(permissions)) return false;
    if (permissions.includes("*") || permissions.includes("all")) return true;
    return permissions.includes(requiredKey);
  };

  const hasAnyPermission = (keys: string[]): boolean => {
    return keys.some((k) => hasPermission(k));
  };

  const hasAllPermissions = (keys: string[]): boolean => {
    return keys.every((k) => hasPermission(k));
  };

  return {
    user,
    permissions,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    roleScope: user?.role?.scope,
    // Scope, never role name — a tenant can create a role called "SUPER_ADMIN".
    isSuperAdmin: user?.role?.scope === "SYSTEM",
  };
}
