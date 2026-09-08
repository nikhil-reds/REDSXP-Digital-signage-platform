/**
 * Pre-flight for the two RBAC migrations, against a real database, without
 * changing it.
 *
 *   node prisma/verify-rbac-backfill.mjs
 *
 * Applies 20260901120000_reconcile_role_permission_schema and
 * 20260901123000_backfill_rbac_roles_permissions inside a single transaction,
 * reports what the data looks like afterwards, re-applies the backfill to prove
 * it is idempotent, then ROLLS BACK. Nothing is persisted.
 *
 * The number to watch is `users locked out`: users whose role ends up with zero
 * permission links. It must be 0. Anything else means enforcement (see
 * docs/rbac-completion-plan.md Phase 4) would lock those people out.
 *
 * Run this against a copy of production before running `prisma migrate deploy`
 * there. Reads DATABASE_URL from the environment, falling back to .env.
 */
import fs from "node:fs";
import path from "node:path";
import pg from "pg";

function databaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return "";
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("DATABASE_URL")) {
      return trimmed.split("=").slice(1).join("=").trim().replace(/^["']|["']$/g, "");
    }
  }
  return "";
}

const MIGRATIONS = [
  "20260901120000_reconcile_role_permission_schema",
  "20260901123000_backfill_rbac_roles_permissions",
];

function readMigration(name) {
  return fs.readFileSync(path.join("prisma", "migrations", name, "migration.sql"), "utf-8");
}

const connectionString = databaseUrl();
if (!connectionString) {
  console.error("DATABASE_URL is not set and could not be read from .env.");
  process.exit(1);
}

const client = new pg.Client({ connectionString });
const report = async (label, sql) => {
  const result = await client.query(sql);
  console.log(label, JSON.stringify(result.rows));
};

let failed = false;
await client.connect();
try {
  await client.query("BEGIN");

  console.log("── before ──");
  await report("roles           :", `
    SELECT r.name, (SELECT count(*) FROM users u WHERE u.role_id = r.id)::int AS users
    FROM roles r ORDER BY r.name`);

  for (const name of MIGRATIONS) {
    console.log(`\n── applying ${name} ──`);
    await client.query(readMigration(name));
    console.log("ok");
  }

  console.log("\n── after ──");
  await report("permissions     :", `
    SELECT scope::text, count(*)::int AS rows, count(key)::int AS with_key
    FROM permissions GROUP BY scope ORDER BY scope`);
  await report("key nullable?   :", `
    SELECT is_nullable FROM information_schema.columns
    WHERE table_name = 'permissions' AND column_name = 'key'`);
  await report("roles           :", `
    SELECT r.name, r.scope::text AS scope, r.is_system,
           (r.tenant_id IS NOT NULL) AS tenant_scoped,
           (SELECT count(*) FROM "_RolePermissions" rp WHERE rp."B" = r.id)::int AS perms,
           (SELECT count(*) FROM users u WHERE u.role_id = r.id)::int AS users
    FROM roles r ORDER BY r.name, r.tenant_id NULLS FIRST`);
  await report("users locked out:", `
    SELECT count(*)::int AS locked_out
    FROM users u JOIN roles r ON r.id = u.role_id
    WHERE NOT EXISTS (SELECT 1 FROM "_RolePermissions" rp WHERE rp."B" = r.id)`);
  await report("legacy AGENT    :", `
    SELECT count(*)::int AS remaining FROM roles WHERE name = 'AGENT' AND tenant_id IS NULL`);

  console.log("\n── re-applying backfill (idempotency) ──");
  await client.query(readMigration(MIGRATIONS[1]));
  await report("roles           :", `
    SELECT count(*)::int AS total, count(DISTINCT (tenant_id, name))::int AS distinct_tenant_name FROM roles`);
  await report("permission links:", `SELECT count(*)::int AS total FROM "_RolePermissions"`);
  console.log("(total and distinct_tenant_name must match, and links must not have grown)");
} catch (error) {
  failed = true;
  console.error("\nFAILED:", error.message.split("\n")[0]);
  if (error.position) console.error("  at character position", error.position);
} finally {
  await client.query("ROLLBACK").catch(() => {});
  console.log("\n── rolled back, database unchanged ──");
  await client.end().catch(() => {});
}

process.exit(failed ? 1 : 0);
