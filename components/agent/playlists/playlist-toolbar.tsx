"use client";

import React from "react";
import { Redo2, Save, Send, Undo2 } from "lucide-react";
import { Button, IconButton } from "@/components/ui";

interface ToolbarProps {
  playlistName: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  itemCount: number;
  totalLabel: string;
  dirty: boolean;
  saving: boolean;
  saveError: string | null;
  statusText: string;
  onUndo: () => void;
  onRedo: () => void;
  undoDisabled: boolean;
  redoDisabled: boolean;
  displayName: string;
  displayRes: string;
  displayAspect: string;
  dispIconW: number;
  dispIconH: number;
  onOpenDisplayConfig: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export default function PlaylistToolbar({
  playlistName,
  onNameChange,
  itemCount,
  totalLabel,
  dirty,
  saving,
  saveError,
  statusText,
  onUndo,
  onRedo,
  undoDisabled,
  redoDisabled,
  displayName,
  displayRes,
  displayAspect,
  dispIconW,
  dispIconH,
  onOpenDisplayConfig,
  onSaveDraft,
  onPublish,
}: ToolbarProps) {
  // Save state uses the status vocabulary: error red, unsaved amber, saved green.
  const statusClass = saveError
    ? "text-app-danger-text"
    : saving
      ? "text-app-muted"
      : dirty
        ? "text-app-warning-text"
        : "text-app-accent-text";

  return (
    <div className="h-14 border-b border-app-border bg-app-surface flex items-center justify-between px-4 shrink-0 z-10 font-sans gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-8 h-8 rounded-lg bg-app-accent text-app-accent-on font-heading font-semibold text-lead flex items-center justify-center shrink-0">
          R
        </span>

        <div className="flex flex-col min-w-0">
          <input
            type="text"
            value={playlistName}
            onChange={onNameChange}
            aria-label="Playlist name"
            className="text-body font-semibold text-app-text bg-transparent border-b border-transparent hover:border-app-border-strong focus:border-app-accent-text focus:outline-none py-0.5 w-[240px]"
          />
          <span className="text-caption text-app-muted">
            {itemCount} clips · {totalLabel} loop ·{" "}
            <span title={saveError ?? undefined} className={`font-semibold ${statusClass}`}>
              {statusText}
            </span>
          </span>
        </div>

        <span className="w-px h-6 bg-app-border mx-1" />

        <IconButton
          icon={Undo2}
          variant="secondary"
          size="sm"
          onClick={onUndo}
          disabled={undoDisabled}
          aria-label="Undo"
          title="Undo (⌘Z)"
        />
        <IconButton
          icon={Redo2}
          variant="secondary"
          size="sm"
          onClick={onRedo}
          disabled={redoDisabled}
          aria-label="Redo"
          title="Redo (⇧⌘Z)"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenDisplayConfig}
          title="Configure display format"
          className="h-[34px] flex items-center gap-2 px-3 rounded-lg border border-app-border bg-app-surface-alt text-app-text hover:border-app-accent-text cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent-text"
        >
          <span className="inline-flex w-[22px] h-4 items-center justify-center">
            <span
              className="inline-block border-[1.5px] border-app-accent-text rounded-[2px]"
              style={{ width: `${dispIconW}px`, height: `${dispIconH}px` }}
            />
          </span>
          <span className="flex flex-col items-start leading-tight">
            <span className="text-caption font-semibold whitespace-nowrap">{displayName}</span>
            <span className="text-caption text-app-muted whitespace-nowrap">
              {displayRes} · {displayAspect}
            </span>
          </span>
        </button>

        <span className="w-px h-6 bg-app-border mx-0.5" />

        <Button variant="secondary" size="sm" icon={Save} onClick={onSaveDraft} disabled={saving}>
          Save Draft
        </Button>
        <Button variant="primary" size="sm" icon={Send} onClick={onPublish} disabled={saving}>
          Publish Loop
        </Button>
      </div>
    </div>
  );
}
