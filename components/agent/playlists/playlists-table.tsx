"use client";

import React from "react";
import { Edit2, MonitorSmartphone, Trash2 } from "lucide-react";
import { PlaylistSummary } from "./types";
import { formatDuration } from "./utils";
import { Card, EmptyState, IconButton, Td, Th, Tr } from "@/components/ui";

interface PlaylistsTableProps {
  playlists: PlaylistSummary[];
  onEdit: (playlist: PlaylistSummary) => void;
  onDelete: (playlist: PlaylistSummary) => void;
}

export default function PlaylistsTable({ playlists, onEdit, onDelete }: PlaylistsTableProps) {
  return (
    <Card size="panel" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
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
              <Tr key={playlist.id} interactive>
                <Td className="font-semibold">{playlist.name}</Td>
                <Td className="text-app-muted">{playlist.itemCount} clips</Td>
                <Td className="text-app-muted">{formatDuration(playlist.totalDuration)}</Td>
                <Td className="text-app-muted">{playlist.updatedAt}</Td>
                <Td>
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
