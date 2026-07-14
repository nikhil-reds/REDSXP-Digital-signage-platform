"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import PlaylistsTable from "@/components/agent/playlists/playlists-table";
import { PlaylistSummary } from "@/components/agent/playlists/types";

const INITIAL_PLAYLISTS: PlaylistSummary[] = [
  { id: "pl-1", name: "Monsoon Café Promotions", itemCount: 4, totalDuration: 55, orientation: "Landscape", status: "Draft", updatedAt: "Today, 3:42 PM" },
  { id: "pl-2", name: "Airport Express Menu", itemCount: 6, totalDuration: 78, orientation: "Landscape", status: "Published", updatedAt: "Today, 1:15 PM" },
  { id: "pl-3", name: "Lunch Combos", itemCount: 5, totalDuration: 62, orientation: "Landscape", status: "Published", updatedAt: "Yesterday, 4:05 PM" },
  { id: "pl-4", name: "Mango Frappe Launch", itemCount: 3, totalDuration: 34, orientation: "Portrait", status: "Draft", updatedAt: "2 Jul 2026, 11:15 AM" },
  { id: "pl-5", name: "Store Loyalty Kiosk Loop", itemCount: 4, totalDuration: 48, orientation: "Portrait", status: "Published", updatedAt: "28 Jun 2026, 9:00 AM" },
  { id: "pl-6", name: "Independence Day Teaser Loop", itemCount: 2, totalDuration: 32, orientation: "Landscape", status: "Draft", updatedAt: "24 Jun 2026, 6:20 PM" },
];

export default function AgentPlaylistsPage() {
  const router = useRouter();
  const [playlists] = useState<PlaylistSummary[]>(INITIAL_PLAYLISTS);
  const [search, setSearch] = useState("");

  const filteredPlaylists = playlists.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const goToEditor = () => router.push("/agent/playlists/create-playlist");

  return (
    <div className="py-6 px-8 space-y-6 mx-auto font-sans">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E6EC] dark:border-[#283243] pb-5 shrink-0">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Playlists</h1>
          <p className="text-xs text-[#657080] dark:text-[#9AA7B7]">
            Build and manage content loops, then deploy them to screen groups and schedules.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            href="/agent/playlists/create-playlist"
            className="flex items-center gap-1.5 bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] px-3.5 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Playlist</span>
          </Link>
        </div>
      </div>

      {/* Search Input bar */}
      <div className="p-4 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl flex items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search playlist name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-[#18202B] dark:text-[#F2F5F8] placeholder-zinc-450 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1">
        <PlaylistsTable playlists={filteredPlaylists} onEdit={goToEditor} />
      </div>
    </div>
  );
}
