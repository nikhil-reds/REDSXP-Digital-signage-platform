import React from "react";
import PlaylistEditorSkeleton from "@/components/agent/playlists/playlist-editor-skeleton";

/**
 * Route-level fallback (plan tier 1). The editor is full-screen chrome rather
 * than a PageShell route, so it uses its own skeleton — and this overrides the
 * table-shaped skeleton inherited from `playlists/loading.tsx`.
 */
export default function Loading() {
  return <PlaylistEditorSkeleton />;
}
