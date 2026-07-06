"use client";

import React from "react";
import {
  Film,
  Image as ImageIcon,
  Code,
  Trash,
  Copy,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Move
} from "lucide-react";

export interface PlaylistItem {
  uuid: string;
  id: string;
  name: string;
  type: "Video" | "Image" | "HTML5";
  dimensions: string;
  duration: number;
  transition: "Fade" | "Crossfade" | "Cut";
  transitionDuration: number;
}

interface PlaylistTimelineProps {
  items: PlaylistItem[];
  selectedIndex: number | null;
  onSelectItem: (idx: number) => void;
  onUpdateItem: (idx: number, updated: PlaylistItem) => void;
  onRemoveItem: (idx: number) => void;
  onMoveItem: (idx: number, dir: "up" | "down") => void;
  onDuplicateItem: (idx: number) => void;
  orientation: "Landscape" | "Portrait";
}

export default function PlaylistTimeline({
  items,
  selectedIndex,
  onSelectItem,
  onUpdateItem,
  onRemoveItem,
  onMoveItem,
  onDuplicateItem,
  orientation
}: PlaylistTimelineProps) {
  
  return (
    <div className="flex-1 bg-[#F6F7F9] dark:bg-[#090D14] p-5 overflow-y-auto flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-xs font-bold text-[#18202B] dark:text-[#F2F5F8] uppercase tracking-wider">
            Loop Timeline Timeline ({items.length} items)
          </h2>
          <p className="text-[10px] text-zinc-400">Order, duration, and transition sequencer.</p>
        </div>
        
        <div className="text-right">
          <span className="block text-xs font-bold text-[#18202B] dark:text-[#F2F5F8]">
            {items.reduce((acc, curr) => acc + curr.duration, 0)}s
          </span>
          <span className="text-[9px] text-zinc-400 font-semibold uppercase">Total Loop Time</span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex-1 border-2 border-dashed border-[#E2E6EC] dark:border-[#283243] rounded-xl flex flex-col items-center justify-center text-center p-8 space-y-2 bg-white dark:bg-[#111722]/50">
          <PlaySquare className="w-8 h-8 text-zinc-300 animate-pulse" />
          <p className="text-xs text-zinc-400">Timeline loop is empty.</p>
          <span className="text-[10px] text-zinc-400 block">Click "+ Add" on the library sidebar to append media.</span>
        </div>
      ) : (
        <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
          {items.map((item, idx) => {
            const isSelected = selectedIndex === idx;
            const isVideo = item.type === "Video";
            const isHtml = item.type === "HTML5";
            const Icon = isVideo ? Film : isHtml ? Code : ImageIcon;
            
            // Check orientation warning: if portrait model size is placed on landscape dashboard
            const isItemPortrait = item.dimensions.startsWith("1080") || item.dimensions.startsWith("2160");
            const hasWarning = (orientation === "Landscape" && isItemPortrait) || (orientation === "Portrait" && !isItemPortrait && item.type !== "HTML5");

            return (
              <div
                key={item.uuid}
                onClick={() => onSelectItem(idx)}
                className={`p-3.5 border rounded-xl bg-white dark:bg-[#111722] hover:shadow-xs transition-all flex items-center justify-between gap-4 cursor-pointer relative ${
                  isSelected
                    ? "border-[#2859D9] dark:border-[#6F96FF] ring-2 ring-blue-500/10"
                    : "border-[#E2E6EC] dark:border-[#283243]"
                }`}
              >
                {/* Visual order bubble */}
                <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold text-[9px] flex items-center justify-center shadow border border-white dark:border-[#090D14] shrink-0 select-none">
                  {idx + 1}
                </div>

                <div className="flex items-center gap-3.5 pl-2.5 min-w-0 flex-1">
                  {/* Order controllers */}
                  <div className="flex flex-col gap-0.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onMoveItem(idx, "up")}
                      disabled={idx === 0}
                      className="p-0.5 rounded hover:bg-[#F6F7F9] dark:hover:bg-zinc-800 disabled:opacity-30 text-zinc-400 cursor-pointer"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onMoveItem(idx, "down")}
                      disabled={idx === items.length - 1}
                      className="p-0.5 rounded hover:bg-[#F6F7F9] dark:hover:bg-zinc-800 disabled:opacity-30 text-zinc-400 cursor-pointer"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Thumbnail type */}
                  <div className="p-2 bg-[#F6F7F9] dark:bg-[#171F2C] border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-zinc-400 shrink-0">
                    <Icon className="w-4 h-4 shrink-0" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
                      {item.name}
                    </span>
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-semibold block mt-0.5">
                      {item.type} · {item.dimensions}
                    </span>
                    
                    {/* Incompatible Alert banner */}
                    {hasWarning && (
                      <span className="inline-flex items-center gap-1 text-[8px] font-bold text-amber-500 uppercase mt-1 animate-pulse">
                        <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                        Orientation Mismatch
                      </span>
                    )}
                  </div>
                </div>

                {/* Duration and Transitions */}
                <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <div className="flex flex-col gap-1 w-16">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-400">Duration</span>
                    <input
                      type="number"
                      min="1"
                      value={item.duration}
                      onChange={(e) =>
                        onUpdateItem(idx, {
                          ...item,
                          duration: Math.max(1, parseInt(e.target.value) || 1)
                        })
                      }
                      className="px-1.5 py-0.5 text-[10px] font-bold bg-[#F6F7F9] dark:bg-[#171F2C] border border-[#E2E6EC] dark:border-[#283243] rounded text-center w-full focus:outline-none focus:ring-1 focus:ring-[#2859D9]"
                    />
                  </div>

                  <div className="flex flex-col gap-1 w-20">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-400">Transition</span>
                    <select
                      value={item.transition}
                      onChange={(e) =>
                        onUpdateItem(idx, {
                          ...item,
                          transition: e.target.value as any
                        })
                      }
                      className="px-1.5 py-0.5 text-[9px] font-bold bg-[#F6F7F9] dark:bg-[#171F2C] border border-[#E2E6EC] dark:border-[#283243] rounded text-zinc-700 dark:text-zinc-300 w-full focus:outline-none cursor-pointer"
                    >
                      <option value="Fade">Fade</option>
                      <option value="Crossfade">Crossfade</option>
                      <option value="Cut">Cut</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-0.5 border-l border-[#E2E6EC] dark:border-[#283243] pl-2.5">
                    <button
                      onClick={() => onDuplicateItem(idx)}
                      className="p-1 rounded text-zinc-450 hover:bg-[#F6F7F9] dark:hover:bg-zinc-800 hover:text-zinc-700 cursor-pointer"
                      title="Duplicate Item"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onRemoveItem(idx)}
                      className="p-1 rounded text-zinc-450 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 cursor-pointer"
                      title="Delete Item"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

// Small mock helper
function PlaySquare({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
      />
    </svg>
  );
}
