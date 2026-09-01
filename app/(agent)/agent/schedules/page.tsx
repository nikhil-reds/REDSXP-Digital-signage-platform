"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Calendar, Layers, ListChecks, AlertTriangle, Monitor } from "lucide-react";
import ScheduleCalendar from "@/components/agent/schedules/schedule-calendar";
import ScheduleFormModal from "@/components/agent/schedules/schedule-form-modal";
import ConflictDialog from "@/components/agent/schedules/conflict-dialog";
import { ScheduleSummary, fetchSchedules } from "@/components/agent/schedules/api";
import { findConflicts, ScheduleConflict } from "@/components/agent/schedules/conflict-utils";
import { fetchScreenGroups, fetchScreenGroup } from "@/components/agent/screen-groups/api";
import { ScreenGroup } from "@/components/agent/screen-groups/groups-grid";
import {
  Button,
  Card,
  EmptyState,
  PageShell,
  Select,
  Skeleton,
  SkeletonRegion,
  SkeletonStatGrid,
  StatGrid,
  StatTile,
} from "@/components/ui";

/**
 * The schedules page renders a month calendar, not a list, so it gets its own
 * skeleton rather than a table or card grid: a weekday header row over a 5x7
 * grid of day cells at the same min-height as the real calendar panel.
 */
function ScheduleCalendarSkeleton() {
  return (
    <SkeletonRegion label="Loading schedules…">
      <Card size="panel" padded className="min-h-[300px]">
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={`head-${index}`} className="h-3 w-10" />
          ))}
        </div>
        <div className="mt-3 grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, index) => (
            <Skeleton key={`cell-${index}`} className="h-14 rounded-lg" />
          ))}
        </div>
      </Card>
    </SkeletonRegion>
  );
}

export default function AgentSchedulesPage() {
  const [schedules, setSchedules] = useState<ScheduleSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [groupFilter, setGroupFilter] = useState("All");
  const [screenGroups, setScreenGroups] = useState<ScreenGroup[]>([]);
  const [groupDeviceIds, setGroupDeviceIds] = useState<Record<string, string[]>>({});

  // Modals state
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleSummary | null>(null);

  // Plan §2: skeleton on first load only — a refetch keeps the calendar on screen.
  const isFirstLoad = isLoading && schedules.length === 0;
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

  const handleEditConflictSchedule = (schedule: ScheduleSummary) => {
    setConflictModalData(null);
    setSelectedSchedule(schedule);
  };

  return (
    <PageShell>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-app-border pb-5 shrink-0">
        <div>
          <h1 className="font-heading text-h5 font-semibold tracking-headline text-app-text">
            Signage Calendars &amp; Scheduling
          </h1>
          <p className="text-body text-app-muted mt-1">
            Schedule playlists by date grids, hour slots, week filters, and resolve conflicts via priority weights.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setIsCreating(true)}
          className="self-start sm:self-auto"
        >
          Create Schedule
        </Button>
      </div>

      {isFirstLoad ? (
        <SkeletonStatGrid columns={4} label="Loading schedule counts…" />
      ) : (
      <StatGrid columns={4}>
        <StatTile label="Total Schedules" value={`${schedules.length}`} icon={ListChecks} />
        <StatTile label="Active Schedules" value={`${schedules.filter((s) => s.status === "ACTIVE").length}`} icon={Calendar} />
        <StatTile label="Conflicts" value={`${conflicts.length}`} icon={AlertTriangle} tone={conflicts.length ? "warning" : undefined} />
        <StatTile label="Targeted Screens" value={`${new Set(schedules.flatMap((s) => s.deviceIds)).size}`} icon={Monitor} />
      </StatGrid>
      )}

      {/* Group Filters panel */}
      <Card size="widget" padded className="flex items-center gap-3">
        <Select
          icon={Layers}
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          aria-label="Filter by screen group"
          className="w-64"
        >
          <option value="All">All Screen Groups</option>
          {screenGroups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </Select>
      </Card>

      {/* Calendar Area */}
      <div className="flex-1">
        {isFirstLoad ? (
          <ScheduleCalendarSkeleton />
        ) : schedules.length === 0 ? (
          <Card size="panel" className="min-h-[300px] flex items-center justify-center">
            <EmptyState
              icon={Calendar}
              title="No schedules yet"
              description="Create a schedule to deploy playlists on a timeline."
              action={
                <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsCreating(true)}>
                  Create Schedule
                </Button>
              }
            />
          </Card>
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
          onEditSchedule={handleEditConflictSchedule}
          onClose={() => setConflictModalData(null)}
        />
      )}
    </PageShell>
  );
}
