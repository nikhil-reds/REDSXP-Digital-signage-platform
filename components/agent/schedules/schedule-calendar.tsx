"use client";
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ScheduleSummary } from './api';
import { findConflictsOnDate, type ScheduleConflict } from './conflict-utils';
import { addDays, addMonths, formatFullDate, formatMonthYear, formatWeekRange, getMonthGridDates, getWeekDates, isSameDay, isSameMonth, isScheduleActiveOnDate, toISODate } from './date-utils';
import { scheduleLanes } from './calendar-layout';
export const DAY_COLUMNS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((label,index)=>({label,value:index+1}));
export function formatDays(days:number[]) { return days.length===7?'Daily':DAY_COLUMNS.filter(day=>days.includes(day.value)).map(day=>day.label).join(', '); }
type View='day'|'week'|'month'|'agenda';
interface Props { schedules:ScheduleSummary[]; conflicts:ScheduleConflict[]; onSelectConflict:(a:ScheduleSummary,b:ScheduleSummary)=>void; onSelectSchedule:(schedule:ScheduleSummary)=>void }
export default function ScheduleCalendar({schedules,conflicts,onSelectConflict,onSelectSchedule}:Props) {
  const [view,setView]=useState<View>('week');
  const [date,setDate]=useState(()=>new Date());
  useEffect(()=>{
    // Choose a compact default once; later resizes preserve the user's selection.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if(window.matchMedia('(max-width:767px)').matches) setView('agenda');
  },[]);
  const days=view==='day'?[date]:getWeekDates(date);
  const label=view==='agenda'?'All matching schedules':view==='month'?formatMonthYear(date):view==='day'?formatFullDate(date):formatWeekRange(days);
  const navigate=(step:number)=>setDate(value=>view==='month'?addMonths(value,step):addDays(value,step*(view==='week'?7:1)));
  const openDay=(day:Date)=>{setDate(day);setView('day');};
  const conflictButton=(schedule:ScheduleSummary,pairs:ScheduleConflict[])=>{
    const pair=pairs.find(pair=>pair.a.id===schedule.id||pair.b.id===schedule.id);
    return pair?<button type="button" className="schedule-conflict-action" aria-label={`View conflict for ${schedule.name}`} onClick={()=>onSelectConflict(pair.a,pair.b)}>View conflict</button>:null;
  };
  const visibleDates=view==='month'?getMonthGridDates(date):days;
  const periodEmpty=view!=='agenda'&&!visibleDates.some(day=>schedules.some(schedule=>isScheduleActiveOnDate(schedule,day)));
  return <section className="schedule-calendar" aria-label="Schedule calendar">
    <div className="schedule-calendar-toolbar">
      <div className="schedule-view-tabs" role="group" aria-label="Calendar view">{(['day','week','month','agenda'] as View[]).map(mode=><button type="button" key={mode} aria-pressed={view===mode} onClick={()=>setView(mode)}>{mode}</button>)}</div>
      {view!=='agenda'&&<div className="schedule-date-actions"><button aria-label={`Previous ${view}`} onClick={()=>navigate(-1)}><ChevronLeft size={18}/></button><button onClick={()=>setDate(new Date())}>Today</button><button aria-label={`Next ${view}`} onClick={()=>navigate(1)}><ChevronRight size={18}/></button></div>}
      <strong className="schedule-range" aria-live="polite">{label}</strong>
    </div>
    <div className="schedule-legend"><span>Normal: priority &lt; 50</span><span>High: priority ≥ 50</span><span>Conflict: overlapping active schedules</span></div>
    {periodEmpty&&<p className="schedule-period-empty" role="status">{schedules.length ? "Nothing scheduled for this period. Try another date or Agenda." : "No schedules match your filters. Clear filters to see more."}</p>}
    <div className="schedule-calendar-scroll" tabIndex={0} role="region" aria-label={`${view} schedules; scroll to explore`}>
      {view==='agenda'&&<div className="schedule-agenda">{schedules.length===0?<p>No schedules match your filters.</p>:schedules.map(schedule=><article key={schedule.id} className="schedule-agenda-card">
        <button className="schedule-agenda-details" onClick={()=>onSelectSchedule(schedule)}><strong>{schedule.name}</strong><span>{schedule.playlistName}</span><span>{formatDays(schedule.daysOfWeek)} · {schedule.dailyStartTime}–{schedule.dailyEndTime}</span><span>{schedule.startDate} – {schedule.endDate}</span><span>{schedule.status==='ACTIVE'?'Active':'Inactive'} · Priority {schedule.priority} · {schedule.screensCount} screens</span></button>{conflictButton(schedule,conflicts)}
      </article>)}</div>}
      {view==='month'&&<div className="schedule-month-grid">
        {DAY_COLUMNS.map(day=><div className="schedule-month-heading" key={day.value}>{day.label}</div>)}
        {getMonthGridDates(date).map(day=>{const entries=schedules.filter(schedule=>isScheduleActiveOnDate(schedule,day));return <div key={toISODate(day)} className="schedule-month-cell" data-outside={!isSameMonth(day,date)}>
          <button className="schedule-day-number" aria-label={`View ${formatFullDate(day)}`} aria-current={isSameDay(day,new Date())?'date':undefined} onClick={()=>openDay(day)}>{day.getDate()}</button>
          {entries.slice(0,3).map(schedule=><button key={schedule.id} className="schedule-month-event" title={schedule.name} onClick={()=>onSelectSchedule(schedule)}>{schedule.name}</button>)}
          {entries.length>3&&<button className="schedule-more" onClick={()=>openDay(day)}>+{entries.length-3} more</button>}
        </div>;})}
      </div>}
      {(view==='day'||view==='week')&&<div className="schedule-time-grid" style={{gridTemplateColumns:`64px ${days.map(day=>`minmax(${Math.max(view==='day'?250:160,scheduleLanes(schedules.filter(s=>isScheduleActiveOnDate(s,day))).count*150)}px,1fr)`).join(' ')}`}}>
        <div className="schedule-hours"><div className="schedule-day-heading">Time</div><div className="schedule-hour-track">{Array.from({length:9},(_,i)=><span key={i} style={{top:i*120}}>{String(i*3).padStart(2,'0')}:00</span>)}</div></div>
        {days.map(day=>{const layout=scheduleLanes(schedules.filter(schedule=>isScheduleActiveOnDate(schedule,day)));const pairs=findConflictsOnDate(schedules,day);return <div className="schedule-day-column" key={toISODate(day)}>
          <button className="schedule-day-heading" aria-current={isSameDay(day,new Date())?'date':undefined} onClick={()=>openDay(day)}>{day.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'})}</button>
          <div className="schedule-day-track">{!layout.entries.length&&<p className="schedule-no-events">No schedules</p>}{layout.entries.map(({schedule,lane,top,height})=><div key={schedule.id} className="schedule-timed-event" data-high={schedule.priority>=50} data-conflict={pairs.some(pair=>pair.a.id===schedule.id||pair.b.id===schedule.id)} style={{top,height,left:`calc(${lane/layout.count*100}% + 3px)`,width:`calc(${100/layout.count}% - 6px)`}}>
            <button title={`${schedule.name} · ${schedule.dailyStartTime}–${schedule.dailyEndTime}`} aria-label={`Edit ${schedule.name}, ${schedule.dailyStartTime} to ${schedule.dailyEndTime}`} onClick={()=>onSelectSchedule(schedule)}><strong>{schedule.name}</strong><span>{schedule.dailyStartTime}–{schedule.dailyEndTime}</span></button>
            {height>=88&&conflictButton(schedule,pairs)}
          </div>)}</div>
        </div>;})}
      </div>}
    </div>
    <p className="schedule-calendar-hint">Select a schedule to edit. Agenda shows full details and conflict actions.</p>
  </section>;
}
