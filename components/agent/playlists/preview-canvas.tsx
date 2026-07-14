"use client";

import React, { useEffect, useRef } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { ClipType, Fit } from "./types";

interface PreviewCanvasProps {
  displayName: string;
  displayRes: string;
  aspect: string;
  landscape: boolean;
  thumb: string;
  letterbox: boolean;
  assetAspect: string;
  warning: boolean;
  warningText: string;
  currentClipKey: string;
  currentClipType: ClipType | null;
  currentClipSrc: string | null;
  currentClipFit: Fit;
  currentClipName: string;
  clipProgressPct: string;
  playing: boolean;
  onPlayPause: () => void;
  onRestart: () => void;
  timeLabel: string;
  totalLabel: string;
  safeTitleOn: boolean;
  safeActionOn: boolean;
  safeBleedOn: boolean;
  onToggleSafeTitle: () => void;
  onToggleSafeAction: () => void;
  onToggleSafeBleed: () => void;
}

export default function PreviewCanvas({
  displayName,
  displayRes,
  aspect,
  landscape,
  thumb,
  letterbox,
  assetAspect,
  warning,
  warningText,
  currentClipKey,
  currentClipType,
  currentClipSrc,
  currentClipFit,
  currentClipName,
  clipProgressPct,
  playing,
  onPlayPause,
  onRestart,
  timeLabel,
  totalLabel,
  safeTitleOn,
  safeActionOn,
  safeBleedOn,
  onToggleSafeTitle,
  onToggleSafeAction,
  onToggleSafeBleed,
}: PreviewCanvasProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Imperatively drive the real <video> element's playback from the `playing` state —
  // it remounts (via `key={currentClipKey}`) on every clip change, so this also re-applies
  // the current play/pause state to whichever clip just became active.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (playing) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [playing, currentClipKey]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-3 min-h-0 min-w-0 px-6 py-4 bg-[#F6F7F9] dark:bg-[#090D14]">
      <div
        className="relative bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/10 dark:ring-white/5 transition-[aspect-ratio] duration-200"
        style={{
          aspectRatio: aspect,
          maxHeight: "calc(100% - 60px)",
          maxWidth: "100%",
          width: landscape ? "min(100%, 900px)" : undefined,
          height: !landscape ? "calc(100% - 60px)" : undefined,
        }}
      >
        {currentClipSrc ? (
          currentClipType === "Video" ? (
            <video
              key={currentClipKey}
              ref={videoRef}
              src={currentClipSrc}
              loop
              muted
              playsInline
              className={`absolute inset-0 w-full h-full bg-black ${
                currentClipFit === "Fill" ? "object-cover" : "object-contain"
              }`}
            />
          ) : currentClipType === "Image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={currentClipKey}
              src={currentClipSrc}
              alt={currentClipName}
              className={`absolute inset-0 w-full h-full bg-black ${
                currentClipFit === "Fill" ? "object-cover" : "object-contain"
              }`}
            />
          ) : (
            <iframe
              key={currentClipKey}
              src={currentClipSrc}
              title={currentClipName}
              className="absolute inset-0 w-full h-full border-0 bg-white"
            />
          )
        ) : (
          <>
            <div className="absolute inset-0 opacity-90 transition-colors duration-300" style={{ background: thumb }} />
            {letterbox && (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div
                  className="h-full shadow-[0_0_0_1px_rgba(255,255,255,0.2)]"
                  style={{ aspectRatio: assetAspect, background: thumb }}
                />
              </div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/95 pointer-events-none">
              <div className="font-mono text-xs bg-black/35 rounded px-2.5 py-1 [text-shadow:0_1px_6px_rgba(0,0,0,0.7)]">
                {currentClipName}
              </div>
            </div>
          </>
        )}

        {safeActionOn && (
          <div className="absolute inset-[5%] border border-dashed border-[#6F96FF]/80 pointer-events-none">
            <span className="absolute top-0.5 left-1 text-[8.5px] font-bold text-[#6F96FF] tracking-wide">
              ACTION SAFE
            </span>
          </div>
        )}
        {safeTitleOn && (
          <div className="absolute inset-[10%] border border-dashed border-emerald-500/85 pointer-events-none">
            <span className="absolute top-0.5 left-1 text-[8.5px] font-bold text-emerald-500 tracking-wide">
              TITLE SAFE
            </span>
          </div>
        )}
        {safeBleedOn && (
          <div className="absolute -inset-px border-2 border-red-500/60 rounded-xl pointer-events-none">
            <span className="absolute bottom-0.5 right-1.5 text-[8.5px] font-bold text-red-500 tracking-wide">
              BLEED
            </span>
          </div>
        )}

        <span className="absolute top-2.5 right-2.5 text-[9.5px] font-bold text-white bg-black/55 border border-white/25 rounded px-1.5 py-0.5 tracking-wide">
          {displayName} · {displayRes}
        </span>

        {warning && (
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 text-[10px] font-bold text-white bg-amber-500/90 rounded px-2 py-0.5">
            ⚠ {warningText}
          </span>
        )}

        <div className="absolute left-0 right-0 bottom-0 h-[3px] bg-white/15">
          <div className="h-full bg-[#2859D9] dark:bg-[#6F96FF]" style={{ width: `${clipProgressPct}%` }} />
        </div>
      </div>

      <div className="flex items-center gap-2.5 h-10">
        <button
          onClick={onRestart}
          title="Restart"
          className="w-8 h-8 rounded-full border border-[#E2E6EC] dark:border-[#283243] bg-white dark:bg-[#111722] text-zinc-450 flex items-center justify-center hover:bg-[#F6F7F9] dark:hover:bg-[#18202E] hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
        <button
          onClick={onPlayPause}
          title="Play / Pause (Space)"
          className="w-10 h-10 rounded-full border-none bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] flex items-center justify-center shadow-md hover:brightness-110 cursor-pointer transition-[filter]"
        >
          {playing ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
        </button>
        <span className="font-mono text-xs text-zinc-450 min-w-[96px] text-center">
          <span className="text-zinc-900 dark:text-zinc-100 font-semibold">{timeLabel}</span> / {totalLabel}
        </span>
        <span
          title="Loop enabled"
          className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#2859D9] dark:text-[#6F96FF] bg-[#2859D9]/10 dark:bg-[#6F96FF]/10 rounded px-2 py-0.5"
        >
          ⟲ LOOP
        </span>
        <div className="w-px h-5 bg-[#E2E6EC] dark:bg-[#283243]" />
        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-zinc-450 cursor-pointer">
            <input type="checkbox" checked={safeTitleOn} onChange={onToggleSafeTitle} className="accent-emerald-500 cursor-pointer" />
            Title Safe
          </label>
          <label className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-zinc-450 cursor-pointer">
            <input
              type="checkbox"
              checked={safeActionOn}
              onChange={onToggleSafeAction}
              className="accent-[#2859D9] dark:accent-[#6F96FF] cursor-pointer"
            />
            Action Safe
          </label>
          <label className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-zinc-450 cursor-pointer">
            <input type="checkbox" checked={safeBleedOn} onChange={onToggleSafeBleed} className="accent-red-500 cursor-pointer" />
            Bleed
          </label>
        </div>
      </div>
    </main>
  );
}
