"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, WifiOff, CheckCircle2 } from "lucide-react";
import { ScreenGroup } from "./groups-grid";
import { createScreenGroup, fetchScreenGroup, updateScreenGroup } from "./api";
import { fetchScreens } from "@/components/agent/screens/api";
import { ScreenDevice } from "@/components/agent/screens/screens-table";
import { fetchPlaylists } from "@/components/agent/playlists/api";
import { PlaylistSummary } from "@/components/agent/playlists/types";
import {
  Button,
  Checkbox,
  FieldLabel,
  Modal,
  Select,
  TextInput,
} from "@/components/ui";

interface GroupEditModalProps {
  group: ScreenGroup | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function GroupEditModal({ group, onClose, onSaved }: GroupEditModalProps) {
  const isCreateMode = group === null;

  const [name, setName] = useState(group?.name ?? "");
  const [playlistId, setPlaylistId] = useState("");
  const [scheduleLabel, setScheduleLabel] = useState("");
  const [screens, setScreens] = useState<ScreenDevice[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistSummary[]>([]);
  const [assignedIds, setAssignedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetchScreens(),
      fetchPlaylists(),
      group ? fetchScreenGroup(group.id) : Promise.resolve(null),
    ])
      .then(([screenList, playlistList, detail]) => {
        if (cancelled) return;
        setScreens(screenList);
        setPlaylists(playlistList);
        if (detail) {
          setPlaylistId(detail.currentPlaylistId ?? "");
          setScheduleLabel(detail.scheduleLabel ?? "");
          setAssignedIds(detail.deviceIds);
        }
      })
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : "Failed to load data"))
      .finally(() => !cancelled && setIsLoading(false));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleScreen = (id: string, checked: boolean) => {
    setAssignedIds((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        name,
        currentPlaylistId: playlistId || null,
        scheduleLabel: scheduleLabel || null,
        deviceIds: assignedIds,
      };
      if (isCreateMode) {
        await createScreenGroup(payload);
      } else {
        await updateScreenGroup(group.id, payload);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save screen group");
      setIsSubmitting(false);
    }
  };

  const alertsCount = group?.alertsCount ?? 0;

  return (
    <Modal
      open
      onClose={onClose}
      title={isCreateMode ? "Create Screen Group" : "Configure Screen Group"}
      description="Edit playlist, schedule allocation, and screen assignments."
      size="lg"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Discard
          </Button>
          <Button type="submit" form="group-edit-form" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Publishing…" : "Publish Changes"}
          </Button>
        </>
      }
    >
      <form id="group-edit-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <FieldLabel htmlFor="ge-name">Group Name</FieldLabel>
          <TextInput
            id="ge-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel htmlFor="ge-playlist">Assigned Playlist</FieldLabel>
            <Select
              id="ge-playlist"
              value={playlistId}
              onChange={(e) => setPlaylistId(e.target.value)}
            >
              <option value="">No Playlist</option>
              {playlists.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <FieldLabel htmlFor="ge-schedule">Active Schedule</FieldLabel>
            <TextInput
              id="ge-schedule"
              value={scheduleLabel}
              onChange={(e) => setScheduleLabel(e.target.value)}
              placeholder="e.g. Lunch Combos (11:00 AM–4:00 PM)"
            />
          </div>
        </div>

        {/* Screen Allocations List */}
        <div>
          <FieldLabel>Assign Screens ({assignedIds.length} screens assigned)</FieldLabel>
          <div className="border border-app-border rounded-lg max-h-40 overflow-y-auto divide-y divide-app-border bg-app-surface">
            {isLoading ? (
              <p className="px-3 py-2 text-body text-app-muted">Loading screens…</p>
            ) : screens.length === 0 ? (
              <p className="px-3 py-2 text-body text-app-muted">No screens available yet.</p>
            ) : (
              screens.map((s) => (
                <label
                  key={s.id}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-app-surface-alt cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={assignedIds.includes(s.id)}
                    onChange={(e) => handleToggleScreen(s.id, e.target.checked)}
                  />
                  <span className="flex-1 min-w-0">
                    <span className="block text-body font-semibold text-app-text truncate">
                      {s.name}
                    </span>
                    {s.group !== "Unassigned" && s.group !== name && (
                      <span className="block text-caption text-app-warning-text font-semibold uppercase tracking-headline">
                        Currently in group “{s.group}”
                      </span>
                    )}
                  </span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Publish Preview Panel */}
        <div className="p-3.5 border border-app-border bg-app-accent-surface rounded-lg space-y-2">
          <h4 className="text-caption font-semibold uppercase tracking-headline text-app-accent-text flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Publish Impact Summary
          </h4>
          <div className="text-body text-app-muted space-y-1">
            <p>
              Changes will immediately sync to{" "}
              <span className="font-semibold text-app-text">{assignedIds.length} players</span>.
            </p>
            {alertsCount > 0 ? (
              <p className="flex items-center gap-1.5 text-app-warning-text font-semibold">
                <WifiOff className="w-3.5 h-3.5 shrink-0" />
                {alertsCount} player{alertsCount > 1 ? "s" : ""} currently disconnected and will
                receive this manifest upon next heartbeat check-in.
              </p>
            ) : (
              <p className="flex items-center gap-1.5 text-app-accent-text font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                All targeted screens are online and will update in &lt;10 seconds.
              </p>
            )}
          </div>
        </div>

        {error && <p className="text-body font-semibold text-app-danger-text">{error}</p>}
      </form>
    </Modal>
  );
}
