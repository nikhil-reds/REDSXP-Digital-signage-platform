# Skeleton loading — one system across both portals

Goal: every surface that waits on data shows the *shape* of what's coming, from the same primitives,
with the same motion, in both portals — and never flashes a skeleton at a user who is already
looking at content.

Scope: **25 page routes** (`app/(admin)/admin/**/page.tsx` — 12, `app/(agent)/agent/**/page.tsx` — 13)
plus the components they render.

Builds on the token layer and primitives from
[`docs/agent-card-system-plan.md`](./agent-card-system-plan.md) §2–3. Skeletons are the one gap in
that primitive set: `components/ui/index.ts` exports 13 primitive families, none of them a skeleton.

---

## 1. What the audit found

**Seven different loading treatments** across the two portals, and no shared primitive behind any of
them.

| Count | Treatment | Where |
| --- | --- | --- |
| 15 | **Nothing at all** | every route not listed below |
| 4 | Centred text label in a `Card` — `"Loading schedules…"` | agent `media`, `schedules`, `screens`, `screen-groups` |
| 2 | `Loader2` spinner + text label | agent `playlists`, `playlists/create-playlist` (full-page) |
| 1 | `animate-pulse` rows, **raw zinc colours** | admin `users` |
| 1 | `Loader2` spinner inside a table cell | admin `tenants` |
| 1 | `animate-pulse` empty `Card` as a `next/dynamic` fallback | `components/agent/overview/trends-activity-section.tsx:18` |
| 1 | Em-dash placeholder in a `StatTile` | `app/(admin)/admin/users/page.tsx:160` |

Three further findings:

**1.1 — There are zero `loading.tsx` files in the app.** No route segment has a Suspense fallback, so
a click on a sidebar link leaves the previous page on screen, frozen, until the next page's JS has
run. Both portal layouts are static (no data fetching in
`app/(admin)/admin/layout.tsx` or `app/(agent)/agent/layout.tsx`), which means route-level skeletons
would render *inside* the shell with the sidebar and navbar staying put — the ideal case, currently
unused.

**1.2 — Only three surfaces actually fetch.** `admin/users`, `admin/tenants` and `agent/media` hit
real APIs. The other 22 render hardcoded demo arrays; six of those fake an `isLoading` flag over
static data. So most of the "loading states" in the codebase have never been tested against a real
network.

**1.3 — The one hand-rolled skeleton violates the token rule.** `admin/users` builds its pulse rows
from `bg-zinc-100 dark:bg-zinc-800`, against the rule stated at the top of `components/ui/index.ts`
("never hardcode a hex; use the `--app-*` tokens"). It also flips the *entire* table to skeletons on
every filter change — see §2.

---

## 2. The contract: three tiers, and the rule that matters

Most of the mess above is one missing distinction. Loading is not one state, it is three, and only
two of them get a skeleton.

| Tier | When | Treatment |
| --- | --- | --- |
| **1 — Route transition** | user navigates; the segment's server work hasn't resolved | `loading.tsx` renders a page-shaped skeleton inside the portal shell |
| **2 — First data load** | client page mounted, `useEffect` fetch in flight, **no data yet** | skeleton replaces the content region only; header, toolbar and filters stay live |
| **3 — Refetch** | filter/search/page change, manual refresh, post-mutation reload — **data already on screen** | **never a skeleton.** Keep the rows. Spin the refresh icon, optionally dim the region to 60%. |

### The rule

```
show skeleton  ⟺  isLoading && data.length === 0
```

Tier 3 is where the current code goes wrong. `admin/users` calls `setIsLoading(true)` in every filter
handler, so typing in the search box or paging forward replaces populated rows with pulsing grey
bars — the user loses their place on every keystroke-triggered request. Stale rows for 200ms beat a
skeleton flash every time.

`admin/tenants` already implements the rule correctly
(`isLoading && tenants.length === 0` at `components/admin/tenants/tenants-table.tsx`); it is the
reference for the sweep, though its Tier-2 branch is a spinner and needs replacing with a skeleton.

