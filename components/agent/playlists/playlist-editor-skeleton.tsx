import React from "react";
import { Skeleton, SkeletonRegion } from "@/components/ui";

/**
 * Skeleton for the playlist editor. Not a list, so it gets none of the generic
 * shapes: it mirrors the editor's own chrome — toolbar, the three panes at their
 * real widths (library 300px, flexible preview, inspector 330px), and the
 * timeline strip.
 *
 * Used in three places that previously showed a bare spinner: the route-level
 * `loading.tsx`, the editor's own `loading` branch, and the `Suspense` fallback
 * that wraps it.
 */
export default function PlaylistEditorSkeleton() {
  return (
    <SkeletonRegion
      label="Loading playlist editor…"
      className="flex h-screen flex-col overflow-hidden bg-app-canvas"
    >
      {/* Toolbar */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-app-border bg-app-surface px-4 py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-4 w-[240px]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-[34px] w-24 rounded-lg" />
          <Skeleton className="h-[34px] w-24 rounded-lg" />
          <Skeleton className="h-[34px] w-28 rounded-lg" />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Asset library — 300px, matching asset-library-panel */}
        <div className="flex w-[300px] shrink-0 flex-col gap-3 border-r border-app-border bg-app-surface p-3">
          <Skeleton className="h-9 w-full rounded-lg" />
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-lg" />
          ))}
        </div>

        {/* Preview canvas */}
        <div className="flex flex-1 items-center justify-center p-6">
          <Skeleton className="aspect-video w-full max-w-3xl rounded-xl" />
        </div>

        {/* Inspector — 330px, matching playlist-inspector */}
        <div className="flex w-[330px] shrink-0 flex-col gap-4 border-l border-app-border bg-app-surface p-4">
          <Skeleton className="h-4 w-32" />
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-[30px] w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Timeline strip */}
      <div className="flex shrink-0 items-center gap-2 border-t border-app-border bg-app-surface p-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-24 shrink-0 rounded-lg" />
        ))}
      </div>
    </SkeletonRegion>
  );
}
