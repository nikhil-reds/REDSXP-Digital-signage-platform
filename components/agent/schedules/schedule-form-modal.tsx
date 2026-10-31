"use client";

import React, { useEffect, useState, useRef } from "react";
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
  const [screenQuery, setScreenQuery] = useState("");
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const discardRef = useRef<HTMLDivElement>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [isPickingGroup, setIsPickingGroup] = useState(false);
  const submitLock = useRef(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { if (confirmDiscard) { discardRef.current?.querySelector<HTMLButtonElement>('button')?.focus(); discardRef.current?.scrollIntoView({block:'nearest'}); } }, [confirmDiscard]);
  useEffect(() => { if (error) { feedbackRef.current?.focus(); feedbackRef.current?.scrollIntoView({block:'nearest'}); } }, [error]);

  const snapshot = JSON.stringify({name,description,playlistId,startDate,endDate,dailyStartTime,dailyEndTime,priority,status,daysOfWeek:[...daysOfWeek].sort(),deviceIds:[...deviceIds].sort()});
  const initialSnapshot = useRef(snapshot);
  const requestClose = () => { if (isSubmitting || isDeleting || isPickingGroup) return; if (snapshot !== initialSnapshot.current) setConfirmDiscard(true); else onClose(); };
  useEffect(() => {
    let cancelled = false;

    // Restart option loading when the user requests a retry.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
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
  }, [reloadKey]);

  const toggleDay = (value: number) => {
    setDaysOfWeek((prev) => (prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]));
  };

  const toggleScreen = (id: string, checked: boolean) => {
    setDeviceIds((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  };

  const handleGroupQuickPick = async (groupId: string) => {
    setGroupQuickPick(groupId);
    if (!groupId) return;
    setIsPickingGroup(true);
    try {
      const detail = await fetchScreenGroup(groupId);
      setDeviceIds((prev) => Array.from(new Set([...prev, ...detail.deviceIds])));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load screen group");
    } finally { setIsPickingGroup(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitLock.current || isDeleting || isLoading || isPickingGroup) return;
    if (!name.trim() || !playlistId) { setError("Enter a name and choose a playlist."); return; }
    if (endDate < startDate) { setError("End date must be on or after the start date."); return; }
    if (!daysOfWeek.length || !deviceIds.length) { setError("Select at least one weekday and one target screen."); return; }
    if (!dailyStartTime || !dailyEndTime || dailyEndTime <= dailyStartTime) { setError("Daily end time must be after start time. Use separate schedules for overnight playback."); return; }
    if (!Number.isInteger(Number(priority)) || Number(priority)<0 || Number(priority)>100) { setError("Priority must be a whole number from 0 to 100."); return; }
    submitLock.current = true;
    setIsSubmitting(true);
    setError(null);
    try {
      const payload: SaveSchedulePayload = {
        name: name.trim(),
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
      submitLock.current = false;
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
      onClose={requestClose}
      title={isCreateMode ? "Create Content Schedule" : "Edit Content Schedule"}
      description="Deploy playlists on target displays with timeline calendar boundaries and override rules."
      size="lg"
      className="schedule-form-dialog"
      footer={
        <>
          {!isCreateMode && (
            <Button
              type="button"
              variant="secondary"
              icon={Trash2}
              onClick={handleDelete}
              disabled={isDeleting || isSubmitting || confirmDiscard || isPickingGroup}
              className="mr-auto text-app-danger-text border-app-danger/30 hover:bg-app-danger-surface"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={requestClose} disabled={isSubmitting || isDeleting || isPickingGroup}>
            Discard
          </Button>
          <Button type="submit" form="schedule-form" variant="primary" disabled={isSubmitting || isDeleting || isLoading || isPickingGroup || confirmDiscard}>
            {isSubmitting ? "Publishing…" : "Publish Schedule"}
          </Button>
        </>
      }
    >
      {confirmDiscard && <div ref={discardRef} role="alert" className="mb-4 rounded-lg border border-app-warning p-3"><p>Discard your unsaved schedule changes?</p><div className="flex flex-wrap gap-2 mt-2"><Button onClick={() => setConfirmDiscard(false)}>Keep editing</Button><Button variant="secondary" onClick={onClose}>Discard changes</Button></div></div>}
      {error && <div ref={feedbackRef} tabIndex={-1} role="alert" className="mb-3 text-app-danger-text">{error}{!playlists.length && <Button onClick={() => { setError(null); setReloadKey(value=>value+1); }}>Retry loading options</Button>}</div>}
      <form id="schedule-form" onSubmit={handleSubmit} className="space-y-4" inert={confirmDiscard || isSubmitting || isDeleting}>
        <p className="text-caption text-app-muted">Dates and times use your browser timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}. Daily windows end on the same day.</p>

          {/* Schedule name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-caption font-semibold uppercase tracking-headline text-app-muted">
              Schedule Name
            </label>
            <input
              type="text"
              aria-label="Schedule name" value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 bg-app-surface-alt border border-app-border rounded-lg text-xs text-app-text focus:outline-none"
              required
            />
          </div>

          <label className="flex flex-col gap-1.5 text-caption text-app-muted">Description (optional)<textarea value={description} onChange={event=>setDescription(event.target.value)} className="rounded-lg border border-app-border bg-app-surface-alt p-3 text-app-text" rows={2}/></label>

          <div className="grid grid-cols-2 gap-4">
            {/* Playlist Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-caption font-semibold uppercase tracking-headline text-app-muted">
                Signage Playlist
              </label>
              <select
                aria-label="Signage playlist" value={playlistId}
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
                aria-label="Schedule status" value={status}
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
                aria-label="Start date" value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-1.5 bg-app-surface-alt border border-app-border rounded-lg text-xs text-app-text focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-caption font-semibold uppercase tracking-headline text-app-muted">End Date</label>
              <input
                type="date"
                aria-label="End date" value={endDate}
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
            <div className="schedule-weekdays flex justify-between gap-1 select-none">
              {DAY_COLUMNS.map((day) => {
                const isActive = daysOfWeek.includes(day.value);
                return (
                  <button
                    key={day.value}
                    aria-pressed={isActive}
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
              aria-label="Schedule priority" value={priority}
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
              aria-label="Assign from screen group" disabled={isPickingGroup || isLoading} value={groupQuickPick}
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
            <input type="search" aria-label="Search target screens" placeholder="Search screens…" value={screenQuery} onChange={event=>setScreenQuery(event.target.value)} className="rounded-lg border border-app-border bg-app-surface-alt p-3"/>
            <div className="flex flex-wrap gap-2"><Button type="button" variant="secondary" onClick={()=>setDeviceIds(ids=>Array.from(new Set([...ids,...screens.filter(screen=>screen.name.toLowerCase().includes(screenQuery.toLowerCase())).map(screen=>screen.id)])))}>Select matching screens</Button><Button type="button" variant="ghost" onClick={()=>setDeviceIds([])}>Clear selection</Button></div>
            {!isLoading && screens.length>0 && !screens.some(screen=>screen.name.toLowerCase().includes(screenQuery.toLowerCase())) && <p>No matching screens.</p>}
            <div className="border border-app-border rounded-lg max-h-40 overflow-y-auto divide-y divide-app-border bg-white dark:bg-app-surface p-1">
              {isLoading ? (
                <p className="px-3 py-2 text-caption text-app-muted">Loading screens…</p>
              ) : screens.length === 0 ? (
                <p className="px-3 py-2 text-caption text-app-muted">No screens available yet.</p>
              ) : (
                screens.filter(screen=>screen.name.toLowerCase().includes(screenQuery.toLowerCase())).map((s) => {
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



      </form>
    </Modal>
  );
}
