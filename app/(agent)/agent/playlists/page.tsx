"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Plus } from "lucide-react";
import "@/components/agent/playlists/playlists-responsive.css";
import PlaylistDetailsDrawer from "@/components/agent/playlists/playlist-details-drawer";
import PlaylistsTable from "@/components/agent/playlists/playlists-table";
import { PlaylistSummary } from "@/components/agent/playlists/types";
import { deletePlaylist, fetchPlaylists } from "@/components/agent/playlists/api";
import { Button, Card, CollectionPagination, CollectionToolbar, EmptyState, SearchInput, SkeletonTable } from "@/components/ui";

export default function AgentPlaylistsPage() {
  const router = useRouter();
  const [playlists, setPlaylists] = useState<PlaylistSummary[]>([]);
  const [loading, setLoading] = useState(true);
  // Plan §2: skeleton on first load only — a refetch keeps the current content
  // on screen rather than replacing it with grey bars.
  const isFirstLoad = loading && playlists.length === 0;


  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistSummary | null>(null);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<{ id: string; message: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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
    setDeletingId(playlist.id);
    setDeleteError(null);
    try {
      await deletePlaylist(playlist.id);
      setPlaylists((prev) => prev.filter((p) => p.id !== playlist.id));
      setSelectedPlaylist((current) => current?.id === playlist.id ? null : current);
    } catch (err) {
      setDeleteError({ id: playlist.id, message: err instanceof Error ? err.message : "Failed to delete playlist" });
    } finally { setDeletingId(null); }
  };

  return (
    <div className="playlists-page flex h-full min-h-0 overflow-hidden">
      <div className="playlists-content min-w-0 min-h-0 flex-1 flex flex-col gap-4 overflow-y-auto px-3 py-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-app-border pb-5 shrink-0">
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
      <Card size="widget" padded className="shrink-0 space-y-3">
        <div className="flex flex-wrap gap-3">
          <SearchInput className="min-w-0 flex-[1_1_220px]" aria-label="Search playlists" placeholder="Search playlist name…" value={search} onChange={(event) => { setSearch(event.target.value); resetPage(); }} />
          <Button variant="secondary" className="playlists-controls-toggle" aria-expanded={controlsOpen} aria-controls="playlist-controls" onClick={() => setControlsOpen(!controlsOpen)}>Sort & group{sort !== "updated-desc" || groupBy !== "none" ? " (" + (Number(sort !== "updated-desc") + Number(groupBy !== "none")) + ")" : ""}</Button>
        </div>
        <div id="playlist-controls" className={"playlists-controls " + (controlsOpen ? "is-open" : "")}>
        <CollectionToolbar
          sort={{ value: sort, onChange: (value) => { setSort(value); resetPage(); }, options: [
            { value: "updated-desc", label: "Last updated: newest" }, { value: "updated-asc", label: "Last updated: oldest" }, { value: "name-asc", label: "Name: A–Z" }, { value: "name-desc", label: "Name: Z–A" },
          ] }}
          groupBy={{ value: groupBy, onChange: (value) => { setGroupBy(value); resetPage(); }, options: [
            { value: "none", label: "No grouping" }, { value: "items", label: "Group by item count" }, { value: "duration", label: "Group by duration" },
          ] }}
          hasActiveControls={Boolean(search) || sort !== "updated-desc" || groupBy !== "none"}
          onClear={() => { setSearch(""); setSort("updated-desc"); setGroupBy("none"); resetPage(); }}
        />
        </div>
      </Card>
      {deleteError && <p role="alert" className="rounded-lg border border-app-danger-border bg-app-danger-surface p-3 text-body text-app-danger-text">{deleteError.message}</p>}

      {/* Table / states */}
      <div className="min-w-0 shrink-0">
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
        ) : playlists.length === 0 ? (
          <Card size="panel" className="p-6"><EmptyState title="No playlists yet" description="Create your first content loop to get started." action={<Button variant="primary" onClick={() => router.push("/agent/playlists/create-playlist")}>Create Playlist</Button>} /></Card>
        ) : visiblePlaylists.length === 0 ? (
          <Card size="panel" className="p-6"><EmptyState title="No matching playlists" description="Try a different playlist name." action={<Button variant="secondary" onClick={() => { setSearch(""); resetPage(); }}>Clear search</Button>} /></Card>
        ) : (
          <PlaylistsTable
            playlists={visiblePlaylists}
            onSelect={(playlist) => { setSelectedPlaylist(playlist); setDeleteError(null); }}
            selectedId={selectedPlaylist?.id}
            deletingId={deletingId}
            onEdit={editPlaylist}
            onDelete={removePlaylist}
          />
        )}
      </div>
      {!isFirstLoad && !error && (
        <CollectionPagination page={page} pageSize={pageSize} total={sortedPlaylists.length} onPageChange={setPage} onPageSizeChange={(value) => { setPageSize(value); resetPage(); }} />
      )}
      </div>
      {selectedPlaylist && <PlaylistDetailsDrawer key={selectedPlaylist.id} playlist={selectedPlaylist} onClose={() => setSelectedPlaylist(null)} onEdit={() => editPlaylist(selectedPlaylist)} onDelete={() => removePlaylist(selectedPlaylist)} deleting={deletingId === selectedPlaylist.id} deleteError={deleteError?.id === selectedPlaylist.id ? deleteError.message : undefined} />}
    </div>
  );
}
