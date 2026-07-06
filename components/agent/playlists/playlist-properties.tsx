"use client";

import React from "react";
import { Sliders, History, Calendar, RotateCcw, AlertCircle, Sparkles } from "lucide-react";
import { PlaylistItem } from "./playlist-timeline";

interface PlaylistPropertiesProps {
  selectedItem: PlaylistItem | null;
  onUpdateItem: (updated: PlaylistItem) => void;
  orientation: "Landscape" | "Portrait";
  onUpdateOrientation: (orient: "Landscape" | "Portrait") => void;
  onRestoreVersion: (version: any) => void;
}

const mockVersions = [
  { id: "ver-3", version: "v1.2 (Active)", date: "Today, 3:42 PM", author: "Aarav Mehta", desc: "Added Monsoon Cold Coffee video asset." },
  { id: "ver-2", version: "v1.1", date: "2 Jul 2026, 11:15 AM", author: "System Auto", desc: "Updated Breakfast Promo timing parameter." },
  { id: "ver-1", version: "v1.0", date: "28 Jun 2026, 9:00 AM", author: "Rohan Das", desc: "Initial sequence configuration." }
];

export default function PlaylistProperties({
  selectedItem,
  onUpdateItem,
  orientation,
  onUpdateOrientation,
  onRestoreVersion
}: PlaylistPropertiesProps) {
  
  return (
    <div className="w-80 bg-white dark:bg-[#111722] border-l border-[#E2E6EC] dark:border-[#283243] flex flex-col h-full font-sans shrink-0 overflow-y-auto">
      
      {/* Tab Header */}
      <div className="p-4 border-b border-[#E2E6EC] dark:border-[#283243] bg-zinc-50/20 dark:bg-zinc-900/10 shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
          Playlist Properties
        </span>
      </div>

      <div className="p-4 space-y-5 text-xs flex-1">
        
        {/* SECTION 1: SELECTED ITEM DETAILS */}
        {selectedItem ? (
          <div className="space-y-3.5 p-3.5 border border-[#E2E6EC] dark:border-[#283243] rounded-xl bg-zinc-50/10 dark:bg-zinc-950/10">
            <h4 className="font-bold text-zinc-800 dark:text-zinc-200 text-xs flex items-center gap-1.5 border-b border-[#E2E6EC] dark:border-[#283243] pb-2">
              <Sliders className="w-4 h-4 text-[#2859D9]" />
              Track Item Settings
            </h4>
            
            <div className="space-y-3">
              <div>
                <span className="block text-[9px] uppercase font-bold text-zinc-400">Name</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200 block truncate mt-0.5">{selectedItem.name}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="block text-[9px] uppercase font-bold text-zinc-400">Timing Override</span>
                  <div className="flex items-center gap-1 mt-1">
                    <input
                      type="number"
                      min="1"
                      value={selectedItem.duration}
                      onChange={(e) =>
                        onUpdateItem({
                          ...selectedItem,
                          duration: Math.max(1, parseInt(e.target.value) || 1)
                        })
                      }
                      className="px-2 py-1 bg-white dark:bg-zinc-900 border border-[#E2E6EC] dark:border-[#283243] rounded text-center w-full focus:outline-none"
                    />
                    <span className="text-zinc-400 font-bold">s</span>
                  </div>
                </div>

                <div>
                  <span className="block text-[9px] uppercase font-bold text-zinc-400">Transition Time</span>
                  <div className="flex items-center gap-1 mt-1">
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={selectedItem.transitionDuration}
                      onChange={(e) =>
                        onUpdateItem({
                          ...selectedItem,
                          transitionDuration: Math.max(0, parseFloat(e.target.value) || 0)
                        })
                      }
                      className="px-2 py-1 bg-white dark:bg-zinc-900 border border-[#E2E6EC] dark:border-[#283243] rounded text-center w-full focus:outline-none"
                    />
                    <span className="text-zinc-400 font-bold">s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border border-dashed border-[#E2E6EC] dark:border-[#283243] rounded-xl text-center text-zinc-400 bg-zinc-50/10">
            Select an item on the timeline to inspect properties.
          </div>
        )}

        {/* SECTION 2: GLOBAL SETTINGS */}
        <div className="space-y-4 pt-3.5 border-t border-[#E2E6EC] dark:border-[#283243]">
          <h4 className="font-bold text-zinc-800 dark:text-zinc-200 text-xs">
            Global Loop Settings
          </h4>

          {/* Orientation selectors */}
          <div className="flex flex-col gap-1.5">
            <span className="block text-[9px] uppercase font-bold text-zinc-400">Layout Orientation</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdateOrientation("Landscape")}
                className={`py-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer text-center ${
                  orientation === "Landscape"
                    ? "bg-[#2859D9]/10 text-[#2859D9] border-[#2859D9]"
                    : "bg-white dark:bg-zinc-900 border-[#E2E6EC] dark:border-[#283243] text-zinc-500"
                }`}
              >
                Landscape (16:9)
              </button>
              <button
                type="button"
                onClick={() => onUpdateOrientation("Portrait")}
                className={`py-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer text-center ${
                  orientation === "Portrait"
                    ? "bg-[#2859D9]/10 text-[#2859D9] border-[#2859D9]"
                    : "bg-white dark:bg-zinc-900 border-[#E2E6EC] dark:border-[#283243] text-zinc-500"
                }`}
              >
                Portrait (9:16)
              </button>
            </div>
          </div>

          {/* Fallback Selector */}
          <div className="flex flex-col gap-1.5">
            <span className="block text-[9px] uppercase font-bold text-zinc-400">Fallback Loop Chain</span>
            <select className="w-full px-2 py-1.5 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-700 dark:text-zinc-300 font-bold focus:outline-none cursor-pointer">
              <option>Default Emergency Loop</option>
              <option>Corporate Standard Loop</option>
              <option>None (Black Screen Fallback)</option>
            </select>
          </div>
        </div>

        {/* SECTION 3: VERSION HISTORY */}
        <div className="space-y-3.5 pt-4 border-t border-[#E2E6EC] dark:border-[#283243] flex-1">
          <h4 className="font-bold text-zinc-800 dark:text-zinc-200 text-xs flex items-center gap-1.5">
            <History className="w-4 h-4 text-zinc-400" />
            Release Version History
          </h4>
          
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {mockVersions.map((v) => (
              <div
                key={v.id}
                className="p-2.5 border border-[#E2E6EC] dark:border-[#283243] bg-zinc-50/10 dark:bg-zinc-950/10 rounded-lg space-y-1.5"
              >
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-[#2859D9] dark:text-[#6F96FF]">{v.version}</span>
                  <span className="text-zinc-400 font-mono font-normal">{v.date}</span>
                </div>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal">{v.desc}</p>
                <div className="flex justify-between items-center text-[9px] border-t border-[#E2E6EC]/60 dark:border-[#283243]/60 pt-1.5">
                  <span className="text-zinc-400">By {v.author}</span>
                  {v.version !== "v1.2 (Active)" && (
                    <button
                      type="button"
                      onClick={() => onRestoreVersion(v)}
                      className="text-[#2859D9] dark:text-[#6F96FF] font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                    >
                      <RotateCcw className="w-2.5 h-2.5" /> Revert
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
