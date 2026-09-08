import React from "react";
import { cn } from "@/lib/cn";
import { Card } from "./card";

/**
 * Loading skeletons. See docs/skeleton-loading-plan.md for the contract.
 *
 * Two rules do all the work here:
 *
 *   1. Geometry mirrors the real component. A skeleton row is the same height,
 *      with the same cell padding, as the row it stands in for — otherwise it
 *      is a layout shift dressed up as polish, and the page moves twice.
 *   2. A skeleton is for a FIRST load only (`isLoading && data.length === 0`).
 *      On refetch — filter, search, paginate, refresh — keep the rows on screen
 *      and spin the refresh control instead. Plan §2, tier 3.
 *
 * Fill is `bg-app-border`, not `bg-app-surface-alt`: in the light theme
 * surface-alt is #f3f2f2 against a #ffffff surface, which is invisible. Border
 * is Cool 20 on light and Cool 80 on dark — a visible neutral block on
 * `bg-app-surface` in both themes.
 *
 * Motion is Tailwind's `animate-pulse`, which ends on opacity 1, so the
 * `prefers-reduced-motion` block in globals.css flattens it to a static block
 * that is still visible rather than one that fades out invisible.
 */

/** Base block. Size it with `className` — `h-*`/`w-*`. */
export function Skeleton({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-app-border", className)}
      {...rest}
    />
  );
}

/**
 * Wraps a loading region so assistive tech gets one announcement instead of one
 * per block. Every composite below renders this.
 */
export function SkeletonRegion({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

/** Stacked text lines. The last line runs short, the way a paragraph does. */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn("h-3", index === lines - 1 ? "w-3/5" : "w-full")}
        />
      ))}
    </div>
  );
}

/** Avatar / status bubble. `admin/users` initials chip is h-9 w-9. */
export function SkeletonCircle({ className }: { className?: string }) {
  return <Skeleton className={cn("h-9 w-9 rounded-full", className)} />;
}

// Cells get varied widths so a table skeleton doesn't read as graph paper.
// Deterministic by index — Math.random() here would break hydration.
const CELL_WIDTHS = ["w-32", "w-20", "w-24", "w-16", "w-28", "w-24", "w-20", "w-28"];

/**
 * `<tr>` rows to drop straight into an existing `<tbody>`, so the real
 * `<thead>` keeps defining the column widths.
 *
 * `padding` must match the table being stood in for: the `Td` primitive in
 * table-card.tsx is `px-5 py-3`; the admin tables are hand-rolled at `p-4`
 * (users) and `p-3.5` (tenants).
 */
