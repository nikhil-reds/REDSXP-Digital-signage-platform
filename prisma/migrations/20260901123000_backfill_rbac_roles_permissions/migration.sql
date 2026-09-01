-- Data backfill for the RBAC reconciliation in
-- 20260901120000_reconcile_role_permission_schema.
--
-- That migration reshapes "roles" and "permissions" but touches no data, and
-- prisma/seed.ts only adds -- it never migrates the rows an earlier, name-keyed
-- seed left behind. Without this migration, on any database that predates the
-- reconciliation:
--
--   * every "permissions" row keeps key = NULL, so "key" can never be promoted
--     to NOT NULL and seed's upsert-on-key inserts a second, duplicate
--     catalogue rather than matching the rows already there;
--   * the legacy "ADMIN" and "AGENT" roles inherit scope = 'TENANT' (the column
--     default) with zero permission links, so their users are authenticated but
--     authorized for nothing -- and because proxy.ts routes on scope, the admins
--     among them land in a panel where every request 403s.
--
-- Every step is idempotent: re-running is a no-op on an already-backfilled
-- database, and safe on a fresh one (where each step simply matches no rows).

-- ---------------------------------------------------------------------------
-- 1. The canonical catalogue, generated from prisma/seed.ts. Keyed by "name"
--    because that is the only column the earlier seed populated.
-- ---------------------------------------------------------------------------
-- Dropped first so the migration is re-runnable inside a single session
-- (ON COMMIT DROP only fires on commit).
DROP TABLE IF EXISTS _rbac_catalogue;

CREATE TEMP TABLE _rbac_catalogue (
  key      TEXT NOT NULL,
  name     TEXT NOT NULL,
  scope    "RoleScope" NOT NULL,
  resource TEXT NOT NULL,
  action   TEXT NOT NULL
) ON COMMIT DROP;

INSERT INTO _rbac_catalogue (key, name, scope, resource, action) VALUES
    ('admin:tenants:read', 'Read Tenants', 'SYSTEM', 'tenants', 'read'),
    ('admin:tenants:write', 'Manage Tenants', 'SYSTEM', 'tenants', 'write'),
    ('admin:tenants:delete', 'Delete Tenants', 'SYSTEM', 'tenants', 'delete'),
    ('admin:plans:read', 'Read Plans', 'SYSTEM', 'plans', 'read'),
    ('admin:plans:write', 'Manage Plans', 'SYSTEM', 'plans', 'write'),
    ('admin:billing:read', 'Read System Billing', 'SYSTEM', 'billing', 'read'),
    ('admin:billing:write', 'Manage System Billing', 'SYSTEM', 'billing', 'write'),
    ('admin:users:read', 'Read System Users', 'SYSTEM', 'users', 'read'),
    ('admin:users:write', 'Manage System Users', 'SYSTEM', 'users', 'write'),
    ('admin:roles:read', 'Read Admin Roles', 'SYSTEM', 'roles', 'read'),
    ('admin:roles:write', 'Manage Admin Roles', 'SYSTEM', 'roles', 'write'),
    ('admin:audit:read', 'Read System Audit Logs', 'SYSTEM', 'audit', 'read'),
    ('media:read', 'Read Media', 'TENANT', 'media', 'read'),
    ('media:create', 'Upload Media', 'TENANT', 'media', 'create'),
    ('media:update', 'Update Media', 'TENANT', 'media', 'update'),
    ('media:delete', 'Delete Media', 'TENANT', 'media', 'delete'),
    ('playlist:read', 'Read Playlists', 'TENANT', 'playlist', 'read'),
    ('playlist:create', 'Create Playlist', 'TENANT', 'playlist', 'create'),
    ('playlist:update', 'Update Playlist', 'TENANT', 'playlist', 'update'),
    ('playlist:delete', 'Delete Playlist', 'TENANT', 'playlist', 'delete'),
    ('schedule:read', 'Read Schedules', 'TENANT', 'schedule', 'read'),
    ('schedule:create', 'Create Schedule', 'TENANT', 'schedule', 'create'),
    ('schedule:update', 'Update Schedule', 'TENANT', 'schedule', 'update'),
    ('schedule:delete', 'Delete Schedule', 'TENANT', 'schedule', 'delete'),
    ('device:read', 'Read Devices', 'TENANT', 'device', 'read'),
    ('device:create', 'Register Device', 'TENANT', 'device', 'create'),
    ('device:update', 'Update Device', 'TENANT', 'device', 'update'),
    ('device:delete', 'Unregister Device', 'TENANT', 'device', 'delete'),
    ('device:reboot', 'Reboot Device', 'TENANT', 'device', 'reboot'),
    ('tenant:users:read', 'Read Workspace Users', 'TENANT', 'users', 'read'),
    ('tenant:users:create', 'Invite Workspace Users', 'TENANT', 'users', 'create'),
    ('tenant:users:update', 'Update Workspace Users', 'TENANT', 'users', 'update'),
    ('tenant:users:delete', 'Remove Workspace Users', 'TENANT', 'users', 'delete'),
    ('tenant:roles:read', 'Read Custom Roles', 'TENANT', 'roles', 'read'),
    ('tenant:roles:create', 'Create Custom Roles', 'TENANT', 'roles', 'create'),
    ('tenant:roles:update', 'Update Custom Roles', 'TENANT', 'roles', 'update'),
    ('tenant:roles:delete', 'Delete Custom Roles', 'TENANT', 'roles', 'delete'),
    ('tenant:audit:read', 'Read Workspace Audit Logs', 'TENANT', 'audit', 'read');

