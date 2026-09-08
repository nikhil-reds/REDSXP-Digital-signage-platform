# Agent panel — one card system across every page

Goal: every card on every agent page reads as the same component, built from the same tokens, with
the same density, typography, states and behaviour.

This is phase 3–4 of [`docs/agent-panel-rebrand-plan.md`](./agent-panel-rebrand-plan.md). Phases 0–2
(token layer, shell, assistant) are already landed; the token layer this plan builds on exists.

Scope: **56 files** — `components/agent/**` and `app/(agent)/agent/**/page.tsx`.

---

## 1. What the audit found

I scanned all 56 files and extracted every container that reads as a card (a radius + a background +
a border or shadow). There are **306 of them, and no two areas agree.**

### 1.1 The shell itself is 35 different components

Grouping outer panels by `radius | shadow | padding`:

| Count | Signature |
| --- | --- |
| 27 | `rounded-xl` \| no shadow \| `p-4` |
| 10 | `rounded-xl` \| `shadow-xs` \| no padding |
| 10 | `rounded-xl` \| `shadow-xs` \| `p-5` |
| 8 | `rounded-xl` \| `shadow-2xl` \| no padding |
| 6 | `rounded-lg` \| `shadow-2xs` \| no padding |
| 6 | `rounded-lg` \| no shadow \| no padding |
| … | **35 distinct signatures in total** |

Underlying spread: **6 radius values** (`sm/md/lg/xl/2xl/full`), **6 shadow values**
(`2xs/xs/sm/md/lg/2xl`), **12 padding values** (`p-0.5` … `p-8`, including a one-off `p-4.5`),
**8 grid gaps** (`gap-0.5` … `gap-6`).

### 1.2 Ten different card backgrounds

`bg-white` (160), `bg-[#171F2C]` (146), `bg-[#111722]` (128), `bg-zinc-800` (60), `bg-zinc-50` (60),
`bg-zinc-900` (33), `bg-zinc-950` (19), `bg-[#18202E]` (18), `bg-[#0D1320]` (18), `bg-zinc-100` (9).

Three parallel neutral systems are in use at once: the custom hex palette, Tailwind `zinc`, and a
handful of one-off darks. Borders are the same story — `#E2E6EC`/`#283243` (236 each) plus stray
`zinc-100/200/800`.

### 1.3 Typography is off-scale almost everywhere

**395 arbitrary font sizes**, of which **385 sit below the brand's 12px floor**:

| Count | Size | | Count | Size |
| --- | --- | --- | --- | --- |
| 162 | `text-[10px]` | | 15 | `text-[8px]` |
| 124 | `text-[9px]` | | 6 | `text-[6px]` |
| 43 | `text-[11px]` | | 5 | `text-[9.5px]` |
| 25 | `text-[10.5px]` | | 3 | `text-[8.5px]` |

Text at **6px** is not readable by anyone. Alongside these, only four scale classes are used at all
(`text-xs` 240, `text-sm` 31, `text-xl` 19, `text-lg` 7), so there is no heading hierarchy — card
titles and body copy are frequently the same size.

### 1.4 Cards are a rainbow, which is the one thing the brand book forbids

**562 decorative hue usages** from Tailwind's palette:

| Hue | Count | Status |
| --- | --- | --- |
| emerald | 154 | ❌ not a brand hue — stands in for "online/success", which is green's job |
| red | 147 | ⚠️ right idea, wrong value (`#D32735` is the brand error) |
| amber | 136 | ⚠️ right idea, wrong value (`#E5A015`) |
| blue | 63 | ❌ not the brand blue, and blue is tertiary |
| rose | 28 | ❌ |
| **purple** | **23** | ❌ **explicitly forbidden adjacent to green** |
| orange | 11 | ❌ |

The stat tiles make this structural: each tile gets its own pastel icon chip
(`bg-blue-50`, `bg-red-50`, `bg-emerald-50`, `bg-purple-50`, `bg-zinc-50`), so a single row of five
KPIs shows five competing hues. The brand book's first sentence is that every other hue "exists to
serve [green] — never to compete with it."

### 1.5 Modals are hand-rolled 13 times, and their animation doesn't exist

Five different backdrop strings across 13 modal files (`bg-black/55` vs `/50`, `dark:bg-black/80` vs
`/75`, with and without `backdrop-blur-[2px]`, `z-50` vs `z-[70]`).

All 13 apply `animate-fadeIn` — **which is never defined** in `app/globals.css`. It is a dead class;
no modal in the product actually animates.

### 1.6 There are no shared primitives

`components/ui/` does not exist. Every card is copy-pasted, which is why the drift above happened and
why it will happen again after any one-off cleanup.

---

## 2. The fix: a real card contract

### 2.1 Three card sizes, and nothing else

