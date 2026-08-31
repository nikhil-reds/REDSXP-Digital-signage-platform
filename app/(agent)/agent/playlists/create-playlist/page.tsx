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
      <div className="h-screen flex flex-col items-center justify-center gap-3 bg-app-canvas text-app-muted">
        <Loader2 className="w-6 h-6 animate-spin" />
        <p className="text-body font-semibold">Loading playlist editor…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3 bg-app-canvas text-center px-6">
        <AlertTriangle className="w-6 h-6 text-app-danger-text" />
        <p className="font-heading text-h6 font-semibold tracking-headline text-app-text">Couldn&apos;t load the playlist editor</p>
        <p className="text-body text-app-muted max-w-sm">{loadError}</p>
        <Link href="/agent/playlists" className="text-body font-semibold text-app-accent-text hover:underline">
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
      className="h-screen flex flex-col overflow-hidden bg-app-canvas text-app-text outline-none relative"
    >
      <PlaylistToolbar {...toolbar} />

      {showSaveErrorBanner && (
        <div className="flex items-center justify-between gap-3 px-4 py-2 bg-app-danger-surface border-b border-app-danger/30 text-app-danger-text text-body font-semibold shrink-0">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            {toolbar.saveError}
          </span>
          <button
            onClick={() => setDismissedError(toolbar.saveError)}
            className="p-0.5 rounded hover:bg-app-surface-alt cursor-pointer"
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
        <div className="h-screen flex items-center justify-center bg-app-canvas text-app-muted">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      }
    >
      <PlaylistEditor />
    </Suspense>
  );
}
