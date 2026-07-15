import { ScheduleSummary } from "./api";
import { isScheduleActiveOnDate } from "./date-utils";

export interface ScheduleConflict {
  a: ScheduleSummary;
  b: ScheduleSummary;
}

function sharesDevice(a: ScheduleSummary, b: ScheduleSummary): boolean {
  return a.deviceIds.some((id) => b.deviceIds.includes(id));
}

function sharesDay(a: ScheduleSummary, b: ScheduleSummary): boolean {
  return a.daysOfWeek.some((day) => b.daysOfWeek.includes(day));
}

// "YYYY-MM-DD" and "HH:mm" strings sort lexically, so plain string comparison works.
function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart <= bEnd && bStart <= aEnd;
}

function overlapsDaily(a: ScheduleSummary, b: ScheduleSummary): boolean {
  return rangesOverlap(a.dailyStartTime, a.dailyEndTime, b.dailyStartTime, b.dailyEndTime);
}

// Abstract "do these recurring configs ever collide" check — used for the date-agnostic agenda view.
export function schedulesConflict(a: ScheduleSummary, b: ScheduleSummary): boolean {
  if (a.id === b.id) return false;
  if (a.status !== "ACTIVE" || b.status !== "ACTIVE") return false;
  if (!sharesDevice(a, b)) return false;
  if (!sharesDay(a, b)) return false;
  if (!rangesOverlap(a.startDate, a.endDate, b.startDate, b.endDate)) return false;
  if (!overlapsDaily(a, b)) return false;
  return true;
}

export function findConflicts(schedules: ScheduleSummary[]): ScheduleConflict[] {
  const conflicts: ScheduleConflict[] = [];
  for (let i = 0; i < schedules.length; i++) {
    for (let j = i + 1; j < schedules.length; j++) {
      if (schedulesConflict(schedules[i], schedules[j])) {
        conflicts.push({ a: schedules[i], b: schedules[j] });
      }
    }
  }
  return conflicts;
}

// Date-scoped check: both schedules must actually be active on this exact date (day-of-week and
// date-range overlap are implied by that), so only device sharing and daily time overlap remain.
export function findConflictsOnDate(schedules: ScheduleSummary[], date: Date): ScheduleConflict[] {
  const active = schedules.filter((s) => s.status === "ACTIVE" && isScheduleActiveOnDate(s, date));
  const conflicts: ScheduleConflict[] = [];
  for (let i = 0; i < active.length; i++) {
    for (let j = i + 1; j < active.length; j++) {
      const a = active[i];
      const b = active[j];
      if (sharesDevice(a, b) && overlapsDaily(a, b)) {
        conflicts.push({ a, b });
      }
    }
  }
  return conflicts;
}