### Geometry is the whole point

A skeleton earns its keep only if it occupies the same box as the content it stands in for. If the
real row is 53px tall with 6 columns, the skeleton row is 53px tall with 6 columns. Anything else is
a layout shift dressed up as polish — worse than a spinner, because it moves the page twice.

This means skeletons live next to the components they mirror and are updated with them, not
maintained as a separate parallel design.

### Motion, colour, a11y

- **Fill:** `bg-app-border` on `bg-app-surface`. Never `zinc-*`, never a hex. *(Phase A correction:
  this originally said `bg-app-surface-alt`, which is `#f3f2f2` against a `#ffffff` surface in the
  light theme — invisible. `--app-border` is Cool 20 light / Cool 80 dark and reads on both.)*
- **Motion:** one animation for all skeletons. Tailwind's `animate-pulse` is the default choice —
  no new keyframes, and it lands on `opacity: 1`, so it stays visible when
  `globals.css:359`'s `prefers-reduced-motion` block flattens the duration to `0.01ms`. A branded
  `--animate-shimmer` is the alternative; that is a single decision made once in `globals.css`, not
  per component (§7).
- **Screen readers:** the blocks are decorative — `aria-hidden="true"`. Each loading *region* gets
  one `role="status" aria-live="polite"` node with a visually-hidden `Loading tenants…`, so a
  40-block table skeleton announces once instead of forty times.

---

## 3. Primitives to build

One new file, `components/ui/skeleton.tsx`, exported from `components/ui/index.ts`:

| Primitive | Mirrors | Notes |
| --- | --- | --- |
| `<Skeleton />` | any block | base: `bg-app-border rounded-md animate-pulse`; size via `className` |
| `<SkeletonText lines={n} />` | a paragraph / stacked labels | last line at 60% width |
| `<SkeletonCircle size />` | avatar, status dot | `admin/users` initials bubble is `h-9 w-9` |
| `<SkeletonTable rows cols />` | `<Th>/<Td>` from `table-card.tsx` | must reuse `Td`'s `px-5 py-3` so column widths don't jump |
| `<SkeletonStatGrid columns />` | `StatGrid` + `StatTile` | replaces the em-dash placeholder |
| `<SkeletonCardGrid count />` | media grid, playlist cards | |
| `<SkeletonChart />` | `ChartCard` body | fixed panel height; `next/dynamic` fallback |
| `<PageSkeleton variant="table" \| "grid" \| "dashboard" />` | a whole route | the only thing `loading.tsx` files need to call |

`PageSkeleton` is what keeps Phase B cheap: 25 routes need three shapes between them, not 25 bespoke
files.

---

## 4. Which tier each surface gets

| Surface | Kind | Tier | Component |
| --- | --- | --- | --- |
| admin `analytics`, `audit-logs`, `billing`, `health`, `plans`, overview | server | 1 | `loading.tsx` → `PageSkeleton` |
| agent overview | server | 1 | `loading.tsx` → `PageSkeleton variant="dashboard"` |
| admin `users`, `tenants` | client, real fetch | 2 + 3 | `SkeletonTable` + `SkeletonStatGrid` |
| agent `media` | client, real fetch | 2 + 3 | `SkeletonCardGrid` / `SkeletonTable` per view mode |
| agent `schedules`, `screens`, `screen-groups`, `playlists` | client, demo today | 2 | `SkeletonTable` / `SkeletonCardGrid` |
| agent `playlists/create-playlist` | client, full-page spinner | 2 | bespoke — three-pane editor, not a list |
| `trends-activity-section` | `next/dynamic` | — | `loading:` → `SkeletonChart` |
| admin/agent remaining demo pages | client, no state | 2 | added when each one migrates to real data (§5, Phase D) |
| any modal/drawer with async content | — | 2 | skeleton inside the modal body |
| any mutation in flight | — | — | button spinner only — `<Button>` already handles this |

### Next.js 16 note

