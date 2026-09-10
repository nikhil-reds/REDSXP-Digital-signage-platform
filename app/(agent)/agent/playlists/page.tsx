"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Plus } from "lucide-react";
import PlaylistsTable from "@/components/agent/playlists/playlists-table";
import { PlaylistSummary } from "@/components/agent/playlists/types";
import { deletePlaylist, fetchPlaylists } from "@/components/agent/playlists/api";
import { Button, Card, CollectionPagination, CollectionToolbar, EmptyState, PageShell, SkeletonTable } from "@/components/ui";

export default function AgentPlaylistsPage() {
  const router = useRouter();
  const [playlists, setPlaylists] = useState<PlaylistSummary[]>([]);
  const [loading, setLoading] = useState(true);
  // Plan §2: skeleton on first load only — a refetch keeps the current content
  // on screen rather than replacing it with grey bars.
  const isFirstLoad = loading && playlists.length === 0;


  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("updated-desc");
  const [groupBy, setGroupBy] = useState("none");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
  const sortedPlaylists = [...filteredPlaylists].sort((a, b) => {
    if (groupBy === "items") return a.itemCount - b.itemCount || a.name.localeCompare(b.name);
    if (groupBy === "duration") return a.totalDuration - b.totalDuration || a.name.localeCompare(b.name);
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    if (sort === "name-desc") return b.name.localeCompare(a.name);
    const difference = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    return sort === "updated-asc" ? difference : -difference;
  });
  const totalPages = Math.max(1, Math.ceil(sortedPlaylists.length / pageSize));
  const visiblePlaylists = sortedPlaylists.slice((Math.min(page, totalPages) - 1) * pageSize, Math.min(page, totalPages) * pageSize);
  const resetPage = () => setPage(1);

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

      {/* Collection controls */}
      <Card size="widget" padded>
        <CollectionToolbar
          search={{ value: search, onChange: (value) => { setSearch(value); resetPage(); }, placeholder: "Search playlist name…" }}
          sort={{ value: sort, onChange: (value) => { setSort(value); resetPage(); }, options: [
            { value: "updated-desc", label: "Last updated: newest" }, { value: "updated-asc", label: "Last updated: oldest" }, { value: "name-asc", label: "Name: A–Z" }, { value: "name-desc", label: "Name: Z–A" },
          ] }}
          groupBy={{ value: groupBy, onChange: (value) => { setGroupBy(value); resetPage(); }, options: [
            { value: "none", label: "No grouping" }, { value: "items", label: "Group by item count" }, { value: "duration", label: "Group by duration" },
          ] }}
          hasActiveControls={Boolean(search) || sort !== "updated-desc" || groupBy !== "none"}
          onClear={() => { setSearch(""); setSort("updated-desc"); setGroupBy("none"); resetPage(); }}
        />
      </Card>

      {/* Table / states */}
      <div className="flex-1">
        {isFirstLoad ? (
          <Card size="panel" className="overflow-hidden">
            <SkeletonTable rows={6} cols={5} label="Loading playlists…" />
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
            playlists={visiblePlaylists}
            onEdit={editPlaylist}
            onDelete={removePlaylist}
          />
        )}
      </div>
      {!isFirstLoad && !error && (
        <CollectionPagination page={page} pageSize={pageSize} total={sortedPlaylists.length} onPageChange={setPage} onPageSizeChange={(value) => { setPageSize(value); resetPage(); }} />
      )}
    </PageShell>
  );
}
