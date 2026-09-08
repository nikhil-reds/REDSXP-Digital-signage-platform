"use client";

import React from "react";
import { CompatResult, MediaFit, MediaPosition, PlaylistLayoutMode, Transition } from "./types";

const FIT_OPTIONS: MediaFit[] = ["cover", "contain", "fill", "none", "scale-down"];
const POSITION_OPTIONS: MediaPosition[] = ["center", "top", "bottom", "left", "right"];

interface PlaylistInspectorProps {
  displayName: string;
  displayRes: string;
  displayAspect: string;
  deviceName: string;
  deviceBitrate: string;
  deployCompat: string;
  deployCompatWarn: boolean;
  onOpenDisplayConfig: () => void;
  layoutMode: PlaylistLayoutMode;
  onLayoutModeChange: (mode: PlaylistLayoutMode) => void;
  gridRows: number;
  gridColumns: number;
  onGridRowsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGridColumnsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  hasSelection: boolean;
  selName: string;
  selType: string;
  selDims: string;
  selThumb: string;
  selCompat: CompatResult | null;
  selDuration: number | string;
  selTransDur: number | string;
  selTransition: Transition;
  onDurationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTransDurChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTransitionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selFit: MediaFit;
  selPosition: MediaPosition;
  onFitChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onPositionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  zoneOptions: { id: string; name: string; color: string }[];
  selZoneId: string;
  onZoneChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

