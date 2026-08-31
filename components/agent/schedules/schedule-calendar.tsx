"use client";

import React, { useMemo, useState } from "react";
import { AlertTriangle, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { ScheduleSummary } from "./api";
import { ScheduleConflict, findConflictsOnDate } from "./conflict-utils";
import {
  addDays,
  addMonths,
  formatFullDate,
  formatMonthYear,
  formatWeekRange,
  getMonthGridDates,
  getWeekDates,
  isSameDay,
  isSameMonth,
  isScheduleActiveOnDate,
  weekdayNumber,
} from "./date-utils";

interface ScheduleCalendarProps {
  schedules: ScheduleSummary[];
  conflicts: ScheduleConflict[];
  onSelectConflict: (a: ScheduleSummary, b: ScheduleSummary) => void;
  onSelectSchedule: (schedule: ScheduleSummary) => void;
}

type CalendarViewMode = "day" | "week" | "month" | "agenda";

export const DAY_COLUMNS: { label: string; value: number }[] = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 7 },
];

const HOUR_MARKS = [0, 3, 6, 9, 12, 15, 18, 21, 24];
const DAY_TIMELINE_HEIGHT = 600;

function formatHour(hour: number): string {
  const h = hour % 24;
  const period = h < 12 ? "AM" : "PM";
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display.toString().padStart(2, "0")} ${period}`;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function formatDays(daysOfWeek: number[]): string {
  if (daysOfWeek.length === 7) return "Daily";
  return DAY_COLUMNS.filter((d) => daysOfWeek.includes(d.value))
    .map((d) => d.label)
    .join(", ");
}

/**
 * Schedule block tone. Priority is a categorical scale, so it uses the approved
 * family: Blue for normal, brand Green for high priority. Conflicts use Amber
 * because an overlap genuinely is a warning state, not decoration.
 * (Was blue / purple / amber - purple is forbidden alongside green.)
 */
function priorityColorClasses(isConflict: boolean, isHighPriority: boolean) {
  if (isConflict) {
    return {
      block:
        "bg-app-warning-surface border-2 border-app-warning ring-2 ring-app-warning/20",
      text: "text-app-warning-text",
      dot: "bg-app-warning",
    };
  }
  if (isHighPriority) {
    return {
      block: "bg-app-accent-surface border border-app-accent/40 hover:border-app-accent",
      text: "text-app-accent-text",
      dot: "bg-app-accent-text",
    };
  }
  return {
    block: "bg-app-surface-alt border border-app-border-strong hover:border-app-accent-text",
    text: "text-app-text",
    dot: "bg-reds-blue",
  };
}

export default function ScheduleCalendar({
  schedules,
  conflicts,
  onSelectConflict,
  onSelectSchedule,
}: ScheduleCalendarProps) {
  const [viewMode, setViewMode] = useState<CalendarViewMode>("week");
  const [currentDate, setCurrentDate] = useState(() => new Date());

  // Date-agnostic view (agenda): "do these recurring configs ever collide" abstraction.
  const agendaConflictedIds = useMemo(() => {
    const ids = new Set<string>();
    conflicts.forEach((c) => {
      ids.add(c.a.id);
      ids.add(c.b.id);
    });
    return ids;
  }, [conflicts]);

  const findAgendaConflictPartner = (sch: ScheduleSummary): ScheduleSummary | null => {
    const pair = conflicts.find((c) => c.a.id === sch.id || c.b.id === sch.id);
    if (!pair) return null;
    return pair.a.id === sch.id ? pair.b : pair.a;
  };

  // Date-scoped conflicts for day/week/month grids: only counts as a conflict if the partner is
  // actually active on that exact rendered date, not just "shares some weekday" in the abstract.
  const dateConflictHelpers = (date: Date) => {
    const dateConflicts = findConflictsOnDate(schedules, date);
    const ids = new Set<string>();
    dateConflicts.forEach((c) => {
      ids.add(c.a.id);
      ids.add(c.b.id);
    });
    const findPartner = (sch: ScheduleSummary): ScheduleSummary | null => {
      const pair = dateConflicts.find((c) => c.a.id === sch.id || c.b.id === sch.id);
      if (!pair) return null;
      return pair.a.id === sch.id ? pair.b : pair.a;
    };
    return { ids, findPartner };
  };

  const handleBlockClick = (
    e: React.MouseEvent,
    sch: ScheduleSummary,
    isConflict: boolean,
    findPartner: (sch: ScheduleSummary) => ScheduleSummary | null
  ) => {
    if (isConflict) {
      e.stopPropagation();
      const partner = findPartner(sch);
      if (partner) onSelectConflict(sch, partner);
    } else {
      onSelectSchedule(sch);
    }
  };

  const goToday = () => setCurrentDate(new Date());
  const goPrev = () => {
    if (viewMode === "day") setCurrentDate((d) => addDays(d, -1));
    else if (viewMode === "week") setCurrentDate((d) => addDays(d, -7));
    else setCurrentDate((d) => addMonths(d, -1));
  };
  const goNext = () => {
    if (viewMode === "day") setCurrentDate((d) => addDays(d, 1));
    else if (viewMode === "week") setCurrentDate((d) => addDays(d, 7));
    else setCurrentDate((d) => addMonths(d, 1));
  };

  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);
  const monthDates = useMemo(() => getMonthGridDates(currentDate), [currentDate]);

  const rangeLabel =
    viewMode === "day"
      ? formatFullDate(currentDate)
      : viewMode === "week"
      ? formatWeekRange(weekDates)
      : viewMode === "month"
      ? formatMonthYear(currentDate)
      : "All Schedules";

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-app-surface border border-app-border rounded-xl overflow-hidden min-h-[500px]">

      {/* Top bar: view tabs + navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-app-border bg-app-surface-alt">
        <div className="flex items-center gap-0.5 p-0.5 border border-app-border rounded-lg bg-app-surface-alt w-fit">
          {(["day", "week", "month", "agenda"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setViewMode(v)}
              className={`px-3 py-1 rounded-md text-caption uppercase font-semibold tracking-headline transition-all duration-200 cursor-pointer ${
                viewMode === v
                  ? "bg-app-accent text-app-accent-on"
                  : "text-app-muted hover:text-app-text"
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {viewMode !== "agenda" && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 border border-app-border rounded-lg bg-app-surface-alt">
              <button
                onClick={goPrev}
                className="p-1.5 rounded-l-lg text-app-muted hover:bg-app-surface-alt hover:text-app-text transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={goToday}
                className="px-2.5 py-1 text-caption font-semibold uppercase text-app-muted hover:text-app-accent-text transition-colors cursor-pointer border-x border-app-border"
              >
                Today
              </button>
              <button
                onClick={goNext}
                className="p-1.5 rounded-r-lg text-app-muted hover:bg-app-surface-alt hover:text-app-text transition-colors cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="flex items-center gap-1.5 text-body font-semibold text-app-text min-w-[150px]">
              <CalendarDays className="w-3.5 h-3.5 text-app-accent-text" />
              {rangeLabel}
            </span>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="px-4 py-2.5 border-b border-app-border bg-app-surface-alt flex items-center justify-end gap-4 text-caption font-semibold text-app-muted">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-reds-blue rounded-sm" /> Normal (Priority &lt; 50)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-app-accent-text rounded-sm" /> High Priority (Priority &ge; 50)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-app-warning rounded-sm" /> Conflict Overlap
        </span>
      </div>

      {viewMode === "agenda" && (
        schedules.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-body font-semibold text-app-muted">
            No schedules yet.
          </div>
        ) : (
          <div className="p-4 divide-y divide-app-border overflow-y-auto">
            {schedules.map((sch) => {
              const isConflict = agendaConflictedIds.has(sch.id);
              return (
                <div
                  key={sch.id}
                  onClick={() => onSelectSchedule(sch)}
                  className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0 cursor-pointer hover:bg-app-surface-alt rounded-lg px-2 -mx-2 transition-colors"
                >
                  <div className="min-w-0">
                    <span className="text-caption bg-app-surface-alt text-app-muted font-semibold px-1.5 py-0.5 rounded border border-app-border uppercase">
                      P-{sch.priority}
                    </span>
                    <h4 className="text-body font-semibold text-app-text mt-1">
                      {sch.name}
                    </h4>
                    <p className="text-caption text-app-muted mt-0.5">
                      {sch.playlistName} · {formatDays(sch.daysOfWeek)} · {sch.dailyStartTime} - {sch.dailyEndTime}
                    </p>
                  </div>
                  <div
                    className="text-right shrink-0"
                    onClick={(e) => {
                      if (!isConflict) return;
                      e.stopPropagation();
                      const partner = findAgendaConflictPartner(sch);
                      if (partner) onSelectConflict(sch, partner);
                    }}
                  >
                    <span
                      className={`text-caption font-semibold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${
                        isConflict
                          ? "bg-app-warning-surface text-app-warning-text border-app-warning/30"
                          : sch.status === "ACTIVE"
                          ? "bg-app-accent-surface text-app-accent-text border-app-accent/30"
                          : "bg-app-surface-alt text-app-muted border-app-border"
                      }`}
                    >
                      {isConflict && <AlertTriangle className="w-3 h-3 text-app-warning-text" />}
                      {isConflict ? "Conflict" : sch.status === "ACTIVE" ? "Active" : "Inactive"}
                    </span>
                    <span className="block text-caption text-app-muted mt-1 font-semibold">
                      {sch.screensCount} Screens
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {viewMode === "week" && (
        <div className="flex-1 overflow-y-auto p-4 font-sans text-xs">
          <div className="grid grid-cols-8 border border-app-border rounded-xl overflow-hidden bg-app-surface divide-x divide-app-border">

            {/* Hour labels column */}
            <div className="relative bg-app-surface-alt" style={{ height: DAY_TIMELINE_HEIGHT + 32 }}>
              {HOUR_MARKS.map((hour) => (
                <span
                  key={hour}
                  className="absolute left-0 right-0 -translate-y-1/2 text-center text-app-muted font-semibold text-caption select-none uppercase tracking-headline"
                  style={{ top: 32 + (hour / 24) * DAY_TIMELINE_HEIGHT }}
                >
                  {formatHour(hour)}
                </span>
              ))}
            </div>

            {/* Day columns */}
            {weekDates.map((date) => {
              const daySchedules = schedules.filter((sch) => isScheduleActiveOnDate(sch, date));
              const { ids: dayConflictedIds, findPartner: findDayConflictPartner } = dateConflictHelpers(date);
              const today = isSameDay(date, new Date());
              return (
                <div
                  key={date.toISOString()}
                  className={`relative ${today ? "bg-app-accent-surface" : "bg-app-surface"} hover:bg-app-surface-alt transition-colors`}
                  style={{ height: DAY_TIMELINE_HEIGHT + 32 }}
                >
                  <div className="sticky top-0 z-10 h-8 flex flex-col items-center justify-center bg-app-surface border-b border-app-border select-none">
                    <span className="block text-caption font-semibold text-app-muted uppercase tracking-headline">
                      {DAY_COLUMNS[weekdayNumber(date) - 1].label}
                    </span>
                    <span className={`block text-caption font-semibold ${today ? "text-app-accent-text" : "text-app-text"}`}>
                      {date.getDate()}
                    </span>
                  </div>

                  {daySchedules.length === 0 && (
                    <span className="absolute inset-x-1 top-12 text-caption text-app-muted uppercase select-none font-semibold text-center">
                      Offline
                    </span>
                  )}

                  {daySchedules.map((sch) => {
                    const startMin = timeToMinutes(sch.dailyStartTime);
                    const endMin = timeToMinutes(sch.dailyEndTime);
                    const top = 32 + (startMin / 1440) * DAY_TIMELINE_HEIGHT;
                    const height = Math.max(((endMin - startMin) / 1440) * DAY_TIMELINE_HEIGHT, 20);
                    const isConflict = dayConflictedIds.has(sch.id);
                    const isHighPriority = sch.priority >= 50;
                    const colors = priorityColorClasses(isConflict, isHighPriority);

                    return (
                      <div
                        key={sch.id}
                        onClick={(e) => handleBlockClick(e, sch, isConflict, findDayConflictPartner)}
                        className={`absolute left-1 right-1 rounded-lg p-1.5 flex flex-col justify-between overflow-hidden transition-all cursor-pointer hover:scale-[1.02] ${colors.block}`}
                        style={{ top, height }}
                        title={`${sch.name} · ${sch.dailyStartTime} - ${sch.dailyEndTime}`}
                      >
                        <span className={`font-semibold text-caption block truncate ${colors.text}`}>{sch.name}</span>
                        <span className="text-caption text-app-muted block truncate">
                          {sch.dailyStartTime} - {sch.dailyEndTime}
                        </span>
                        {isConflict && (
                          <span className="flex items-center gap-1 text-caption text-app-warning-text font-semibold">
                            <AlertTriangle className="w-2.5 h-2.5 shrink-0 animate-pulse" />
                            Conflict
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === "day" && (
        <div className="flex-1 overflow-y-auto p-4 font-sans text-xs">
          {(() => {
            const daySchedules = schedules.filter((sch) => isScheduleActiveOnDate(sch, currentDate));
            const { ids: dayConflictedIds, findPartner: findDayConflictPartner } = dateConflictHelpers(currentDate);
            return (
              <div className="grid grid-cols-[80px_1fr] border border-app-border rounded-xl overflow-hidden bg-app-surface divide-x divide-app-border">
                <div className="relative bg-app-surface-alt" style={{ height: DAY_TIMELINE_HEIGHT }}>
                  {HOUR_MARKS.map((hour) => (
                    <span
                      key={hour}
                      className="absolute left-0 right-0 -translate-y-1/2 text-center text-app-muted font-semibold text-caption select-none uppercase tracking-headline"
                      style={{ top: (hour / 24) * DAY_TIMELINE_HEIGHT }}
                    >
                      {formatHour(hour)}
                    </span>
                  ))}
                </div>

                <div className="relative bg-app-surface" style={{ height: DAY_TIMELINE_HEIGHT }}>
                  {HOUR_MARKS.slice(1, -1).map((hour) => (
                    <div
                      key={hour}
                      className="absolute left-0 right-0 border-t border-dashed border-app-border"
                      style={{ top: (hour / 24) * DAY_TIMELINE_HEIGHT }}
                    />
                  ))}

                  {daySchedules.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-body font-semibold text-app-muted">
                      No schedules active on this day.
                    </div>
                  )}

                  {daySchedules.map((sch) => {
                    const startMin = timeToMinutes(sch.dailyStartTime);
                    const endMin = timeToMinutes(sch.dailyEndTime);
                    const top = (startMin / 1440) * DAY_TIMELINE_HEIGHT;
                    const height = Math.max(((endMin - startMin) / 1440) * DAY_TIMELINE_HEIGHT, 28);
                    const isConflict = dayConflictedIds.has(sch.id);
                    const isHighPriority = sch.priority >= 50;
                    const colors = priorityColorClasses(isConflict, isHighPriority);

                    return (
                      <div
                        key={sch.id}
                        onClick={(e) => handleBlockClick(e, sch, isConflict, findDayConflictPartner)}
                        className={`absolute left-3 right-3 rounded-lg p-2.5 flex flex-col justify-between overflow-hidden transition-all cursor-pointer hover:scale-[1.01] ${colors.block}`}
                        style={{ top, height }}
                      >
                        <div>
                          <span className={`font-semibold text-caption block truncate ${colors.text}`}>{sch.name}</span>
                          <span className="text-caption text-app-muted block truncate">
                            {sch.playlistName} · {sch.screensCount} screens
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-caption text-app-muted font-semibold">
                          <span>{sch.dailyStartTime} - {sch.dailyEndTime}</span>
                          {isConflict && (
                            <span className="flex items-center gap-1 text-app-warning-text">
                              <AlertTriangle className="w-3 h-3 shrink-0 animate-pulse" />
                              Conflict
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {viewMode === "month" && (
        <div className="flex-1 overflow-y-auto p-4 font-sans text-xs">
          <div className="grid grid-cols-7 border border-app-border rounded-xl overflow-hidden bg-app-surface">
            {DAY_COLUMNS.map((day) => (
              <div
                key={day.label}
                className="text-center text-caption font-semibold uppercase tracking-headline text-app-muted py-2 bg-app-surface-alt border-b border-app-border"
              >
                {day.label}
              </div>
            ))}

            {monthDates.map((date) => {
              const daySchedules = schedules.filter((sch) => isScheduleActiveOnDate(sch, date));
              const { ids: dayConflictedIds, findPartner: findDayConflictPartner } = dateConflictHelpers(date);
              const inMonth = isSameMonth(date, currentDate);
              const today = isSameDay(date, new Date());
              const visible = daySchedules.slice(0, 3);
              const overflowCount = daySchedules.length - visible.length;

              return (
                <div
                  key={date.toISOString()}
                  onClick={() => {
                    setCurrentDate(date);
                    setViewMode("day");
                  }}
                  className={`min-h-[92px] p-1.5 border-b border-r border-app-border cursor-pointer transition-colors ${
                    inMonth ? "bg-app-surface hover:bg-app-surface-alt" : "bg-app-surface-alt/60 hover:bg-app-surface-alt"
                  }`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-caption font-semibold select-none ${
                      today
                        ? "bg-app-accent text-app-accent-on"
                        : inMonth
                        ? "text-app-text"
                        : "text-app-muted"
                    }`}
                  >
                    {date.getDate()}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {visible.map((sch) => {
                      const isConflict = dayConflictedIds.has(sch.id);
                      const isHighPriority = sch.priority >= 50;
                      const colors = priorityColorClasses(isConflict, isHighPriority);
                      return (
                        <div
                          key={sch.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBlockClick(e, sch, isConflict, findDayConflictPartner);
                          }}
                          className={`px-1 py-0.5 rounded text-caption font-semibold truncate flex items-center gap-1 transition-all hover:scale-[1.02] ${colors.block} ${colors.text}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`} />
                          {sch.name}
                        </div>
                      );
                    })}
                    {overflowCount > 0 && (
                      <span className="block text-caption font-semibold text-app-muted pl-1">+{overflowCount} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