| Size | Used for | Radius | Padding | Title |
| --- | --- | --- | --- | --- |
| **Panel** | page-level sections: table cards, chart cards, form sections | `rounded-xl` | header `p-5`, body `p-5` (or `p-0` for tables) | H5 — Sora Semibold 24/32 |
| **Widget** | grid items: stat tiles, group cards, config blocks | `rounded-xl` | `p-4` | H6 — Sora Semibold 20/26 |
| **Row** | list rows, media tiles, inspector items, chips-with-content | `rounded-lg` | `p-3` | Body — Source Sans Semibold 14/18 |

Nested elements inside a card go one step down (`rounded-lg` inside a Panel, `rounded-md` inside a
Row). Pills stay `rounded-full`.

### 2.2 Surface, border, elevation

| Property | Value | Note |
| --- | --- | --- |
| Card background | `bg-app-surface` | white / brand black |
| Nested block inside a card | `bg-app-surface-alt` | Cool 10 / Cool 90 |
| Border | `border border-app-border` | always present; this is what separates cards |
| Shadow — resting card | **none** | borders do the work; removes 5 of 6 shadow variants |
| Shadow — overlay (dropdown, popover) | `shadow-xs` | |
| Shadow — modal / drawer | `shadow-2xl` | |

Resting cards get no shadow. That single rule deletes most of the 35 signatures.

### 2.3 Interactive states

Only cards that are actually clickable get hover treatment, and it is always the same:

| State | Treatment |
| --- | --- |
| Hover (clickable card) | `border-app-accent-text` + `bg-app-surface-alt` |
| Focus-visible | `ring-2 ring-app-accent-text ring-offset-2 ring-offset-app-canvas` |
| Selected | `border-app-accent-text` + `bg-app-accent-surface` + 3px left bar in `--app-accent-text` |
| Disabled | `opacity-60`, no hover |

Never hover-on-shadow (currently `hover:shadow-sm` in the stat tiles) — it causes layout shimmer and
is invisible in dark mode. Green stays a **fill or a bar**, never thin-and-vivid, per the rule
established in phase 1.

### 2.4 Typography inside a card

| Slot | Token | Font |
| --- | --- | --- |
| Card title | per size table above | Sora Semibold, `tracking-headline` |
| Card description / subtitle | `text-body` (14/18) `text-app-muted` | Source Sans |
| Body / table cell | `text-body` (14/18) `text-app-text` | Source Sans |
| Label, timestamp, meta, uppercase eyebrow | `text-caption` (12/16) `text-app-muted` | Source Sans |
| Stat value | `text-h4` (32/40) Sora Semibold | Sora |

**12px is the floor.** All 385 sub-12px occurrences collapse into `text-caption`.
Headings take `tracking-headline`, never `tracking-tight` (§15 of the brand book — the stat tiles
currently use `tracking-tight` on every value).

### 2.5 One status colour system

This replaces all 562 decorative hue usages.

| Meaning | Token | Example |
| --- | --- | --- |
| Online / healthy / success | `--app-accent` fill, `--app-accent-text` for dots & text | "44 Online" |
| Warning / degraded | `--app-warning` family | "2 Delayed" |
| Error / offline / critical | `--app-danger` family | "2 Offline" |
| Neutral / unknown / inactive | `--app-text-muted` | "3 Medium/Low" |
| Informational accent | `--app-accent-surface` + `--app-accent-text` | count chips |

Consequences: emerald → accent green; rose/orange/purple/blue chips → **deleted**; red/amber → brand
values. Stat-tile icon chips all become the *same* neutral chip (`bg-app-surface-alt` +
`text-app-muted`), except tiles whose subject genuinely is an error or warning state.

### 2.6 Spacing

| Context | Value |
| --- | --- |
| Between page sections | `space-y-6` |
| Between cards in a grid | `gap-4` |
| Inside a card, between blocks | `gap-3` |
| Inside a row, between inline items | `gap-2` |
| Page wrapper | `py-6 px-8` |

Collapses 8 gap values to 3 and settles the page padding (currently `py-6 px-8`, `p-2` and `p-4` are
all in use).

---

## 3. Components to build

New directory `components/ui/`. Each is a thin, typed wrapper over the tokens — no logic.

| Component | API sketch | Replaces |
| --- | --- | --- |
| `Card` | `size="panel" \| "widget" \| "row"`, `interactive`, `selected`, `as` | 306 hand-rolled containers |
| `CardHeader` / `CardTitle` / `CardDescription` / `CardActions` | composition slots | ad-hoc header rows |
| `CardBody` / `CardFooter` | `padded` | — |
| `StatTile` | `label, value, icon, trend, status, children` | 9 stat grids |
| `TableCard` | `title, actions, columns, children, footer` | 9 table cards |
| `ChartCard` | `title, description, legend, children` | 2 chart cards |
| `EmptyState` | `icon, title, description, action` | scattered inline empties |
| `Badge` | `tone="neutral\|accent\|warning\|danger"`, `size` | pill variants |
| `StatusDot` | `status="online\|warning\|error\|unknown"` | emerald/amber/red dots |
| `ProgressBar` | `value, max, tone` | 5 bar variants |
| `Modal` | `open, onClose, title, size, footer` | 13 hand-rolled modals + 5 backdrops |
| `Drawer` | `open, onClose, title, side` | screens detail drawer, media preview |
| `SectionHeader` | `title, description, actions` | page headers |
| `Toolbar` | `filters, search, actions` | filter bars |

