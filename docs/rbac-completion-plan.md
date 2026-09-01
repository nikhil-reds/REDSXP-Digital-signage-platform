# RBAC — completing the system

Goal: every request into the platform is authorized by an explicit permission key, and every query is
scoped to the caller's tenant. The permission vocabulary already exists and the management UI is
already built — what's missing is the wiring, the data migration, and the enforcement sweep.

Scope: **26 files to port** from `RBAC/tripti`, **18 API route files / 33 handlers to guard**,
**1 backfill migration**, **2 auth libs to unify**, **1 proxy to correct**.

Branch state at time of writing: `RBAC/tripti` is 26 commits, all dated 2026-08-03, and **266 commits
behind `origin/main`**. Nothing is merged. `ui/change` is `origin/main` minus two merge commits, so
`origin/main` is the correct base — it contains all current UI work.

---

## 0. Where the system actually stands

| Layer | State | Where |
| --- | --- | --- |
| `RoleScope` enum, tenant-aware `Role`, keyed `Permission` | Written, unmerged | `prisma/schema.prisma` |
| 38 permission keys (12 SYSTEM / 26 TENANT) | Written, unmerged | `prisma/seed.ts` |
| `hasPermission` / `hasAny` / `hasAll` + typed `PERMISSIONS` map | Written, unmerged | `lib/rbac.ts` |
| `requireAdmin(req, perm)` / `requirePermission(req, perm)` | Written, unmerged | `lib/admin-auth.ts` |
| Roles CRUD (admin + tenant), `/api/permissions`, `/api/auth/me` | Written, unmerged | 7 route files |
| Role manager UI + permission matrix modal | Written, unmerged | 3 components, 2 pages |
| `usePermissions` / `<PermissionGuard>` | Written, **never used** | `hooks/`, `components/auth/` |
| Enforcement on business routes | **5 of 24 routes** | — |
| Tenant isolation on business routes | **None** — `tenantId` read from query/body | `app/api/{media,playlist,schedules,screens,screen-groups}` |
| Backfill for existing `ADMIN` / `AGENT` rows | **Missing** | — |

### 0.1 — Correction: route-level protection is not missing

The repo has no `middleware.ts`, but Next 16 renamed that convention to **`proxy`**, and
[`proxy.js`](../proxy.js) already exists: it validates the session cookie against the `sessions`
table and redirects `/admin/*` ↔ `/agent/*` by role. It is not missing — it is *wrong after RBAC*
(see Phase 3.4), because it decides admin-ness with `role.name.includes("ADMIN")`.

Per Next 16's own guidance, proxy is for *optimistic* checks only and "should not be used as a full
session management or authorization solution"
(`node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md:29`). So proxy stays a UX-level
redirect; **all real authorization lives in the route handlers.** That split is assumed throughout
this plan.

### 0.2 — The three real security holes

1. **Unauthenticated CRUD.** `media`, `playlist`, `schedules`, `screens`, `screen-groups` and their
   `[id]` variants take `Request` (not `NextRequest`), never look at a cookie, and read `tenantId`
   from `searchParams` or the JSON body. Any unauthenticated caller can pass any `tenantId`.
2. **No tenant scoping in practice.** The frontend never sends `tenantId`, so `where: undefined` —
   these endpoints currently return **every tenant's rows to every caller**.
3. **IDOR on every `[id]` route.** `app/api/media/[id]/route.ts:13` is a bare
   `findUnique({ where: { id } })`; `PATCH` and `DELETE` likewise mutate by id with no ownership
   check. Same shape in the playlist, schedule, screen and screen-group `[id]` routes.

Fixing #2 and #3 is cheap *because* of #1 — no client passes `tenantId` today, so deriving it from
the session breaks no call sites.

---

## Phase 0 — Port strategy (½ day)

