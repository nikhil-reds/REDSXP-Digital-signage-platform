"use client";

import React from "react";
import PlaylistToolbar from "@/components/agent/playlists/playlist-toolbar";
import AssetLibraryPanel from "@/components/agent/playlists/asset-library-panel";
import PreviewCanvas from "@/components/agent/playlists/preview-canvas";
import PlaylistInspector from "@/components/agent/playlists/playlist-inspector";
import PlaylistTimeline from "@/components/agent/playlists/playlist-timeline";
import DisplayConfigModal from "@/components/agent/playlists/display-config-modal";
import { usePlaylistEditor } from "@/components/agent/playlists/use-playlist-editor";

export default function AgentPlaylistsPage() {
  const { onKeyDown, toolbar, library, preview, inspector, timeline, displayModal } = usePlaylistEditor();

  return (
    <div
      onKeyDown={onKeyDown}
      tabIndex={-1}
      className="h-screen flex flex-col overflow-hidden bg-[#F6F7F9] dark:bg-[#090D14] text-zinc-900 dark:text-zinc-100 outline-none relative"
    >
      <PlaylistToolbar {...toolbar} />

      <div className="flex-1 flex overflow-hidden min-h-0">
        <AssetLibraryPanel {...library} />
        <PreviewCanvas {...preview} />
        <PlaylistInspector {...inspector} />
      </div>

      <PlaylistTimeline {...timeline} />

      <DisplayConfigModal {...displayModal} />
    </div>
  );
}