  fallback: string;
  fallbackOptions: string[];
  onFallbackChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function PlaylistInspector({
  displayName,
  displayRes,
  displayAspect,
  deviceName,
  deviceBitrate,
  deployCompat,
  deployCompatWarn,
  onOpenDisplayConfig,
  layoutMode,
  onLayoutModeChange,
  gridRows,
  gridColumns,
  onGridRowsChange,
  onGridColumnsChange,
  hasSelection,
  selName,
  selType,
  selDims,
  selThumb,
  selCompat,
  selDuration,
  selTransDur,
  selTransition,
  onDurationChange,
  onTransDurChange,
  onTransitionChange,
  selFit,
  selPosition,
  onFitChange,
  onPositionChange,
  zoneOptions,
  selZoneId,
  onZoneChange,
  fallback,
  fallbackOptions,
  onFallbackChange,
}: PlaylistInspectorProps) {
  return (
    <aside className="w-[330px] bg-app-surface border-l border-app-border flex flex-col h-full font-sans shrink-0 overflow-hidden">
      <div className="p-3 border-b border-app-border bg-app-surface-alt shrink-0">
        <span className="text-caption font-semibold uppercase tracking-headline text-app-muted">
          Inspector
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-4 text-xs">
        {/* Deployment */}
        <section className="flex flex-col gap-2">
          <div className="text-caption font-semibold tracking-headline uppercase text-app-muted">Deployment</div>
          <div className="border border-app-border rounded-lg bg-app-surface-alt px-2.5 py-2.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-caption">
            <span className="text-app-muted">Display</span>
            <span className="font-semibold">{displayName}</span>
            <span className="text-app-muted">Resolution</span>
            <span className="font-mono">{displayRes}</span>
            <span className="text-app-muted">Aspect Ratio</span>
            <span className="font-mono">{displayAspect}</span>
            <span className="text-app-muted">Playback</span>
            <span className="font-mono">60 FPS</span>
            <span className="text-app-muted">Output</span>
            <span className="font-semibold">{deviceName}</span>
            <span className="text-app-muted">Bitrate</span>
            <span className="font-mono">{deviceBitrate}</span>
            <span className="text-app-muted">Compatibility</span>
            <span className={`font-bold ${deployCompatWarn ? "text-app-warning-text" : "text-app-accent-text"}`}>
              {deployCompat}
            </span>
          </div>
          <button
            onClick={onOpenDisplayConfig}
            className="h-7 rounded-md border border-app-border bg-app-surface text-app-text text-body font-semibold hover:border-app-accent-text hover:text-app-accent-text cursor-pointer transition-colors"
          >
            Configure Display…
          </button>
          <div className="grid grid-cols-2 gap-1 rounded-md border border-app-border bg-app-surface-alt p-1">
            <button
              type="button"
              onClick={() => onLayoutModeChange("zone")}
              className={`h-7 rounded text-caption font-semibold cursor-pointer transition-colors ${
                layoutMode === "zone"
                  ? "bg-app-surface text-app-accent-text shadow-xs"
                  : "text-app-muted hover:text-app-text"
              }`}
            >
              Zone
            </button>
            <button
              type="button"
              onClick={() => onLayoutModeChange("custom-grid")}
              className={`h-7 rounded text-caption font-semibold cursor-pointer transition-colors ${
                layoutMode === "custom-grid"
                  ? "bg-app-surface text-app-accent-text shadow-xs"
                  : "text-app-muted hover:text-app-text"
              }`}
            >
              Custom Grid
            </button>
          </div>
          {layoutMode === "custom-grid" && (
            <div className="grid grid-cols-2 gap-2.5">
              <label className="flex flex-col gap-1 text-caption font-semibold text-app-muted">
                Grid Rows
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={gridRows}
                  onChange={onGridRowsChange}
                  className="w-full box-border h-[30px] px-2 rounded-md border border-app-border bg-app-surface-alt text-app-text text-body font-semibold focus:outline-none focus:border-app-accent-text"
                />
              </label>
              <label className="flex flex-col gap-1 text-caption font-semibold text-app-muted">
                Grid Columns
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={gridColumns}
                  onChange={onGridColumnsChange}
                  className="w-full box-border h-[30px] px-2 rounded-md border border-app-border bg-app-surface-alt text-app-text text-body font-semibold focus:outline-none focus:border-app-accent-text"
                />
              </label>
            </div>
          )}
        </section>

        <div className="h-px bg-app-border" />

        {hasSelection ? (
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <div className="w-[34px] h-6 rounded shrink-0" style={{ background: selThumb }} />
              <div className="min-w-0">
                <div className="text-xs font-bold whitespace-nowrap overflow-hidden text-ellipsis">{selName}</div>
                <div className="text-caption text-app-muted">
                  {selType} · {selDims}
                </div>
              </div>
            </div>

            {selCompat && (
              <div
                title={selCompat.tip}
                className={`flex items-start gap-1.5 text-caption font-semibold rounded-lg border px-2.5 py-2 leading-relaxed cursor-help ${
                  selCompat.level === "ok"
                    ? "text-app-accent-text bg-app-accent-surface border-app-accent/30"
                    : "text-app-warning-text bg-app-warning-surface border-app-warning/30"
                }`}
              >
                <span className="shrink-0">{selCompat.icon}</span>
                <span>
                  {selCompat.label}
                  <br />
                  <span className="font-normal text-app-muted text-caption">{selCompat.tip}</span>
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5">
              <label className="flex flex-col gap-1 text-caption font-semibold text-app-muted">
                Duration
                <span className="relative block">
                  <input
                    type="number"
                    min={1}
                    value={selDuration}
                    onChange={onDurationChange}
                    className="w-full box-border h-[30px] pl-2 pr-5.5 rounded-md border border-app-border bg-app-surface-alt text-app-text text-body font-semibold focus:outline-none focus:border-app-accent-text"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-caption text-app-muted">s</span>
                </span>
              </label>
              <label className="flex flex-col gap-1 text-caption font-semibold text-app-muted">
                Transition Dur.
                <span className="relative block">
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={selTransDur}
                    onChange={onTransDurChange}
                    className="w-full box-border h-[30px] pl-2 pr-5.5 rounded-md border border-app-border bg-app-surface-alt text-app-text text-body font-semibold focus:outline-none focus:border-app-accent-text"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-caption text-app-muted">s</span>
                </span>
              </label>
            </div>

            <label className="flex flex-col gap-1 text-caption font-semibold text-app-muted">
              Zone
              <select
                value={selZoneId}
                onChange={onZoneChange}
                className="h-[30px] px-2 rounded-md border border-app-border bg-app-surface-alt text-app-text text-body font-medium cursor-pointer focus:outline-none focus:border-app-accent-text"
              >
                {zoneOptions.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-caption font-semibold text-app-muted">
              Transition In
              <select
                value={selTransition}
                onChange={onTransitionChange}
                className="h-[30px] px-2 rounded-md border border-app-border bg-app-surface-alt text-app-text text-body font-medium cursor-pointer focus:outline-none focus:border-app-accent-text"
              >
                <option value="Fade">Fade</option>
                <option value="Crossfade">Crossfade</option>
                <option value="Cut">Cut</option>
              </select>
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              <label className="flex flex-col gap-1 text-caption font-semibold text-app-muted">
                Fit
                <select
                  value={selFit}
                  onChange={onFitChange}
                  className="h-[30px] px-2 rounded-md border border-app-border bg-app-surface-alt text-app-text text-body font-medium cursor-pointer focus:outline-none focus:border-app-accent-text"
                >
                  {FIT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-caption font-semibold text-app-muted">
                Position
                <select
                  value={selPosition}
                  onChange={onPositionChange}
                  className="h-[30px] px-2 rounded-md border border-app-border bg-app-surface-alt text-app-text text-body font-medium cursor-pointer focus:outline-none focus:border-app-accent-text"
                >
                  {POSITION_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>
        ) : (
          <div className="py-6 px-2.5 text-center text-app-muted leading-relaxed">
            Select a clip in the timeline to edit its properties.
          </div>
        )}

        <div className="h-px bg-app-border" />

        <section className="flex flex-col gap-2">
          <div className="text-caption font-semibold tracking-headline uppercase text-app-muted">Fallback Chain</div>
          <select
            value={fallback}
            onChange={onFallbackChange}
            className="h-[30px] px-2 rounded-md border border-app-border bg-app-surface-alt text-app-text text-xs cursor-pointer focus:outline-none focus:border-app-accent-text"
          >
            {fallbackOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
          <span className="text-caption text-app-muted">What plays if this loop fails?</span>
        </section>
      </div>
    </aside>
  );
}
