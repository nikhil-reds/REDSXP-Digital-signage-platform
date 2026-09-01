import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// docs/skeleton-loading-plan.md §5 phase E — stop the next hand-rolled skeleton
// at the build instead of at review.
//
// Two signatures, because a hand-rolled skeleton takes two shapes: the pulse and
// the grey fill on one element, or the pulse on a wrapper with the fill on its
// children. The pulse alone is NOT banned — it is also legitimate live state
// (voice indicator, schedule conflict warning, the alert bar in device-detail),
// and those all use brand or functional colours rather than a neutral fill.
const PULSE = "/animate-pulse/";
const NEUTRAL_FILL = "/bg-(app-surface-alt|zinc-|gray-|slate-|neutral-)/";
const RAW_GREY = "/bg-(zinc|gray|slate|neutral)-[0-9]/";

const SKELETON_MESSAGE =
  "Hand-rolled skeleton. Use the primitives in components/ui/skeleton.tsx " +
  "(Skeleton, SkeletonTable, SkeletonStatGrid, SkeletonCardGrid, SkeletonChart, PageSkeleton) " +
  "so geometry, fill token and reduced-motion behaviour stay consistent. " +
  "See docs/skeleton-loading-plan.md.";

const GREY_MESSAGE =
  "Raw neutral palette. Use the --app-* tokens (bg-app-surface / -surface-alt / " +
  "bg-app-border), per the rules at the top of components/ui/index.ts. If this is " +
  "a loading placeholder, use components/ui/skeleton.tsx instead.";

const SKELETON_SELECTORS = [
  { selector: `Literal[value=${PULSE}][value=${NEUTRAL_FILL}]`, message: SKELETON_MESSAGE },
  {
    selector: `TemplateElement[value.raw=${PULSE}][value.raw=${NEUTRAL_FILL}]`,
    message: SKELETON_MESSAGE,
  },
];

// Catches the pulse-on-wrapper, fill-on-children variant too, since any
// skeleton needs a grey fill somewhere.
const RAW_GREY_SELECTORS = [
  { selector: `Literal[value=${RAW_GREY}]`, message: GREY_MESSAGE },
  { selector: `TemplateElement[value.raw=${RAW_GREY}]`, message: GREY_MESSAGE },
];

// Pre-dating the token migration. Grandfathered so the gate protects new code
// without a 54-occurrence sweep landing inside the skeleton work; converting
// these is the separate token-migration task. They still get the skeleton gate.
const RAW_GREY_BACKLOG = [
  "app/(admin)/admin/users/page.tsx",
  "components/admin/announcements/announcement-form.tsx",
  "components/admin/announcements/announcements-table.tsx",
  "components/admin/billing/invoices-table.tsx",
  "components/admin/devices/devices-list.tsx",
  "components/admin/health/incidents-deployments.tsx",
  "components/admin/plans/admin-users.tsx",
  // Ported from the RBAC/tripti branch, which was cut before the token system
  // existed. The two /admin/roles files are converted; the agent mirror still
  // needs the same treatment.
  "components/agent/roles/tenant-role-manager.tsx",
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["app/**/*.tsx", "components/**/*.tsx"],
    ignores: ["components/ui/skeleton.tsx", ...RAW_GREY_BACKLOG],
    // Flat config REPLACES a rule's options rather than merging them, so every
    // selector for a given file has to arrive in one array.
    rules: {
      "no-restricted-syntax": ["error", ...SKELETON_SELECTORS, ...RAW_GREY_SELECTORS],
    },
  },
  {
    files: RAW_GREY_BACKLOG,
    rules: {
      "no-restricted-syntax": ["error", ...SKELETON_SELECTORS],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
