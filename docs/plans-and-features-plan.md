# Plans & features — how a feature gets added

Goal: a single, repeatable path for shipping a gated feature. One place to declare it, one guard on
the server, one gate in the UI, one switch in the admin portal — so "add Proof-of-Play Export to
Business and above" is a checklist, not a design exercise each time.

Scope: `/admin/plans` and everything behind it. Related: `docs/rbac-completion-plan.md`, whose
`requirePermission` / `usePermissions` / `<PermissionGuard>` this deliberately mirrors — a feature
check and a permission check are different questions and both have to pass.

---

## 1. What the page is today

Every number on `/admin/plans` is a literal in a component file. Nothing reads the database, nothing
writes to it, and no request anywhere in the product is affected by any of it.

| Section | Source | State |
| --- | --- | --- |
| Plan Comparison — 4 cards | `components/admin/plans/plan-cards.tsx`, hardcoded `plans` array | Prices, quotas and feature toggles are all local `useState`; toggling one changes nothing beyond the component |
| Global Feature Flags — 5 rows | `components/admin/plans/feature-flags.tsx`, hardcoded `initialFlags` | `enabled` toggles local state; `rollout` and `overrides` are display-only; **Edit** is a dead button |
| Admin Users — 5 rows | `components/admin/plans/admin-users.tsx`, hardcoded `initialUsers` | Duplicates the real, RBAC-backed `/admin/users`, with invented roles ("Finance Admin") and an MFA column the schema has no field for |
| Header actions | `app/(admin)/admin/plans/page.tsx` | "Review Changes" and "Publish Changes" have no handlers |

Four findings that shape the work:

**1.1 — The `plans` table is empty.** `Plan` exists in `prisma/schema.prisma:390` with
`priceMonthly`, `priceYearly`, `maxDevices`, `maxStorageGb`, `maxUsers`, `maxRules` — and zero rows.
`subscriptions` is empty too, and all 6 tenants have no subscription. So the plan `<select>` in
`components/admin/tenants/create-tenant-form.tsx:129` renders with only "No plan (assign later)":
**you currently cannot put a tenant on a plan at all.**

**1.2 — There is no feature model of any kind.** No `Feature`, no `FeatureFlag`, no join table, no
per-tenant override table. The 5 per-plan features and the 5 global flags in the UI exist only as
strings in two component files.

**1.3 — No quota is enforced.** `maxDevices`, `maxUsers` and `maxRules` are read nowhere in the
codebase. `maxStorageGb` is read once, in `app/api/admin/tenants/route.ts:92`, purely to display a
limit next to usage. A tenant on a 5-screen plan can register 500 screens.

**1.4 — The usage half already exists, and is good.** `app/api/admin/tenants/route.ts:104-155`
already aggregates device counts by status and `SUM(media.size_bytes)` per tenant in two grouped
queries, with a comment explaining the one-query-per-metric choice. Quota enforcement should reuse
that shape rather than invent a second way to count.

---

## 2. The page conflates two different things

This is the decision that makes everything else fall out, so it comes first.

|  | **Plan entitlement** | **Feature flag** |
| --- | --- | --- |
| Answers | "Did this workspace pay for it?" | "Have we turned it on yet?" |
| Owned by | Billing / sales | Engineering |
| Changes when | A tenant upgrades | A rollout progresses |
| Lifetime | Permanent | Temporary — deleted once the feature is fully shipped |
| Scope | Per plan, inherited by its tenants | Global, with % rollout and per-tenant overrides |
| Example | Proof-of-Play Export, API Access, Custom Domain | `advanced_analytics_v2`, `ai_content_suggestions` |

The current UI shows both as identical green toggles, which is why they look like one feature. They
need separate tables and separate admin controls, but they answer the *same question at the call
site* — "can this workspace use X right now?" — so they must resolve through **one** function.
Otherwise every caller has to remember which of the two kinds it is dealing with, and they will get
it wrong.

### 2.1 Resolution order

`isFeatureEnabled(tenantId, key)` resolves in this order, first match wins:

