"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, X, Workflow, MonitorPlay } from "lucide-react";
import PlaylistEditorSkeleton from "@/components/agent/playlists/playlist-editor-skeleton";
import PlaylistToolbar from "@/components/agent/playlists/playlist-toolbar";
import AssetLibraryPanel from "@/components/agent/playlists/asset-library-panel";
import PreviewCanvas from "@/components/agent/playlists/preview-canvas";
import FlowWorkspace from "@/components/agent/playlists/flow-workspace";
import PlaylistInspector from "@/components/agent/playlists/playlist-inspector";
import PlaylistTimeline from "@/components/agent/playlists/playlist-timeline";
import DisplayConfigModal from "@/components/agent/playlists/display-config-modal";
import PublishProgressModal from "@/components/agent/playlists/publish-progress-modal";
import { usePlaylistEditor } from "@/components/agent/playlists/use-playlist-editor";

function PlaylistEditor() {
  const searchParams = useSearchParams();
  const playlistId = searchParams.get("id") ?? undefined;
  const { onKeyDown, loading, loadError, toolbar, library, preview, inspector, timeline, displayModal, publishModal, flowItems, flowState, setFlowState } =
    usePlaylistEditor({ playlistId });
  const [dismissedError, setDismissedError] = useState<string | null>(null);
  const [flow, setFlow] = useState(false);
  useEffect(() => { if (flowState.sensors.length) setFlow(true); }, [flowState.sensors.length]);
  const [timelineCollapsed, setTimelineCollapsed] = useState(false);
  const [libraryCollapsed, setLibraryCollapsed] = useState(false);

  if (loading) {
    return <PlaylistEditorSkeleton />;
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

      <button className="flex items-center gap-2 text-sm px-4 py-2 text-app-accent-text text-left border-b border-app-border" onClick={() => setFlow(!flow)}>{flow ? <MonitorPlay size={18}/> : <Workflow size={18}/>}{flow ? 'Switch to playback preview' : 'Add sensor / open dynamic flow'}</button>
      <div className="flex gap-4 border-b border-app-border px-4 py-2 text-sm"><button aria-expanded={!libraryCollapsed} onClick={() => setLibraryCollapsed(v => !v)}>{libraryCollapsed ? 'Show' : 'Collapse'} media library</button><button aria-expanded={!timelineCollapsed} onClick={() => setTimelineCollapsed(v => !v)}>{timelineCollapsed ? 'Show' : 'Collapse'} timeline</button></div>
      <div className={flow ? 'flex flex-1 min-h-0' : 'hidden'}><FlowWorkspace items={flowItems} flow={flowState} setFlow={setFlowState} library={libraryCollapsed ? null : <AssetLibraryPanel {...library} />} inspector={<PlaylistInspector {...inspector} />} timelineCollapsed={timelineCollapsed} /></div>{!flow && <div className="flex-1 flex overflow-hidden min-h-0">
        {!libraryCollapsed && <AssetLibraryPanel {...library} />}
        <PreviewCanvas {...preview} />
        <PlaylistInspector {...inspector} />
      </div>}

      {!timelineCollapsed && <PlaylistTimeline {...timeline} />}

      <DisplayConfigModal {...displayModal} />

      <PublishProgressModal {...publishModal} />
    </div>
  );
}

export default function AgentCreatePlaylistPage() {
  return (
    <Suspense fallback={<PlaylistEditorSkeleton />}>
      <PlaylistEditor />
    </Suspense>
  );
}


