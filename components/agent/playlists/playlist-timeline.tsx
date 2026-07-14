"use client";

import React from "react";
import { ArrowLeft, ArrowRight, Code, Copy, Film, Image as ImageIcon, Lock, Trash2 } from "lucide-react";
import { PlaylistClip } from "./types";

interface ClipRenderData {
  clip: PlaylistClip;
  name: string;
  type: string;
  isVideo: boolean;
  isImage: boolean;
  isHtml: boolean;
  left: number;
  width: number;
  bg: string;
  selected: boolean;
  warning: boolean;
  dragging: boolean;
  dragDx: number;
  durLabel: string;
  transitionName: string;
  tooltip: string;
  resizable: boolean;
  onClick: (e: React.MouseEvent) => void;
  onPointerDown: (e: React.PointerEvent) => void;
  onResizeDown: (e: React.PointerEvent) => void;
}

interface TransMarkerData {
  key: number;
  left: number;
  tooltip: string;
  onClick: (e: React.MouseEvent) => void;
}

interface TickData {
  left: number;
  label: string;
}

interface OverviewBlockData {
  key: number;
  widthPct: number;
  bg: string;
  opacity: number;
}

interface PlaylistTimelineProps {
  itemCount: number;
  totalLabel: string;
  zoom: number;
  onZoomChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  timelineWidth: number;
  ticks: TickData[];
  clips: ClipRenderData[];
  transMarkers: TransMarkerData[];
  playheadLeft: number;
  onRulerClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onLaneClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  lockedTracks: { name: string }[];
  overviewBlocks: OverviewBlockData[];
  selActionsVisible: boolean;
  selActionsLeft: number;
  onSelLeft: (e: React.MouseEvent) => void;
  onSelRight: (e: React.MouseEvent) => void;
  onSelDuplicate: (e: React.MouseEvent) => void;
  onSelDelete: (e: React.MouseEvent) => void;
}

