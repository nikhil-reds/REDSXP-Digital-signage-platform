import fs from "node:fs";
import pg from "pg";
const NL = String.fromCharCode(10);
let url = process.env.DATABASE_URL || "";
if (!url) for (const line of fs.readFileSync(".env", "utf-8").split(NL)) { const t = line.trim(); if (t.startsWith("DATABASE_URL")) url = t.split("=").slice(1).join("=").trim().replace(/^["']|["']$/g, ""); }
const client = new pg.Client({ connectionString: url });
const q = async (l, sql) => { const r = await client.query(sql); console.log(l, JSON.stringify(r.rows)); };
await client.connect();
await q("permissions   :", `SELECT scope::text, count(*)::int AS rows, count(key)::int AS keyed FROM permissions GROUP BY scope ORDER BY scope`);
await q("key nullable? :", `SELECT is_nullable FROM information_schema.columns WHERE table_name='permissions' AND column_name='key'`);
await q("roles         :", `SELECT r.name, r.scope::text AS scope, r.is_system, (r.tenant_id IS NOT NULL) AS tenant_scoped, (SELECT count(*) FROM "_RolePermissions" rp WHERE rp."B"=r.id)::int AS perms, (SELECT count(*) FROM users u WHERE u.role_id=r.id)::int AS users FROM roles r ORDER BY r.scope, r.name, r.tenant_id NULLS FIRST`);
await q("LOCKED OUT    :", `SELECT count(*)::int AS users FROM users u JOIN roles r ON r.id=u.role_id WHERE NOT EXISTS (SELECT 1 FROM "_RolePermissions" rp WHERE rp."B"=r.id)`);
await q("legacy AGENT  :", `SELECT count(*)::int AS remaining FROM roles WHERE name='AGENT'`);
await q("every user    :", `SELECT u.email, r.name AS role, r.scope::text AS scope, (SELECT count(*) FROM "_RolePermissions" rp WHERE rp."B"=r.id)::int AS perms FROM users u JOIN roles r ON r.id=u.role_id ORDER BY r.scope, u.email`);
await client.end();
