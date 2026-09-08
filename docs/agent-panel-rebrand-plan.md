# Agent panel → REDS brand — implementation plan

Bringing the agent portal shell and the AI Assistant panel onto the REDS brand system defined in
[`docs/reds-brand-book.md`](./reds-brand-book.md).

**Scope (phases 0–3):** the frame a user sees on every agent page.

| | File |
| --- | --- |
| Token layer | `app/globals.css` |
| Fonts | `app/layout.tsx` |
| Shell | `app/(agent)/agent/layout.tsx`, `components/layout/agent-sidebar.tsx`, `components/layout/agent-navbar.tsx` |
| Assistant | `components/chatbot/floating-chatbot-widget.tsx` |

**Out of scope for now (phase 4):** the 57 feature components under `components/agent/*` and
`app/(agent)/agent/*/page.tsx`. They inherit the token layer built in phase 0, so they get partially
corrected for free; a per-area sweep is sequenced at the end.

---

## 1. Where we are today

Hardcoded hex literals across the agent surfaces (62 `.tsx` files):

| Count | Hex | Currently used as | In the brand book? |
| --- | --- | --- | --- |
| 412 | `#283243` | dark border | ❌ not a brand value |
| 410 | `#E2E6EC` | light border | ❌ |
| 218 | `#2859D9` | **accent / active nav (blue)** | ❌ |
| 212 | `#F6F7F9` | light surface | ❌ |
| 173 | `#6F96FF` | dark-mode accent | ❌ |
| 172 | `#111722` | dark panel | ❌ |
| 160 | `#171F2C` | dark hover | ❌ |
| 75 | `#9AA7B7` | dark muted text | ❌ |
| 74 | `#657080` | light muted text | ❌ |
| 57 | `#F2F5F8` / `#18202B` | dark/light body text | ❌ |
| 35 | `#7A66F6` | **AI Assistant accent (purple)** | ❌ **explicitly forbidden** |
| 4 | `#FF2244` | alert badge | ❌ (brand red is `#D32735`) |

**Zero** of the ~1,900 color literals in the agent portal are brand values. There is no token layer —
`app/globals.css` defines only `--background` / `--foreground`, and the font is Geist, not Sora /
Source Sans 3.

Highest-density files (hex literals per file):

```
104  components/agent/screens/screens-detail-drawer.tsx
 91  app/(agent)/agent/screens/page.tsx
 85  components/agent/playlists/playlist-inspector.tsx
 85  components/agent/media/media-upload-modal.tsx
 74  components/chatbot/floating-chatbot-widget.tsx   <- in scope
 57  components/layout/agent-sidebar.tsx              <- in scope
 41  components/layout/agent-navbar.tsx               <- in scope
```

---

## 2. Brand violations to fix

Ranked by how directly they contradict the book.

| # | Violation | Book reference |
| --- | --- | --- |
| 1 | **The AI Assistant is purple** (`#7A66F6`), and its voice orb is an indigo→purple→pink gradient. Green + purple is one of the three named forbidden pairings, and "never blend outside the Green–Teal–Blue family (e.g. no purple, red, or yellow)". | §5 Combinations to avoid, §8 Gradients |
| 2 | **The hero color is absent.** `#0BDA51` appears nowhere in the agent portal. The accent is blue `#2859D9`, which is not in the palette (brand blue is `#0B8793`, and it is a *tertiary*, never the accent). | §1, §2, §5 |
| 3 | **Wrong red.** Alert badges use `#FF2244`; the error base is `#D32735`. | §6 |
| 4 | **Off-system neutrals.** Ten ad-hoc grays, none from the Cool or Warm ramp. No single neutral mood is declared. | §7 |
| 5 | **Wrong typefaces.** Geist / Arial instead of Sora (headlines) + Source Sans 3 (body & UI). | §10 |
| 6 | **Off-scale type.** `text-[9px]`, `text-[10px]`, `text-[11px]` are used throughout; the scale's smallest step is 12px. Line heights are Tailwind defaults, not the §13 pairings. | §11, §12, §13 |
| 7 | **Contrast failures.** White on the assistant's purple is **4.15:1** — below the 4.5:1 the book requires for body text. | §9 |
| 8 | **Decorative functional color.** `emerald-400/500` ping dots, `orange-600` avatar, `yellow-300` sparkle. Amber and red are reserved for warning/error only; emerald and orange aren't brand hues at all. | §6 |

