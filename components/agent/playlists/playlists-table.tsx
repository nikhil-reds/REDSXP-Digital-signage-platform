"use client";

import React from "react";
import { Edit2, MonitorSmartphone, Trash2 } from "lucide-react";
import { PlaylistSummary } from "./types";
import { formatDuration } from "./utils";
import { Button, Card, EmptyState, IconButton, Td, Th, Tr } from "@/components/ui";

interface PlaylistsTableProps {
  playlists: PlaylistSummary[];
  onEdit: (playlist: PlaylistSummary) => void;
  onDelete: (playlist: PlaylistSummary) => void;
  onSelect: (playlist: PlaylistSummary) => void;
  selectedId?: string;
  deletingId: string | null;
}

export default function PlaylistsTable({ playlists, onEdit, onDelete, onSelect, selectedId, deletingId }: PlaylistsTableProps) {
  return (
    <Card size="panel" className="overflow-hidden">
      <div className="playlists-cards divide-y divide-app-border">
        {playlists.map((playlist) => (
          <article key={playlist.id} className={`min-w-0 p-4 space-y-3 ${selectedId === playlist.id ? "bg-app-accent-surface" : ""}`} onClick={() => onSelect(playlist)}>
            <button className="min-h-11 w-full text-left text-body font-semibold [overflow-wrap:anywhere]" data-playlist-id={playlist.id} aria-pressed={selectedId === playlist.id} onClick={(event) => { event.stopPropagation(); onSelect(playlist); }}>{playlist.name}</button>
            <dl className="grid grid-cols-2 gap-3 text-body">
              <div><dt className="text-caption text-app-muted">Clips</dt><dd>{playlist.itemCount}</dd></div>
              <div><dt className="text-caption text-app-muted">Duration</dt><dd>{formatDuration(playlist.totalDuration)}</dd></div>
              <div className="col-span-2"><dt className="text-caption text-app-muted">Last updated</dt><dd>{playlist.updatedAt}</dd></div>
            </dl>
            <div className="flex flex-wrap gap-2" onClick={(event) => event.stopPropagation()}>
              <Button variant="secondary" onClick={() => onSelect(playlist)}>Details</Button>
              <Button variant="secondary" icon={Edit2} onClick={() => onEdit(playlist)}>Edit</Button>
              <Button variant="ghost" icon={Trash2} disabled={deletingId !== null} onClick={() => onDelete(playlist)} aria-label={`Delete ${playlist.name}`}>Delete</Button>
            </div>
          </article>
        ))}
      </div>
      <div className="playlists-desktop-table overflow-x-auto" tabIndex={0} role="region" aria-label="Playlists table">
        <table className="w-full min-w-[720px] text-left border-collapse">
          <thead>
            <tr className="bg-app-surface-alt select-none">
              <Th>Playlist Name</Th>
              <Th>Clips</Th>
              <Th>Loop Duration</Th>
              <Th>Last Updated</Th>
              <Th className="w-20 text-center">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {playlists.map((playlist) => (
              <Tr key={playlist.id} interactive selected={selectedId === playlist.id} onClick={() => onSelect(playlist)}>
                <Td className="font-semibold"><button className="min-h-11 text-left [overflow-wrap:anywhere]" data-playlist-id={playlist.id} aria-pressed={selectedId === playlist.id} onClick={(event) => { event.stopPropagation(); onSelect(playlist); }}>{playlist.name}</button></Td>
                <Td className="text-app-muted">{playlist.itemCount} clips</Td>
                <Td className="text-app-muted">{formatDuration(playlist.totalDuration)}</Td>
                <Td className="text-app-muted">{playlist.updatedAt}</Td>
                <Td onClick={(event) => event.stopPropagation()}>
                  <div className="flex items-center justify-center gap-1">
                    <IconButton
                      icon={Edit2}
                      size="sm"
                      onClick={() => onEdit(playlist)}
                      aria-label={`Edit ${playlist.name}`}
                      title="Edit playlist"
                    />
                    <IconButton
                      icon={Trash2}
                      disabled={deletingId !== null}
                      size="sm"
                      onClick={() => onDelete(playlist)}
                      aria-label={`Delete ${playlist.name}`}
                      title="Delete playlist"
                      className="hover:text-app-danger-text hover:bg-app-danger-surface"
                    />
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </table>
      </div>

      {playlists.length === 0 && (
        <EmptyState
          icon={MonitorSmartphone}
          title="No playlists found"
          description="No playlists match your search."
        />
      )}
    </Card>
  );
}
