"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, Plus, Search } from "lucide-react";
import PlaylistsTable from "@/components/agent/playlists/playlists-table";
import { PlaylistSummary } from "@/components/agent/playlists/types";
import { deletePlaylist, fetchPlaylists } from "@/components/agent/playlists/api";

export default function AgentPlaylistsPage() {
  const router = useRouter();
  const [playlists, setPlaylists] = useState<PlaylistSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPlaylists();
        if (!cancelled) setPlaylists(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load playlists");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const filteredPlaylists = playlists.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const editPlaylist = (playlist: PlaylistSummary) => router.push(`/agent/playlists/create-playlist?id=${playlist.id}`);

  const removePlaylist = async (playlist: PlaylistSummary) => {
    if (!window.confirm(`Delete "${playlist.name}"? This can't be undone.`)) return;
    const previous = playlists;
    setPlaylists((prev) => prev.filter((p) => p.id !== playlist.id));
    try {
      await deletePlaylist(playlist.id);
    } catch (err) {
      setPlaylists(previous);
      alert(err instanceof Error ? err.message : "Failed to delete playlist");
    }
  };

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

      {/* Table / states */}
      <div className="flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-zinc-450">
            <Loader2 className="w-5 h-5 animate-spin" />
            <p className="text-xs font-semibold">Loading playlists…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center px-6">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Couldn&apos;t load playlists</p>
            <p className="text-xs text-zinc-450 max-w-sm">{error}</p>
            <button
              onClick={() => setReloadKey((k) => k + 1)}
              className="mt-1 text-xs font-bold text-[#2859D9] dark:text-[#6F96FF] hover:underline cursor-pointer"
            >
              Try again
            </button>
          </div>
        ) : (
          <PlaylistsTable playlists={filteredPlaylists} onEdit={editPlaylist} onDelete={removePlaylist} />
        )}
      </div>
    </div>
  );
}