Do **not** rebase or merge `RBAC/tripti`. 266 commits of drift across 5 shared files is a worse trade
than a clean re-apply, and the branch's history is 26 near-identical "implement RBAC system" commits
that carry no bisect value.

Of the 26 changed files: **16 are pure additions**, 5 are modified-but-undrifted, and only **5 need
hand-merging.**

```bash
git checkout main && git pull && git checkout -b rbac/integration
```

**Apply the 16 additions verbatim** — zero conflict risk:

```bash
git checkout origin/RBAC/tripti -- lib/rbac.ts hooks/use-permissions.ts prisma/seed.ts prisma/migrations/20260803130000_reconcile_role_permission_schema components/auth/permission-guard.tsx components/admin/roles components/agent/roles "app/(admin)/admin/roles" "app/(agent)/agent/roles" app/api/admin/roles app/api/agent/roles app/api/permissions app/api/auth/me
```

Then rename the migration directory immediately — see **Re-timestamp the migration** below:

```bash
git mv prisma/migrations/20260803130000_reconcile_role_permission_schema prisma/migrations/20260901120000_reconcile_role_permission_schema
```

**Apply the 5 undrifted modifications** — `git diff main..origin/RBAC/tripti` for these touches only
lines that `main` has not changed since the merge-base, so they apply as-is:

```bash
git checkout origin/RBAC/tripti -- lib/admin-auth.ts lib/admin-user-status.ts prisma.config.ts app/api/admin/users/route.ts app/api/auth/register/route.ts
```

**Hand-merge the 5 drifted files.** Drift on `main` shown below is all post-RBAC-branch work
(skeleton loading, sidebar rework):

| File | Drift since merge-base | What to take from `RBAC/tripti` |
| --- | --- | --- |
| `prisma/schema.prisma` | +139 / −13 | Only the `Role`, `Permission`, `Tenant.roles` and `RoleScope` hunks |
| `app/(admin)/admin/users/page.tsx` | +243 / −44 | Role `<select>`, inline role modal, `isSystem` lock badge — reapply onto the current skeleton-loading version |
| `components/layout/agent-sidebar.tsx` | +94 / −65 | One nav item (`Roles & Permissions`, `ShieldCheck`) |
| `components/layout/admin-sidebar.tsx` | +19 / −14 | One nav item (`Platform Roles`, `Shield`) |
| `app/api/auth/login/route.ts` | +28 / −24 | `role.permissions` include, `roleScope` + `permissions` in the payload, scope-based `redirectTo` |

**Re-timestamp the migration.** `RBAC/tripti` carries
`20260803130000_reconcile_role_permission_schema`, but `main` has since added
`20260810074000_add_media_external_url_source` and `20260811160000_add_player_registrations`. Prisma
applies migrations in lexical name order, so an 0803 migration landing after 0811 applies out of
order. Rename the directory to a timestamp later than the last existing one before committing.

**Exit criteria:** `npx prisma generate`, `npx tsc --noEmit` and `npm run build` all clean; app boots;
no behaviour change yet.

---

## Phase 1 — Schema, backfill, seed (1 day)

### 1.1 Schema

Take the four hunks listed above. Net effect: `Role` gains `tenantId?`, `scope`, `isSystem` and swaps
global-unique `name` for `@@unique([tenantId, name])`; `Permission` gains `key` (unique), `scope`,
`resource`, `action`.

### 1.2 The backfill migration — this is the step that will otherwise break every environment

The seed script ports cleanly, but it only *adds*: it upserts the 38 permissions, creates
`SUPER_ADMIN` and the `AGENT_ADMIN` template (both `tenantId: null`), the `system-admin` tenant and
`superadmin@redsxp.com`. It never touches the existing `ADMIN` and `AGENT` role rows.

So on any database with real users, immediately after migrating:

- the old `ADMIN` role gets `scope = 'TENANT'` (the column default) and holds **zero** permissions →
  `requireAdmin` returns 403, while `proxy.js` still matches `"ADMIN".includes("ADMIN")` and routes
  those users to `/admin`. Result: the admin panel loads and every request inside it 403s.
