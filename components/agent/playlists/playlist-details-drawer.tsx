"use client";

import React, { useEffect, useRef, useState } from "react";
import { Edit2, Film, Trash2, X } from "lucide-react";
import { Button, Card, DataField, IconButton } from "@/components/ui";
import { fetchMediaLibrary, fetchPlaylist, type PlaylistDetail } from "./api";
import type { LibraryAsset, PlaylistSummary } from "./types";
import { formatDuration } from "./utils";

interface Props {
  playlist: PlaylistSummary;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
  deleteError?: string;
}

export default function PlaylistDetailsDrawer({ playlist, onClose, onEdit, onDelete, deleting, deleteError }: Props) {
  const panelRef = useRef<HTMLDialogElement>(null);
  const [docked, setDocked] = useState(false);
  const [detail, setDetail] = useState<PlaylistDetail | null>(null);
  const [media, setMedia] = useState<LibraryAsset[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const panel = panelRef.current;
    const host = panel?.parentElement;
    if (!panel || !host) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const observer = new ResizeObserver(([entry]) => setDocked(entry.contentRect.width >= 1440));
    observer.observe(host);
    return () => {
      observer.disconnect();
      panel.close();
      const selectedButton = Array.from(host.querySelectorAll<HTMLButtonElement>("[data-playlist-id]")).find((button) => button.dataset.playlistId === playlist.id && button.getClientRects().length > 0);
      (selectedButton ?? previousFocus)?.focus();
    };
  }, [playlist.id]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    panel.close();
    if (docked) panel.show(); else panel.showModal();
    const content = panel.parentElement?.querySelector<HTMLElement>(".playlists-content");
    const previousOverflow = content?.style.overflow;
    if (!docked && content) content.style.overflow = "hidden";
    return () => { if (content) content.style.overflow = previousOverflow ?? ""; };
  }, [docked]);

  useEffect(() => {
    let cancelled = false;
    // A failed media lookup must not prevent viewing the playlist itself.
    Promise.allSettled([fetchPlaylist(playlist.id), fetchMediaLibrary()]).then(([playlistResult, mediaResult]) => {
      if (cancelled) return;
      if (playlistResult.status === "fulfilled") setDetail(playlistResult.value);
      else setError(playlistResult.reason instanceof Error ? playlistResult.reason.message : "Unable to load playlist details.");
      if (mediaResult.status === "fulfilled") setMedia(mediaResult.value);
      setMediaError(mediaResult.status === "rejected");
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [playlist.id, attempt]);

  const retry = () => { setLoading(true); setError(null); setAttempt((value) => value + 1); };
  const mediaById = new Map(media.map((asset) => [asset.id, asset]));

  return (
    <dialog ref={panelRef} aria-label={`${playlist.name} details`}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={(event) => { if (docked && event.key === "Escape") { event.preventDefault(); onClose(); } }}
      onClick={(event) => { if (!docked && event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right) onClose(); } }}
      className={`playlist-details ${docked ? "playlist-details-docked" : "playlist-details-overlay"} bg-app-surface text-app-text border-l border-app-border shadow-2xl`}>
      <div className="playlist-details-header flex shrink-0 items-start justify-between gap-3 border-b border-app-border p-4">
        <div className="min-w-0"><p className="text-caption text-app-muted">Playlist details</p><h2 className="font-heading text-h6 font-semibold [overflow-wrap:anywhere]">{detail?.name ?? playlist.name}</h2></div>
        <IconButton icon={X} aria-label="Close playlist details" onClick={onClose} />
      </div>
      <div className="playlist-details-body min-h-0 flex-1 overflow-y-auto space-y-4 p-4">
        {deleteError && <p role="alert" className="rounded-lg bg-app-danger-surface p-3 text-body text-app-danger-text">{deleteError}</p>}
        {loading ? <p role="status" className="py-6 text-body text-app-muted">Loading playlist details…</p> : error ? (
          <Card size="row" padded><p role="alert" className="text-body text-app-danger-text">{error}</p><Button variant="secondary" className="mt-3" onClick={retry}>Try again</Button></Card>
        ) : detail && <>
          <Card size="row" padded className="space-y-3">
            <h3 className="font-semibold text-body">Overview</h3>
            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3">
              <DataField label="Clips" value={detail.items.length} />
              <DataField label="Total duration" value={formatDuration(detail.items.reduce((total, item) => total + item.durationSec, 0))} />
              <DataField label="Last updated" value={new Date(detail.updatedAt).toLocaleString()} />
            </div>
          </Card>
          <Card size="row" padded className="space-y-3">
            <h3 className="font-semibold text-body">Display configuration</h3>
            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3">
              <DataField label="Display" value={detail.displayName} />
              <DataField label="Resolution" value={`${detail.displayWidth} × ${detail.displayHeight}`} />
              <DataField label="Layout" value={detail.layoutMode === "custom-grid" ? `${detail.gridRows} × ${detail.gridColumns} grid` : "Zones"} />
              <DataField label="Zones in use" value={detail.items.length ? Array.from(new Set(detail.items.map((item) => detail.zones.find((zone) => zone.id === item.zoneId)?.name ?? "Default zone"))).join(", ") : "No clips assigned"} />
            </div>
          </Card>
          <Card size="row" padded className="space-y-2">
            <h3 className="font-semibold text-body">Publishing</h3>
            <DataField label="State" value={detail.publishState?.replaceAll("_", " ") || "Not available"} />
            {detail.syncError && <p className="text-body text-app-danger-text">{detail.syncError}</p>}
          </Card>
          <section className="space-y-3" aria-label="Content sequence">
            <h3 className="font-semibold text-body">Content sequence · {detail.items.length} clips</h3>
            {mediaError && <div className="text-body text-app-muted"><p>Media information couldn’t be loaded. Clip IDs and timing are still available.</p><Button variant="secondary" className="mt-2" onClick={retry}>Retry media</Button></div>}
            {!detail.items.length && <p className="text-body text-app-muted">This playlist has no clips yet. Open the editor to add content.</p>}
            <ol className="space-y-2">
              {detail.items.map((item, index) => {
                const asset = mediaById.get(item.mediaId);
                const zone = detail.zones.find((entry) => entry.id === item.zoneId);
                return <li key={item.id} className="flex items-start gap-3 rounded-lg border border-app-border p-3">
                  <span className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded bg-app-surface-alt">
                    {asset?.type === "Image" && asset.src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={asset.src} alt="" loading="lazy" className="h-full w-full object-contain" />
                    ) : <Film className="h-5 w-5 text-app-muted" aria-hidden />}
                  </span>
                  <div className="min-w-0 text-body"><p className="font-semibold">{index + 1}. {asset?.name ?? "Unavailable media"}</p><p className="text-caption text-app-muted">{asset?.type ?? item.mediaId} · {formatDuration(item.durationSec)}</p>{zone && <p className="text-caption text-app-muted">Zone: {zone.name}</p>}{asset && asset.status !== "Ready" && <p className="text-caption text-app-warning-text">{asset.status}</p>}</div>
                </li>;
              })}
            </ol>
          </section>
        </>}
        <div className="flex flex-wrap gap-2 border-t border-app-border pt-4">
          <Button variant="primary" icon={Edit2} onClick={onEdit}>Edit Playlist</Button>
          <Button variant="secondary" icon={Trash2} onClick={onDelete} disabled={deleting}>{deleting ? "Deleting…" : "Delete Playlist"}</Button>
        </div>
      </div>
    </dialog>
  );
}
