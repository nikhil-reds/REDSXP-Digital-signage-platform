"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, Plus } from "lucide-react";
import PlaylistsTable from "@/components/agent/playlists/playlists-table";
import { PlaylistSummary } from "@/components/agent/playlists/types";
import { deletePlaylist, fetchPlaylists } from "@/components/agent/playlists/api";
import { Button, Card, EmptyState, PageShell, SearchInput } from "@/components/ui";

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

  const filteredPlaylists = playlists.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const editPlaylist = (playlist: PlaylistSummary) =>
    router.push(`/agent/playlists/create-playlist?id=${playlist.id}`);

  const removePlaylist = async (playlist: PlaylistSummary) => {
    if (!window.confirm(`Delete “${playlist.name}”? This cannot be undone.`)) return;
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
    <PageShell>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-app-border pb-5 shrink-0">
        <div>
          <h1 className="font-heading text-h5 font-semibold tracking-headline text-app-text">
            Playlists
          </h1>
          <p className="text-body text-app-muted mt-1">
            Build and manage content loops, then deploy them to screen groups and schedules.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => router.push("/agent/playlists/create-playlist")}
          className="self-start sm:self-auto"
        >
          Create Playlist
        </Button>
      </div>

      {/* Search bar */}
      <Card size="widget" padded>
        <SearchInput
          placeholder="Search playlist name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md"
        />
      </Card>

      {/* Table / states */}
      <div className="flex-1">
        {loading ? (
          <Card size="panel" className="min-h-[300px] flex items-center justify-center">
            <span className="flex items-center gap-2 text-body font-semibold text-app-muted">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading playlists…
            </span>
          </Card>
        ) : error ? (
          <Card size="panel" className="min-h-[300px] flex items-center justify-center">
            <EmptyState
              icon={AlertTriangle}
              title="Couldn’t load playlists"
              description={error}
              action={
                <Button variant="secondary" size="sm" onClick={() => setReloadKey((k) => k + 1)}>
                  Try again
                </Button>
              }
            />
          </Card>
        ) : (
          <PlaylistsTable
            playlists={filteredPlaylists}
            onEdit={editPlaylist}
            onDelete={removePlaylist}
          />
        )}
      </div>
    </PageShell>
  );
}