---

## 3. Color mapping

### 3.1 Chrome / neutrals — adopt **Cool Gray** as the single neutral mood

The book requires one mood per application (§7). The existing grays already lean cool, so Cool Gray
(hue 220°) is the lower-friction choice. Warm Gray is then off-limits portal-wide, and — per §8 — must
never appear in a gradient anywhere.

| Current | → | Brand token | Role |
| --- | --- | --- | --- |
| `#F6F7F9` | → | `#F6F6F3` Off-white | light app canvas |
| `#FFFFFF` (panels) | → | `#FFFFFF` | light panel surface (kept — it's in the §9 matrix) |
| `#E2E6EC` | → | `#E1E1E0` Cool 20 | light border |
| `#657080` | → | `#5B616B` Cool 70 | light muted text — **4.68 → 5.76:1** |
| `#18202B` | → | `#292929` Black | light body text |
| `#090D14` | → | `#212121` Cool 100 | dark app canvas |
| `#111722` | → | `#292929` Black | dark panel surface |
| `#171F2C` | → | `#333538` Cool 90 | dark hover / raised surface |
| `#283243` | → | `#474B52` Cool 80 | dark border |
| `#9AA7B7` | → | `#8F949E` Cool 50 | dark muted text — 5.29:1 on Cool 100 ✅ |
| `#F2F5F8` | → | `#F6F6F3` Off-white | dark body text — 14.87:1 ✅ |

### 3.2 Accent

| Current | → | Brand token |
| --- | --- | --- |
| `#2859D9` (light accent) | → | `#0BDA51` Green 60 — **surfaces and indicators only** (see §4.1) |
| `#6F96FF` (dark accent) | → | `#0BDA51` Green 60 — 7.73:1 on `#292929` ✅ |
| `#7A66F6` (assistant) | → | `#0BDA51` Green 60 |
| `#2859D9`/10 chips | → | `#E7FEEF` Green 10 surface + `#292929` text — 13.73:1 ✅ |

### 3.3 Functional

| Current | → | Brand token | Note |
| --- | --- | --- | --- |
| `#FF2244` badge | → | `#D32735` Red 60, white text | 5.11:1 ✅ |
| `emerald-400/500` live dot | → | `#0BDA51` Green 60 | "online/live" is brand state, not an error |
| `orange-600` avatar | → | `#474B52` Cool 80 or `#0BDA51` | orange is not a brand hue |
| `yellow-300` sparkle | → | `#F6F6F3` or drop | amber is warning-only |
| `#F59E0B` warning states | → | `#E5A015` Amber 60 | |

### 3.4 Gradients

| Current | → | Approved replacement |
| --- | --- | --- |
| Assistant header `#7A66F6 → #6853F3` | → | `#0BDA51 → #1FBF8A` |
| Voice orb `indigo → #7A66F6 → pink` | → | `#0BDA51 → #1FBF8A → #0B8793` (the approved 3-color combination) |
| Orb glow `purple-500/25` | → | `#1FBF8A` at low alpha |

---

## 4. Derived rules — decisions the book implies but doesn't spell out

These are the traps. Each one is a place where a naive "swap blue for green" produces something that
violates §9.

### 4.1 Green cannot be text on a light surface

`#0BDA51` on `#F6F6F3` is **1.74:1** — the book marks it ❌, and the math confirms it badly fails.
The current active nav item is *blue text on a light row*; that pattern cannot survive a straight
color swap.

**Rule:** in light mode, green is a **surface, bar, or fill** — never a text color.

| Context | Light mode | Dark mode |
| --- | --- | --- |
| Active nav row | `#E7FEEF` (Green 10) background + `#292929` text + `#0BDA51` 3px left bar — **13.73:1** | `#333538` background + `#0BDA51` text + `#0BDA51` bar — **7.73:1** |
| Active nav icon | `#06792D` (Green 80) — **5.13:1** | `#0BDA51` — 7.73:1 |
| Link / green text on light | `#06792D` Green 80 (5.13:1) or `#04531F` Green 90 (8.57:1) | `#0BDA51` |
| Primary button | `#0BDA51` fill + `#292929` label — 7.73:1 ✅ | same |

Green 80/90 as the light-mode "green text" value is a derived extension of the §4 ramp — it stays
inside the system ("build hierarchy and state without introducing new hues") while clearing AA.

**Corollary, found during implementation:** the same applies to *thin non-text elements* — active-state
bars, focus rings, status dots. Green 60 on the Green 10 active row measures **1.78:1**, so the
indicator bar vanished in light mode; on white it is 1.74:1, so a Green 60 focus ring failed the 3:1
that WCAG 1.4.11 asks of UI components. All of these now use `--app-accent-text` (Green 80 light,
Green 60 dark), which gives 5.24:1 on the active row and 5.13:1 on white.

So in light mode the hero green appears as **large fills behind dark text** — buttons, badges, the
avatar, the assistant header — and never as anything thin. That is the honest reading of a palette
whose hero is tuned for dark backgrounds.

### 4.2 Muted-text floors

Muted text has to clear 4.5:1 on **every** surface it can land on, including the raised one.

| Theme | Canvas | Surface | Raised surface | Muted value |
| --- | --- | --- | --- | --- |
| Light | 5.76:1 | 5.76:1 | 5.58:1 | `#5B616B` Cool 70 |
| Dark | 7.32:1 | 6.61:1 | 5.59:1 | `#ACAFB4` Cool 40 |

Cool 60 `#737A87` on off-white is **3.99:1** — fails. Do not use it for text on light.

**Correction from implementation:** dark muted was originally specced as Cool 50 `#8F949E`. That is
fine on the canvas (5.29:1) and on brand black (4.78:1) but only **4.04:1** on the raised Cool 90
surface — caught by the automated audit on the navbar's "Live Context" pill. Dark muted is now
Cool 40.

### 4.3 No alpha on anything whose contrast matters

Tailwind's `/50`-style modifiers compile to `color-mix(... in oklab ...)`, which makes the rendered
value depend on whatever is behind it and impossible to check by reading the class name. Two real
failures came from this:

- the sidebar footer's `bg-app-surface-alt/50` — replaced with the solid token;
- the assistant header's `text-reds-black/80`, which reads 5.19:1 over the green end of the gradient
  but **4.32:1** over the teal end — now full opacity, with hierarchy carried by size instead.

Rule: surfaces and text use solid tokens. Alpha is for glows, scrims and hover washes only — never
for something a user has to read.

### 4.4 Blue is a caution

The book lists white-on-`#0B8793` as ✅, but it measures **4.28:1** — just under the 4.5:1 the same
slide cites. Restrict blue to non-body-text roles (chart series, gradient terminus, large labels), or
pair it with `#F6F6F3` rather than pure white.

### 4.5 Red badge next to a green active row

§6 says red is "never adjacent to Green". The Alerts nav item carries a red count badge and can
simultaneously be the active (green) row. Two clean resolutions — **needs a call** (see §8):

- **(a)** Keep the badge `#D32735` always. Simple, honours "red = system feedback", accepts a green/red
  adjacency on one row.
- **(b)** Badge is Cool 80 `#474B52` by default and only turns `#D32735` when there are unacknowledged
  critical alerts, so red and green rarely co-occur. Stricter, slightly more logic.

### 4.6 The 12px floor

The scale bottoms out at 12px (§11), but the chrome uses 9–11px in 14 places in the in-scope files alone. Options — **needs a
call** (see §8): raise everything to 12px (denser layouts get looser), or document a deliberate
"micro-label" deviation at 10px.

---

## 5. Typography plan

### 5.1 Fonts

Both are on Google Fonts, so `next/font/google` handles it — no new dependency.

```ts
// app/layout.tsx
import { Sora, Source_Sans_3 } from "next/font/google";

const sora = Sora({ variable: "--font-sora", subsets: ["latin"], weight: ["400","600","700"] });
const sourceSans = Source_Sans_3({ variable: "--font-source-sans", subsets: ["latin"] });
```

Geist stays wired for now so the admin portal is untouched; the agent portal opts in via the token layer.

### 5.2 Role mapping for the shell

| Element | Font | Size / line height | Token |
| --- | --- | --- | --- |
| Navbar page title | Sora Semibold | 20 / 26 | H6 / Subtitle |
| Sidebar nav item | Source Sans 3 | 14 / 18 | Body |
| Sidebar section label | Source Sans 3, uppercase | 12 / 16 | Caption / Label |
| User name (sidebar footer) | Source Sans 3 Semibold | 14 / 18 | Body |
| User role, region | Source Sans 3 | 12 / 16 | Caption / Label |
| Search input | Source Sans 3 | 14 / 18 | Body |
| Assistant header title | Sora Semibold | 16 / 22 | Body Lead |
| Assistant message text | Source Sans 3 | 14 / 18 | Body |
| Assistant chips, timestamps | Source Sans 3 | 12 / 16 | Caption / Label |
| Buttons | **Sora Semibold** | 16 / 22 | Body Lead / Button (§12) |

Also from §15–§18, applied to the shell:

- Sora headlines get a touch of tracking (`letter-spacing: 0.01em`) — never `tracking-tight`, which
  the book shows as the "clumped" failure. Strip the existing `tracking-tight` on the navbar title.
- All body copy stays flush left (§17). No centered paragraphs in the assistant's empty state.
- Replace `'` `"` `-` in UI copy with `’` `“ ”` `—` (§18). The assistant's greeting string and the
  navbar search placeholder both need this.

---

## 6. Phased work plan

### Phase 0 — token layer + fonts ✅ **done**

**Files:** `app/globals.css`, `app/layout.tsx`

1. Paste the token block from Appendix C of the brand book into `app/globals.css`.
2. Add semantic aliases on top of the raw ramp so components never reference a ramp step directly:

```css
:root {
  --app-canvas:      var(--reds-offwhite);
  --app-surface:     #ffffff;
  --app-surface-alt: var(--reds-cool-10);
  --app-border:      var(--reds-cool-20);
  --app-text:        var(--reds-black);
  --app-text-muted:  var(--reds-cool-70);   /* 5.76:1 */
  --app-accent:      var(--reds-green-60);  /* surfaces/bars only in light */
  --app-accent-text: var(--reds-green-80);  /* 5.13:1 on off-white */
  --app-accent-surface: var(--reds-green-10);
  --app-danger:      var(--reds-red-60);
  --app-warning:     var(--reds-amber-60);
}

.dark {
  --app-canvas:      var(--reds-cool-100);
  --app-surface:     var(--reds-black);
  --app-surface-alt: var(--reds-cool-90);
  --app-border:      var(--reds-cool-80);
  --app-text:        var(--reds-offwhite);
  --app-text-muted:  var(--reds-cool-50);   /* 5.29:1 */
  --app-accent:      var(--reds-green-60);
  --app-accent-text: var(--reds-green-60);  /* 7.73:1 on brand black */
  --app-accent-surface: var(--reds-cool-90);
}
```

3. Expose them to Tailwind v4 via `@theme inline` (`--color-app-canvas: var(--app-canvas)` …) so
   `bg-app-canvas`, `text-app-muted`, `border-app-border` become real utilities.
4. Register `--font-sora` / `--font-source-sans` and set the agent shell's `font-family`.
5. Add the §13 size/line-height pairs as `--text-*` theme entries so `text-body`, `text-h6` etc. carry
   the correct leading automatically.

**Verify:** app still builds, nothing visually changes yet (aliases resolve to values close to current).

---

### Phase 1 — shell ✅ **done**

**Files:** `app/(agent)/agent/layout.tsx`, `components/layout/agent-sidebar.tsx`,
`components/layout/agent-navbar.tsx`

| Change | Detail |
| --- | --- |
| Replace all 100 hex literals in these three files with `app-*` utilities | mechanical |
| Active nav item | per §4.1 table — surface + left bar in light, green text in dark |
| Alert badge | `#FF2244` → `--app-danger`, white label |
| "Live Context" ping | emerald → `--app-accent` |
| Avatar | `orange-600` → `--app-accent` fill + `#292929` initials (7.73:1) |
| Focus rings | `focus:ring-[#2859D9]` → `--app-accent` (a ring is a bar, not text — legal on light) |
| Typography | apply §5.2 mapping; drop `tracking-tight` from the navbar title |
| Logo | sidebar already uses `/reds-xos-logo.png`; confirm it reads on both canvases, otherwise swap the collapsed state to `reds logo/REDS Logo TM.svg` |

**Verify:** every text/background pair in the two files checked against §9; sidebar collapsed and
expanded, light and dark.

---

### Phase 2 — AI Assistant panel ✅ **done**

**File:** `components/chatbot/floating-chatbot-widget.tsx` (74 hex literals, 412 lines)

| Element | Now | Target |
| --- | --- | --- |
| Launcher button | `#7A66F6` fill, white icon (4.15:1 ✗) | `#0BDA51` fill, `#292929` icon (7.73:1 ✓), green-60/35 shadow |
| Window header | purple gradient, white text | `#0BDA51 → #1FBF8A` gradient, `#292929` text (7.73:1 / 6.15:1 ✓) |
| Bot avatar | `#7A66F6`/15 | `--app-accent-surface` + `--app-accent-text` |
| User bubble | `#7A66F6` fill, white text | `#292929` fill, `#F6F6F3` text (13.44:1) — keeps green for the *system*, not the user |
| Bot bubble | white / `#171F2C` | `--app-surface` / `--app-border` |
| Error bubble | `red-50` / `red-700` | Red 10 `#FAEBEC` + Red 80 `#811821` text (light); Red 100 `#350D11` + Red 30 `#EBA8AD` (dark) |
| Quick chips | purple hover border | `--app-accent` hover border, `--app-accent-text` label |
| Card badges | `#7A66F6`/10 | `--app-accent-surface` |
| Voice orb core | `indigo → #7A66F6 → pink` | `#0BDA51 → #1FBF8A → #0B8793` |
| Orb rings / glow | `purple-500/25`, `#7A66F6`/20 | `#1FBF8A`/25, `#0BDA51`/20 |
| Sound-wave bars | `#7A66F6 → pink-400` | `#0BDA51 → #1FBF8A` |
| Status pill | purple tint | `--app-accent-surface` + `--app-accent-text` |
| Typing dots | `slate-300/600` | `--app-text-muted` |
| Mic active state | `#7A66F6` fill | `#0BDA51` fill, `#292929` icon |
| `font-mono` timestamps/status | Geist Mono | Source Sans 3 12/16 (the book defines no mono face) |
| Copy | "Type your message…", greeting | curly apostrophes / em dashes per §18 |

Also: the sparkle icon's `fill-yellow-300` goes — amber is warning-only.

**Verify:** all nine assistant states (closed, open-empty, sending, replied, with cards, error,
voice-listening, voice-processing, mic-muted) × light/dark.

---

### Phase 3 — shared primitives sweep *(next)*

Extract the patterns that phases 1–2 settle (card, table row, badge, chip, modal shell, empty state,
stat tile) into `components/ui/*` so phase 4 is substitution rather than re-decision. This is the step
that stops the other 57 files from re-inventing a palette.

---

### Phase 4 — feature areas *(separate effort, sequenced)*

57 files, ~1,800 hex literals. Suggested order by user-facing weight:

1. `overview` (4 files) — first screen after login
2. `screens` + `screen-groups` (9)
3. `playlists` (10) — highest complexity, includes `preview-canvas`
4. `schedules` (5)
5. `media` (5)
6. `alerts` + `sensor-rules` (8) — heaviest functional-color usage, needs §6 discipline
7. `analytics` + `reports` (8) — **chart palettes**: build series from Green→Teal→Blue plus Cool Gray
   steps; red/amber only for threshold breaches
8. `activity-log` + `support` (6)

---

## 7. Verification checklist

- [ ] Every text/background pair in changed files appears in §9's ✅ table, or measures ≥ 4.5:1
- [ ] No green text on any light surface (§4.1)
- [ ] No red or amber used decoratively; none adjacent to green except the resolved badge case
- [ ] Exactly one neutral mood in use — grep for warm-gray values returns nothing
- [ ] No gradient leaves Green–Teal–Blue; no gradient spans > 4 tonal steps; no warm-gray gradient
- [ ] Type sizes come from `12/14/16/20/24/32/42/48/60/84` with §13 line heights
- [ ] Sora for headings/buttons, Source Sans 3 for body/UI; no Geist in the agent portal
- [ ] Headlines have positive tracking, never `tracking-tight`
- [ ] Body copy flush left everywhere
- [ ] UI copy uses `’ “ ” —`, not `' " -`
- [ ] Light + dark verified for every changed component
- [ ] `npm run build` and `npm run lint` clean

---

## 8. Verification results (phases 0–2)

Measured in-browser with a canvas-based contrast audit that resolves `oklab`, `color-mix` and
stacked alpha correctly, over the live rendered DOM:

| Scope | Theme | Text nodes | Failures | Min ratio | Sub-12px |
| --- | --- | --- | --- | --- | --- |
| Shell + assistant (open) | light | 50 | **0** | 5.11:1 | 0 |
| Shell + assistant (open) | dark | 50 | **0** | 5.11:1 | 0 |
| Assistant — chat, voice, error states | light | 13 | **0** | 5.76:1 | 0 |
| Assistant — chat, voice, error states | dark | 13 | **0** | 6.61:1 | 0 |

Also confirmed: no `#7A66F6`, `#2859D9`, `#6F96FF` or `#FF2244` survives anywhere in the rendered
portal; body renders in Source Sans 3 and headings in Sora; `npm run build` compiles and the changed
files lint clean apart from two pre-existing `<img>` warnings.

Three defects were found *by the audit rather than by eye*, and all three were fixed at the token
layer rather than patched per-component: dark muted text on raised surfaces (4.04:1), the invisible
green active-indicator bar (1.78:1), and the assistant header subtitle at 80% alpha over the teal end
of the gradient (4.32:1).

---

## 9. Decisions taken

You said no preference, so I applied the recommendations below. Any of them is cheap to reverse.

| # | Question | Applied |
| --- | --- | --- |
| 1 | Alert badge next to a green active row | **Always red** (`--app-danger`). A count badge is system feedback; hiding severity is worse than the adjacency. |
| 2 | 9–11px chrome text vs the 12px floor | **Raised to 12px.** The audit confirms zero sub-12px text nodes remain. |
| 3 | Admin portal | **Not touched.** `font-sans` resolves per-portal via `--app-font-sans`, so admin still renders Geist and its own palette. |
| 4 | Green for user chat bubbles | **Reserved for the assistant.** User bubbles are neutral (`--app-bubble-user`). |
| 5 | Logo asset | **Left as `/reds-xos-logo.png`** — see the open question below. |

### Still open

**The logo files disagree with the brand book.** `reds logo/REDS Logo.svg`, `REDS Logo TM.svg` and
`public/reds-tag.svg` are drawn in `#03E55E` / `#5DBB54`, not the hero `#0BDA51`. That is a
different green, not a rounding difference. I have not changed any logo asset. Which is
authoritative — the book's `#0BDA51`, or the SVGs?

## 10. Original decision list (for reference)

| # | Question | My recommendation |
| --- | --- | --- |
| 1 | Alert badge next to a green active row (§4.5) — always red, or red only for unacknowledged criticals? | **(a) always red.** A count badge *is* system feedback; the adjacency is unavoidable in a sidebar and the alternative hides severity. |
| 2 | The 9–11px chrome text vs the 12px scale floor (§4.6) | **Raise to 12px.** The book is explicit that the scale starts at 12pt, and the portal is dense enough that 10px labels are already marginal. Expect ~5% vertical growth in the sidebar footer and badges. |
| 3 | Does the **admin** portal (`components/admin/*`, blue-themed, 20+ files) get the same treatment? | Not in this pass — but phase 0's token layer is portal-agnostic, so it's ready when you are. |
| 4 | Green as the user's chat-bubble color, or reserved for the assistant? | **Reserve green for the assistant.** User bubbles go brand black. Green is the product's voice, not the operator's. |
| 5 | Is `public/reds-xos-logo.png` the current mark, or should the shell move to `reds logo/REDS Logo TM.svg`? | Move to the SVG — it scales for the collapsed 24px sidebar state and carries the ™ the book shows on all three lockups. |

---

## 11. Effort

| Phase | Files | Estimate |
| --- | --- | --- |
| 0 — tokens + fonts | 2 | ~1h |
| 1 — shell | 3 | ~2–3h |
| 2 — assistant | 1 | ~2–3h |
| 3 — primitives | ~8 new | ~3–4h |
| **In-scope total** | **~14** | **~8–11h** |
| 4 — feature areas | 57 | ~3–5 days, phased |
