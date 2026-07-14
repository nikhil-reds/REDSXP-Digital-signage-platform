"use client";

import React from "react";
import { Edit2, MonitorSmartphone, RectangleHorizontal, RectangleVertical } from "lucide-react";
import { PlaylistSummary } from "./types";
import { formatDuration } from "./utils";

interface PlaylistsTableProps {
  playlists: PlaylistSummary[];
  onEdit: (playlist: PlaylistSummary) => void;
}

export default function PlaylistsTable({ playlists, onEdit }: PlaylistsTableProps) {
  return (
    <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F6F7F9] dark:bg-[#171F2C]/50 text-[#657080] dark:text-[#9AA7B7] font-bold border-b border-[#E2E6EC] dark:border-[#283243] select-none">
              <th className="p-3.5">Playlist Name</th>
              <th className="p-3.5">Clips</th>
              <th className="p-3.5">Loop Duration</th>
              <th className="p-3.5">Orientation</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Last Updated</th>
              <th className="p-3.5 w-12 text-center">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E6EC] dark:divide-[#283243]">
            {playlists.map((playlist) => {
              const isPublished = playlist.status === "Published";
              const isLandscape = playlist.orientation === "Landscape";
              const OrientIcon = isLandscape ? RectangleHorizontal : RectangleVertical;
              return (
                <tr
                  key={playlist.id}
                  className="hover:bg-[#F6F7F9]/30 dark:hover:bg-[#171F2C]/10 transition-all"
                >
                  <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-50">{playlist.name}</td>
                  <td className="p-3.5 text-zinc-550 dark:text-zinc-400 font-semibold">
                    {playlist.itemCount} clips
                  </td>
                  <td className="p-3.5 text-zinc-500 font-mono text-[11px]">
                    {formatDuration(playlist.totalDuration)}
                  </td>
                  <td className="p-3.5">
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-bold border bg-zinc-50 text-zinc-600 dark:bg-zinc-800/40 dark:text-zinc-300 border-zinc-200/70 dark:border-zinc-700/60 inline-flex items-center gap-1">
                      <OrientIcon className="w-2.5 h-2.5 shrink-0" />
                      {playlist.orientation}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold border inline-flex items-center gap-1 ${
                        isPublished
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100/50"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-100/50"
                      }`}
                    >
                      {playlist.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-zinc-400 font-semibold font-mono text-[10px]">{playlist.updatedAt}</td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => onEdit(playlist)}
                      className="p-1 rounded-md text-zinc-450 hover:bg-[#F6F7F9] dark:hover:bg-[#171F2C] hover:text-[#2859D9] dark:hover:text-[#6F96FF] cursor-pointer"
                      title="Edit playlist"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {playlists.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-zinc-450">
          <MonitorSmartphone className="w-6 h-6" />
          <p className="text-xs">No playlists match your search.</p>
        </div>
      )}
    </div>
  );
}
