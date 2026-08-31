# REDS agent panel UI/UX modification plan

Status: implementation guide and delivery checklist  
Scope: `/agent` shell, all agent pages, shared agent components, and the floating assistant  
Source of truth: `REDS_Brand Book_R2 (1).pdf` (17 pages), reviewed as visual brand reference only

## 1. Goal

Turn the agent panel into one coherent REDS operations product: green-led, high-contrast, calm, dense
enough for daily monitoring, and consistent across light and dark themes. The rebrand is not a simple
hex swap. It requires a token layer, a fixed type hierarchy, shared UI primitives, predictable page
layouts, and explicit interaction and accessibility rules.

Success means an operator can move between Overview, Screens, Playlists, Schedules, Alerts, Analytics,
Reports, Activity Log, and Support without relearning the interface.

## 2. Brand rules to apply

### 2.1 Color hierarchy

Use **Cool Gray** as the agent panel's only neutral family. Do not mix Cool and Warm Gray in the same
application.

| Role | Light theme | Dark theme | Usage |
| --- | --- | --- | --- |
| Canvas | `#F6F6F3` | `#212121` | Page background |
| Primary surface | `#FFFFFF` | `#292929` | Cards, sidebar, navbar, modals |
| Raised/nested surface | Cool 10 | Cool 90 `#333538` | Filters, nested rows, hover surfaces |
| Border | Cool 20 `#E1E1E0` | Cool 80 `#474B52` | Card and control borders |
| Primary text | Black `#292929` | Off-white `#F6F6F3` | Titles and body copy |
| Muted text | Cool 70 `#5B616B` | Cool 40 `#ACAFB4` | Descriptions, metadata, placeholders |
| Hero accent | Green 60 `#0BDA51` | Green 60 `#0BDA51` | Primary fills, progress, brand moments |
| Accent surface | Green 10 `#E7FEEF` | Cool 90 `#333538` | Selected rows and informational chips |
| Safe green text/focus | Green 80 `#06792D` | Green 60 `#0BDA51` | Links, icons, focus rings, thin indicators |
| Error | Red 60 `#D32735` | Red family | Errors and critical system feedback only |
| Warning | Amber 60 `#E5A015` | Amber family | Warnings and degraded states only |
| Secondary series | Teal `#1FBF8A` | Teal `#1FBF8A` | Charts and approved gradients |
| Tertiary series | Blue `#0B8793` | Blue `#0B8793` | Charts and approved gradients only |

Rules:

- Green 60 is the hero, but **must not be body text on a light surface**; it is only 1.74:1 on
  off-white. Use Green 80 for light-theme green text, icons, focus rings, and thin bars.
- Primary green buttons use Green 60 with Black text, not white text.
- Red and amber communicate system state only. Never use them decoratively.
- Remove purple, violet, indigo, orange, rose, and off-brand blue/emerald from product chrome.
- Approved gradients stay inside Green -> Teal -> Blue, use two or three stops, and never include
  red, amber, purple, or a neutral gray.
- Customer content inside the playlist preview canvas may use arbitrary colors; the surrounding
  editor chrome may not.

### 2.2 Typography

| UI role | Font | Size / line height | Weight |
| --- | --- | --- | --- |
| Page title / panel title | Sora | 24/32 | 600 |
| Widget title / navbar title | Sora | 20/26 | 600 |
| Button label / lead | Sora | 16/22 | 600 |
| Body, table cells, controls | Source Sans 3 | 14/18 | 400 or 600 |
| Caption, badge, timestamp, metadata | Source Sans 3 | 12/16 | 400 or 600 |
| KPI value | Sora | 32/40 | 600 |

Additional rules:

- Sora is for headings and buttons; Source Sans 3 is for body and UI.
- The smallest permitted UI text is 12px. Remove all 6-11px arbitrary text sizes.
- Headings use slight positive tracking (`0.01em`), never tight or negative tracking.
- Keep body copy flush left. Use curly apostrophes and quotation marks, and use an em dash for
  parenthetical breaks.

