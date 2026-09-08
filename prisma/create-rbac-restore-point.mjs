/**
 * Writes a tested rollback for the two RBAC migrations, before you apply them.
 *
 *   node prisma/create-rbac-restore-point.mjs ./rbac-restore-point.sql
 *
 * Snapshots roles, permissions, _RolePermissions and users.role_id -- every
 * table 20260901120000_reconcile_role_permission_schema and
 * 20260901123000_backfill_rbac_roles_permissions write to -- and emits a single
 * SQL file that puts both the data and the table shape back.
 *
 * Use it together with prisma/verify-rbac-backfill.mjs:
 *
 *   1. node prisma/create-rbac-restore-point.mjs ./rollback.sql   # escape hatch
 *   2. node prisma/verify-rbac-backfill.mjs                       # dry run, rolls back
 *   3. npx prisma migrate deploy && npm run db:seed               # apply
 *
 * Reads DATABASE_URL from the environment, falling back to .env.
 */
import fs from "node:fs";
import pg from "pg";

const NL = String.fromCharCode(10);
const OUT = process.argv[2];

// created_at/updated_at are `timestamp without time zone`. Left to the default
// parser, pg hands back a Date in local time and toISOString() then shifts the
// stored wall-clock value by the local UTC offset. Take the raw string instead.
pg.types.setTypeParser(1114, (value) => value);

let url = process.env.DATABASE_URL || "";
if (!url) {
  for (const line of fs.readFileSync(".env", "utf-8").split(NL)) {
    const t = line.trim();
    if (t.startsWith("DATABASE_URL")) {
      url = t.split("=").slice(1).join("=").trim().replace(/^["']|["']$/g, "");
    }
  }
}

const client = new pg.Client({ connectionString: url });
await client.connect();

const lit = (v) => {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return String(v);
  if (v instanceof Date) return `'${v.toISOString()}'`;
  return `'${String(v).replace(/'/g, "''")}'`;
};

const roles = await client.query(`SELECT * FROM "roles"`);
const perms = await client.query(`SELECT * FROM "permissions"`);
const links = await client.query(`SELECT "A", "B" FROM "_RolePermissions"`);
const users = await client.query(`SELECT id, role_id FROM "users" ORDER BY id`);

const upserts = (table, res) =>
  res.rows
    .map((row) => {
      const cols = res.fields.map((f) => `"${f.name}"`).join(", ");
      const vals = res.fields.map((f) => lit(row[f.name])).join(", ");
      const sets = res.fields
        .filter((f) => f.name !== "id")
        .map((f) => `"${f.name}" = EXCLUDED."${f.name}"`)
        .join(", ");
      return `INSERT INTO "${table}" (${cols}) VALUES (${vals})${NL}  ON CONFLICT ("id") DO UPDATE SET ${sets};`;
    })
    .join(NL);

const ids = (res) => res.rows.map((r) => lit(r.id)).join(", ");

const userUpdates = users.rows
  .map((u) => `UPDATE "users" SET "role_id" = ${lit(u.role_id)} WHERE "id" = ${lit(u.id)};`)
  .join(NL);

const linkInserts = links.rows
  .map((l) => `INSERT INTO "_RolePermissions" ("A", "B") VALUES (${lit(l.A)}, ${lit(l.B)});`)
  .join(NL);

const sql = `-- Rollback for the RBAC migrations. Taken ${new Date().toISOString()}.
--
-- Reverses 20260901120000_reconcile_role_permission_schema and
-- 20260901123000_backfill_rbac_roles_permissions, restoring both the data and
-- the table shape they changed. Those two migrations write only to roles,
-- permissions, _RolePermissions and users.role_id; nothing else is affected.
--
-- Snapshot: ${roles.rows.length} roles, ${perms.rows.length} permissions, ${links.rows.length} links, ${users.rows.length} users.
--
--   psql "$DATABASE_URL" -f rbac-restore-point.sql
--
-- Then let Prisma know the migrations are gone:
--   DELETE FROM "_prisma_migrations" WHERE "migration_name" IN
--     ('20260901120000_reconcile_role_permission_schema',
--      '20260901123000_backfill_rbac_roles_permissions');
--
-- This is a full rollback, not a data-only one, and the step order is load
-- bearing in three places:
--
--   * the added columns come off FIRST, because the backfill promotes
--     permissions.key to NOT NULL and the original rows have no key to supply.
--     Postgres checks NOT NULL on the proposed tuple before ON CONFLICT
--     arbitration, so restoring the data first fails outright.
--   * users.role_id is repointed only after every original role exists again
--     (the backfill deletes the legacy global AGENT role).
--   * the old UNIQUE(roles.name) index is recreated LAST, because the surplus
--     per-tenant roles all share the name AGENT_ADMIN and would collide.
--
-- Guarded throughout: safe on a partly-migrated database, and safe to re-run.

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. Take the added columns off, returning both tables to their original shape.
-- ---------------------------------------------------------------------------
DROP INDEX IF EXISTS "permissions_key_key";
ALTER TABLE "permissions" DROP COLUMN IF EXISTS "key";
ALTER TABLE "permissions" DROP COLUMN IF EXISTS "scope";
ALTER TABLE "permissions" DROP COLUMN IF EXISTS "resource";
ALTER TABLE "permissions" DROP COLUMN IF EXISTS "action";

DROP INDEX IF EXISTS "roles_tenant_id_name_key";
ALTER TABLE "roles" DROP CONSTRAINT IF EXISTS "roles_tenant_id_fkey";
ALTER TABLE "roles" DROP COLUMN IF EXISTS "tenant_id";
ALTER TABLE "roles" DROP COLUMN IF EXISTS "scope";
ALTER TABLE "roles" DROP COLUMN IF EXISTS "is_system";

-- The backfill's scratch table is ON COMMIT DROP, so it is normally gone by
-- now. Dropped explicitly in case the rollback runs in the same session, where
-- its "RoleScope" column would still hold a dependency on the type.
DROP TABLE IF EXISTS _rbac_catalogue;
DROP TYPE IF EXISTS "RoleScope";

-- ---------------------------------------------------------------------------
-- 2. Restore the rows.
-- ---------------------------------------------------------------------------

-- 2a. Every original role, including any the backfill deleted.
${upserts("roles", roles)}

-- 2b. Repoint every user at the role it had, now that all of them exist again.
${userUpdates}

-- 2c. Every original permission.
${upserts("permissions", perms)}

-- 2d. Drop the rows the migrations added, now that nothing references them.
DELETE FROM "roles" WHERE "id" NOT IN (${ids(roles)});
DELETE FROM "permissions" WHERE "id" NOT IN (${ids(perms)});

-- 2e. Original role-permission links.
DELETE FROM "_RolePermissions";
${linkInserts}

-- ---------------------------------------------------------------------------
-- 3. Recreate the original unique indexes, now that the names are unique again.
-- ---------------------------------------------------------------------------
CREATE UNIQUE INDEX IF NOT EXISTS "roles_name_key" ON "roles"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "permissions_name_key" ON "permissions"("name");

COMMIT;
`;

fs.writeFileSync(OUT, sql, "utf-8");
console.error(
  `roles=${roles.rows.length} permissions=${perms.rows.length} links=${links.rows.length} users=${users.rows.length}`,
);
console.error("wrote " + OUT);
await client.end();
