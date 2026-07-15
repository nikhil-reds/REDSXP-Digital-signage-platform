"use client";

import React from "react";
import { Redo2, Save, Send, Undo2 } from "lucide-react";

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
  return (
    <div className="h-14 border-b border-[#E2E6EC] dark:border-[#283243] bg-white dark:bg-[#111722] flex items-center justify-between px-4 shrink-0 z-10 font-sans">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-[30px] h-[30px] rounded-lg bg-gradient-to-br from-[#2859D9] to-[#3B5BD9] dark:from-[#6F96FF] dark:to-[#3B5BD9] flex items-center justify-center text-white font-bold text-sm shrink-0">
          R
        </div>

        <div className="flex flex-col min-w-0">
          <input
            type="text"
            value={playlistName}
            onChange={onNameChange}
            aria-label="Playlist name"
            className="text-sm font-bold text-zinc-900 dark:text-white bg-transparent border-b border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-[#2859D9] dark:focus:border-[#6F96FF] focus:outline-none py-0.5 w-[240px]"
          />
          <span className="text-[10.5px] text-zinc-450 dark:text-zinc-500">
            {itemCount} clips · {totalLabel} loop ·{" "}
            <span
              title={saveError ?? undefined}
              className={`font-semibold ${
                saveError ? "text-red-500" : saving ? "text-zinc-450" : dirty ? "text-amber-500" : "text-emerald-500"
              }`}
            >
              {statusText}
            </span>
          </span>
        </div>

        <div className="w-px h-6 bg-[#E2E6EC] dark:bg-[#283243] mx-1" />

        <button
          onClick={onUndo}
          disabled={undoDisabled}
          title="Undo (⌘Z)"
          className="w-[30px] h-[30px] rounded-md border border-[#E2E6EC] dark:border-[#283243] bg-white dark:bg-[#111722] text-zinc-400 flex items-center justify-center hover:bg-[#F6F7F9] dark:hover:bg-[#18202E] hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-40 cursor-pointer transition-colors"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onRedo}
          disabled={redoDisabled}
          title="Redo (⇧⌘Z)"
          className="w-[30px] h-[30px] rounded-md border border-[#E2E6EC] dark:border-[#283243] bg-white dark:bg-[#111722] text-zinc-400 flex items-center justify-center hover:bg-[#F6F7F9] dark:hover:bg-[#18202E] hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-40 cursor-pointer transition-colors"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenDisplayConfig}
          title="Configure display format"
          className="h-[34px] flex items-center gap-2 px-3 rounded-lg border border-[#E2E6EC] dark:border-[#283243] bg-[#F6F7F9] dark:bg-[#18202E] text-zinc-800 dark:text-zinc-200 hover:border-[#2859D9] dark:hover:border-[#6F96FF] cursor-pointer transition-colors"
        >
          <span className="inline-flex w-[22px] h-4 items-center justify-center">
            <span
              className="inline-block border-[1.5px] border-[#2859D9] dark:border-[#6F96FF] rounded-[2px]"
              style={{ width: `${dispIconW}px`, height: `${dispIconH}px` }}
            />
          </span>
          <span className="flex flex-col items-start leading-tight">
            <span className="text-[11.5px] font-bold whitespace-nowrap">{displayName}</span>
            <span className="font-mono text-[9.5px] text-zinc-450 dark:text-zinc-500 whitespace-nowrap">
              {displayRes} · {displayAspect}
            </span>
          </span>
        </button>

        <div className="w-px h-6 bg-[#E2E6EC] dark:bg-[#283243] mx-0.5" />

        <button
          onClick={onSaveDraft}
          disabled={saving}
          className="h-8 px-3.5 rounded-lg border border-[#E2E6EC] dark:border-[#283243] bg-white dark:bg-[#111722] hover:bg-[#F6F7F9] dark:hover:bg-[#18202E] text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-3.5 h-3.5" />
          Save Draft
        </button>
        <button
          onClick={onPublish}
          disabled={saving}
          className="h-8 px-3.5 rounded-lg border-none bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] text-xs font-bold flex items-center gap-1.5 shadow-sm hover:opacity-90 cursor-pointer transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-3.5 h-3.5" />
          Publish Loop
        </button>
      </div>
    </div>
  );
}