-- ---------------------------------------------------------------------------
-- 2. Give the existing permission rows their key, scope, resource and action.
--    Scoped to rows still missing a key so a re-run cannot clobber a key that
--    was since edited by hand.
-- ---------------------------------------------------------------------------
UPDATE "permissions" p
SET "key"      = c.key,
    "scope"    = c.scope,
    "resource" = c.resource,
    "action"   = c.action
FROM _rbac_catalogue c
WHERE p."name" = c.name
  AND p."key" IS NULL;

-- ---------------------------------------------------------------------------
-- 3. Now that every catalogue row has a key, promote the column to NOT NULL to
--    match `key String @unique` in schema.prisma. Skipped -- rather than
--    failing the migration -- if some row outside the catalogue still has no
--    key, which would need a human decision about what that row is.
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  orphans INT;
BEGIN
  SELECT count(*) INTO orphans FROM "permissions" WHERE "key" IS NULL;
  IF orphans > 0 THEN
    RAISE WARNING 'Leaving permissions.key nullable: % row(s) are not in the seed catalogue and have no key.', orphans;
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'permissions' AND column_name = 'key' AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE "permissions" ALTER COLUMN "key" SET NOT NULL;
  END IF;
END
$$;

-- ---------------------------------------------------------------------------
-- 4. The legacy platform role. "ADMIN" predates the scope column, so it must be
--    promoted to SYSTEM explicitly or requireAdmin() rejects its users.
-- ---------------------------------------------------------------------------
UPDATE "roles"
SET "scope" = 'SYSTEM', "is_system" = true, "tenant_id" = NULL
WHERE "name" = 'ADMIN' AND "tenant_id" IS NULL;

-- ---------------------------------------------------------------------------
-- 5. Scope and protect the two roles the current seed owns, so the database is
--    correct even if the migration runs before the seed.
-- ---------------------------------------------------------------------------
UPDATE "roles" SET "scope" = 'SYSTEM', "is_system" = true
WHERE "name" = 'SUPER_ADMIN' AND "tenant_id" IS NULL;

UPDATE "roles" SET "scope" = 'TENANT', "is_system" = true
WHERE "name" = 'AGENT_ADMIN' AND "tenant_id" IS NULL;

-- ---------------------------------------------------------------------------
-- 6. Permission links for every system-scope role. "_RolePermissions"."A" is
--    Permission.id and "B" is Role.id (Prisma orders the implicit join columns
--    by model name). The (A, B) primary key makes this idempotent.
-- ---------------------------------------------------------------------------
INSERT INTO "_RolePermissions" ("A", "B")
SELECT p."id", r."id"
FROM "permissions" p
CROSS JOIN "roles" r
WHERE p."scope" = 'SYSTEM'
  AND r."tenant_id" IS NULL
  AND r."name" IN ('ADMIN', 'SUPER_ADMIN')
ON CONFLICT DO NOTHING;

INSERT INTO "_RolePermissions" ("A", "B")
SELECT p."id", r."id"
FROM "permissions" p
CROSS JOIN "roles" r
WHERE p."scope" = 'TENANT'
  AND r."tenant_id" IS NULL
  AND r."name" = 'AGENT_ADMIN'
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 7. Roles are tenant-scoped now, so the single global "AGENT" role cannot
--    serve users across tenants. Give every tenant that still has users on it
--    its own AGENT_ADMIN -- the same role name and shape that
--    app/api/auth/register/route.ts creates for new tenants.
-- ---------------------------------------------------------------------------
INSERT INTO "roles" ("id", "tenant_id", "scope", "name", "description", "is_system", "created_at", "updated_at")
SELECT gen_random_uuid(), t."tenant_id", 'TENANT', 'AGENT_ADMIN',
       'Full Workspace Administrator custom role', true, now(), now()
FROM (
  SELECT DISTINCT u."tenant_id"
  FROM "users" u
  JOIN "roles" r ON r."id" = u."role_id"
  WHERE r."name" = 'AGENT' AND r."tenant_id" IS NULL
) t
WHERE NOT EXISTS (
  SELECT 1 FROM "roles" existing
  WHERE existing."tenant_id" = t."tenant_id" AND existing."name" = 'AGENT_ADMIN'
);

-- 7b. All 26 tenant-scope permissions for every per-tenant AGENT_ADMIN.
INSERT INTO "_RolePermissions" ("A", "B")
SELECT p."id", r."id"
FROM "permissions" p
CROSS JOIN "roles" r
WHERE p."scope" = 'TENANT'
  AND r."name" = 'AGENT_ADMIN'
  AND r."tenant_id" IS NOT NULL
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 8. Move the users off the legacy global role and onto their own tenant's.
-- ---------------------------------------------------------------------------
UPDATE "users" u
SET "role_id" = target."id"
FROM "roles" target
WHERE target."tenant_id" = u."tenant_id"
  AND target."name" = 'AGENT_ADMIN'
  AND u."role_id" IN (
    SELECT "id" FROM "roles" WHERE "name" = 'AGENT' AND "tenant_id" IS NULL
  );

-- ---------------------------------------------------------------------------
-- 9. Drop the legacy global role, but only once nothing points at it. Its
--    permission links go with it via the join table's FK cascade.
-- ---------------------------------------------------------------------------
DELETE FROM "roles" r
WHERE r."name" = 'AGENT'
  AND r."tenant_id" IS NULL
  AND NOT EXISTS (SELECT 1 FROM "users" u WHERE u."role_id" = r."id");