## 3. UX system for every page

### 3.1 Page anatomy

Every standard page follows the same sequence:

1. Persistent sidebar and 64px navbar.
2. Page wrapper with `32px` horizontal and `24px` vertical padding.
3. Header row with page title, one-line description, and primary action.
4. Optional KPI row.
5. Filter/search toolbar.
6. Main content in panels, widgets, tables, or a split view.
7. Loading, empty, error, and success feedback in the content region - never as layout-shifting
   one-off blocks.

At widths below 1024px, grids reduce columns and action groups wrap. At mobile widths, the sidebar
must become an overlay/drawer instead of consuming 80px of the viewport; tables must either scroll
horizontally with a visible affordance or switch to a row-card representation.

### 3.2 Shared component contract

Use `components/ui/*` rather than recreating class strings in feature files.

| Primitive | Standard |
| --- | --- |
| `Card` | Panel/widget/row sizes; border-led with no resting shadow |
| `Button`, `IconButton` | Primary, secondary, ghost, danger; visible focus state |
| `StatTile` | Neutral icon chip; semantic color only for genuine status |
| `TableCard`, `Th`, `Td`, `Tr` | One header, row, hover, selection, and empty-state treatment |
| `Toolbar`, `SearchInput`, `Select` | One height, radius, label, focus, and disabled treatment |
| `Badge`, `StatusDot`, `ProgressBar` | Accent/warning/danger/neutral semantic tones only |
| `Modal`, `Drawer` | Shared backdrop, title row, close behavior, focus management, and motion |
| `ChartCard` | Green/Teal/Blue/Cool series with semantic red/amber thresholds |
| `PageShell`, `SectionHeader`, `EmptyState` | Consistent page rhythm and fallback states |

Resting cards use a border and no shadow. Shadows are reserved for menus, dialogs, and drawers.
Clickable cards need hover, focus-visible, selected, disabled, and keyboard activation states.

### 3.3 Interaction and accessibility

- Minimum text contrast: 4.5:1; large text: 3:1; controls and focus indicators: 3:1.
- All icon-only buttons require an accessible name and a tooltip where the icon is ambiguous.
- Every form control needs a persistent label; placeholder text is not a label.
- Modals trap focus, close on Escape, restore focus to the trigger, and do not close while a critical
  save/publish step is running unless explicitly confirmed.
- Loading actions keep their width and replace the label with a spinner plus status text.
- Destructive actions require clear wording and confirmation when recovery is not possible.
- Respect `prefers-reduced-motion`; use 150-200ms motion for overlays and state changes.
- Do not communicate status by color alone. Pair color with an icon and text label.

## 4. Page-by-page modification guide

