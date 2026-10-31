"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, X } from "lucide-react";
import "@/components/agent/playlists/editor-responsive.css";
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
  const { onKeyDown, loading, loadError, toolbar, library, preview, inspector, timeline, displayModal, publishModal, flowItems, flowState, setFlowState, selectClip } =
    usePlaylistEditor({ playlistId });
  const [dismissedError, setDismissedError] = useState<string | null>(null);
  const [flowChoice, setFlow] = useState<boolean | null>(null);
  const flow = flowChoice ?? flowState.sensors.length > 0;
  const [timelineOpen, setTimelineOpen] = useState<boolean | null>(null);
  const [panel, setPanel] = useState("canvas");
  const [inspectorCollapsed, setInspectorCollapsed] = useState(false);
  const [timelineHeight, setTimelineHeight] = useState(240);
  const editorRef = useRef<HTMLDivElement>(null);
  const [hasTimelineSpace, setHasTimelineSpace] = useState(true);
  const timelineVisible = timelineOpen ?? hasTimelineSpace;
  useEffect(() => {
    if (!editorRef.current) return;
    const observer = new ResizeObserver(([entry]) => setHasTimelineSpace(entry.contentRect.height > 580));
    observer.observe(editorRef.current);
    return () => observer.disconnect();
  }, [loading]);
  const [libraryCollapsed, setLibraryCollapsed] = useState(false);

  if (loading) {
    return <PlaylistEditorSkeleton />;
  }

  if (loadError) {
    return (
      <div className="h-full min-h-0 flex flex-col items-center justify-center gap-3 bg-app-canvas text-center px-6">
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
      ref={editorRef}
      onKeyDown={(event) => {
        if ((event.target as HTMLElement).closest("button, a, summary") && [" ", "Enter", "Delete", "Backspace"].includes(event.key)) return;
        onKeyDown(event);
      }}
      tabIndex={-1}
      data-panel={panel} data-library={libraryCollapsed ? "closed" : "open"} data-inspector={inspectorCollapsed ? "closed" : "open"} data-timeline={timelineVisible ? "open" : "closed"}
      style={{ "--timeline-height": `${timelineHeight}px` } as React.CSSProperties}
      className="playlist-editor h-full min-h-0 flex flex-col overflow-hidden bg-app-canvas text-app-text outline-none relative"
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

      <div className="editor-workspace-toolbar flex shrink-0 flex-wrap items-center gap-2 border-b border-app-border px-3 py-2 text-body">
        <div className="flex gap-1" role="group" aria-label="Workspace mode">
          <button aria-pressed={!flow} onClick={() => { setFlow(false); setPanel("canvas"); }}>Playback</button>
          <button aria-pressed={flow} onClick={() => { setFlow(true); setPanel("canvas"); }}>Flow</button>
        </div>
        <div className="editor-desktop-toggles flex flex-wrap gap-1">
          <button aria-expanded={!libraryCollapsed} onClick={() => setLibraryCollapsed(v => !v)}>Library</button>
          <button aria-expanded={!inspectorCollapsed} onClick={() => setInspectorCollapsed(v => !v)}>Inspector</button>
          <button aria-expanded={timelineVisible} onClick={() => setTimelineOpen(!timelineVisible)}>Timeline</button>
        </div>
        <div className="editor-panel-tabs" role="group" aria-label="Workspace panel">
          {["canvas", "library", "inspector", "timeline"].map(name => <button key={name} aria-pressed={panel === name} onClick={() => setPanel(name)}>{name === "canvas" ? "Workspace" : name[0].toUpperCase() + name.slice(1)}</button>)}
        </div>
      </div>
      <div className="editor-body flex min-h-0 min-w-0 flex-1 overflow-hidden">
        <div className={flow ? "flex min-h-0 min-w-0 flex-1" : "hidden"}>
          <FlowWorkspace items={flowItems} flow={flowState} setFlow={setFlowState}
            library={<div className="editor-library-panel"><AssetLibraryPanel {...library} /></div>}
            inspector={<PlaylistInspector {...inspector} />}
            selectedClipId={timeline.clips.find(clip => clip.selected)?.clip.instanceId}
            onSelectClip={(id) => { selectClip(id); setInspectorCollapsed(false); setPanel("inspector"); }}
            onInspect={() => { setInspectorCollapsed(false); setPanel("inspector"); }} />
        </div>
        <div className={!flow ? "editor-playback-workspace flex min-h-0 min-w-0 flex-1 overflow-hidden" : "hidden"}>
          <div className="editor-library-panel"><AssetLibraryPanel {...library} /></div>
          <PreviewCanvas {...preview} playing={!flow && preview.playing} />
          <div className="editor-inspector-panel"><PlaylistInspector {...inspector} /></div>
        </div>
      </div>
      <div className="editor-timeline-panel min-w-0 min-h-0 flex flex-col">
        <label className="editor-timeline-size flex items-center justify-end gap-2 px-3 text-caption text-app-muted">Timeline height
          <input aria-label="Timeline height" type="range" min="140" max="360" step="20" value={timelineHeight} onChange={event => setTimelineHeight(Number(event.target.value))} />
        </label>
        <PlaylistTimeline {...timeline} />
      </div>

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