1. **Flag kill switch** — the feature has a flag row and it is globally off → **off**. This is the
   incident lever; it beats everything, including a paying Enterprise tenant.
2. **Tenant override** — an explicit on/off for this tenant → that value. Covers pilots, apologies,
   and Enterprise contracts negotiated off-plan.
3. **Rollout percentage** — deterministic bucket from `hash(tenantId + key) % 100 < rollout`. Must
   be a stable hash of the *tenant* id, never `Math.random()` and never the user id: a tenant that
   flips between requests, or shows one thing to two colleagues, is worse than not shipping.
4. **Plan entitlement** — is the feature attached to the tenant's current plan? → that value.
5. **Default** — off. A feature nobody has granted is not available.

A feature can use any subset. A pure entitlement has no flag row and lands at step 4. A pure
engineering flag is attached to every plan and gated at steps 1–3.

---

## 3. Data model

Four changes to `prisma/schema.prisma`. One migration, following the guarded style of
`prisma/migrations/20260901123000_backfill_rbac_roles_permissions`.

```prisma
model Feature {
  id          String      @id @default(uuid())
  key         String      @unique          // snake_case, e.g. "proof_of_play_export"
  name        String                       // "Proof-of-Play Export"
  description String?
  kind        FeatureKind @default(ENTITLEMENT)
  /// Set only for kind = FLAG. Null means "no global switch".
  enabled     Boolean?    @map("enabled")
  rolloutPct  Int?        @map("rollout_pct")
  createdAt   DateTime    @default(now()) @map("created_at")
  updatedAt   DateTime    @updatedAt @map("updated_at")

  plans     PlanFeature[]
  overrides TenantFeature[]

  @@map("features")
}

model PlanFeature {
  planId    String   @map("plan_id")
  featureId String   @map("feature_id")
  createdAt DateTime @default(now()) @map("created_at")

  plan    Plan    @relation(fields: [planId], references: [id], onDelete: Cascade)
  feature Feature @relation(fields: [featureId], references: [id], onDelete: Cascade)

  @@id([planId, featureId])
  @@map("plan_features")
}

/// Per-tenant escape hatch. `enabled` is explicit on/off, not a tri-state —
/// the absence of a row is the "no opinion" case.
model TenantFeature {
  tenantId  String   @map("tenant_id")
  featureId String   @map("feature_id")
  enabled   Boolean
  note      String?                       // why, for the next person reading it
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  tenant  Tenant  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  feature Feature @relation(fields: [featureId], references: [id], onDelete: Cascade)

  @@id([tenantId, featureId])
  @@map("tenant_features")
}

enum FeatureKind {
  ENTITLEMENT
  FLAG
}
```

Plus, on `Plan`:

```prisma
  analyticsRetentionDays Int? @map("analytics_retention_days")
```

The UI already shows "Analytics retention" as a plan parameter and the column does not exist.

**Unlimited is `null`, not `-1`.** Enterprise shows "Unlimited" for four of five quotas. Make every
`max*` column nullable and read null as no limit; a sentinel integer will eventually be compared
with `<` by someone and silently cap Enterprise at −1.

That means an accompanying migration step to make `max_devices`, `max_storage_gb`, `max_users`,
`max_rules` nullable. They are currently `NOT NULL` with no default, and the table is empty, so this
is free right now — and expensive later.

---

## 4. Backend

### 4.1 `lib/features.ts` — the one resolver

Mirrors `lib/rbac.ts` deliberately: same shape, same naming, so nobody has to learn two systems.

```ts
export type FeatureKey = (typeof FEATURES)[keyof typeof FEATURES];

/** Every feature key, for autocomplete and to keep strings out of call sites. */
export const FEATURES = {
  CUSTOM_BRANDING:      "custom_branding",
  CUSTOM_DOMAIN:        "custom_domain",
  API_ACCESS:           "api_access",
  PROOF_OF_PLAY_EXPORT: "proof_of_play_export",
  PRIORITY_SUPPORT:     "priority_support",
} as const;

/** Effective feature set for a tenant, resolved per §2.1. */
export async function getTenantFeatures(tenantId: string): Promise<Set<string>>;

export function hasFeature(features: Set<string>, key: FeatureKey): boolean;
```

