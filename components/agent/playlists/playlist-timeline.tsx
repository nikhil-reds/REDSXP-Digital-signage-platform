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
  laneIndex: number;
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
  key: string;
  left: number;
  laneIndex: number;
  tooltip: string;
  onClick: (e: React.MouseEvent) => void;
}

interface TickData {
  left: number;
  label: string;
}

interface OverviewBlockData {
  key: string;
  widthPct: number;
  bg: string;
  opacity: number;
}

interface ZoneLaneData {
  id: string;
  name: string;
  color: string;
  active: boolean;
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
  zoneLanes: ZoneLaneData[];
  lockedTracks: { name: string }[];
  overviewBlocks: OverviewBlockData[];
  selActionsVisible: boolean;
  selActionsLeft: number;
  selActionsTop: number;
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
  zoneLanes,
  lockedTracks,
  overviewBlocks,
  selActionsVisible,
  selActionsLeft,
  selActionsTop,
  onSelLeft,
  onSelRight,
  onSelDuplicate,
  onSelDelete,
}: PlaylistTimelineProps) {
  const zoneLaneHeight = 54;
  const lockedTrackHeight = 24;
  const rulerHeight = 26;
  const zoneLaneAreaHeight = Math.max(zoneLaneHeight, zoneLanes.length * zoneLaneHeight);
  const tracksHeight = zoneLaneAreaHeight + lockedTracks.length * lockedTrackHeight;
  const trackContentHeight = rulerHeight + tracksHeight;

  return (
    <div className="h-[300px] max-h-[42vh] min-h-[220px] flex flex-col bg-app-surface border-t border-app-border font-sans">
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 border-b border-app-border shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-body font-semibold text-app-text">Timeline</span>
          <span className="text-caption text-app-muted truncate">
            {itemCount} clips · {totalLabel} total loop
          </span>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="inline-flex items-center gap-1 text-caption font-semibold text-app-muted">Snap on</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onZoomOut}
              className="w-[22px] h-[22px] rounded border border-app-border bg-app-surface text-app-muted text-body leading-none hover:bg-app-surface-alt hover:text-app-text cursor-pointer"
            >
              −
            </button>
            <input
              type="range"
              min={8}
              max={60}
              value={zoom}
              onChange={onZoomChange}
              className="w-[120px] cursor-pointer accent-[var(--app-accent)]"
              aria-label="Timeline zoom"
            />
            <button
              onClick={onZoomIn}
              className="w-[22px] h-[22px] rounded border border-app-border bg-app-surface text-app-muted text-body leading-none hover:bg-app-surface-alt hover:text-app-text cursor-pointer"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="grid grid-cols-[96px_1fr] min-h-full">
          <div className="sticky left-0 z-20 border-r border-app-border bg-app-surface">
            <div style={{ height: `${rulerHeight}px` }} />
            {zoneLanes.map((zone) => (
              <div
                key={zone.id}
                className="flex items-center px-2.5 text-caption font-semibold text-app-text border-b border-app-border"
                style={{ height: `${zoneLaneHeight}px` }}
              >
                <span className="inline-flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: zone.color }} />
                  <span className="truncate">{zone.name}</span>
                </span>
              </div>
            ))}
            {lockedTracks.map((t) => (
              <div
                key={t.name}
                className="flex items-center justify-between px-2.5 text-caption font-semibold text-app-muted opacity-60 border-b border-app-border"
                style={{ height: `${lockedTrackHeight}px` }}
              >
                <span className="truncate">{t.name}</span>
                <Lock className="w-2.5 h-2.5 shrink-0" />
              </div>
            ))}
          </div>

          <div className="overflow-x-auto overflow-y-hidden relative min-w-0">
            <div className="relative" style={{ width: `${timelineWidth}px`, minWidth: "100%", height: `${trackContentHeight}px` }}>
            <div
              onClick={onRulerClick}
              className="sticky top-0 z-[7] relative border-b border-app-border cursor-pointer bg-app-surface"
              style={{ height: `${rulerHeight}px` }}
            >
              {ticks.map((tk, i) => (
                <div key={i} className="absolute top-0 bottom-0 flex flex-col justify-end" style={{ left: `${tk.left}px` }}>
                  <span className="text-caption text-app-muted translate-x-[3px] mb-1.5">{tk.label}</span>
                  <div className="absolute left-0 bottom-0 w-px h-[5px] bg-app-muted" />
                </div>
              ))}
            </div>

            <div
              onClick={onLaneClick}
              className="relative bg-app-surface-alt border-b border-app-border"
              style={{ height: `${zoneLaneAreaHeight}px` }}
            >
              {zoneLanes.map((zone, i) => (
                <div
                  key={zone.id}
                  className="absolute left-0 right-0 border-b border-app-border"
                  style={{
                    top: `${i * zoneLaneHeight}px`,
                    height: `${zoneLaneHeight}px`,
                    background: i % 2 ? "rgba(120,130,145,0.04)" : "transparent",
                  }}
                />
              ))}
              {clips.map((c) => {
                const Icon = c.isVideo ? Film : c.isHtml ? Code : ImageIcon;
                return (
                  <div
                    key={c.clip.instanceId}
                    onPointerDown={c.onPointerDown}
                    onClick={c.onClick}
                    title={c.tooltip}
                    className={`absolute h-9 rounded-lg box-border overflow-hidden cursor-grab flex flex-col justify-center gap-0.5 px-2.5 border-[1.5px] hover:brightness-110 ${
                      c.selected
                        ? "border-app-accent-text ring-2 ring-app-accent-text/40"
                        : c.warning
                        ? "border-app-warning"
                        : "border-white/15"
                    } ${c.dragging ? "shadow-md" : ""}`}
                    style={{
                      left: `${c.left}px`,
                      top: `${c.laneIndex * zoneLaneHeight + 8}px`,
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
                      <span className="text-caption font-semibold text-reds-offwhite whitespace-nowrap overflow-hidden text-ellipsis [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
                        {c.name}
                      </span>
                      {c.warning && <span className="shrink-0 text-caption">⚠</span>}
                    </div>
                    <div className="text-caption text-reds-offwhite/85 whitespace-nowrap overflow-hidden text-ellipsis">
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
                  className="absolute w-5 h-5 -ml-2.5 rounded-full border-[1.5px] border-app-border bg-app-surface text-app-muted cursor-pointer z-[6] flex items-center justify-center p-0 shadow-xs hover:border-app-accent-text hover:text-app-accent-text hover:scale-125 transition-transform"
                  style={{ left: `${tm.left}px`, top: `${tm.laneIndex * zoneLaneHeight + 17}px` }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="4,5 11,12 4,19" />
                    <polygon points="20,5 13,12 20,19" />
                  </svg>
                </button>
              ))}

              {selActionsVisible && (
                <div
                  className="absolute -top-0.5 z-[8] flex gap-0.5 bg-app-surface border border-app-border rounded-md p-0.5 shadow-xs"
                  style={{ left: `${selActionsLeft}px`, top: `${selActionsTop}px` }}
                >
                  <button
                    onClick={onSelLeft}
                    title="Move earlier"
                    className="w-5 h-[18px] rounded text-app-muted hover:bg-app-surface-alt hover:text-app-text flex items-center justify-center cursor-pointer"
                  >
                    <ArrowLeft className="w-2.5 h-2.5" />
                  </button>
                  <button
                    onClick={onSelRight}
                    title="Move later"
                    className="w-5 h-[18px] rounded text-app-muted hover:bg-app-surface-alt hover:text-app-text flex items-center justify-center cursor-pointer"
                  >
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                  <button
                    onClick={onSelDuplicate}
                    title="Duplicate"
                    className="w-5 h-[18px] rounded text-app-muted hover:bg-app-surface-alt hover:text-app-text flex items-center justify-center cursor-pointer"
                  >
                    <Copy className="w-2.5 h-2.5" />
                  </button>
                  <button
                    onClick={onSelDelete}
                    title="Delete (⌫)"
                    className="w-5 h-[18px] rounded text-app-muted hover:bg-app-danger-surface hover:text-app-danger-text flex items-center justify-center cursor-pointer"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                </div>
              )}
            </div>

            {lockedTracks.map((t) => (
              <div
                key={t.name}
                className="border-b border-app-border opacity-60"
                style={{
                  height: `${lockedTrackHeight}px`,
                  background:
                    "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(120,130,145,0.08) 8px, rgba(120,130,145,0.08) 16px)",
                }}
              />
            ))}

            <div
              className="absolute top-0 bottom-0 w-0 z-10 pointer-events-none"
              style={{ left: `${playheadLeft}px` }}
            >
              <div className="absolute -left-px top-0 bottom-0 w-0.5 bg-app-danger" />
              <div className="absolute -left-[5.5px] top-0 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-app-danger" />
            </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 px-3.5 py-1.5 border-t border-app-border shrink-0">
        <span className="text-caption font-semibold tracking-headline text-app-muted shrink-0">OVERVIEW</span>
        <div className="flex-1 h-2.5 rounded-md bg-app-surface-alt flex overflow-hidden gap-px">
          {overviewBlocks.map((ob) => (
            <div key={ob.key} style={{ width: `${ob.widthPct}%`, background: ob.bg, opacity: ob.opacity }} />
          ))}
        </div>
        <span className="text-caption text-app-muted shrink-0">{totalLabel}</span>
      </div>
    </div>
  );
}
