"use client";

import React, { useState } from "react";
import { Search, Plus, Film, Image as ImageIcon, Code, Filter } from "lucide-react";

export interface LibraryItem {
  id: string;
  name: string;
  type: "Video" | "Image" | "HTML5";
  dimensions: string;
  size: string;
  duration?: number;
}

const mockLibrary: LibraryItem[] = [
  { id: "lib-1", name: "Monsoon_Cold_Coffee_15s.mp4", type: "Video", dimensions: "1920×1080", size: "42.8 MB", duration: 15 },
  { id: "lib-2", name: "Breakfast_Combo_Landscape.jpg", type: "Image", dimensions: "1920×1080", size: "4.2 MB", duration: 8 },
  { id: "lib-3", name: "Rewards_QR_July.html", type: "HTML5", dimensions: "Flexible", size: "8.7 MB", duration: 20 },
  { id: "lib-4", name: "Mango_Frappe_Promo_10s.mp4", type: "Video", dimensions: "1080×1920", size: "31.6 MB", duration: 10 },
  { id: "lib-5", name: "Store_Menu_July_v3.png", type: "Image", dimensions: "2160×3840", size: "12.4 MB", duration: 12 },
  { id: "lib-6", name: "Independence_Day_Teaser.mp4", type: "Video", dimensions: "1920×1080", size: "86.1 MB", duration: 20 },
  { id: "lib-7", name: "Summer_Blend_Promotion.mp4", type: "Video", dimensions: "1920×1080", size: "38.2 MB", duration: 15 },
  { id: "lib-8", name: "Espresso_Macchiato_Still.jpg", type: "Image", dimensions: "1920×1080", size: "2.1 MB", duration: 5 }
];

interface SearchableLibraryProps {
  onAddItem: (item: LibraryItem) => void;
}

export default function SearchableLibrary({ onAddItem }: SearchableLibraryProps) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");

  const filteredItems = mockLibrary.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "All" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="w-80 bg-white dark:bg-[#111722] border-r border-[#E2E6EC] dark:border-[#283243] flex flex-col h-full font-sans shrink-0 overflow-hidden">
      
      {/* Header Search */}
      <div className="p-4 border-b border-[#E2E6EC] dark:border-[#283243] space-y-2.5 bg-zinc-50/20 dark:bg-zinc-900/10 shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
          Media Library Assets
        </span>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search media assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8.5 pr-3 py-1.5 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-[#18202B] dark:text-[#F2F5F8] placeholder-zinc-450 focus:outline-none"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex gap-1.5 pt-1">
          {["All", "Video", "Image", "HTML5"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2 py-1 rounded text-[9px] font-bold border transition-colors cursor-pointer ${
                filterType === type
                  ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-950 dark:border-white"
                  : "bg-white dark:bg-zinc-900 border-[#E2E6EC] dark:border-[#283243] text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-350"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* List items */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-2">
        {filteredItems.map((item) => {
          const isVideo = item.type === "Video";
          const isHtml = item.type === "HTML5";
          const isPortrait = item.dimensions.startsWith("1080") || item.dimensions.startsWith("2160");
          const Icon = isVideo ? Film : isHtml ? Code : ImageIcon;

          return (
            <div
              key={item.id}
              className="p-2.5 border border-[#E2E6EC] dark:border-[#283243] rounded-lg hover:border-[#2859D9]/30 dark:hover:border-[#6F96FF]/30 bg-white dark:bg-[#171F2C]/30 flex items-center justify-between gap-3 group transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 bg-[#F6F7F9] dark:bg-[#171F2C] border border-[#E2E6EC] dark:border-[#283243] rounded text-zinc-400 shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate leading-tight">
                    {item.name}
                  </span>
                  <span className="text-[9px] text-zinc-400 dark:text-zinc-500 mt-0.5 block font-mono">
                    {item.size} · {item.dimensions} {isPortrait && "· Port"}
                  </span>
                </div>
              </div>

              {/* Add action */}
              <button
                onClick={() => onAddItem(item)}
                className="p-1 rounded bg-[#2859D9]/10 text-[#2859D9] hover:bg-[#2859D9] hover:text-white dark:bg-[#6F96FF]/10 dark:text-[#6F96FF] dark:hover:bg-[#6F96FF] dark:hover:text-[#111722] cursor-pointer transition-colors"
                title="Add to Playlist Loop"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
