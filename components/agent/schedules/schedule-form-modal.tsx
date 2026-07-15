"use client";

import React, { useEffect, useState } from "react";
import { X, Sparkles, Trash2 } from "lucide-react";
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
    <div className="fixed inset-0 bg-black/55 dark:bg-black/80 flex items-center justify-center z-50 animate-fadeIn font-sans">
      <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl w-[540px] max-w-full shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">

        {/* Header */}
        <div className="p-5 border-b border-[#E2E6EC] dark:border-[#283243] flex justify-between items-center bg-[#F6F7F9]/50 dark:bg-[#171F2C]/20">
          <div>
            <h3 className="font-bold text-sm text-[#18202B] dark:text-[#F2F5F8]">
              {isCreateMode ? "Create Content Schedule" : "Edit Content Schedule"}
            </h3>
            <p className="text-[10px] text-[#657080] dark:text-[#9AA7B7] mt-0.5">
              Deploy playlists on target displays with timeline calendar boundaries and override rules.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-55 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">

          {/* Schedule name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Schedule Name
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
            {/* Playlist Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Signage Playlist
              </label>
              <select
                value={playlistId}
                onChange={(e) => setPlaylistId(e.target.value)}
                className="w-full px-3 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-705 dark:text-zinc-300 font-bold focus:outline-none cursor-pointer"
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
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "ACTIVE" | "INACTIVE")}
                className="w-full px-3 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-705 dark:text-zinc-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-1.5 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-1.5 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
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
            <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Days of Week</span>
            <div className="flex justify-between gap-1 select-none">
              {DAY_COLUMNS.map((day) => {
                const isActive = daysOfWeek.includes(day.value);
                return (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer text-center ${
                      isActive
                        ? "bg-[#2859D9]/10 text-[#2859D9] border-[#2859D9]"
                        : "bg-white dark:bg-zinc-900 border-[#E2E6EC] dark:border-[#283243] text-zinc-500"
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
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Schedule Priority (0 - 100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3.5 py-1.5 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none font-bold font-mono"
            />
          </div>

          {/* Assign from screen group quick-pick */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Assign From Screen Group
            </label>
            <select
              value={groupQuickPick}
              onChange={(e) => handleGroupQuickPick(e.target.value)}
              className="w-full px-3 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-705 dark:text-zinc-300 font-bold focus:outline-none cursor-pointer"
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
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Target Screens ({deviceIds.length} assigned)
            </label>
            <div className="border border-[#E2E6EC] dark:border-[#283243] rounded-lg max-h-40 overflow-y-auto divide-y divide-[#E2E6EC] dark:divide-[#283243] bg-white dark:bg-zinc-950 p-1">
              {isLoading ? (
                <p className="px-3 py-2 text-[11px] text-zinc-400 dark:text-zinc-500">Loading screens…</p>
              ) : screens.length === 0 ? (
                <p className="px-3 py-2 text-[11px] text-zinc-400 dark:text-zinc-500">No screens available yet.</p>
              ) : (
                screens.map((s) => {
                  const isAssigned = deviceIds.includes(s.id);
                  return (
                    <label
                      key={s.id}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-[#F6F7F9]/50 dark:hover:bg-[#171F2C]/20 rounded-md cursor-pointer text-xs transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isAssigned}
                        onChange={(e) => toggleScreen(s.id, e.target.checked)}
                        className="rounded border-[#E2E6EC] dark:border-[#283243] focus:ring-[#2859D9]"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="block font-bold text-zinc-800 dark:text-zinc-200">{s.name}</span>
                        <span className="text-[9px] text-zinc-400">{s.group}</span>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Impact preview */}
          <div className="p-3.5 border border-blue-100 dark:border-blue-900/30 bg-blue-50/20 dark:bg-blue-950/10 rounded-xl space-y-1.5">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-[#2859D9] dark:text-[#6F96FF] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Impact Preview Analysis
            </h4>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal">
              This deployment will sync schedule config to{" "}
              <span className="font-bold text-zinc-800 dark:text-white">{deviceIds.length} target players</span>.
            </p>
          </div>

          {error && <p className="text-[11px] font-semibold text-red-500">{error}</p>}

        </form>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#E2E6EC] dark:border-[#283243] flex gap-2 justify-end bg-[#F6F7F9]/50 dark:bg-[#171F2C]/20 shrink-0 font-sans">
          {!isCreateMode && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 border border-red-200 dark:border-red-900/40 text-xs font-bold rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer disabled:opacity-60 mr-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#E2E6EC] dark:border-[#283243] text-xs font-bold rounded-lg text-zinc-650 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Discard
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] text-xs font-bold rounded-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? "Publishing..." : "Publish Schedule"}
          </button>
        </div>

      </div>
    </div>
  );
}
