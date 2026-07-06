"use client";

import React from "react";
import { Clock, AlertTriangle, Monitor, Calendar, CheckCircle } from "lucide-react";

export interface CampaignSchedule {
  id: string;
  playlistName: string;
  targetGroup: string;
  timeRange: string;
  days: string;
  priority: number;
  screensCount: number;
  status: "Active" | "Conflict" | "Scheduled";
}

interface ScheduleCalendarProps {
  schedules: CampaignSchedule[];
  onSelectConflict: (c1: CampaignSchedule, c2: CampaignSchedule) => void;
  viewMode: "week" | "day" | "month" | "agenda";
}

export default function ScheduleCalendar({
  schedules,
  onSelectConflict,
  viewMode
}: ScheduleCalendarProps) {
  
  // Find conflicts (Weekend Live Music vs. Monsoon promotions on Fri/Sat/Sun)
  const monsoon = schedules.find((s) => s.id === "sch-3");
  const weekend = schedules.find((s) => s.id === "sch-4");

  const handleConflictClick = () => {
    if (monsoon && weekend) {
      onSelectConflict(monsoon, weekend);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl overflow-hidden shadow-xs min-h-[500px]">
      
      {/* Tab/Legend info */}
      <div className="p-4 border-b border-[#E2E6EC] dark:border-[#283243] bg-zinc-50/20 dark:bg-zinc-900/10 flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-800 dark:text-zinc-200">
          {viewMode === "week" && "Weekly Schedule Block Planner (Mon - Sun)"}
          {viewMode === "day" && "Daily Operations Scheduler"}
          {viewMode === "month" && "Monthly Rotation Calendar"}
          {viewMode === "agenda" && "Active Campaign Agenda List"}
        </span>
        <div className="flex gap-4 text-[10px] font-semibold text-zinc-500">
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
      </div>

      {/* RENDER VIEWS */}
      {viewMode === "agenda" ? (
        <div className="p-4 divide-y divide-[#E2E6EC] dark:divide-[#283243]">
          {schedules.map((sch) => (
            <div key={sch.id} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <span className="text-[10px] bg-[#F6F7F9] dark:bg-[#171F2C] text-zinc-500 font-bold px-1.5 py-0.2 rounded border border-[#E2E6EC] dark:border-[#283243] uppercase">
                  P-{sch.priority}
                </span>
                <h4 className="font-bold text-xs text-zinc-900 dark:text-white mt-1">
                  {sch.playlistName}
                </h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  Target: {sch.targetGroup} · {sch.days} · {sch.timeRange}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm border inline-flex items-center gap-1 ${
                  sch.status === "Conflict"
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-950/20 border-amber-100/50"
                    : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 border-emerald-100/50"
                }`}>
                  {sch.status === "Conflict" && <AlertTriangle className="w-3 h-3 text-amber-500 animate-pulse" />}
                  {sch.status}
                </span>
                <span className="block text-[9px] text-zinc-400 mt-1 font-semibold">
                  {sch.screensCount} Screens
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
          
          {/* Weekly Timeline Tracks representation */}
          <div className="grid grid-cols-8 border border-[#E2E6EC] dark:border-[#283243] rounded-lg overflow-hidden bg-white dark:bg-zinc-950 divide-x divide-[#E2E6EC] dark:divide-[#283243] h-[400px]">
            {/* Hour labels column */}
            <div className="flex flex-col justify-between p-2 py-6 bg-[#F6F7F9]/50 dark:bg-[#171F2C]/30 text-zinc-450 font-bold text-[9px] text-center select-none uppercase tracking-wider">
              <span>06:00 AM</span>
              <span>09:00 AM</span>
              <span>12:00 PM</span>
              <span>03:00 PM</span>
              <span>06:00 PM</span>
              <span>09:30 PM</span>
            </div>

            {/* Days Columns */}
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => {
              const isWeekend = idx >= 4; // Friday, Saturday, Sunday
              return (
                <div key={day} className="flex-1 flex flex-col justify-between relative p-1.5 h-full space-y-1 bg-zinc-50/10 dark:bg-zinc-900/5 hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10 transition-colors">
                  <span className="block text-[10px] font-bold text-center text-zinc-500 border-b border-[#E2E6EC] dark:border-[#283243] pb-1 uppercase tracking-wide shrink-0 select-none">
                    {day}
                  </span>

                  {/* 6AM - 11AM block */}
                  <div className="h-14 bg-blue-500/10 dark:bg-blue-500/5 border border-blue-500/25 rounded-md p-1.5 flex flex-col justify-between hover:bg-blue-500/15 transition-all cursor-pointer">
                    <span className="font-bold text-[8px] text-blue-600 dark:text-blue-400 block truncate">Breakfast Menu</span>
                    <span className="text-[7px] text-zinc-400 block">6:00 - 11:00</span>
                  </div>

                  {/* 11AM - 4PM block */}
                  <div className="h-16 bg-blue-500/10 dark:bg-blue-500/5 border border-blue-500/25 rounded-md p-1.5 flex flex-col justify-between hover:bg-blue-500/15 transition-all cursor-pointer">
                    <span className="font-bold text-[8px] text-blue-600 dark:text-blue-400 block truncate">Lunch Combos</span>
                    <span className="text-[7px] text-zinc-400 block">11:00 - 16:00</span>
                  </div>

                  {/* 4PM - 9:30PM block */}
                  {!isWeekend ? (
                    <div className="h-20 bg-blue-500/10 dark:bg-blue-500/5 border border-blue-500/25 rounded-md p-1.5 flex flex-col justify-between hover:bg-blue-500/15 transition-all cursor-pointer">
                      <span className="font-bold text-[8px] text-blue-600 dark:text-blue-400 block truncate">Monsoon Café</span>
                      <span className="text-[7px] text-zinc-400 block">16:00 - 21:30</span>
                    </div>
                  ) : (
                    // Overlap Conflict block on weekends (Fri/Sat/Sun)
                    <div
                      onClick={handleConflictClick}
                      className="h-20 bg-amber-500/15 border-2 border-amber-500 rounded-md p-1.5 flex flex-col justify-between hover:bg-amber-500/25 transition-all cursor-pointer relative ring-2 ring-amber-500/10"
                    >
                      <div>
                        <span className="font-bold text-[8px] text-amber-700 dark:text-amber-400 block truncate">Weekend Music Overlay</span>
                        <span className="text-[7px] text-amber-500 block font-semibold mt-0.5 truncate">Monsoon campaign hidden</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-[7px] text-zinc-450 border-t border-amber-200 dark:border-amber-900/30 pt-1">
                        <span>P-60 overrides P-40</span>
                        <AlertTriangle className="w-2.5 h-2.5 text-amber-500 shrink-0 animate-pulse" />
                      </div>
                    </div>
                  )}

                  <div className="h-10 border border-dashed border-[#E2E6EC] dark:border-[#283243] rounded-md flex items-center justify-center text-[8px] text-zinc-400 uppercase select-none font-semibold shrink-0">
                    Offline Slot
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
