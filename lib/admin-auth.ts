/**
 * Re-export shim. The implementation moved to lib/session.ts when the admin and
 * agent guards were unified; this keeps the existing /api/admin call sites and
 * lib/admin-user-status.ts importing from where they always have.
 */
export {
  getAuthenticatedUser,
  requireAdmin,
  requirePermission,
  type AuthenticatedUser,
} from "@/lib/session";