| Area | Files / components | Required UX and visual changes | Priority |
| --- | --- | --- | --- |
| Global shell | `app/(agent)/agent/layout.tsx`, `agent-sidebar.tsx`, `agent-navbar.tsx` | Finish responsive sidebar behavior; keep selected navigation on Green 10 + Green 80 indicator in light mode; unify search, region, notifications, theme controls, and account actions; verify logo asset against the authoritative green. | P0 |
| Overview | `agent/page.tsx`, `components/agent/overview/*` | Use the reference layout for all pages: page header, neutral KPI tiles, operational charts, current schedules, and activity. Charts use Green/Teal/Blue; red/amber appear only at breached thresholds. | P0 / pilot |
| Screens | `agent/screens/page.tsx`, `components/agent/screens/*` | Standardize KPI row and toolbar; make table/map toggle obvious; unify device state labels; migrate create modal and detail drawer; preserve player installation/download feedback; add responsive table behavior. | P0 |
| Screen Groups | `agent/screen-groups/page.tsx`, `components/agent/screen-groups/*` | Align grid/table cards, search, view switch, selected state, and edit modal with shared primitives; expose screen count and health without decorative colors. | P1 |
| Media Library | `agent/media/page.tsx`, `components/agent/media/*` | Keep storage usage, filters, grid/table switch, preview drawer, and upload modal in one hierarchy; standardize upload progress, validation, failure, and retry states; keep thumbnails visually dominant. | P1 |
| Playlists | `agent/playlists/*`, `components/agent/playlists/*` | Migrate list and editor chrome; standardize asset panel, timeline, inspector, toolbar, display modal, and publish progress. Keep customer canvas colors exempt but use REDS tokens around it. Validate keyboard use and unsaved-change protection. | P0 / highest complexity |
| Schedules | `agent/schedules/page.tsx`, `components/agent/schedules/*` | Migrate calendar, time picker, schedule modal, and conflict dialog. Define clear scheduled/active/conflict/disabled states with labels and patterns, not color alone. Preserve calendar density at the 12px text floor. | P0 |
| Sensor Rules | `agent/sensor-rules/page.tsx`, `components/agent/sensor-rules/*` | Convert rules list, trends, and form modal to shared primitives; distinguish enabled, triggered, warning, error, and disabled states; remove decorative hue assignments. | P1 |
| Alerts | `agent/alerts/page.tsx`, `components/agent/alerts/*` | Make severity, acknowledgement, ownership, and resolution the hierarchy. Replace off-brand red/amber values, migrate filters/table/action modal, and ensure critical actions are explicit and keyboard accessible. | P0 |
| Analytics | `agent/analytics/page.tsx`, `components/agent/analytics/*` | Standardize date range, segmented controls, KPI cards, legends, axes, tooltips, empty/no-data states, and export. Use Green/Teal/Blue/Cool series; reserve red/amber for thresholds. | P1 |
| Reports | `agent/reports/page.tsx`, `components/agent/reports/*` | Unify configurator, generation progress, recent reports, download/error states, and responsive split layout. Long-running generation needs persistent status and retry guidance. | P1 |
| Activity Log | `agent/activity-log/page.tsx`, `components/agent/activity-log/*` | Migrate toolbar and feed; standardize actor/action/object/time hierarchy; make export and clear-history actions visually distinct; require confirmation before clearing. | P1 |
| Help & Support | `agent/support/page.tsx`, `components/agent/support/*` | Migrate filters, ticket list, create modal, and chat. Reuse assistant bubble/status tokens; preserve readable long messages, attachments, sending, failed-send, and reconnect states. | P1 |
| Floating assistant | `components/chatbot/floating-chatbot-widget.tsx` | Keep launcher/header in approved green-led styling; user bubbles neutral, assistant identity green; approved Green-Teal-Blue voice gradient only; verify all closed/open/loading/error/voice states in both themes. | P0 |

## 5. Delivery phases

### Phase 0 - freeze the rules

- Confirm the authoritative logo green: the PDF uses `#0BDA51`, while some repository logo assets use
  different greens.
- Approve Cool Gray as the single agent-panel neutral family.
- Approve Green 80 as the light-theme green text/focus value.
- Record the playlist customer-content exemption.

Exit: token and logo decisions are signed off; no feature work depends on an unresolved color choice.

### Phase 1 - foundation and shell

- Finalize raw brand tokens and semantic `--app-*` aliases in `app/globals.css`.
- Register Sora and Source Sans 3 in `app/layout.tsx` and scope them to `.agent-portal`.
- Finish sidebar, navbar, page shell, assistant, dark theme, and responsive navigation.
- Add or finish the shared primitives in `components/ui/*`.

Exit: the component gallery covers every state in both themes and passes contrast checks.

### Phase 2 - pilot

- Complete Overview end to end.
- Use it to settle page spacing, KPI, card, chart, table, empty, loading, and error patterns.
- Correct primitive APIs before other pages copy them.

