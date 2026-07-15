"use client";

import React from "react";
import { Edit2, MonitorSmartphone, Trash2 } from "lucide-react";
import { PlaylistSummary } from "./types";
import { formatDuration } from "./utils";

interface PlaylistsTableProps {
  playlists: PlaylistSummary[];
  onEdit: (playlist: PlaylistSummary) => void;
  onDelete: (playlist: PlaylistSummary) => void;
}

export default function PlaylistsTable({ playlists, onEdit, onDelete }: PlaylistsTableProps) {
  return (
    <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F6F7F9] dark:bg-[#171F2C]/50 text-[#657080] dark:text-[#9AA7B7] font-bold border-b border-[#E2E6EC] dark:border-[#283243] select-none">
              <th className="p-3.5">Playlist Name</th>
              <th className="p-3.5">Clips</th>
              <th className="p-3.5">Loop Duration</th>
              <th className="p-3.5">Last Updated</th>
              <th className="p-3.5 w-20 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E6EC] dark:divide-[#283243]">
            {playlists.map((playlist) => (
              <tr key={playlist.id} className="hover:bg-[#F6F7F9]/30 dark:hover:bg-[#171F2C]/10 transition-all">
                <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-50">{playlist.name}</td>
                <td className="p-3.5 text-zinc-550 dark:text-zinc-400 font-semibold">{playlist.itemCount} clips</td>
                <td className="p-3.5 text-zinc-500 font-mono text-[11px]">
                  {formatDuration(playlist.totalDuration)}
                </td>
                <td className="p-3.5 text-zinc-400 font-semibold font-mono text-[10px]">{playlist.updatedAt}</td>
                <td className="p-3.5">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onEdit(playlist)}
                      className="p-1 rounded-md text-zinc-450 hover:bg-[#F6F7F9] dark:hover:bg-[#171F2C] hover:text-[#2859D9] dark:hover:text-[#6F96FF] cursor-pointer"
                      title="Edit playlist"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(playlist)}
                      className="p-1 rounded-md text-zinc-450 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
                      title="Delete playlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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