- the old `AGENT` role likewise holds zero permissions → every tenant user is locked out of
  everything the moment Phase 4 lands.

Write a second migration (or a `prisma/backfill-rbac.ts` run once after seeding) that:

1. Sets `scope = 'SYSTEM'`, `is_system = true` on the role named `ADMIN` and connects it to all 12
   SYSTEM permissions.
2. For every existing tenant, creates that tenant's own `AGENT_ADMIN` role (`tenantId = <tenant>`,
   `scope = 'TENANT'`, all 26 TENANT permissions) and repoints its users' `role_id` at it. The old
   global `AGENT` row cannot serve this, because roles are now tenant-scoped.
3. Deletes the orphaned global `AGENT` row, but only once no `users.role_id` references it.

Make it idempotent (guarded `DO` blocks, matching the defensive style of the ported migration) and
verify it against a restored copy of the dev database, not an empty one.

### 1.3 Seed hardening

- `prisma/seed.ts` hardcodes `SuperAdmin@123456` in plaintext. Read it from
  `process.env.SEED_SUPERADMIN_PASSWORD`, fail loudly when unset outside development, and keep the
  literal only as a dev fallback.
- Add `SEED_SUPERADMIN_PASSWORD` to `.env` and to the README's env table.

**Exit criteria:** against a copy of the dev DB — migrate, seed and backfill run twice with no error;
the pre-existing admin user still reaches `/admin` and can use it; `SELECT count(*) FROM permissions`
returns 38.

---

## Phase 2 — One auth helper, not two (½ day)

`lib/admin-auth.ts` and `lib/agent-auth.ts` are currently two copies of the same session lookup
returning differently-named keys (`{ admin }` vs `{ agent }`). The ported `admin-auth.ts` adds
`getAuthenticatedUser()`, which is the shape both need.

1. Move `getAuthenticatedUser` into a neutral `lib/session.ts` — it is no longer admin-specific, it
   is about to be called from every business route.
2. Re-export `requireAdmin` / `requirePermission` from there, keeping `lib/admin-auth.ts` as a
   re-export shim so the ported admin routes don't churn.
3. Rewrite `requireAgent` in terms of it, preserving the `{ agent }` key so the three existing
   callers (`player-registrations`, `player-downloads`, `agent/assistant`) keep compiling. Have it
   return `permissions` as well.
4. Ensure `requirePermission` returns a `{ user }` that includes `tenantId` — Phase 4 depends on that
   being the *only* source of tenant identity.

One caution on the ported `lib/rbac.ts`: `hasPermission` treats the literal strings `"*"` and `"all"`
as god-mode. Nothing in the seed ever grants either, so it is dead code today — either drop the
wildcard branch or make `"*"` a real, seeded permission. Leaving an untested bypass path inside the
one function every guard funnels through is the worse option.

**Exit criteria:** `npx tsc --noEmit` clean; the three existing `requireAgent` routes behave
identically.

---

## Phase 3 — Session identity end-to-end (½ day)

1. `login` — the ported change already returns `roleScope` + `permissions` and redirects on scope.
2. `register` — the ported change already creates a per-tenant `AGENT_ADMIN` inside the transaction.
   Verify it still composes with the current `tenants` / `users` shape on `main`.
3. `/api/auth/me` — ported; this is what `usePermissions` reads.
4. **Fix `proxy.js`** (see 0.1). Replace `const isAdmin = session.user.role.name.includes("ADMIN")`
   with a `role.scope === "SYSTEM"` check, selecting `role: { select: { scope: true } }`. The
   substring check becomes an active bug the moment tenants can name their own roles: a custom tenant
   role called `Content ADMIN` would redirect that user into `/admin`. Convert the file to `proxy.ts`
   while touching it.