`cacheComponents` is **not** enabled in `next.config.ts`, so `use cache` and `unstable_instant` are
out of scope: plain `loading.tsx` + `<Suspense>` is the correct mechanism here. If cacheComponents is
turned on later, every `loading.tsx` needs revisiting against
`node_modules/next/dist/docs/01-app/02-guides/instant-navigation.md` — misplaced boundaries silently
block client navigation, and that guide's `unstable_instant` export is the dev-time check for it.

---

## 5. Phased execution

### Phase A — primitives *(no visual change to any page)*

Build `components/ui/skeleton.tsx`, export it, settle the pulse-vs-shimmer question. One file, one
export line. Nothing else in the repo changes, so this is safe to land on its own.

### Phase B — pilot on **admin** *(recommended first)*

Admin goes first because **two of the three real-fetch surfaces live there.** The pilot gets
validated against actual query latency instead of a `setTimeout` over a demo array — the agent pages
mostly can't verify their own skeletons yet.

- **B1 `admin/users`** — the worst offender and the best test. Pulse rows → `SkeletonTable`,
  em-dash tiles → `SkeletonStatGrid`, raw zinc → tokens, and apply the §2 rule so filter changes stop
  flashing. (This page's table and pagination still carry raw `zinc-*` classes from before the token
  migration; converting them is adjacent but separate work.)
- **B2 `admin/tenants`** — in-cell spinner → `SkeletonTable`. The Tier-3 logic is already right.
- **B3** — `loading.tsx` for the six server-rendered admin routes.

Exit criteria: navigate admin at Slow 3G with no layout shift, and no skeleton on any filter change.

### Phase C — agent sweep

Replace the four `"Loading X…"` labels and two spinners with region skeletons; point the
`trends-activity-section` dynamic fallback at `SkeletonChart`; add `loading.tsx` for agent overview.
Mechanical once Phase B has settled the patterns.

### Phase D — ride along with the demo-data migration

The 22 demo-data pages each need real APIs (the `admin/tenants` conversion is the template: route
handler + `requireAdmin` + client fetch). **Each one lands with its skeleton in the same commit** —
retrofitting loading states across 22 pages a second time is the thing this plan exists to prevent.

### Phase E — lock it in

A grep gate in CI (or an eslint `no-restricted-syntax`) rejecting `animate-pulse` and `zinc-` in
`app/**` and `components/**` outside `skeleton.tsx`, so the next hand-rolled skeleton fails the build
instead of the review.

---

## 6. Verification per surface

1. DevTools **Slow 3G** — skeleton appears within one frame of navigation.
2. **No layout shift** when real content swaps in (Rendering → Layout Shift Regions).
3. **Filter/search/paginate with data on screen** — no skeleton, rows never disappear.
4. **`prefers-reduced-motion: reduce`** — skeleton still visible, just static.
5. **Light and dark**, both portals.
6. **Screen reader** — one "Loading X…" per region, not one per block.

---

## 7. Open questions

- **Pulse or shimmer?** `reds-brand-book.md` doesn't cover loading motion. `animate-pulse` is free and
  already reduced-motion-safe; a shimmer is more branded but needs a keyframe and a gradient that
  works on both themes. **Recommend pulse** and revisit if it reads cheap.
- **Minimum skeleton duration?** A 300ms floor prevents flash-then-content on fast local queries but
  adds latency to every fast request. **Recommend no floor** — fix it with the §2 rule instead, which
  removes the common case (refetch flashes) entirely.
- **How far does Phase E's gate reach?** `device-detail.tsx:183` uses `animate-pulse` legitimately —
  a pulsing red bar as a *live alert*, not a skeleton. The rule needs that exemption or that line
  needs its own token.

---

## 8. Effort

| Phase | Files | Notes |
| --- | --- | --- |
| A | 2 | new `skeleton.tsx` + `index.ts` export |
| B | 3 touched + 6 new | `users`, `tenants`, `PageSkeleton` variants, 6 × `loading.tsx` |
| C | 7 touched + 1 new | 6 agent pages + dynamic fallback |
| D | — | folded into each page's data migration |
| E | 1 | lint rule / CI gate |

