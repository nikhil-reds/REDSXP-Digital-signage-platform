"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Calendar, Layers, ChevronDown } from "lucide-react";
import ScheduleCalendar from "@/components/agent/schedules/schedule-calendar";
import ScheduleFormModal from "@/components/agent/schedules/schedule-form-modal";
import ConflictDialog from "@/components/agent/schedules/conflict-dialog";
import { ScheduleSummary, fetchSchedules } from "@/components/agent/schedules/api";
import { findConflicts, ScheduleConflict } from "@/components/agent/schedules/conflict-utils";
import { fetchScreenGroups, fetchScreenGroup } from "@/components/agent/screen-groups/api";
import { ScreenGroup } from "@/components/agent/screen-groups/groups-grid";

export default function AgentSchedulesPage() {
  const [schedules, setSchedules] = useState<ScheduleSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [groupFilter, setGroupFilter] = useState("All");
  const [screenGroups, setScreenGroups] = useState<ScreenGroup[]>([]);
  const [groupDeviceIds, setGroupDeviceIds] = useState<Record<string, string[]>>({});

  // Modals state
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleSummary | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [conflictModalData, setConflictModalData] = useState<{ c1: ScheduleSummary; c2: ScheduleSummary } | null>(null);

  const loadSchedules = useCallback(() => {
    return fetchSchedules()
      .then(setSchedules)
      .catch((err) => console.error("Failed to load schedules:", err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  useEffect(() => {
    let cancelled = false;

    fetchScreenGroups()
      .then(async (groups) => {
        if (cancelled) return;
        setScreenGroups(groups);
        const details = await Promise.all(groups.map((g) => fetchScreenGroup(g.id).catch(() => null)));
        if (cancelled) return;
        const map: Record<string, string[]> = {};
        groups.forEach((g, idx) => {
          const detail = details[idx];
          if (detail) map[g.id] = detail.deviceIds;
        });
        setGroupDeviceIds(map);
      })
      .catch((err) => console.error("Failed to load screen groups:", err));

    return () => {
      cancelled = true;
    };
  }, []);

  const conflicts: ScheduleConflict[] = useMemo(() => findConflicts(schedules), [schedules]);

  // Group filter application
  const filteredSchedules = schedules.filter((sch) => {
    if (groupFilter === "All") return true;
    const groupDevices = groupDeviceIds[groupFilter] ?? [];
    return sch.deviceIds.some((id) => groupDevices.includes(id));
  });

  const handleModalSaved = () => {
    setSelectedSchedule(null);
    setIsCreating(false);
    loadSchedules();
  };

  return (
    <div className="py-6 px-8 space-y-6 mx-auto font-sans">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E6EC] dark:border-[#283243] pb-5 shrink-0">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-55 tracking-tight">
            Signage Calendars & Scheduling
          </h1>
          <p className="text-xs text-[#657080] dark:text-[#9AA7B7]">
            Schedule playlists by date grids, hour slots, week filters, and resolve conflicts via priority weights.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Create Schedule Button */}
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] px-3.5 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Schedule</span>
          </button>
        </div>
      </div>

      {/* Group Filters panel */}
      <div className="p-4 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl flex items-center gap-3">
        <div className="relative w-64">
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="w-full pl-8 pr-8 py-1.5 border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-[#F6F7F9] dark:bg-[#171F2C]/50 text-xs text-zinc-700 dark:text-zinc-300 font-bold focus:outline-none appearance-none cursor-pointer"
          >
            <option value="All">All Screen Groups</option>
            {screenGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
          <Layers className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
        </div>
      </div>

      {/* Calendar Area */}
      <div className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center text-xs font-semibold text-zinc-400 dark:text-zinc-500 min-h-[300px] border border-[#E2E6EC] dark:border-[#283243] rounded-xl">
            Loading schedules…
          </div>
        ) : schedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 text-center min-h-[300px] border border-dashed border-[#E2E6EC] dark:border-[#283243] rounded-xl">
            <Calendar className="w-6 h-6 text-zinc-400 dark:text-zinc-500" />
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">No schedules yet.</p>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">Create a schedule to deploy playlists on a timeline.</p>
          </div>
        ) : (
          <ScheduleCalendar
            schedules={filteredSchedules}
            conflicts={conflicts}
            onSelectConflict={(c1, c2) => setConflictModalData({ c1, c2 })}
            onSelectSchedule={(sch) => setSelectedSchedule(sch)}
          />
        )}
      </div>

      {/* Render Scheduling Form */}
      {(selectedSchedule || isCreating) && (
        <ScheduleFormModal
          schedule={selectedSchedule}
          onClose={() => {
            setSelectedSchedule(null);
            setIsCreating(false);
          }}
          onSaved={handleModalSaved}
        />
      )}

      {/* Render Conflict dialog details */}
      {conflictModalData && (
        <ConflictDialog
          campaign1={conflictModalData.c1}
          campaign2={conflictModalData.c2}
          onClose={() => setConflictModalData(null)}
        />
      )}

    </div>
  );
}