**Exit criteria:** superadmin lands on `/admin`; a tenant user lands on `/agent`; a tenant role named
`Store ADMIN` still lands on `/agent`.

---

## Phase 4 — The enforcement sweep (2–3 days, the bulk of the work)

For each handler below: change the signature from `Request` to `NextRequest`, call
`requirePermission`, derive `tenantId` from `auth.user.tenantId`, and delete every read of
`searchParams.get("tenantId")` / `body.tenantId` along with the `resolvedTenantId` fallback blocks.
The `// In a real app, tenantId comes from session` comment (`app/api/media/route.ts:73`) marks each
one of the five.

**List routes** — replace `where: tenantId ? { tenantId } : undefined` with
`where: { tenantId: auth.user.tenantId, ...filters }`.

**`[id]` routes** — replace `findUnique({ where: { id } })` with
`findFirst({ where: { id, tenantId: auth.user.tenantId } })`, and for `PATCH` / `PUT` / `DELETE`
perform that ownership read *before* the mutation, 404-ing when it misses. Never pass a
client-supplied id straight into `update` or `delete`.

| Route file | Handlers | Permission |
| --- | --- | --- |
| `media/route.ts` | GET / POST | `MEDIA_READ` / `MEDIA_CREATE` |
| `media/[id]/route.ts` | GET / PATCH / DELETE | `MEDIA_READ` / `MEDIA_UPDATE` / `MEDIA_DELETE` |
| `media/presigned/route.ts` | POST | `MEDIA_CREATE` |
| `playlist/route.ts` | GET / POST | `PLAYLIST_READ` / `PLAYLIST_CREATE` |
| `playlist/[id]/route.ts` | GET / PUT / DELETE | `PLAYLIST_READ` / `PLAYLIST_UPDATE` / `PLAYLIST_DELETE` |
| `playlist/[id]/render-status/route.ts` | GET | `PLAYLIST_READ` |
| `schedules/route.ts` | GET / POST | `SCHEDULE_READ` / `SCHEDULE_CREATE` |
| `schedules/[id]/route.ts` | GET / PUT / DELETE | `SCHEDULE_READ` / `SCHEDULE_UPDATE` / `SCHEDULE_DELETE` |
| `screens/route.ts` | GET / POST | `DEVICE_READ` / `DEVICE_CREATE` |
| `screens/[id]/route.ts` | GET / PATCH / DELETE | `DEVICE_READ` / `DEVICE_UPDATE` / `DEVICE_DELETE` |
| `screen-groups/route.ts` | GET / POST | `DEVICE_READ` / `DEVICE_CREATE` — see decision D1 |
| `screen-groups/[id]/route.ts` | GET / PATCH / DELETE | `DEVICE_READ` / `DEVICE_UPDATE` / `DEVICE_DELETE` |
| `player-registrations/route.ts` | GET | `DEVICE_READ` (already has `requireAgent`) |
| `player-downloads/route.ts` | POST | `DEVICE_CREATE` (already has `requireAgent`) |
| `agent/assistant/route.ts` | POST | see decision D2 |
| `admin/tenants/route.ts` | GET | `ADMIN_TENANTS_READ` |
| `admin/users/[userId]/activate/route.ts` | POST | `ADMIN_USERS_WRITE` (via `updateAdminStatus`, already ported) |
| `admin/users/[userId]/deactivate/route.ts` | POST | `ADMIN_USERS_WRITE` (same) |

Work one resource at a time — media → playlist → schedules → screens → screen-groups — each as its
own commit, clicking through that resource's agent page after each. `lib/assistant-tools.ts` already
gets this right and is the reference for the pattern; `lib/assistant-tools.ts:4`:
*"tenantId derived from the authenticated session — never from model input."*

**Exit criteria:** every `app/api/**/route.ts` either calls a `require*` guard or appears in Phase 5;
`grep -rn 'searchParams.get("tenantId")\|body.tenantId' app/api` returns nothing.