**~20 files. No schema changes, no API changes, no new dependencies.** Phases A–C are independently
shippable in that order.

---

## 9. Execution log

**Phases A, B, C and E are landed. Phase D is ongoing by design.**

| Phase | Status | What landed |
| --- | --- | --- |
| A — primitives | done | `components/ui/skeleton.tsx` (10 exports), wired into `components/ui/index.ts` and the `card-gallery` harness |
| B — admin pilot | done | `admin/users` + `admin/tenants` skeletons and the tier-3 rule; `loading.tsx` for **all 12** admin routes |
| C — agent sweep | done | 6 agent pages, the `next/dynamic` chart fallback, `PlaylistEditorSkeleton`, `loading.tsx` for **all 13** agent routes |
| D — demo-data migration | ongoing | each page picks up its skeleton as it moves to real data |
| E — lint gate | done | two `no-restricted-syntax` signatures in `eslint.config.mjs`, verified against 2 positive and 4 negative cases |

### Three things the plan got wrong

**1. The fill token.** §2 originally specified `bg-app-surface-alt`. That is `#f3f2f2` against a
`#ffffff` surface in the light theme — invisible. Corrected to `bg-app-border` (Cool 20 light / Cool
80 dark) and verified in the browser: fill `rgb(225,225,224)` on surface `rgb(255,255,255)`.

**2. `loading.tsx` cascades.** §5 planned 6 files for the server-rendered admin routes. But
`loading.tsx` wraps "the `page.js` file **and any children below**", so `admin/loading.tsx` would
have shown its dashboard-shaped skeleton on `/admin/tenants`, `/admin/users` and every other admin
route. **Every** route therefore needs its own to override the parent — 12 admin + 13 agent = 25,
plus the editor's own. Client routes benefit anyway: the fallback covers the segment's JS/RSC
payload on first navigation.

**3. Two surfaces were not lists.** §4 assigned `SkeletonTable`/`SkeletonCardGrid` to agent
`schedules`, which actually renders a month calendar, and left `create-playlist` as "bespoke". Both
got local skeletons mirroring their real chrome: a 7-column weekday header over a 5×7 day grid, and
a three-pane editor at the real pane widths (library 300px, inspector 330px) in
`components/agent/playlists/playlist-editor-skeleton.tsx`, reused across the route fallback, the
editor's `loading` branch, and its `Suspense` fallback.

### Phase E, as actually built

Banning `animate-pulse` outright was rejected: all 8 remaining uses are legitimate live state (voice
indicator, schedule conflict warnings, the `device-detail` alert bar), and their `className` sits in
JSX attribute position where `eslint-disable-next-line` does not go cleanly. The gate matches the
*skeleton signature* instead:

- pulse **and** a neutral fill in one `className` — the single-element form
- a raw grey fill (`bg-zinc-*`, `bg-gray-*`, `bg-slate-*`, `bg-neutral-*`) — which also catches the
  pulse-on-wrapper/fill-on-children form, since any skeleton needs a grey somewhere

7 files carrying 54 pre-existing raw greys are grandfathered in `RAW_GREY_BACKLOG` (they still get
the skeleton gate). Converting them is the token migration, not this plan. The §7 open question
about exempting `device-detail.tsx:183` is resolved: it uses `bg-app-danger`, so the gate never
sees it.

### Verified

`npx next build` compiles all 26 `loading.tsx` files. `tsc --noEmit` clean. Lint reports the same 7
pre-existing errors as before this work and no new ones. Skeleton geometry, both themes, and all
three `PageSkeleton` variants checked in the browser via `/card-gallery`.

**Not verified in a browser:** the admin/agent pages themselves, which sit behind the login the
proxy enforces, and `prefers-reduced-motion` (reasoned from `globals.css:359` flattening
`animate-pulse` to its opacity-1 end state, not observed).
