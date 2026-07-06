"use client";

import React, { useState } from "react";
import { Plus, Calendar, Layers, Activity, ChevronDown } from "lucide-react";
import ScheduleCalendar, { CampaignSchedule } from "@/components/agent/schedules/schedule-calendar";
import ScheduleFormModal from "@/components/agent/schedules/schedule-form-modal";
import ConflictDialog from "@/components/agent/schedules/conflict-dialog";

const initialSchedules: CampaignSchedule[] = [
  {
    id: "sch-1",
    playlistName: "Breakfast Menu",
    targetGroup: "Menu Boards",
    timeRange: "6:00 AM - 11:00 AM",
    days: "Daily",
    priority: 30,
    screensCount: 34,
    status: "Active"
  },
  {
    id: "sch-2",
    playlistName: "Lunch Combos",
    targetGroup: "Menu Boards",
    timeRange: "11:00 AM - 4:00 PM",
    days: "Daily",
    priority: 30,
    screensCount: 34,
    status: "Active"
  },
  {
    id: "sch-3",
    playlistName: "Monsoon Café Promotions",
    targetGroup: "Bengaluru Flagship Stores",
    timeRange: "4:00 PM - 9:30 PM",
    days: "Daily",
    priority: 40,
    screensCount: 21,
    status: "Conflict" // Weekend Live Music overrides on weekends
  },
  {
    id: "sch-4",
    playlistName: "Weekend Live Music",
    targetGroup: "Bengaluru Flagship Stores",
    timeRange: "6:00 PM - 10:00 PM",
    days: "Fri, Sat, Sun",
    priority: 60,
    screensCount: 6,
    status: "Active"
  },
  {
    id: "sch-5",
    playlistName: "Independence Day Campaign",
    targetGroup: "All Groups",
    timeRange: "All day",
    days: "15 Aug",
    priority: 100,
    screensCount: 48,
    status: "Scheduled"
  }
];

export default function AgentSchedulesPage() {
  const [schedules, setSchedules] = useState<CampaignSchedule[]>(initialSchedules);
  const [viewMode, setViewMode] = useState<"week" | "day" | "month" | "agenda">("week");
  const [groupFilter, setGroupFilter] = useState("All");
  
  // Modals state
  const [showFormModal, setShowFormModal] = useState(false);
  const [conflictModalData, setConflictModalData] = useState<{ c1: CampaignSchedule; c2: CampaignSchedule } | null>(null);

  // Group filter application
  const filteredSchedules = schedules.filter((sch) => {
    if (groupFilter === "All") return true;
    return sch.targetGroup.toLowerCase().includes(groupFilter.toLowerCase()) || sch.targetGroup === "All Groups";
  });

  const handleAddScheduleSuccess = (newSch: CampaignSchedule) => {
    setSchedules([...schedules, newSch]);
    setShowFormModal(false);
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
          {/* View Toggles */}
          <div className="flex items-center gap-0.5 p-0.5 border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-white dark:bg-[#111722] shadow-xs">
            {["week", "day", "agenda"].map((v) => (
              <button
                key={v}
                onClick={() => setViewMode(v as any)}
                className={`px-3 py-1 rounded-md text-[10px] uppercase font-bold transition-all duration-200 cursor-pointer ${
                  viewMode === v
                    ? "bg-[#F6F7F9] dark:bg-[#171F2C] text-[#2859D9] dark:text-[#6F96FF]"
                    : "text-zinc-400 hover:text-zinc-650"
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Create Schedule Button */}
          <button
            onClick={() => setShowFormModal(true)}
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
            <option value="Flagship">Flagship Outlets</option>
            <option value="Menu Boards">Menu Boards</option>
            <option value="Mall Stores">Mall Stores</option>
            <option value="Airport Outlets">Airport Outlets</option>
          </select>
          <Layers className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
        </div>
      </div>

      {/* Calendar Area */}
      <div className="flex-1">
        <ScheduleCalendar
          schedules={filteredSchedules}
          viewMode={viewMode}
          onSelectConflict={(c1, c2) => setConflictModalData({ c1, c2 })}
        />
      </div>

      {/* Render Scheduling Form */}
      {showFormModal && (
        <ScheduleFormModal
          onClose={() => setShowFormModal(false)}
          onSuccess={handleAddScheduleSuccess}
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
