"use client";

import React, { useState } from "react";
import { Film, Image as ImageIcon, Code, AlertCircle, RefreshCw, Archive, Trash, Tag, Folder } from "lucide-react";
import { MediaAsset } from "./media-grid";

interface MediaTableProps {
  assets: MediaAsset[];
  onSelectMedia: (asset: MediaAsset) => void;
}

export default function MediaTable({ assets, onSelectMedia }: MediaTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(assets.map((a) => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    }
  };

  return (
    <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl overflow-hidden shadow-xs">
      
      {/* Bulk actions */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border-b border-blue-100 dark:border-blue-900/30 flex items-center justify-between gap-3 animate-fadeIn">
          <span className="text-xs font-bold text-[#2859D9] dark:text-[#6F96FF]">
            {selectedIds.length} assets selected
          </span>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-zinc-900 border border-[#E2E6EC] dark:border-[#283243] rounded text-[10px] font-bold text-zinc-700 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
              <Folder className="w-3.5 h-3.5 text-blue-500" />
              Move to Folder
            </button>
            <button className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-zinc-900 border border-[#E2E6EC] dark:border-[#283243] rounded text-[10px] font-bold text-zinc-700 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
              <Tag className="w-3.5 h-3.5 text-purple-500" />
              Add Tags
            </button>
            <button className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-zinc-900 border border-[#E2E6EC] dark:border-[#283243] rounded text-[10px] font-bold text-zinc-700 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
              <Archive className="w-3.5 h-3.5 text-amber-500" />
              Archive
            </button>
            <button className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-zinc-900 border border-[#E2E6EC] dark:border-[#283243] rounded text-[10px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer">
              <Trash className="w-3.5 h-3.5" />
              Delete Selected
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F6F7F9] dark:bg-[#171F2C]/50 text-[#657080] dark:text-[#9AA7B7] font-bold border-b border-[#E2E6EC] dark:border-[#283243] select-none">
              <th className="p-3.5 w-10 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.length === assets.length && assets.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-[#E2E6EC] dark:border-[#283243] focus:ring-[#2859D9]"
                />
              </th>
              <th className="p-3.5">Filename</th>
              <th className="p-3.5">Type</th>
              <th className="p-3.5">Resolution</th>
              <th className="p-3.5">File Size</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Assigned Playlists</th>
              <th className="p-3.5">Uploaded By</th>
              <th className="p-3.5">Date Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E6EC] dark:divide-[#283243]">
            {assets.map((asset) => {
              const isSelected = selectedIds.includes(asset.id);
              const Icon = asset.type === "Video" ? Film : asset.type === "HTML5" ? Code : ImageIcon;
              return (
                <tr
                  key={asset.id}
                  onClick={() => onSelectMedia(asset)}
                  className="hover:bg-[#F6F7F9]/30 dark:hover:bg-[#171F2C]/10 transition-all cursor-pointer"
                >
                  <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleSelectOne(asset.id, e.target.checked)}
                      className="rounded border-[#E2E6EC] dark:border-[#283243] focus:ring-[#2859D9]"
                    />
                  </td>
                  
                  {/* Name column */}
                  <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span className="truncate max-w-[200px]">{asset.name}</span>
                  </td>
                  
                  <td className="p-3.5 text-zinc-450 uppercase text-[9px] font-bold tracking-wide">
                    {asset.type}
                  </td>
                  <td className="p-3.5 text-zinc-500 font-mono text-[10px]">
                    {asset.dimensions}
                  </td>
                  <td className="p-3.5 text-zinc-500 font-mono text-[10px]">
                    {asset.size}
                  </td>

                  {/* Status chip */}
                  <td className="p-3.5">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold border inline-flex items-center gap-1.5 ${
                        asset.status === "Ready"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450 border-emerald-100/50"
                          : asset.status === "Failed"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-455 border-rose-100/50"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-450 border-amber-100/50"
                      }`}
                    >
                      {asset.status === "Transcoding" && <RefreshCw className="w-2.5 h-2.5 animate-spin" />}
                      {asset.status === "Failed" && <AlertCircle className="w-2.5 h-2.5" />}
                      <span>{asset.status}</span>
                    </span>
                  </td>

                  {/* Playlists count */}
                  <td className="p-3.5 font-semibold text-[#2859D9] dark:text-[#6F96FF]">
                    {asset.usedInPlaylists.length > 0 ? (
                      <span>{asset.usedInPlaylists.length} playlists</span>
                    ) : (
                      <span className="text-zinc-400 font-normal">Unused</span>
                    )}
                  </td>
                  
                  <td className="p-3.5 text-zinc-500">
                    {asset.uploader}
                  </td>
                  <td className="p-3.5 text-zinc-400 font-mono text-[10px]">
                    {asset.date}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
