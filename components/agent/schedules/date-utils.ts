export function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Monday=1 .. Sunday=7 (matches Calendar.daysOfWeek convention)
export function weekdayNumber(d: Date): number {
  const day = d.getDay();
  return day === 0 ? 7 : day;
}

export function addDays(d: Date, amount: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + amount);
  return copy;
}

export function addMonths(d: Date, amount: number): Date {
  const copy = new Date(d);
  copy.setMonth(copy.getMonth() + amount);
  return copy;
}

export function startOfWeek(d: Date): Date {
  return addDays(d, -(weekdayNumber(d) - 1));
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function getWeekDates(anchor: Date): Date[] {
  const start = startOfWeek(anchor);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

// 6 rows x 7 cols, Monday-first grid fully covering the anchor's month
export function getMonthGridDates(anchor: Date): Date[] {
  const gridStart = startOfWeek(startOfMonth(anchor));
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}

export function isSameDay(a: Date, b: Date): boolean {
  return toISODate(a) === toISODate(b);
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export interface DateRangeAndDays {
  daysOfWeek: number[];
  startDate: string;
  endDate: string;
}

export function isScheduleActiveOnDate(schedule: DateRangeAndDays, date: Date): boolean {
  const iso = toISODate(date);
  if (iso < schedule.startDate || iso > schedule.endDate) return false;
  return schedule.daysOfWeek.includes(weekdayNumber(date));
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatMonthYear(d: Date): string {
  return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatFullDate(d: Date): string {
  const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return `${DAY_NAMES[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function formatShortDate(d: Date): string {
  return `${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
}

export function formatWeekRange(weekDates: Date[]): string {
  const start = weekDates[0];
  const end = weekDates[6];
  if (isSameMonth(start, end)) {
    return `${MONTH_NAMES[start.getMonth()].slice(0, 3)} ${start.getDate()}–${end.getDate()}, ${end.getFullYear()}`;
  }
  return `${formatShortDate(start)} – ${formatShortDate(end)}, ${end.getFullYear()}`;
}
