"use client";

import React, { useEffect, useState } from "react";
import { X, Sparkles, WifiOff, CheckCircle2 } from "lucide-react";
import { ScreenGroup } from "./groups-grid";
import { createScreenGroup, fetchScreenGroup, updateScreenGroup } from "./api";
import { fetchScreens } from "@/components/agent/screens/api";
import { ScreenDevice } from "@/components/agent/screens/screens-table";
import { fetchPlaylists } from "@/components/agent/playlists/api";
import { PlaylistSummary } from "@/components/agent/playlists/types";

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
    if (checked) {
      setAssignedIds([...assignedIds, id]);
    } else {
      setAssignedIds(assignedIds.filter((x) => x !== id));
    }
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
    <div className="fixed inset-0 bg-black/55 dark:bg-black/80 flex items-center justify-center z-50 animate-fadeIn font-sans">
      <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl w-[520px] max-w-full shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">

        {/* Header */}
        <div className="p-5 border-b border-[#E2E6EC] dark:border-[#283243] flex justify-between items-center bg-[#F6F7F9]/50 dark:bg-[#171F2C]/20">
          <div>
            <h3 className="font-bold text-sm text-[#18202B] dark:text-[#F2F5F8]">
              {isCreateMode ? "Create Screen Group" : "Configure Screen Group"}
            </h3>
            <p className="text-[10px] text-[#657080] dark:text-[#9AA7B7] mt-0.5">
              Edit playlist, schedule allocation, and screen assignments.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">

          {/* Group Name input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Group Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-[#18202B] dark:text-[#F2F5F8] focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Playlist dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Assigned Playlist
              </label>
              <select
                value={playlistId}
                onChange={(e) => setPlaylistId(e.target.value)}
                className="w-full px-3 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-700 dark:text-zinc-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="">No Playlist</option>
                {playlists.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Schedule label */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Active Schedule
              </label>
              <input
                type="text"
                value={scheduleLabel}
                onChange={(e) => setScheduleLabel(e.target.value)}
                placeholder="e.g. Lunch Combos (11:00 AM–4:00 PM)"
                className="w-full px-3 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-700 dark:text-zinc-300 font-bold focus:outline-none"
              />
            </div>
          </div>

          {/* Screen Allocations List */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Assign Screens ({assignedIds.length} screens assigned)
            </label>
            <div className="border border-[#E2E6EC] dark:border-[#283243] rounded-lg max-h-40 overflow-y-auto divide-y divide-[#E2E6EC] dark:divide-[#283243] bg-white dark:bg-zinc-950 p-1">
              {isLoading ? (
                <p className="px-3 py-2 text-[11px] text-zinc-400 dark:text-zinc-500">Loading screens…</p>
              ) : screens.length === 0 ? (
                <p className="px-3 py-2 text-[11px] text-zinc-400 dark:text-zinc-500">No screens available yet.</p>
              ) : (
                screens.map((s) => {
                  const isAssigned = assignedIds.includes(s.id);
                  return (
                    <label
                      key={s.id}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-[#F6F7F9]/50 dark:hover:bg-[#171F2C]/20 rounded-md cursor-pointer text-xs transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isAssigned}
                        onChange={(e) => handleToggleScreen(s.id, e.target.checked)}
                        className="rounded border-[#E2E6EC] dark:border-[#283243] focus:ring-[#2859D9]"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="block font-bold text-zinc-800 dark:text-zinc-200">
                          {s.name}
                        </span>
                        {s.group !== "Unassigned" && s.group !== name && (
                          <span className="text-[9px] text-amber-500 font-semibold uppercase">
                            Currently in group &quot;{s.group}&quot;
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Publish Preview Panel */}
          <div className="p-3.5 border border-blue-100 dark:border-blue-900/30 bg-blue-50/20 dark:bg-blue-950/10 rounded-xl space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#2859D9] dark:text-[#6F96FF] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Publish Impact Summary
            </h4>
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 space-y-1 leading-relaxed">
              <p>● Changes will immediately sync to <span className="font-bold text-zinc-700 dark:text-zinc-200">{assignedIds.length} players</span>.</p>
              {alertsCount > 0 ? (
                <p className="flex items-center gap-1 text-amber-600 dark:text-amber-500 font-semibold">
                  <WifiOff className="w-3 h-3 shrink-0" />
                  {alertsCount} player{alertsCount > 1 ? "s" : ""} currently disconnected and will receive this manifest upon next heartbeat check-in.
                </p>
              ) : (
                <p className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500 font-semibold">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  All targeted screens are online and will update in &lt;10 seconds.
                </p>
              )}
            </div>
          </div>

          {error && <p className="text-[11px] font-semibold text-red-500">{error}</p>}

        </form>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#E2E6EC] dark:border-[#283243] flex gap-2 justify-end bg-[#F6F7F9]/50 dark:bg-[#171F2C]/20 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#E2E6EC] dark:border-[#283243] text-xs font-bold rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Discard
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] text-xs font-bold rounded-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? "Publishing..." : "Publish Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}