---

## Phase 5 — Device and worker routes need machine auth, not permissions (1 day)

Four routes are called by players and the render worker, not by a logged-in human. A user-session
guard would break them; leaving them open is the current state.

| Route | Caller | Approach |
| --- | --- | --- |
| `playlist/[id]/render-manifest/route.ts` | render worker / player | Shared-secret header or signed URL — currently fully open |
| `player-registrations/install/route.ts` | player installer | Already `installToken` — audit only |
| `player-registrations/[id]/claim/route.ts` | player during pairing | Already token-based — audit only |
| `player-downloads/[id]/file/route.ts` | player installer | Already `token` + `installToken` — audit only |

`app/api/player-registrations/install/route.ts` is the pattern to copy: it hashes an install token
and looks up the registration. Note that `render-manifest` currently returns `tenantId` in its
response body (`route.ts:24`) to an unauthenticated caller.

This phase is independent of RBAC and can be split into its own ticket — but it must not be
*forgotten* on the strength of "Phase 4 secured the API".

---

## Phase 6 — Gate the UI (1 day)

`<PermissionGuard>` and `usePermissions` exist and are used by nothing but each other.

1. **Lift the fetch first.** `usePermissions` fires its own `/api/auth/me` request per mounting
   component. Once steps 2–3 put it in both sidebars plus every guarded button, that is one request
   per guard. Move it into a `PermissionsProvider` context mounted in the two portal layouts and have
   the hook read from context. Do this **before** the other steps, not after.
2. **Sidebars.** Drive `navItems` from permissions so users never see links that 403. In
   `components/layout/agent-sidebar.tsx`, add `permission` to the `NavItem` interface and filter with
   `hasAnyPermission`; same for `admin-sidebar.tsx`.
3. **Action controls.** Wrap create / edit / delete buttons on the media, playlist, schedules,
   screens and screen-groups pages in `<PermissionGuard permission={PERMISSIONS.X}>`. Read-only users
   should see data, not buttons that fail on click.
4. **Page shells.** For `/agent/roles` and `/admin/roles`, guard the whole page body with a
   "you don't have access to this" fallback rather than rendering an empty manager.

**Exit criteria:** a role holding only `media:read` sees the media page, no upload or delete buttons,
and no Roles nav item.

---

## Phase 7 — Assigning roles to users (½ day)

The admin users page gains a role `<select>` from the port, and `POST /api/admin/users` accepts
`roleId`. Still missing:

1. `PUT /api/admin/users/[userId]/role`, guarded by `ADMIN_USERS_WRITE` — changing an existing
   administrator's role.
2. The tenant-side equivalent: `/api/agent/users` CRUD guarded by `TENANT_USERS_*`. Four permission
   keys (`tenant:users:read|create|update|delete`) are seeded with **no endpoint behind them** — a
   workspace admin currently cannot invite a teammate at all.
3. **Privilege-escalation guard.** Both endpoints must reject a role whose `scope` or `tenantId`
   doesn't match the target user, and must reject granting a role that holds permissions the caller
   does not itself hold. Without this, `tenant:roles:create` is a path to any permission in the
   catalogue.

---

## Phase 8 — Audit and verification (1 day)

1. **Audit logging — extend, don't invent.** The `AuditLog` model and the write pattern already
   exist and are used in four places: `app/api/admin/tenants/route.ts:244`,
   `app/api/admin/users/route.ts:110`, `app/api/player-registrations/[id]/claim/route.ts:63` and
   `lib/admin-user-status.ts:26`. Two gaps:
   - The four ported role endpoints (`admin/roles`, `admin/roles/[id]`, `agent/roles`,
     `agent/roles/[id]`) write no audit row. A permission grant is exactly the event this table is
     for — follow the `tx.auditLog.create` pattern in `admin/users/route.ts`, recording which
     permission keys were added or removed.
   - `admin:audit:read` and `tenant:audit:read` are seeded with **no endpoint and no reader**. There
     is no `app/api/**/audit` route, and `app/(agent)/agent/activity-log/page.tsx` renders without
     fetching anything. Add `GET /api/agent/audit` (tenant-scoped, `TENANT_AUDIT_READ`) and
     `GET /api/admin/audit` (`ADMIN_AUDIT_READ`), then wire the activity-log page to the former.