export default function PlaylistTimeline({
  itemCount,
  totalLabel,
  zoom,
  onZoomChange,
  onZoomIn,
  onZoomOut,
  timelineWidth,
  ticks,
  clips,
  transMarkers,
  playheadLeft,
  onRulerClick,
  onLaneClick,
  lockedTracks,
  overviewBlocks,
  selActionsVisible,
  selActionsLeft,
  onSelLeft,
  onSelRight,
  onSelDuplicate,
  onSelDelete,
}: PlaylistTimelineProps) {
  return (
    <div className="h-[300px] flex flex-col bg-white dark:bg-[#111722] border-t border-[#E2E6EC] dark:border-[#283243] min-h-0 font-sans">
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-[#E2E6EC] dark:border-[#283243] shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Timeline</span>
          <span className="font-mono text-[11px] text-zinc-450">
            {itemCount} clips · {totalLabel} total loop
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-zinc-450">Snap on</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onZoomOut}
              className="w-[22px] h-[22px] rounded border border-[#E2E6EC] dark:border-[#283243] bg-white dark:bg-[#111722] text-zinc-450 text-sm leading-none hover:bg-[#F6F7F9] dark:hover:bg-[#18202E] hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
            >
              −
            </button>
            <input
              type="range"
              min={8}
              max={60}
              value={zoom}
              onChange={onZoomChange}
              className="w-[120px] cursor-pointer accent-[#2859D9] dark:accent-[#6F96FF]"
              aria-label="Timeline zoom"
            />
            <button
              onClick={onZoomIn}
              className="w-[22px] h-[22px] rounded border border-[#E2E6EC] dark:border-[#283243] bg-white dark:bg-[#111722] text-zinc-450 text-sm leading-none hover:bg-[#F6F7F9] dark:hover:bg-[#18202E] hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[96px_1fr] min-h-0">
        <div className="border-r border-[#E2E6EC] dark:border-[#283243] flex flex-col pt-[26px]">
          <div className="h-[84px] flex items-center px-2.5 text-[10.5px] font-bold text-zinc-900 dark:text-zinc-100">
            <span className="inline-flex items-center gap-1.5">
              <Film className="w-3 h-3" />
              Video
            </span>
          </div>
          {lockedTracks.map((t) => (
            <div
              key={t.name}
              className="h-[26px] flex items-center justify-between px-2.5 text-[10px] font-semibold text-zinc-450 opacity-45"
            >
              {t.name}
              <Lock className="w-2.5 h-2.5" />
            </div>
          ))}
        </div>

        <div className="overflow-x-auto overflow-y-hidden relative">
          <div className="relative h-full" style={{ width: `${timelineWidth}px`, minWidth: "100%" }}>
            <div
              onClick={onRulerClick}
              className="relative h-[26px] border-b border-[#E2E6EC] dark:border-[#283243] cursor-pointer bg-white dark:bg-[#111722]"
            >
              {ticks.map((tk, i) => (
                <div key={i} className="absolute top-0 bottom-0 flex flex-col justify-end" style={{ left: `${tk.left}px` }}>
                  <span className="font-mono text-[9px] text-zinc-450 translate-x-[3px] mb-1.5">{tk.label}</span>
                  <div className="absolute left-0 bottom-0 w-px h-[5px] bg-zinc-450" />
                </div>
              ))}
            </div>

            <div
              onClick={onLaneClick}
              className="relative h-[84px] bg-[#F6F7F9] dark:bg-[#0D1320] border-b border-[#E2E6EC] dark:border-[#283243]"
            >
              {clips.map((c) => {
                const Icon = c.isVideo ? Film : c.isHtml ? Code : ImageIcon;
                return (
                  <div
                    key={c.clip.id}
                    onPointerDown={c.onPointerDown}
                    onClick={c.onClick}
                    title={c.tooltip}
                    className={`absolute top-2.5 h-16 rounded-lg box-border overflow-hidden cursor-grab flex flex-col justify-center gap-0.5 px-2.5 border-[1.5px] hover:brightness-110 ${
                      c.selected
                        ? "border-[#2859D9] dark:border-[#6F96FF] ring-2 ring-[#2859D9]/30 dark:ring-[#6F96FF]/30"
                        : c.warning
                        ? "border-amber-500 shadow-sm"
                        : "border-white/15 shadow-sm"
                    } ${c.dragging ? "shadow-lg" : ""}`}
                    style={{
                      left: `${c.left}px`,
                      width: `${c.width}px`,
                      background: c.bg,
                      zIndex: c.dragging ? 20 : c.selected ? 5 : 2,
                      transform: c.dragging ? `translateX(${c.dragDx}px) scale(1.02)` : "none",
                      transition: c.dragging ? "none" : "left 0.18s ease, width 0.12s ease, box-shadow 0.15s",
                    }}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="shrink-0 text-white/95 inline-flex">
                        <Icon className="w-2.5 h-2.5" />
                      </span>
                      <span className="text-[11px] font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
                        {c.name}
                      </span>
                      {c.warning && <span className="shrink-0 text-[10px]">⚠</span>}
                    </div>
                    <div className="font-mono text-[9.5px] text-white/85 whitespace-nowrap overflow-hidden text-ellipsis">
                      {c.durLabel} · {c.type} · {c.transitionName}
                    </div>
                    {c.resizable && (
                      <div
                        onPointerDown={c.onResizeDown}
                        title="Drag to change duration"
                        className="absolute right-0 top-0 bottom-0 w-2.5 cursor-ew-resize flex items-center justify-center"
                      >
                        <div className="w-[3px] h-[22px] rounded bg-white/65" />
                      </div>
                    )}
                  </div>
                );
              })}

              {transMarkers.map((tm) => (
                <button
                  key={tm.key}
                  onClick={tm.onClick}
                  title={tm.tooltip}
                  className="absolute top-[30px] w-5 h-5 -ml-2.5 rounded-full border-[1.5px] border-[#E2E6EC] dark:border-[#283243] bg-white dark:bg-[#111722] text-zinc-450 cursor-pointer z-[6] flex items-center justify-center p-0 shadow-sm hover:border-[#2859D9] dark:hover:border-[#6F96FF] hover:text-[#2859D9] dark:hover:text-[#6F96FF] hover:scale-125 transition-transform"
                  style={{ left: `${tm.left}px` }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="4,5 11,12 4,19" />
                    <polygon points="20,5 13,12 20,19" />
                  </svg>
                </button>
              ))}

              {selActionsVisible && (
                <div
                  className="absolute -top-0.5 z-[8] flex gap-0.5 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-md p-0.5 shadow-md"
                  style={{ left: `${selActionsLeft}px` }}
                >
                  <button
                    onClick={onSelLeft}
                    title="Move earlier"
                    className="w-5 h-[18px] rounded text-zinc-450 hover:bg-[#F6F7F9] dark:hover:bg-[#18202E] hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center justify-center cursor-pointer"
                  >
                    <ArrowLeft className="w-2.5 h-2.5" />
                  </button>
                  <button
                    onClick={onSelRight}
                    title="Move later"
                    className="w-5 h-[18px] rounded text-zinc-450 hover:bg-[#F6F7F9] dark:hover:bg-[#18202E] hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center justify-center cursor-pointer"
                  >
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                  <button
                    onClick={onSelDuplicate}
                    title="Duplicate"
                    className="w-5 h-[18px] rounded text-zinc-450 hover:bg-[#F6F7F9] dark:hover:bg-[#18202E] hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center justify-center cursor-pointer"
                  >
                    <Copy className="w-2.5 h-2.5" />
                  </button>
                  <button
                    onClick={onSelDelete}
                    title="Delete (⌫)"
                    className="w-5 h-[18px] rounded text-zinc-450 hover:bg-red-500/15 hover:text-red-500 flex items-center justify-center cursor-pointer"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                </div>
              )}
            </div>

            {lockedTracks.map((t) => (
              <div
                key={t.name}
                className="h-[26px] border-b border-[#E2E6EC] dark:border-[#283243] opacity-60"
                style={{
                  background:
                    "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(120,130,145,0.08) 8px, rgba(120,130,145,0.08) 16px)",
                }}
              />
            ))}

            <div
              className="absolute top-0 bottom-0 w-0 z-10 pointer-events-none"
              style={{ left: `${playheadLeft}px` }}
            >
              <div className="absolute -left-px top-0 bottom-0 w-0.5 bg-red-500" />
              <div className="absolute -left-[5.5px] top-0 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 px-3.5 py-1.5 border-t border-[#E2E6EC] dark:border-[#283243] shrink-0">
        <span className="text-[9.5px] font-bold tracking-wide text-zinc-450 shrink-0">OVERVIEW</span>
        <div className="flex-1 h-2.5 rounded-md bg-[#F6F7F9] dark:bg-[#0D1320] flex overflow-hidden gap-px">
          {overviewBlocks.map((ob) => (
            <div key={ob.key} style={{ width: `${ob.widthPct}%`, background: ob.bg, opacity: ob.opacity }} />
          ))}
        </div>
        <span className="font-mono text-[10px] text-zinc-450 shrink-0">{totalLabel}</span>
      </div>
    </div>
  );
}
