"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, Loader2, X } from "lucide-react";
import PlaylistToolbar from "@/components/agent/playlists/playlist-toolbar";
import AssetLibraryPanel from "@/components/agent/playlists/asset-library-panel";
import PreviewCanvas from "@/components/agent/playlists/preview-canvas";
import PlaylistInspector from "@/components/agent/playlists/playlist-inspector";
import PlaylistTimeline from "@/components/agent/playlists/playlist-timeline";
import DisplayConfigModal from "@/components/agent/playlists/display-config-modal";
import PublishProgressModal from "@/components/agent/playlists/publish-progress-modal";
import { usePlaylistEditor } from "@/components/agent/playlists/use-playlist-editor";

function PlaylistEditor() {
  const searchParams = useSearchParams();
  const playlistId = searchParams.get("id") ?? undefined;
  const { onKeyDown, loading, loadError, toolbar, library, preview, inspector, timeline, displayModal, publishModal } =
    usePlaylistEditor({ playlistId });
  const [dismissedError, setDismissedError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3 bg-[#F6F7F9] dark:bg-[#090D14] text-zinc-450">
        <Loader2 className="w-6 h-6 animate-spin" />
        <p className="text-xs font-semibold">Loading playlist editor…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3 bg-[#F6F7F9] dark:bg-[#090D14] text-center px-6">
        <AlertTriangle className="w-6 h-6 text-red-500" />
        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Couldn&apos;t load the playlist editor</p>
        <p className="text-xs text-zinc-450 max-w-sm">{loadError}</p>
        <Link href="/agent/playlists" className="text-xs font-bold text-[#2859D9] dark:text-[#6F96FF] hover:underline">
          Back to Playlists
        </Link>
      </div>
    );
  }

  const showSaveErrorBanner = !!toolbar.saveError && toolbar.saveError !== dismissedError && !publishModal.open;

  return (
    <div
      onKeyDown={onKeyDown}
      tabIndex={-1}
      className="h-screen flex flex-col overflow-hidden bg-[#F6F7F9] dark:bg-[#090D14] text-zinc-900 dark:text-zinc-100 outline-none relative"
    >
      <PlaylistToolbar {...toolbar} />

      {showSaveErrorBanner && (
        <div className="flex items-center justify-between gap-3 px-4 py-2 bg-red-50 dark:bg-red-950/20 border-b border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 text-xs font-semibold shrink-0">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            {toolbar.saveError}
          </span>
          <button
            onClick={() => setDismissedError(toolbar.saveError)}
            className="p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden min-h-0">
        <AssetLibraryPanel {...library} />
        <PreviewCanvas {...preview} />
        <PlaylistInspector {...inspector} />
      </div>

      <PlaylistTimeline {...timeline} />

      <DisplayConfigModal {...displayModal} />

      <PublishProgressModal {...publishModal} />
    </div>
  );
}

export default function AgentCreatePlaylistPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-[#F6F7F9] dark:bg-[#090D14] text-zinc-450">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      }
    >
      <PlaylistEditor />
    </Suspense>
  );
}
