"use client";

import { ReactNode } from "react";
import { usePermissions } from "@/hooks/use-permissions";

interface PermissionGuardProps {
  permission: string | string[];
  requireAll?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGuard({
  permission,
  requireAll = false,
  fallback = null,
  children,
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, loading } = usePermissions();

  if (loading) return null;

  const permKeys = Array.isArray(permission) ? permission : [permission];
  const isAllowed = requireAll
    ? hasAllPermissions(permKeys)
    : permKeys.length === 1
      ? hasPermission(permKeys[0])
      : hasAnyPermission(permKeys);

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
