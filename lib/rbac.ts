export type RoleScope = "SYSTEM" | "TENANT";

export interface PermissionItem {
  id: string;
  key: string;
  scope: RoleScope;
  resource: string;
  action: string;
  name: string;
  description?: string | null;
}

export interface UserRoleInfo {
  id: string;
  name: string;
  scope: RoleScope;
  tenantId?: string | null;
  isSystem?: boolean;
}

export interface UserSessionProfile {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  status: string;
  tenantId: string;
  tenantName?: string;
  tenantSlug?: string;
  role: UserRoleInfo;
  permissions: string[]; // Flat array of permission keys (e.g. ["media:create", "device:reboot"])
}

/**
 * Checks if a user has a specific permission key.
 * If the user's role is SUPER_ADMIN with SYSTEM scope or has full permissions, evaluates true.
 */
export function hasPermission(
  userPermissions: string[] | undefined | null,
  requiredPermission: string,
): boolean {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  if (userPermissions.includes("*") || userPermissions.includes("all")) return true;
  return userPermissions.includes(requiredPermission);
}

/**
 * Checks if user has ANY of the specified permission keys.
 */
export function hasAnyPermission(
  userPermissions: string[] | undefined | null,
  requiredPermissions: string[],
): boolean {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  if (userPermissions.includes("*") || userPermissions.includes("all")) return true;
  return requiredPermissions.some((perm) => userPermissions.includes(perm));
}

/**
 * Checks if user has ALL of the specified permission keys.
 */
export function hasAllPermissions(
  userPermissions: string[] | undefined | null,
  requiredPermissions: string[],
): boolean {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  if (userPermissions.includes("*") || userPermissions.includes("all")) return true;
  return requiredPermissions.every((perm) => userPermissions.includes(perm));
}

/**
 * System-wide permission key constants for IDE autocomplete and type safety.
 */
export const PERMISSIONS = {
  // Platform Admin Permissions (SYSTEM scope)
  ADMIN_TENANTS_READ: "admin:tenants:read",
  ADMIN_TENANTS_WRITE: "admin:tenants:write",
  ADMIN_TENANTS_DELETE: "admin:tenants:delete",
  ADMIN_PLANS_READ: "admin:plans:read",
  ADMIN_PLANS_WRITE: "admin:plans:write",
  ADMIN_BILLING_READ: "admin:billing:read",
  ADMIN_BILLING_WRITE: "admin:billing:write",
  ADMIN_USERS_READ: "admin:users:read",
  ADMIN_USERS_WRITE: "admin:users:write",
  ADMIN_ROLES_READ: "admin:roles:read",
  ADMIN_ROLES_WRITE: "admin:roles:write",
  ADMIN_AUDIT_READ: "admin:audit:read",

  // Tenant Agent Permissions (TENANT scope)
  MEDIA_READ: "media:read",
  MEDIA_CREATE: "media:create",
  MEDIA_UPDATE: "media:update",
  MEDIA_DELETE: "media:delete",

  PLAYLIST_READ: "playlist:read",
  PLAYLIST_CREATE: "playlist:create",
  PLAYLIST_UPDATE: "playlist:update",
  PLAYLIST_DELETE: "playlist:delete",

  SCHEDULE_READ: "schedule:read",
  SCHEDULE_CREATE: "schedule:create",
  SCHEDULE_UPDATE: "schedule:update",
  SCHEDULE_DELETE: "schedule:delete",

  DEVICE_READ: "device:read",
  DEVICE_CREATE: "device:create",
  DEVICE_UPDATE: "device:update",
  DEVICE_DELETE: "device:delete",
  DEVICE_REBOOT: "device:reboot",

  TENANT_USERS_READ: "tenant:users:read",
  TENANT_USERS_CREATE: "tenant:users:create",
  TENANT_USERS_UPDATE: "tenant:users:update",
  TENANT_USERS_DELETE: "tenant:users:delete",

  TENANT_ROLES_READ: "tenant:roles:read",
  TENANT_ROLES_CREATE: "tenant:roles:create",
  TENANT_ROLES_UPDATE: "tenant:roles:update",
  TENANT_ROLES_DELETE: "tenant:roles:delete",

  TENANT_AUDIT_READ: "tenant:audit:read",
} as const;
