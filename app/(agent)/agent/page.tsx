import React from "react";
import { Download, RefreshCw, Send, Calendar } from "lucide-react";
import AgentStatsGrid from "@/components/agent/overview/stats-grid";
import HealthMapSection from "@/components/agent/overview/health-map-section";
import SchedulesPlayingSection from "@/components/agent/overview/schedules-playing-section";
import TrendsActivitySection from "@/components/agent/overview/trends-activity-section";

export default function AgentPage() {
  return (
    <div className="py-6 px-8 space-y-6 mx-auto font-sans">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E6EC] dark:border-[#283243] pb-5">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Good afternoon, Aarav
          </h1>
          <p className="text-xs text-[#657080] dark:text-[#9AA7B7]">
            Bengaluru Region · 19 locations · Updated just now (4 July 2026, 4:30 PM IST)
          </p>
        </div>
        
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Refresh Button */}
          <button className="p-2 border border-[#E2E6EC] dark:border-[#283243] bg-white dark:bg-[#111722] hover:bg-[#F6F7F9] dark:hover:bg-[#171F2C] text-[#657080] dark:text-[#9AA7B7] rounded-lg transition-colors cursor-pointer" title="Refresh Live Feeds">
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Date Selector */}
          <button className="flex items-center gap-2 px-3.5 py-2 border border-[#E2E6EC] dark:border-[#283243] bg-white dark:bg-[#111722] hover:bg-[#F6F7F9] dark:hover:bg-[#171F2C] text-xs font-semibold text-[#18202B] dark:text-[#F2F5F8] rounded-lg transition-colors shadow-xs cursor-pointer">
            <Calendar className="w-3.5 h-3.5 text-[#657080] dark:text-[#9AA7B7]" />
            <span>Today, 4 July 2026</span>
          </button>

          {/* Deploy content button */}
          <button className="flex items-center gap-2 bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity shadow-sm cursor-pointer">
            <Send className="w-3.5 h-3.5" />
            <span>Deploy content</span>
          </button>
        </div>
      </div>

      {/* 2. KPIs Stats Row */}
      <AgentStatsGrid />

      {/* 3. Screen Health Summary, Map & Needs Attention list */}
      <HealthMapSection />

      {/* 4. Active playlists, schedules timeline, quick actions */}
      <SchedulesPlayingSection />

      {/* 5. Charts and activity logs */}
      <TrendsActivitySection />
    </div>
  );
}