Resolution is one query — features with their plan links and this tenant's overrides — then the
precedence chain in plain code. Not five queries, and not a query per `hasFeature` call.

**Caching:** features change on the order of once a week; they are read on every request. Memoise
per request first (a `Map` on the resolved set, keyed by tenantId, living as long as the request).
Only reach for a shared cache if a profile says to — and if you do, the tenant-override and
kill-switch writes must invalidate it, or the incident lever stops working, which defeats the point.

### 4.2 `requireFeature` — the route guard

Sits beside `requireAdmin` / `requirePermission` in `lib/admin-auth.ts` (or `lib/session.ts` after
that plan's Phase 2) and returns the same `{ response }` / `{ user }` shape, so route handlers keep
one idiom:

```ts
const auth = await requireFeature(request, FEATURES.PROOF_OF_PLAY_EXPORT);
if (auth.response) return auth.response;
```

Returns **402 Payment Required** for a missing entitlement and **404** for a flag that is off.
The distinction matters: 402 means "upgrade and this appears", which the client can turn into an
upgrade prompt; a dark flag should be indistinguishable from a route that does not exist.

Permission and feature are independent gates and a request needs both — `tenant:reports:read` says
*this user* may pull reports, `proof_of_play_export` says *this workspace* has the export at all. A
route that needs both calls both.

### 4.3 Quota enforcement

Separate from features: quotas are numbers, not booleans, and they are checked at create time.

```ts
/** Throws/returns 402 when the tenant is at its plan limit. Null limit = unlimited. */
export async function assertQuota(tenantId: string, resource: "devices" | "users" | "rules" | "storageGb", adding = 1)
```

Reuse the counting from `app/api/admin/tenants/route.ts:104-155` rather than writing a second
version. Call sites, all of which currently have no limit check at all:

| Quota | Enforce in |
| --- | --- |
| `maxDevices` | `POST /api/screens`, `POST /api/player-registrations` |
| `maxUsers` | `POST /api/agent/users` (Phase 7 of the RBAC plan) and `POST /api/auth/register` |
| `maxStorageGb` | `POST /api/media/presigned` — before handing out an upload URL, not after the bytes land |
| `maxRules` | the sensor-rules endpoint, when it exists |

Storage is the one to get right: check at presign time using `SUM(size_bytes) + declared size`, or
tenants will exceed the cap by exactly one large file every time.

### 4.4 API routes

All admin routes gated with the already-seeded `admin:plans:read` / `admin:plans:write`.

| Route | Methods | Guard |
| --- | --- | --- |
| `/api/admin/plans` | GET, POST | `ADMIN_PLANS_READ` / `ADMIN_PLANS_WRITE` |
| `/api/admin/plans/[id]` | GET, PUT, DELETE | same; DELETE refuses a plan with live subscriptions (409) |
| `/api/admin/plans/[id]/features` | PUT | `ADMIN_PLANS_WRITE` — set the whole feature set for a plan |
| `/api/admin/features` | GET, POST | `ADMIN_PLANS_READ` / `ADMIN_PLANS_WRITE` |
| `/api/admin/features/[id]` | PUT, DELETE | `ADMIN_PLANS_WRITE` — global toggle + rollout live here |
| `/api/admin/tenants/[id]/features` | GET, PUT | `ADMIN_TENANTS_WRITE` — per-tenant overrides |
| `/api/features` | GET | authenticated; returns the caller's own effective set for the UI |

`/api/features` is what the frontend hook reads, exactly as `/api/auth/me` serves `usePermissions`.

---

## 5. Frontend

### 5.1 `useFeatures()` and `<FeatureGate>`

The RBAC work already established the pattern; copy it rather than inventing a parallel one.

```tsx
<FeatureGate feature={FEATURES.PROOF_OF_PLAY_EXPORT} fallback={<UpgradePrompt feature="Proof-of-Play Export" />}>
  <Button icon={Download}>Export proof-of-play</Button>
</FeatureGate>
```

Three rules:

1. **A gate is not security.** `<FeatureGate>` hides UI; `requireFeature` is what actually stops the
   request. Every gated control must have a guarded endpoint behind it.
2. **Entitlements get an upgrade prompt; flags render nothing.** A missing entitlement is a sales
   opportunity and should say what the feature is and which plan has it. A dark flag must leave no
   trace — an "upgrade to get `advanced_analytics_v2`" tooltip is a leak.
3. **One provider, not one fetch per gate.** Same trap as `usePermissions`
   (`docs/rbac-completion-plan.md` Phase 6.1): a hook that fetches on mount becomes one request per
   gate the moment gates are everywhere. Put `FeaturesProvider` in the two portal layouts, and
   ideally fold it into the same provider and the same endpoint as permissions — the client needs
   both on every page, so serving them in one round trip is strictly better.

### 5.2 Composing with permissions

| User has permission | Workspace has feature | Result |
| --- | --- | --- |
| yes | yes | control renders and works |
| yes | no | upgrade prompt (entitlement) or nothing (flag) |
| no | yes | nothing — not their job |
| no | no | nothing |

Feature first, permission second, when both are missing: telling someone their plan lacks a feature
they also would not be allowed to use invites a pointless upgrade conversation.

---

## 6. Admin UI — replacing the three mockups

### 6.1 Plan Comparison → real, editable plans

`components/admin/plans/plan-cards.tsx` keeps its layout, which is good, and loses its data.

- Fetch from `/api/admin/plans`; skeleton on first load with `SkeletonCardGrid`, per
  `docs/skeleton-loading-plan.md`.
- Quotas become editable fields; empty means unlimited and renders as "Unlimited".
- Feature toggles write to `/api/admin/plans/[id]/features`. Pick one: optimistic per-toggle saves,
  or a dirty-state buffer that the header's **Publish Changes** commits. The header already implies
  the second, so either wire those two buttons to a real dirty state or delete them — a button that
  does nothing is worse than no button.
- The Monthly/Annual switch currently just toggles a label. Point it at `priceMonthly` /
  `priceYearly`, both of which already exist.
- "Most Popular" is hardcoded onto Enterprise, which is also the "Contact Sales" card. If the badge
  is meant to be real, it needs an `isFeatured` column; otherwise drop it.

### 6.2 Global Feature Flags → real flag CRUD

- Table reads `/api/admin/features` filtered to `kind = FLAG`.
- The toggle writes `enabled`; the rollout bar becomes an input writing `rolloutPct`.
- **Tenant Overrides** is currently a dead count. Make the cell a button opening a `Drawer`
  (`components/ui/drawer.tsx` exists) listing this flag's `TenantFeature` rows, with add/remove and
  the `note` field visible. That drawer is the whole reason the override table has a `note` column.
- **Edit** opens a modal for key/name/description/kind. Reuse the shape of
  `components/admin/roles/role-form-modal.tsx` — it is the same job.

### 6.3 Admin Users → delete the block

`components/admin/plans/admin-users.tsx` (196 lines) is a mockup of a page that now really exists,
RBAC-backed, at `/admin/users` — with real roles from the `roles` table instead of invented ones
like "Finance Admin", and no MFA column the schema cannot populate. Remove it from
`app/(admin)/admin/plans/page.tsx` and link to `/admin/users` instead. Two admin-user tables that
disagree is a support ticket waiting to happen.

### 6.4 Seed

Extend `prisma/seed.ts`, which already owns the RBAC catalogue, with the four plans and five
features the mockups describe — so a fresh environment has something real on this page, and so the
tenant-creation plan `<select>` is not empty. Same upsert-by-key style as the permission catalogue.

---

## 7. The recipe — adding one feature, start to finish

This is the part that should stay short forever. Worked example: **Proof-of-Play Export**, on
Business and Enterprise.

**1. Decide which kind it is** (§2). Paid capability → `ENTITLEMENT`. Risky rollout → `FLAG`. Both →
an entitlement plus a temporary flag you delete once it is fully out.

**2. Declare it.** Add the key to `FEATURES` in `lib/features.ts`, and the row to `prisma/seed.ts`.
Typed constant, never a bare string at a call site.

```ts
PROOF_OF_PLAY_EXPORT: "proof_of_play_export",
```

**3. Guard the backend.** Every endpoint that does the work:

```ts
const auth = await requireFeature(request, FEATURES.PROOF_OF_PLAY_EXPORT);
if (auth.response) return auth.response;
const perm = await requirePermission(request, PERMISSIONS.TENANT_AUDIT_READ);
if (perm.response) return perm.response;
```

**4. Gate the frontend.** Wrap the control, not the page — a page that vanishes leaves the user
wondering where it went:

```tsx
<FeatureGate feature={FEATURES.PROOF_OF_PLAY_EXPORT} fallback={<UpgradePrompt feature="Proof-of-Play Export" plan="Business" />}>
  …
</FeatureGate>
```

**5. Turn it on in admin.** `/admin/plans` → tick it on Business and Enterprise → publish. For a
flag, set the rollout instead, and add tenant overrides for pilots.

**6. Verify the matrix.** Four cases, and the third is the one that gets skipped:

| Case | Expected |
| --- | --- |
| Business tenant, has permission | works |
| Starter tenant, has permission | upgrade prompt; endpoint returns 402 |
| Starter tenant, **calls the endpoint directly** | 402 — the UI gate is not the boundary |
| Business tenant, lacks the permission | control hidden; endpoint 403 |

**7. If it was a flag, delete it** once it is at 100% everywhere. Flags that outlive their rollout
become permanent branching nobody dares remove.

---

## 8. Sequencing

| Step | Work | Depends on | Size |
| --- | --- | --- | --- |
| 1 | Schema + migration + nullable quotas | — | ½ d |
| 2 | Seed the 4 plans and 5 features | 1 | ½ d |
| 3 | `lib/features.ts` + `requireFeature` | 1 | 1 d |
| 4 | Plans + features admin APIs | 3 | 1 d |
| 5 | Plan Comparison on real data | 4 | 1 d |
| 6 | Feature-flag table + overrides drawer | 4 | 1 d |
| 7 | Remove the Admin Users mockup | — | 15 min |
| 8 | `/api/features`, provider, `useFeatures`, `FeatureGate` | 3 | 1 d |
| 9 | Gate the first real feature end to end | 8 | ½ d |
| 10 | Quota enforcement at the four create sites | 3 | 1 d |

**≈ 8 days.** Steps 1–3 are the foundation and are worth getting right; 7 is free and can go today.
Step 10 is separable and is the one with real blast radius — it is the first time this system tells a
paying customer "no", so it wants the test matrix from §7.6 per quota.

Do this **after** `docs/rbac-completion-plan.md` Phase 2, or at least in knowledge of it: both plans
add a guard to `lib/admin-auth.ts` and a provider to the portal layouts, and doing them blind to each
other means merging two different session helpers and two different providers.

---

## Open decisions

**D1 — Does a tenant without a subscription get nothing, or a default plan?** All 6 tenants are
currently unsubscribed, so "no subscription → no entitlements" locks every existing workspace out
the moment step 9 lands — the same trap as the RBAC backfill. *Recommendation:* seed a free/default
plan, backfill every existing tenant onto it, and treat missing-subscription as that plan rather
than as nothing.

**D2 — Where does per-tenant quota override live?** Enterprise is "Custom" per the mockup, which
means a tenant needs limits that differ from its plan. Either nullable `max*` overrides on
`Subscription`, or a per-tenant plan row. *Recommendation:* override columns on `Subscription` — it
already carries the tenant-plan relationship, and a plan-per-tenant makes the plans list unusable.

**D3 — Publish-changes semantics.** Per-toggle autosave or a staged diff with a publish step? The
existing header implies staged. *Recommendation:* autosave per toggle with an undo notice; staging
needs a draft store, and the page has exactly two writers who are both admins.

**D4 — Is "Priority Support" a feature at all?** It gates nothing in software. Better as a plan
description field than as a `Feature` row that no `requireFeature` will ever reference.
