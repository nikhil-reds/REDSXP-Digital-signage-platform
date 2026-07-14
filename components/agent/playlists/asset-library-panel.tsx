"use client";

import React from "react";
import { Code, Film, Grid2x2, Image as ImageIcon, List, Plus, Search } from "lucide-react";
import { ViewMode } from "./types";

interface LibraryCardData {
  name: string;
  size: string;
  dims: string;
  thumb: string;
  isVideo: boolean;
  isImage: boolean;
  isHtml: boolean;
  compatShort: string;
  compatOk: boolean;
  compatTip: string;
  onAdd: () => void;
}

interface FilterTab {
  label: string;
  active: boolean;
  onClick: () => void;
}

interface AssetLibraryPanelProps {
  search: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filterTabs: FilterTab[];
  viewMode: ViewMode;
  onGridMode: () => void;
  onListMode: () => void;
  items: LibraryCardData[];
  empty: boolean;
}

export default function AssetLibraryPanel({
  search,
  onSearchChange,
  filterTabs,
  viewMode,
  onGridMode,
  onListMode,
  items,
  empty,
}: AssetLibraryPanelProps) {
  const grid = viewMode === "grid";

  return (
    <aside className="w-[300px] bg-white dark:bg-[#111722] border-r border-[#E2E6EC] dark:border-[#283243] flex flex-col h-full font-sans shrink-0 overflow-hidden">
      <div className="p-3 pb-0 shrink-0">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-450 dark:text-zinc-500">
            Media Library
          </span>
          <div className="flex border border-[#E2E6EC] dark:border-[#283243] rounded-md overflow-hidden">
            <button
              onClick={onGridMode}
              title="Grid view"
              className={`w-[26px] h-6 flex items-center justify-center cursor-pointer ${
                grid ? "bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722]" : "bg-white dark:bg-[#111722] text-zinc-450"
              }`}
            >
              <Grid2x2 className="w-3 h-3" />
            </button>
            <button
              onClick={onListMode}
              title="List view"
              className={`w-[26px] h-6 flex items-center justify-center border-l border-[#E2E6EC] dark:border-[#283243] cursor-pointer ${
                !grid ? "bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722]" : "bg-white dark:bg-[#111722] text-zinc-450"
              }`}
            >
              <List className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="relative mb-2.5">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-450" />
          <input
            type="text"
            placeholder="Search assets…"
            value={search}
            onChange={onSearchChange}
            className="w-full pl-8 pr-3 py-1.5 bg-[#F6F7F9] dark:bg-[#18202E]/60 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-450 focus:outline-none focus:border-[#2859D9] dark:focus:border-[#6F96FF]"
          />
        </div>

        <div className="flex gap-1 border-b border-[#E2E6EC] dark:border-[#283243]">
          {filterTabs.map((tab) => (
            <button
              key={tab.label}
              onClick={tab.onClick}
              className={`px-2 py-1.5 -mb-px border-b-2 text-[11px] cursor-pointer transition-colors ${
                tab.active
                  ? "border-[#2859D9] dark:border-[#6F96FF] text-[#2859D9] dark:text-[#6F96FF] font-bold"
                  : "border-transparent text-zinc-450 font-medium hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`flex-1 overflow-y-auto p-3 gap-2 ${
          grid ? "grid grid-cols-2 content-start" : "flex flex-col"
        }`}
      >
        {items.map((item) => {
          const Icon = item.isVideo ? Film : item.isHtml ? Code : ImageIcon;
          return (
            <div
              key={item.name}
              title={item.compatTip}
              className={`border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-white dark:bg-[#111722] hover:border-[#2859D9]/40 dark:hover:border-[#6F96FF]/40 hover:shadow-md hover:-translate-y-px cursor-grab transition-all flex gap-2 ${
                grid ? "flex-col p-2" : "flex-row items-center p-2"
              }`}
            >
              <div
                className={`shrink-0 rounded-md flex items-center justify-center text-white/90 ${
                  grid ? "w-full h-14" : "w-9 h-9"
                }`}
                style={{ background: item.thumb }}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0 w-full">
                <div className="text-[11.5px] font-semibold text-zinc-900 dark:text-zinc-100 truncate">{item.name}</div>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <span className="font-mono text-[10px] text-zinc-450 dark:text-zinc-500">
                    {item.size} · {item.dims}
                  </span>
                  <span
                    className={`text-[9px] font-bold rounded px-1 ${
                      item.compatOk
                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                        : "text-amber-600 dark:text-amber-400 bg-amber-500/15"
                    }`}
                  >
                    {item.compatShort}
                  </span>
                </div>
              </div>
              <button
                onClick={item.onAdd}
                title="Add to timeline"
                className={`shrink-0 h-6 px-2 rounded-md border border-[#E2E6EC] dark:border-[#283243] bg-white dark:bg-[#111722] text-zinc-450 text-[11px] font-bold hover:bg-[#2859D9] hover:border-[#2859D9] hover:text-white dark:hover:bg-[#6F96FF] dark:hover:border-[#6F96FF] dark:hover:text-[#111722] cursor-pointer transition-colors flex items-center gap-1 ${
                  grid ? "self-stretch justify-center" : ""
                }`}
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>
          );
        })}
        {empty && (
          <div className="col-span-2 py-5 px-2 text-center text-xs text-zinc-450">No assets match your search.</div>
        )}
      </div>
    </aside>
  );
}