Plus: **define the missing `fadeIn`/`slideIn` keyframes** in `globals.css` so `Modal` actually
animates, and drop the dead class from the 13 call sites.

---

## 4. Phased execution

### Phase 3a — primitives *(no visual change to existing pages)*
Build `components/ui/*` and a temporary `/card-gallery` preview route rendering every component in
every state × both themes. Verify with the canvas contrast audit from phase 2. Delete the route after
sign-off.

### Phase 3b — pilot on one area
Migrate **`overview`** (4 files) end to end. It has a stat grid, a chart card, a table card and a
health map, so it exercises most of the system. This is where the API gets corrected before it is
copied 50 times.

### Phase 3c — sweep, area by area
Each area: swap containers for `Card`, map text sizes to tokens, replace hue usages, delete dead
classes. Verified per area with the audit + a build.

| # | Area | Files | Notes |
| --- | --- | --- | --- |
| 1 | `overview` | 4 | pilot (3b) |
| 2 | `screens` + `screen-groups` | 9 | includes the 104-literal detail drawer |
| 3 | `playlists` | 10 | highest complexity; `preview-canvas` may keep bespoke styling |
| 4 | `schedules` | 5 | calendar grid needs its own density rules |
| 5 | `media` | 5 | media tiles = Row cards; upload modal |
| 6 | `alerts` + `sensor-rules` | 8 | heaviest functional-colour use — §6 discipline matters most here |
| 7 | `analytics` + `reports` | 8 | **chart palettes**: series built Green → Teal → Blue, then Cool Gray steps; red/amber reserved for threshold breaches |
| 8 | `activity-log` + `support` | 6 | support chat widget should reuse the assistant's bubble tokens |

### Phase 3d — lock it in
Prevent regression, which is the whole point:

- ESLint rule banning raw hex in `className` inside `app/` and `components/`.
- ESLint rule banning `text-[…px]` arbitrary sizes.
- ESLint rule banning non-brand Tailwind hues (`emerald|rose|orange|purple|blue|indigo|violet|…`).
- `scripts/audit-contrast.mjs` — the canvas audit from phase 2, runnable against a route list in CI.

---

## 5. Verification per area

- [ ] Zero raw hex, zero arbitrary text sizes, zero non-brand hues (grep, automated)
- [ ] Contrast audit passes in **both** themes, no node under 4.5:1 (3:1 for large text)
- [ ] No text below 12px
- [ ] Every card is `Card`; no bespoke radius/padding/shadow combinations remain
- [ ] Interactive cards have visible hover **and** focus-visible states
- [ ] `npm run build` + `npx eslint <area>` clean

---

## 6. Open questions

| # | Question | My recommendation |
| --- | --- | --- |
| 1 | The book maps 24px to "standard card titles". On a dense ops dashboard that is large — a 5-up KPI row with 24px titles will feel heavy. | Use the three-size table in §2.1: 24px only for page-level Panels, 20px for Widgets, 14px for Rows. It honours the mapping where it matters and stays dense where it must. |
| 2 | Stat values at `text-h4` (32px) vs today's 20px. | Go to 32px. KPI numbers are the one thing people scan from across a room, and it is a real scale step. |
| 3 | Do the pastel icon chips go entirely neutral, or keep one accent chip for the "primary" KPI? | All neutral, except genuine error/warning tiles. One green chip among five neutral ones is a useful emphasis; five different hues is noise. |
| 4 | `playlists/preview-canvas.tsx` renders customer content at arbitrary colours. | Exempt it from the hue lint — it is a canvas, not chrome. Its *frame* still uses `Card`. |
| 5 | Should `components/admin/*` adopt the same primitives? | Yes eventually — `components/ui/*` is portal-agnostic and reads from `--app-*`. Not in this pass. |

---

## 7. Effort

| Phase | Files | Estimate |
| --- | --- | --- |
| 3a — primitives + gallery | ~14 new | 1–1.5 days |
| 3b — pilot (`overview`) | 4 | ~0.5 day |
| 3c — sweep (7 remaining areas) | 52 | 3–4 days |
| 3d — lint rules + CI audit | ~4 | ~0.5 day |
| **Total** | **~70** | **5–6.5 days** |

The sweep is the bulk, and it is mechanical once 3a and 3b settle the API. Areas 2, 3 and 6 carry the
most risk (largest files, heaviest functional-colour logic).