Exit: Overview is production-ready at desktop, tablet, and mobile widths.

### Phase 3 - operational core

- Complete Screens, Screen Groups, Playlists, Schedules, and Media.
- Test destructive actions, uploads, publishing, conflicts, drawers, modals, and long-running progress.

Exit: the core signage workflow can be completed without legacy visual styles.

### Phase 4 - monitoring and support

- Complete Alerts, Sensor Rules, Analytics, Reports, Activity Log, and Support.
- Standardize chart colors and system statuses across the whole panel.

Exit: every `/agent` route uses the shared UI system.

### Phase 5 - regression protection

- Add lint/audit rules that reject raw hex values, arbitrary pixel text sizes, and non-brand Tailwind
  hues in agent chrome.
- Add automated contrast checks for representative routes in light and dark modes.
- Add screenshot checks at 1440px, 1024px, 768px, and 390px widths.
- Run build, lint, keyboard, reduced-motion, loading, empty, error, and overflow checks.

Exit: future changes cannot silently reintroduce the old palette or off-scale typography.

## 6. Current repository baseline

The rebrand is already partially implemented. The token layer, shell, assistant styling, shared
`components/ui/*` primitives, and several feature pages have been started. This plan should therefore
be executed as a **migration completion**, not as a greenfield redesign.

Audit snapshot taken 2026-08-31:

- 13 agent routes exist, including the playlist editor.
- 27 scanned TSX files still contain measurable styling debt.
- 518 raw six-digit hex occurrences remain in the scanned agent scope.
- 186 arbitrary `text-[...]` occurrences remain.
- 138 legacy non-brand hue utility occurrences remain.
- The largest remaining debt is in schedule, sensor-rule, alert, support, analytics, and report
  dialogs/components.

Do not replace or discard unrelated existing work. Migrate one area at a time and keep behavior/API
logic unchanged unless a UX fix explicitly requires a behavioral change.

## 7. Definition of done

For each migrated area:

- [ ] Uses shared primitives for cards, controls, statuses, overlays, and page structure.
- [ ] Contains no raw product-chrome hex colors and no banned Tailwind hues.
- [ ] Contains no arbitrary text below the 12px floor.
- [ ] Passes contrast in light and dark themes.
- [ ] Has loading, empty, error, disabled, success, and permission-denied states where applicable.
- [ ] Works by keyboard and exposes visible focus.
- [ ] Handles long labels, large values, empty tables, and narrow widths without clipping.
- [ ] Uses semantic status color plus text/icon, never color alone.
- [ ] Keeps feature logic, API calls, and data behavior intact.
- [ ] Passes targeted lint and type checks; the complete project passes `npm run build`.

For final sign-off:

- [ ] All 13 agent routes reviewed at desktop, tablet, and mobile widths.
- [ ] Light, dark, and system themes verified.
- [ ] No purple/red/yellow gradient or mixed neutral family remains in agent chrome.
- [ ] Sora and Source Sans 3 render correctly without layout shift.
- [ ] Logo color authority is resolved and all logo assets match it.
- [ ] A final automated debt scan reports zero unexplained violations.

## 8. Recommended execution order and effort

| Order | Workstream | Estimate |
| --- | --- | --- |
| 1 | Decisions, tokens, shell, responsive navigation, primitive gallery | 1-1.5 days |
| 2 | Overview pilot | 0.5 day |
| 3 | Screens + Screen Groups | 1 day |
| 4 | Playlists | 1-1.5 days |
| 5 | Schedules + Media | 1-1.5 days |
| 6 | Alerts + Sensor Rules | 1 day |
| 7 | Analytics + Reports | 1 day |
| 8 | Activity Log + Support | 0.5-1 day |
| 9 | Cross-theme, responsive, accessibility, lint, and visual regression QA | 1 day |

Expected completion: approximately **8-10 engineering days** for one developer, assuming no major
behavioral redesign and that the existing partial migration is retained.

