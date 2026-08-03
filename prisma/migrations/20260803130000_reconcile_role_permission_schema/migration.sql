-- Reconciles prisma/migrations history with the richer Role/Permission shape
-- already declared in schema.prisma (Role.tenantId/scope/isSystem,
-- Permission.key/scope/resource/action, and the RoleScope enum). The migration
-- that originally created "roles" and "permissions"
-- (20260706101942_add_auth_sessions) only created the bare id/name/description
-- shape; nothing since has migrated them to match the current schema.
--
-- This migration is written defensively (IF NOT EXISTS / guarded DO blocks)
-- because it's unknown whether the target database already has these columns
-- applied out-of-band (e.g. via `prisma db push` during development) or is
-- still on the original bare shape. Either way, running this migration is
-- safe: on a DB that's already caught up, every step below is a no-op; on a
-- DB still on the original shape, it performs the actual reconciliation.
--
-- If `prisma migrate deploy` reports this migration as already satisfied by
-- the current DB state (i.e. the DB was already pushed to match this shape
-- outside of migration history), use `prisma migrate resolve --applied
-- 20260803130000_reconcile_role_permission_schema` instead of `deploy` so
-- Prisma marks it as applied without re-running the (harmless, but
-- unnecessary) DDL.

-- CreateEnum (guarded: CREATE TYPE has no IF NOT EXISTS in Postgres)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'RoleScope') THEN
    CREATE TYPE "RoleScope" AS ENUM ('SYSTEM', 'TENANT');
  END IF;
END
$$;

-- AlterTable "roles": add tenant_id, scope, is_system
ALTER TABLE "roles" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT;
ALTER TABLE "roles" ADD COLUMN IF NOT EXISTS "scope" "RoleScope" NOT NULL DEFAULT 'TENANT';
ALTER TABLE "roles" ADD COLUMN IF NOT EXISTS "is_system" BOOLEAN NOT NULL DEFAULT false;

-- Replace the old global-unique "roles.name" with the composite
-- @@unique([tenantId, name]) the current schema declares.
DROP INDEX IF EXISTS "roles_name_key";
CREATE UNIQUE INDEX IF NOT EXISTS "roles_tenant_id_name_key" ON "roles"("tenant_id", "name");

-- FK: roles.tenant_id -> tenants.id (SetNull is not right; schema uses
-- onDelete: Cascade from Tenant -> Role, i.e. deleting a tenant deletes its
-- custom roles). Guarded so re-running this migration doesn't error if the
-- constraint already exists.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'roles_tenant_id_fkey'
  ) THEN
    ALTER TABLE "roles"
      ADD CONSTRAINT "roles_tenant_id_fkey"
      FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END
$$;

-- AlterTable "permissions": add scope, resource, action, key
ALTER TABLE "permissions" ADD COLUMN IF NOT EXISTS "scope" "RoleScope" NOT NULL DEFAULT 'TENANT';
ALTER TABLE "permissions" ADD COLUMN IF NOT EXISTS "resource" TEXT NOT NULL DEFAULT '';
ALTER TABLE "permissions" ADD COLUMN IF NOT EXISTS "action" TEXT NOT NULL DEFAULT '';
ALTER TABLE "permissions" ADD COLUMN IF NOT EXISTS "key" TEXT;

-- "key" has no natural default, so it's added nullable above. Only promote it
-- to NOT NULL + UNIQUE (matching `key String @unique` in schema.prisma) if
-- every existing row already has one -- true on a fresh/empty table (the only
-- writer of this table is prisma/seed.ts, which always supplies a key) and
-- true on a DB already reconciled out-of-band. If some other process left
-- rows with no key, this step is skipped rather than failing the whole
-- migration, and a manual backfill is needed before "key" can be made
-- required.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM "permissions" WHERE "key" IS NULL)
     AND NOT EXISTS (
       SELECT 1 FROM information_schema.columns
       WHERE table_name = 'permissions' AND column_name = 'key' AND is_nullable = 'NO'
     ) THEN
    ALTER TABLE "permissions" ALTER COLUMN "key" SET NOT NULL;
  END IF;
END
$$;

DROP INDEX IF EXISTS "permissions_name_key";
CREATE UNIQUE INDEX IF NOT EXISTS "permissions_key_key" ON "permissions"("key");
