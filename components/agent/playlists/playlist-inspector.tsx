"use client";

import React from "react";
import { CompatResult, Fit, Transition } from "./types";

interface PlaylistInspectorProps {
  displayName: string;
  displayRes: string;
  displayAspect: string;
  deviceName: string;
  deviceBitrate: string;
  deployCompat: string;
  deployCompatWarn: boolean;
  onOpenDisplayConfig: () => void;

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
  selFit: Fit;
  onFitContain: () => void;
  onFitCover: () => void;

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
  onFitContain,
  onFitCover,
  fallback,
  fallbackOptions,
  onFallbackChange,
}: PlaylistInspectorProps) {
  return (
    <aside className="w-[330px] bg-white dark:bg-[#111722] border-l border-[#E2E6EC] dark:border-[#283243] flex flex-col h-full font-sans shrink-0 overflow-hidden">
      <div className="p-3 border-b border-[#E2E6EC] dark:border-[#283243] bg-zinc-50/40 dark:bg-[#18202E] shrink-0">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-450 dark:text-zinc-500">
          Inspector
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-4 text-xs">
        {/* Deployment */}
        <section className="flex flex-col gap-2">
          <div className="text-[10.5px] font-bold tracking-wide uppercase text-zinc-450">Deployment</div>
          <div className="border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-[#F6F7F9] dark:bg-[#0D1320] px-2.5 py-2.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[11px]">
            <span className="text-zinc-450">Display</span>
            <span className="font-semibold">{displayName}</span>
            <span className="text-zinc-450">Resolution</span>
            <span className="font-mono">{displayRes}</span>
            <span className="text-zinc-450">Aspect Ratio</span>
            <span className="font-mono">{displayAspect}</span>
            <span className="text-zinc-450">Playback</span>
            <span className="font-mono">60 FPS</span>
            <span className="text-zinc-450">Output</span>
            <span className="font-semibold">{deviceName}</span>
            <span className="text-zinc-450">Bitrate</span>
            <span className="font-mono">{deviceBitrate}</span>
            <span className="text-zinc-450">Compatibility</span>
            <span className={`font-bold ${deployCompatWarn ? "text-amber-500" : "text-emerald-500"}`}>
              {deployCompat}
            </span>
          </div>
          <button
            onClick={onOpenDisplayConfig}
            className="h-7 rounded-md border border-[#E2E6EC] dark:border-[#283243] bg-white dark:bg-[#111722] text-zinc-900 dark:text-zinc-100 text-[11.5px] font-semibold hover:border-[#2859D9] dark:hover:border-[#6F96FF] hover:text-[#2859D9] dark:hover:text-[#6F96FF] cursor-pointer transition-colors"
          >
            Configure Display…
          </button>
        </section>

        <div className="h-px bg-[#E2E6EC] dark:bg-[#283243]" />

        {hasSelection ? (
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <div className="w-[34px] h-6 rounded shrink-0" style={{ background: selThumb }} />
              <div className="min-w-0">
                <div className="text-xs font-bold whitespace-nowrap overflow-hidden text-ellipsis">{selName}</div>
                <div className="font-mono text-[10px] text-zinc-450">
                  {selType} · {selDims}
                </div>
              </div>
            </div>

            {selCompat && (
              <div
                title={selCompat.tip}
                className={`flex items-start gap-1.5 text-[11px] font-semibold rounded-lg border px-2.5 py-2 leading-relaxed cursor-help ${
                  selCompat.level === "ok"
                    ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                    : "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30"
                }`}
              >
                <span className="shrink-0">{selCompat.icon}</span>
                <span>
                  {selCompat.label}
                  <br />
                  <span className="font-normal text-zinc-450 text-[10.5px]">{selCompat.tip}</span>
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5">
              <label className="flex flex-col gap-1 text-[10.5px] font-semibold text-zinc-450">
                Duration
                <span className="relative block">
                  <input
                    type="number"
                    min={1}
                    value={selDuration}
                    onChange={onDurationChange}
                    className="w-full box-border h-[30px] pl-2 pr-5.5 rounded-md border border-[#E2E6EC] dark:border-[#283243] bg-[#F6F7F9] dark:bg-[#0D1320] text-zinc-900 dark:text-zinc-100 font-mono text-xs font-bold focus:outline-none focus:border-[#2859D9] dark:focus:border-[#6F96FF]"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10.5px] text-zinc-450">s</span>
                </span>
              </label>
              <label className="flex flex-col gap-1 text-[10.5px] font-semibold text-zinc-450">
                Transition Dur.
                <span className="relative block">
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={selTransDur}
                    onChange={onTransDurChange}
                    className="w-full box-border h-[30px] pl-2 pr-5.5 rounded-md border border-[#E2E6EC] dark:border-[#283243] bg-[#F6F7F9] dark:bg-[#0D1320] text-zinc-900 dark:text-zinc-100 font-mono text-xs font-bold focus:outline-none focus:border-[#2859D9] dark:focus:border-[#6F96FF]"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10.5px] text-zinc-450">s</span>
                </span>
              </label>
            </div>

            <label className="flex flex-col gap-1 text-[10.5px] font-semibold text-zinc-450">
              Transition In
              <select
                value={selTransition}
                onChange={onTransitionChange}
                className="h-[30px] px-2 rounded-md border border-[#E2E6EC] dark:border-[#283243] bg-[#F6F7F9] dark:bg-[#0D1320] text-zinc-900 dark:text-zinc-100 text-xs font-medium cursor-pointer focus:outline-none focus:border-[#2859D9] dark:focus:border-[#6F96FF]"
              >
                <option value="Fade">Fade</option>
                <option value="Crossfade">Crossfade</option>
                <option value="Cut">Cut</option>
              </select>
            </label>

            <div className="flex flex-col gap-1">
              <span className="text-[10.5px] font-semibold text-zinc-450">Scaling</span>
              <div className="grid grid-cols-2 border border-[#E2E6EC] dark:border-[#283243] rounded-lg overflow-hidden">
                <button
                  onClick={onFitContain}
                  className={`h-7 text-[11.5px] font-semibold cursor-pointer transition-colors ${
                    selFit === "Fit"
                      ? "bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722]"
                      : "bg-white dark:bg-[#111722] text-zinc-450"
                  }`}
                >
                  Fit
                </button>
                <button
                  onClick={onFitCover}
                  className={`h-7 border-l border-[#E2E6EC] dark:border-[#283243] text-[11.5px] font-semibold cursor-pointer transition-colors ${
                    selFit === "Fill"
                      ? "bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722]"
                      : "bg-white dark:bg-[#111722] text-zinc-450"
                  }`}
                >
                  Fill
                </button>
              </div>
            </div>
          </section>
        ) : (
          <div className="py-6 px-2.5 text-center text-zinc-450 leading-relaxed">
            Select a clip in the timeline to edit its properties.
          </div>
        )}

        <div className="h-px bg-[#E2E6EC] dark:bg-[#283243]" />

        <section className="flex flex-col gap-2">
          <div className="text-[10.5px] font-bold tracking-wide uppercase text-zinc-450">Fallback Chain</div>
          <select
            value={fallback}
            onChange={onFallbackChange}
            className="h-[30px] px-2 rounded-md border border-[#E2E6EC] dark:border-[#283243] bg-[#F6F7F9] dark:bg-[#0D1320] text-zinc-900 dark:text-zinc-100 text-xs cursor-pointer focus:outline-none focus:border-[#2859D9] dark:focus:border-[#6F96FF]"
          >
            {fallbackOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
          <span className="text-[10.5px] text-zinc-450">What plays if this loop fails?</span>
        </section>
      </div>
    </aside>
  );
}
