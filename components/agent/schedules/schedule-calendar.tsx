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

function priorityColorClasses(isConflict: boolean, isHighPriority: boolean) {
  if (isConflict) {
    return {
      block: "bg-gradient-to-br from-amber-500/20 to-amber-500/10 border-2 border-amber-500 hover:from-amber-500/30 hover:to-amber-500/15 ring-2 ring-amber-500/10",
      text: "text-amber-700 dark:text-amber-400",
      dot: "bg-amber-500",
    };
  }
  if (isHighPriority) {
    return {
      block: "bg-gradient-to-br from-purple-500/15 to-purple-500/5 border border-purple-500/30 hover:from-purple-500/20 hover:to-purple-500/10",
      text: "text-purple-600 dark:text-purple-400",
      dot: "bg-purple-500",
    };
  }
  return {
    block: "bg-gradient-to-br from-blue-500/15 to-blue-500/5 border border-blue-500/30 hover:from-blue-500/20 hover:to-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500",
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
    <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-2xl overflow-hidden shadow-md min-h-[500px]">

      {/* Top bar: view tabs + navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-[#E2E6EC] dark:border-[#283243] bg-gradient-to-r from-[#F6F7F9] to-white dark:from-[#171F2C]/40 dark:to-[#111722]">
        <div className="flex items-center gap-0.5 p-0.5 border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-white dark:bg-[#111722] shadow-xs w-fit">
          {(["day", "week", "month", "agenda"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setViewMode(v)}
              className={`px-3 py-1 rounded-md text-[10px] uppercase font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                viewMode === v
                  ? "bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] shadow-sm"
                  : "text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300"
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {viewMode !== "agenda" && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-white dark:bg-[#111722] shadow-xs">
              <button
                onClick={goPrev}
                className="p-1.5 rounded-l-lg text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={goToday}
                className="px-2.5 py-1 text-[10px] font-bold uppercase text-zinc-500 hover:text-[#2859D9] dark:hover:text-[#6F96FF] transition-colors cursor-pointer border-x border-[#E2E6EC] dark:border-[#283243]"
              >
                Today
              </button>
              <button
                onClick={goNext}
                className="p-1.5 rounded-r-lg text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 min-w-[150px]">
              <CalendarDays className="w-3.5 h-3.5 text-[#2859D9] dark:text-[#6F96FF]" />
              {rangeLabel}
            </span>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="px-4 py-2.5 border-b border-[#E2E6EC] dark:border-[#283243] bg-zinc-50/20 dark:bg-zinc-900/10 flex items-center justify-end gap-4 text-[10px] font-semibold text-zinc-500">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-blue-500 rounded-sm" /> Normal (Priority &lt; 50)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-purple-500 rounded-sm" /> High Priority (Priority &ge; 50)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm" /> Conflict Overlap
        </span>
      </div>

      {viewMode === "agenda" && (
        schedules.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-xs font-semibold text-zinc-400 dark:text-zinc-500">
            No schedules yet.
          </div>
        ) : (
          <div className="p-4 divide-y divide-[#E2E6EC] dark:divide-[#283243] overflow-y-auto">
            {schedules.map((sch) => {
              const isConflict = agendaConflictedIds.has(sch.id);
              return (
                <div
                  key={sch.id}
                  onClick={() => onSelectSchedule(sch)}
                  className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0 cursor-pointer hover:bg-[#F6F7F9]/40 dark:hover:bg-[#171F2C]/20 rounded-lg px-2 -mx-2 transition-colors"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] bg-[#F6F7F9] dark:bg-[#171F2C] text-zinc-500 font-bold px-1.5 py-0.2 rounded border border-[#E2E6EC] dark:border-[#283243] uppercase">
                      P-{sch.priority}
                    </span>
                    <h4 className="font-bold text-xs text-zinc-900 dark:text-white mt-1">
                      {sch.name}
                    </h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5">
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
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-sm border inline-flex items-center gap-1 ${
                        isConflict
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/20 border-amber-100/50"
                          : sch.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 border-emerald-100/50"
                          : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 border-zinc-200/50"
                      }`}
                    >
                      {isConflict && <AlertTriangle className="w-3 h-3 text-amber-500 animate-pulse" />}
                      {isConflict ? "Conflict" : sch.status === "ACTIVE" ? "Active" : "Inactive"}
                    </span>
                    <span className="block text-[9px] text-zinc-400 mt-1 font-semibold">
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
          <div className="grid grid-cols-8 border border-[#E2E6EC] dark:border-[#283243] rounded-xl overflow-hidden bg-white dark:bg-zinc-950 divide-x divide-[#E2E6EC] dark:divide-[#283243] shadow-sm">

            {/* Hour labels column */}
            <div className="relative bg-[#F6F7F9]/50 dark:bg-[#171F2C]/30" style={{ height: DAY_TIMELINE_HEIGHT + 32 }}>
              {HOUR_MARKS.map((hour) => (
                <span
                  key={hour}
                  className="absolute left-0 right-0 -translate-y-1/2 text-center text-zinc-450 font-bold text-[9px] select-none uppercase tracking-wider"
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
                  className={`relative ${today ? "bg-[#2859D9]/[0.04] dark:bg-[#6F96FF]/[0.06]" : "bg-zinc-50/10 dark:bg-zinc-900/5"} hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10 transition-colors`}
                  style={{ height: DAY_TIMELINE_HEIGHT + 32 }}
                >
                  <div className="sticky top-0 z-10 h-8 flex flex-col items-center justify-center bg-white dark:bg-zinc-950 border-b border-[#E2E6EC] dark:border-[#283243] select-none">
                    <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide">
                      {DAY_COLUMNS[weekdayNumber(date) - 1].label}
                    </span>
                    <span className={`block text-[10px] font-bold ${today ? "text-[#2859D9] dark:text-[#6F96FF]" : "text-zinc-600 dark:text-zinc-300"}`}>
                      {date.getDate()}
                    </span>
                  </div>

                  {daySchedules.length === 0 && (
                    <span className="absolute inset-x-1 top-12 text-[8px] text-zinc-400 uppercase select-none font-semibold text-center">
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
                        className={`absolute left-1 right-1 rounded-lg p-1.5 flex flex-col justify-between overflow-hidden transition-all cursor-pointer hover:scale-[1.02] hover:shadow-md ${colors.block}`}
                        style={{ top, height }}
                        title={`${sch.name} · ${sch.dailyStartTime} - ${sch.dailyEndTime}`}
                      >
                        <span className={`font-bold text-[8px] block truncate ${colors.text}`}>{sch.name}</span>
                        <span className="text-[7px] text-zinc-400 block truncate">
                          {sch.dailyStartTime} - {sch.dailyEndTime}
                        </span>
                        {isConflict && (
                          <span className="flex items-center gap-1 text-[7px] text-amber-500 font-semibold">
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
              <div className="grid grid-cols-[80px_1fr] border border-[#E2E6EC] dark:border-[#283243] rounded-xl overflow-hidden bg-white dark:bg-zinc-950 divide-x divide-[#E2E6EC] dark:divide-[#283243] shadow-sm">
                <div className="relative bg-[#F6F7F9]/50 dark:bg-[#171F2C]/30" style={{ height: DAY_TIMELINE_HEIGHT }}>
                  {HOUR_MARKS.map((hour) => (
                    <span
                      key={hour}
                      className="absolute left-0 right-0 -translate-y-1/2 text-center text-zinc-450 font-bold text-[9px] select-none uppercase tracking-wider"
                      style={{ top: (hour / 24) * DAY_TIMELINE_HEIGHT }}
                    >
                      {formatHour(hour)}
                    </span>
                  ))}
                </div>

                <div className="relative bg-zinc-50/10 dark:bg-zinc-900/5" style={{ height: DAY_TIMELINE_HEIGHT }}>
                  {HOUR_MARKS.slice(1, -1).map((hour) => (
                    <div
                      key={hour}
                      className="absolute left-0 right-0 border-t border-dashed border-[#E2E6EC] dark:border-[#283243]"
                      style={{ top: (hour / 24) * DAY_TIMELINE_HEIGHT }}
                    />
                  ))}

                  {daySchedules.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-zinc-400 dark:text-zinc-500">
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
                        className={`absolute left-3 right-3 rounded-lg p-2.5 flex flex-col justify-between overflow-hidden transition-all cursor-pointer hover:scale-[1.01] hover:shadow-md ${colors.block}`}
                        style={{ top, height }}
                      >
                        <div>
                          <span className={`font-bold text-[11px] block truncate ${colors.text}`}>{sch.name}</span>
                          <span className="text-[9px] text-zinc-500 dark:text-zinc-400 block truncate">
                            {sch.playlistName} · {sch.screensCount} screens
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-zinc-400 font-semibold">
                          <span>{sch.dailyStartTime} - {sch.dailyEndTime}</span>
                          {isConflict && (
                            <span className="flex items-center gap-1 text-amber-500">
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
          <div className="grid grid-cols-7 border border-[#E2E6EC] dark:border-[#283243] rounded-xl overflow-hidden bg-white dark:bg-zinc-950 shadow-sm">
            {DAY_COLUMNS.map((day) => (
              <div
                key={day.label}
                className="text-center text-[9px] font-bold uppercase tracking-wide text-zinc-400 py-2 bg-[#F6F7F9]/50 dark:bg-[#171F2C]/30 border-b border-[#E2E6EC] dark:border-[#283243]"
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
                  className={`min-h-[92px] p-1.5 border-b border-r border-[#E2E6EC] dark:border-[#283243] cursor-pointer transition-colors ${
                    inMonth ? "bg-white dark:bg-zinc-950 hover:bg-[#F6F7F9]/60 dark:hover:bg-[#171F2C]/30" : "bg-zinc-50/50 dark:bg-zinc-900/20 hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
                  }`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold select-none ${
                      today
                        ? "bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722]"
                        : inMonth
                        ? "text-zinc-700 dark:text-zinc-300"
                        : "text-zinc-350 dark:text-zinc-600"
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
                          className={`px-1 py-0.5 rounded text-[8px] font-bold truncate flex items-center gap-1 transition-all hover:scale-[1.02] ${colors.block} ${colors.text}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`} />
                          {sch.name}
                        </div>
                      );
                    })}
                    {overflowCount > 0 && (
                      <span className="block text-[8px] font-semibold text-zinc-400 pl-1">+{overflowCount} more</span>
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