export function SkeletonRows({
  rows = 5,
  cols = 4,
  padding = "px-5 py-3",
}: {
  rows?: number;
  cols?: number;
  padding?: string;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-app-border last:border-b-0">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <td key={colIndex} className={cn(padding, "align-middle")}>
              <Skeleton className={cn("h-3.5", CELL_WIDTHS[colIndex % CELL_WIDTHS.length])} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/** Standalone table skeleton — header bar included. For whole-region swaps. */
export function SkeletonTable({
  rows = 5,
  cols = 4,
  padding = "px-5 py-3",
  label = "Loading table…",
  className,
}: {
  rows?: number;
  cols?: number;
  padding?: string;
  label?: string;
  className?: string;
}) {
  return (
    <SkeletonRegion label={label} className={className}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-app-border bg-app-surface-alt">
            {Array.from({ length: cols }).map((_, index) => (
              <th key={index} className={padding}>
                <Skeleton className="h-3 w-16" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <SkeletonRows rows={rows} cols={cols} padding={padding} />
        </tbody>
      </table>
    </SkeletonRegion>
  );
}

/**
 * Mirrors `StatGrid` + `StatTile`: widget card at `p-4`, caption label, icon
 * chip (p-1.5 around a w-4 h-4 → 28px), then the h4 value at `mt-3`.
 */
export function SkeletonStatGrid({
  columns = 4,
  label = "Loading statistics…",
  className,
}: {
  columns?: 2 | 3 | 4 | 5;
  label?: string;
  className?: string;
}) {
  const cols: Record<number, string> = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
    5: "sm:grid-cols-2 lg:grid-cols-5",
  };
  return (
    <SkeletonRegion label={label} className={className}>
      <div className={cn("grid grid-cols-1 gap-4", cols[columns])}>
        {Array.from({ length: columns }).map((_, index) => (
          <Card key={index} size="widget" padded className="flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-7 rounded-lg" />
            </div>
            <div className="mt-3">
              <Skeleton className="h-7 w-20" />
            </div>
          </Card>
        ))}
      </div>
    </SkeletonRegion>
  );
}

/** Media grid / playlist cards: thumbnail over a title and a caption line. */
export function SkeletonCardGrid({
  count = 8,
  columns = 4,
  label = "Loading items…",
  className,
}: {
  count?: number;
  columns?: 2 | 3 | 4;
  label?: string;
  className?: string;
}) {
  const cols: Record<number, string> = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  };
  return (
    <SkeletonRegion label={label} className={className}>
      <div className={cn("grid grid-cols-1 gap-4", cols[columns])}>
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} size="widget" padded>
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="mt-3 h-3.5 w-3/4" />
            <Skeleton className="mt-2 h-3 w-1/2" />
          </Card>
        ))}
      </div>
    </SkeletonRegion>
  );
}

/**
 * Chart panel. Bars of varied height read as a chart rather than a grey slab,
 * which matters because this is also the `next/dynamic` fallback for charts
 * that take a moment to load.
 */
const BAR_HEIGHTS = ["h-16", "h-28", "h-20", "h-36", "h-24", "h-32", "h-20", "h-28"];

export function SkeletonChart({
  bars = 8,
  label = "Loading chart…",
  className,
}: {
  bars?: number;
  label?: string;
  className?: string;
}) {
  return (
    <SkeletonRegion label={label}>
      <Card size="panel" padded className={cn("flex flex-col", className)}>
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-2 h-3 w-56" />
        <div className="mt-6 flex flex-1 items-end gap-3">
          {Array.from({ length: bars }).map((_, index) => (
            <Skeleton
              key={index}
              className={cn("flex-1 rounded-t-md", BAR_HEIGHTS[index % BAR_HEIGHTS.length])}
            />
          ))}
        </div>
        <Skeleton className="mt-3 h-px w-full rounded-none" />
      </Card>
    </SkeletonRegion>
  );
}

/**
 * Whole-route skeleton for `loading.tsx`. Three variants cover all 25 routes —
 * the point being that route-level skeletons stay cheap to add.
 *
 * Renders inside the portal layout, so the sidebar and navbar stay put: both
 * layouts are static and never re-render on navigation.
 */
export function PageSkeleton({
  variant = "table",
  label = "Loading page…",
}: {
  variant?: "table" | "grid" | "dashboard";
  label?: string;
}) {
  return (
    <SkeletonRegion label={label} className="space-y-6 px-8 py-6">
      {/* Page heading + primary action */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-3.5 w-80" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      {variant === "dashboard" && (
        <>
          <SkeletonStatGrid columns={4} label="Loading statistics…" />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <SkeletonChart className="h-80" />
            <SkeletonChart className="h-80" />
          </div>
        </>
      )}

      {variant !== "dashboard" && (
        <>
          {/* Toolbar: search + filters */}
          <Card size="panel" padded className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-9 flex-1 rounded-lg" style={{ minWidth: "200px" }} />
            <Skeleton className="h-9 w-32 rounded-lg" />
            <Skeleton className="h-9 w-32 rounded-lg" />
          </Card>

          {variant === "table" ? (
            <Card size="panel" className="overflow-hidden">
              <SkeletonTable rows={6} cols={5} />
            </Card>
          ) : (
            <SkeletonCardGrid count={8} columns={4} />
          )}
        </>
      )}
    </SkeletonRegion>
  );
}
