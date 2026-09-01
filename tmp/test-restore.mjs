import fs from "node:fs";
import pg from "pg";
let url = process.env.DATABASE_URL || "";
if (!url) for (const line of fs.readFileSync(".env", "utf-8").split("\n")) { const t = line.trim(); if (t.startsWith("DATABASE_URL")) url = t.split("=").slice(1).join("=").trim().replace(/^["']|["']$/g, ""); }
const m1 = fs.readFileSync("prisma/migrations/20260901120000_reconcile_role_permission_schema/migration.sql", "utf-8");
const m2 = fs.readFileSync("prisma/migrations/20260901123000_backfill_rbac_roles_permissions/migration.sql", "utf-8");
const rollback = fs.readFileSync(process.argv[2], "utf-8").replace(/^BEGIN;$/m, "").replace(/^COMMIT;$/m, "");

const client = new pg.Client({ connectionString: url });
const snap = async () => JSON.stringify({
  roleCols: (await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name='roles' ORDER BY column_name`)).rows,
  permCols: (await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name='permissions' ORDER BY column_name`)).rows,
  roles: (await client.query(`SELECT id, name, description, created_at, updated_at FROM roles ORDER BY id`)).rows,
  perms: (await client.query(`SELECT id, name, description, created_at, updated_at FROM permissions ORDER BY id`)).rows,
  links: (await client.query(`SELECT "A","B" FROM "_RolePermissions" ORDER BY "A","B"`)).rows,
  users: (await client.query(`SELECT id, role_id FROM users ORDER BY id`)).rows,
  idx: (await client.query(`SELECT indexname FROM pg_indexes WHERE tablename IN ('roles','permissions') ORDER BY indexname`)).rows,
  enum: (await client.query(`SELECT count(*)::int AS n FROM pg_type WHERE typname='RoleScope'`)).rows,
});

await client.connect();
try {
  await client.query("BEGIN");
  const before = await snap();
  await client.query(m1); await client.query(m2);
  const after = await snap();
  console.log("migrations applied, state changed :", after !== before);
  await client.query(rollback);
  const restored = await snap();
  console.log("rollback applied, matches baseline:", restored === before);
  if (restored !== before) {
    const b = JSON.parse(before), r = JSON.parse(restored);
    for (const k of Object.keys(b)) if (JSON.stringify(b[k]) !== JSON.stringify(r[k])) console.log("  MISMATCH", k, "\n    was:", JSON.stringify(b[k]), "\n    now:", JSON.stringify(r[k]));
  }
  console.log("\nrollback is idempotent          :", await (async () => { try { await client.query(rollback); return (await snap()) === before; } catch (e) { return "THREW: " + e.message.split("\n")[0]; } })());
} catch (e) {
  console.log("FAILED:", e.message.split("\n")[0]);
} finally {
  await client.query("ROLLBACK").catch(() => {});
  console.log("\n-- test transaction rolled back, database unchanged --");
  await client.end().catch(() => {});
}
