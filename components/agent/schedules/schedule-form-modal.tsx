"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Trash2 } from "lucide-react";
import { Button, Modal } from "@/components/ui";
import { ScheduleSummary, SaveSchedulePayload, createSchedule, updateSchedule, deleteSchedule } from "./api";
import { DAY_COLUMNS } from "./schedule-calendar";
import { fetchPlaylists } from "@/components/agent/playlists/api";
import { PlaylistSummary } from "@/components/agent/playlists/types";
import { fetchScreens } from "@/components/agent/screens/api";
import { ScreenDevice } from "@/components/agent/screens/screens-table";
import { fetchScreenGroups, fetchScreenGroup } from "@/components/agent/screen-groups/api";
import { ScreenGroup } from "@/components/agent/screen-groups/groups-grid";
import TimePicker from "./time-picker";

interface ScheduleFormModalProps {
  schedule: ScheduleSummary | null;
  onClose: () => void;
  onSaved: () => void;
}

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
}

export default function ScheduleFormModal({ schedule, onClose, onSaved }: ScheduleFormModalProps) {
  const isCreateMode = schedule === null;

  const [name, setName] = useState(schedule?.name ?? "");
  const [description, setDescription] = useState(schedule?.description ?? "");
  const [playlistId, setPlaylistId] = useState(schedule?.playlistId ?? "");
  const [startDate, setStartDate] = useState(schedule?.startDate ?? todayIso());
  const [endDate, setEndDate] = useState(schedule?.endDate ?? todayIso());
  const [dailyStartTime, setDailyStartTime] = useState(schedule?.dailyStartTime ?? "09:00");
  const [dailyEndTime, setDailyEndTime] = useState(schedule?.dailyEndTime ?? "17:00");
  const [priority, setPriority] = useState(String(schedule?.priority ?? 30));
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">(schedule?.status ?? "ACTIVE");
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(schedule?.daysOfWeek ?? [1, 2, 3, 4, 5, 6, 7]);
  const [deviceIds, setDeviceIds] = useState<string[]>(schedule?.deviceIds ?? []);

  const [playlists, setPlaylists] = useState<PlaylistSummary[]>([]);
  const [screens, setScreens] = useState<ScreenDevice[]>([]);
  const [screenGroups, setScreenGroups] = useState<ScreenGroup[]>([]);
  const [groupQuickPick, setGroupQuickPick] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([fetchPlaylists(), fetchScreens(), fetchScreenGroups()])
      .then(([playlistList, screenList, groupList]) => {
        if (cancelled) return;
        setPlaylists(playlistList);
        setScreens(screenList);
        setScreenGroups(groupList);
      })
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : "Failed to load data"))
      .finally(() => !cancelled && setIsLoading(false));

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleDay = (value: number) => {
    setDaysOfWeek((prev) => (prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]));
  };

  const toggleScreen = (id: string, checked: boolean) => {
    setDeviceIds((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  };

  const handleGroupQuickPick = async (groupId: string) => {
    setGroupQuickPick(groupId);
    if (!groupId) return;
    try {
      const detail = await fetchScreenGroup(groupId);
      setDeviceIds((prev) => Array.from(new Set([...prev, ...detail.deviceIds])));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load screen group");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const payload: SaveSchedulePayload = {
        name,
        description: description || null,
        playlistId,
        startDate,
        endDate,
        dailyStartTime,
        dailyEndTime,
        daysOfWeek,
        priority: parseInt(priority) || 0,
        status,
        deviceIds,
      };
      if (isCreateMode) {
        await createSchedule(payload);
      } else {
        await updateSchedule(schedule.id, payload);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save schedule");
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!schedule) return;
    if (!confirm(`Delete schedule "${schedule.name}"? This cannot be undone.`)) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteSchedule(schedule.id);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete schedule");
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={isCreateMode ? "Create Content Schedule" : "Edit Content Schedule"}
      description="Deploy playlists on target displays with timeline calendar boundaries and override rules."
      size="lg"
      footer={
        <>
          {!isCreateMode && (
            <Button
              type="button"
              variant="secondary"
              icon={Trash2}
              onClick={handleDelete}
              disabled={isDeleting || isSubmitting}
              className="mr-auto text-app-danger-text border-app-danger/30 hover:bg-app-danger-surface"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={onClose}>
            Discard
          </Button>
          <Button type="submit" form="schedule-form" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Publishing…" : "Publish Schedule"}
          </Button>
        </>
      }
    >
      <form id="schedule-form" onSubmit={handleSubmit} className="space-y-4">

          {/* Schedule name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-caption font-semibold uppercase tracking-headline text-app-muted">
              Schedule Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 bg-app-surface-alt border border-app-border rounded-lg text-xs text-app-text focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Playlist Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-caption font-semibold uppercase tracking-headline text-app-muted">
                Signage Playlist
              </label>
              <select
                value={playlistId}
                onChange={(e) => setPlaylistId(e.target.value)}
                className="w-full px-3 py-2 bg-app-surface-alt border border-app-border rounded-lg text-xs text-app-text font-semibold focus:outline-none cursor-pointer"
                required
              >
                <option value="" disabled>Select a playlist</option>
                {playlists.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-caption font-semibold uppercase tracking-headline text-app-muted">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "ACTIVE" | "INACTIVE")}
                className="w-full px-3 py-2 bg-app-surface-alt border border-app-border rounded-lg text-xs text-app-text font-semibold focus:outline-none cursor-pointer"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-caption font-semibold uppercase tracking-headline text-app-muted">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-1.5 bg-app-surface-alt border border-app-border rounded-lg text-xs text-app-text focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-caption font-semibold uppercase tracking-headline text-app-muted">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-1.5 bg-app-surface-alt border border-app-border rounded-lg text-xs text-app-text focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TimePicker label="Daily Start Time" value={dailyStartTime} onChange={setDailyStartTime} />
            <TimePicker label="Daily End Time" value={dailyEndTime} onChange={setDailyEndTime} />
          </div>

          {/* Days of week checklist */}
          <div className="flex flex-col gap-1.5">
            <span className="block text-caption font-semibold uppercase tracking-headline text-app-muted">Days of Week</span>
            <div className="flex justify-between gap-1 select-none">
              {DAY_COLUMNS.map((day) => {
                const isActive = daysOfWeek.includes(day.value);
                return (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className={`flex-1 py-2 rounded-lg text-caption font-semibold border transition-colors cursor-pointer text-center ${
                      isActive
                        ? "bg-app-accent-surface text-app-accent-text border-app-accent-text"
                        : "bg-white dark:bg-app-surface border-app-border text-app-muted"
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-1.5">
            <label className="text-caption font-semibold uppercase tracking-headline text-app-muted">
              Schedule Priority (0 - 100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3.5 py-1.5 bg-app-surface-alt border border-app-border rounded-lg text-xs text-app-text focus:outline-none font-semibold font-mono"
            />
          </div>

          {/* Assign from screen group quick-pick */}
          <div className="flex flex-col gap-1.5">
            <label className="text-caption font-semibold uppercase tracking-headline text-app-muted">
              Assign From Screen Group
            </label>
            <select
              value={groupQuickPick}
              onChange={(e) => handleGroupQuickPick(e.target.value)}
              className="w-full px-3 py-2 bg-app-surface-alt border border-app-border rounded-lg text-xs text-app-text font-semibold focus:outline-none cursor-pointer"
            >
              <option value="">Pick a group to bulk-assign its screens…</option>
              {screenGroups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.screensCount} screens)
                </option>
              ))}
            </select>
          </div>

          {/* Target Screens checklist */}
          <div className="flex flex-col gap-1.5">
            <label className="text-caption font-semibold uppercase tracking-headline text-app-muted">
              Target Screens ({deviceIds.length} assigned)
            </label>
            <div className="border border-app-border rounded-lg max-h-40 overflow-y-auto divide-y divide-app-border bg-white dark:bg-app-surface p-1">
              {isLoading ? (
                <p className="px-3 py-2 text-caption text-app-muted">Loading screens…</p>
              ) : screens.length === 0 ? (
                <p className="px-3 py-2 text-caption text-app-muted">No screens available yet.</p>
              ) : (
                screens.map((s) => {
                  const isAssigned = deviceIds.includes(s.id);
                  return (
                    <label
                      key={s.id}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-app-surface-alt rounded-md cursor-pointer text-body transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isAssigned}
                        onChange={(e) => toggleScreen(s.id, e.target.checked)}
                        className="rounded border-app-border focus:ring-app-accent-text"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="block font-semibold text-app-text">{s.name}</span>
                        <span className="text-caption text-app-muted">{s.group}</span>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Impact preview */}
          <div className="p-3.5 border border-app-accent/30 bg-app-accent-surface rounded-xl space-y-1.5">
            <h4 className="text-caption font-semibold uppercase tracking-headline text-app-accent-text flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Impact Preview Analysis
            </h4>
            <p className="text-caption text-app-muted leading-normal">
              This deployment will sync schedule config to{" "}
              <span className="font-semibold text-app-muted dark:text-white">{deviceIds.length} target players</span>.
            </p>
          </div>

          {error && <p className="text-caption font-semibold text-app-danger-text">{error}</p>}

      </form>
    </Modal>
  );
}
