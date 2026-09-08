"use client";

import React, { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { ClipType, MediaFit, MediaPosition } from "./types";

interface PreviewZone {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}

interface ActivePreviewClip {
  key: string;
  type: ClipType;
  src: string;
  fit: MediaFit;
  position: MediaPosition;
  name: string;
  zone: PreviewZone;
}

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
  currentClipName: string;
  currentClipZone: PreviewZone;
  activeClips: ActivePreviewClip[];
  zones: PreviewZone[];
  showLayoutGuides: boolean;
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
  currentClipName,
  currentClipZone,
  activeClips,
  zones,
  showLayoutGuides,
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
  const videoRefs = useRef(new Map<string, HTMLVideoElement>());
  const [muted, setMuted] = useState(true);
  const hasVideo = activeClips.some((clip) => clip.type === "Video");

  // Imperatively drive the real <video> element's playback from the `playing` state —
  // it remounts (via `key={currentClipKey}`) on every clip change, so this also re-applies
  // the current play/pause state to whichever clip just became active.
  useEffect(() => {
    videoRefs.current.forEach((el) => {
      el.muted = muted;
      if (playing) {
        el.play().catch(() => {});
      } else {
        el.pause();
      }
    });
  }, [playing, currentClipKey, muted, activeClips]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-3 min-h-0 min-w-0 px-6 py-4 bg-app-canvas">
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
        {activeClips.length > 0 ? (
          activeClips.map((clip) => (
            <div
              key={clip.key}
              className="absolute overflow-hidden bg-black"
              style={{
                left: `${clip.zone.x}%`,
                top: `${clip.zone.y}%`,
                width: `${clip.zone.w}%`,
                height: `${clip.zone.h}%`,
              }}
            >
              {clip.type === "Video" ? (
                <video
                  ref={(el) => {
                    if (el) videoRefs.current.set(clip.key, el);
                    else videoRefs.current.delete(clip.key);
                  }}
                  src={clip.src}
                  loop
                  muted={muted}
                  playsInline
                  className="absolute inset-0 w-full h-full bg-black"
                  style={{ objectFit: clip.fit, objectPosition: clip.position }}
                />
              ) : clip.type === "Image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={clip.src}
                  alt={clip.name}
                  className="absolute inset-0 w-full h-full bg-black"
                  style={{ objectFit: clip.fit, objectPosition: clip.position }}
                />
              ) : (
                <iframe src={clip.src} title={clip.name} className="absolute inset-0 w-full h-full border-0 bg-white" />
              )}
            </div>
          ))
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

        {showLayoutGuides && zones.map((zone) => {
          const active = zone.id === currentClipZone.id;
          const showLabel = active || !zone.id.startsWith("grid-");
          return (
            <div
              key={zone.id}
              className="absolute pointer-events-none"
              style={{
                left: `${zone.x}%`,
                top: `${zone.y}%`,
                width: `${zone.w}%`,
                height: `${zone.h}%`,
                border: `1px ${active ? "solid" : "dashed"} ${zone.color}`,
                boxShadow: active ? `inset 0 0 0 1px ${zone.color}` : "none",
                opacity: active ? 0.9 : 0.35,
              }}
            >
              {showLabel && (
                <span
                  className="absolute left-1 top-1 max-w-[calc(100%-8px)] rounded px-1 py-0.5 text-caption font-semibold text-reds-offwhite leading-none whitespace-nowrap overflow-hidden text-ellipsis"
                  style={{ background: zone.color, letterSpacing: 0 }}
                  title={zone.name}
                >
                  {zone.name}
                </span>
              )}
            </div>
          );
        })}

        {safeActionOn && (
          <div className="absolute inset-[5%] border border-dashed border-reds-blue pointer-events-none">
            <span className="absolute top-0.5 left-1 text-caption font-semibold text-reds-blue tracking-headline">
              ACTION SAFE
            </span>
          </div>
        )}
        {safeTitleOn && (
          <div className="absolute inset-[10%] border border-dashed border-reds-teal pointer-events-none">
            <span className="absolute top-0.5 left-1 text-caption font-semibold text-reds-teal tracking-headline">
              TITLE SAFE
            </span>
          </div>
        )}
        {safeBleedOn && (
          <div className="absolute -inset-px border-2 border-app-danger rounded-xl pointer-events-none">
            <span className="absolute bottom-0.5 right-1.5 text-caption font-semibold text-app-danger tracking-headline">
              BLEED
            </span>
          </div>
        )}

        <span className="absolute top-2.5 right-2.5 text-caption font-semibold text-reds-offwhite bg-black/70 border border-white/25 rounded px-1.5 py-0.5 tracking-wide">
          {displayName} · {displayRes}
        </span>

        {warning && (
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 text-caption font-semibold text-app-warning-on bg-app-warning rounded px-2 py-0.5">
            ⚠ {warningText}
          </span>
        )}

        <div className="absolute left-0 right-0 bottom-0 h-[3px] bg-white/15">
          <div className="h-full bg-app-accent" style={{ width: `${clipProgressPct}%` }} />
        </div>
      </div>

      <div className="flex items-center gap-2.5 h-10">
        <button
          onClick={onRestart}
          title="Restart"
          className="w-8 h-8 rounded-full border border-app-border bg-app-surface text-app-muted flex items-center justify-center hover:bg-app-surface-alt hover:text-app-text cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
        <button
          onClick={onPlayPause}
          title="Play / Pause (Space)"
          className="w-10 h-10 rounded-full border-none bg-app-accent text-app-accent-on flex items-center justify-center shadow-xs hover:opacity-90 cursor-pointer transition-opacity"
        >
          {playing ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
        </button>
        <button
          onClick={() => setMuted((v) => !v)}
          disabled={!hasVideo}
          title={muted ? "Unmute video" : "Mute video"}
          aria-label={muted ? "Unmute video" : "Mute video"}
          className="w-8 h-8 rounded-full border border-app-border bg-app-surface text-app-muted flex items-center justify-center hover:bg-app-surface-alt hover:text-app-text cursor-pointer transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
        <span className="text-body text-app-muted min-w-[110px] text-center">
          <span className="text-app-text font-semibold">{timeLabel}</span> / {totalLabel}
        </span>
        <div className="w-px h-5 bg-app-border" />
        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-1 text-caption font-semibold text-app-muted cursor-pointer">
            <input type="checkbox" checked={safeTitleOn} onChange={onToggleSafeTitle} className="accent-[var(--reds-teal)] cursor-pointer" />
            Title Safe
          </label>
          <label className="inline-flex items-center gap-1 text-caption font-semibold text-app-muted cursor-pointer">
            <input
              type="checkbox"
              checked={safeActionOn}
              onChange={onToggleSafeAction}
              className="accent-[var(--reds-blue)] cursor-pointer"
            />
            Action Safe
          </label>
          <label className="inline-flex items-center gap-1 text-caption font-semibold text-app-muted cursor-pointer">
            <input type="checkbox" checked={safeBleedOn} onChange={onToggleSafeBleed} className="accent-[var(--app-danger)] cursor-pointer" />
            Bleed
          </label>
        </div>
      </div>
    </main>
  );
}