2. **Tests.** There is no test runner in the repo at all — no `vitest`/`jest` config, no `test`
   script in `package.json`, zero spec files — and this is the wrong feature to keep that streak on.
   Add Vitest and an `npm test` script as step zero. The high-value cases are cheap and all sit at
   the guard boundary:
   - `hasPermission` / `hasAnyPermission` / `hasAllPermissions` truth table, including whatever the
     Phase 2 wildcard decision settles on.
   - `requirePermission` returns 401 with no cookie and 403 with a valid session lacking the key.
   - Tenant A's session cannot read, update or delete Tenant B's media, playlist, schedule, screen or
     screen-group by id — five tests, one per resource. These are the Phase 4 regressions that would
     otherwise go unnoticed.
   - `isSystem` roles reject PUT and DELETE; a role with assigned users rejects DELETE.
3. **Manual matrix.** Seed three throwaway roles — full tenant admin, `media:read` only, and no
   permissions — and walk every agent page as each.

---

## Open decisions

**D1 — Screen groups have no permission keys.** The 38-key catalogue covers media, playlist,
schedule, device, users, roles and audit; screen groups are a first-class resource in the UI with no
key of their own. *Recommendation:* reuse `device:*`, since a group is a collection of devices and
nobody is likely to want one granted without the other. If separate control is wanted, add
`screengroup:read|create|update|delete` to `TENANT_PERMISSIONS` and re-seed (38 → 42 keys).

**D2 — The AI assistant has no permission key.** `POST /api/agent/assistant` reaches read-only tenant
data through `lib/assistant-tools.ts`. *Recommendation:* require
`hasAnyPermission([MEDIA_READ, PLAYLIST_READ, SCHEDULE_READ, DEVICE_READ])` rather than adding an
`assistant:use` key, so the assistant can never surface something the caller couldn't read directly.
Longer term, the tool layer should filter per-tool against the caller's keys.

**D3 — `device:reboot` is seeded with no endpoint.** Harmless, but it will appear as a checkbox in the
role modal that grants nothing. Either ship the endpoint or drop the key until it exists.

---

## Sequencing

| Phase | Depends on | Size | Ship independently? |
| --- | --- | --- | --- |
| 0 — Port | — | ½ d | Yes — no behaviour change |
| 1 — Schema + backfill + seed | 0 | 1 d | Yes |
| 2 — Unify auth helpers | 1 | ½ d | Yes |
| 3 — Session identity + proxy fix | 2 | ½ d | Yes |
| 4 — Enforcement sweep | 3 | 2–3 d | Per resource |
| 5 — Machine auth for device routes | — | 1 d | Yes, in parallel |
| 6 — UI gating | 3 | 1 d | Per surface |
| 7 — Role assignment | 4 | ½ d | Yes |
| 8 — Audit + tests | 4, 7 | 1 d | Yes |

**Roughly 8–9 working days.** Phases 0–3 are the risky ones — they touch the live database and every
session. Phases 4 and 6 are mechanical volume once those land. Phase 5 is genuinely independent and
can go to whoever owns the player.

Two hard gates worth stating outright:

- **Do not ship Phase 4 without Phase 1's backfill.** Every existing user has zero permissions until
  it runs, so enforcement locks the whole platform out.
- **Do not treat `proxy.ts` as the authorization layer.** Next 16 documents it as optimistic-only; it
  is a redirect for humans, and the route guards are the real boundary.
