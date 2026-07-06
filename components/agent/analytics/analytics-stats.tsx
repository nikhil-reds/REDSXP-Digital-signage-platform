"use client";

import React from "react";
import { Play, Activity, Clock, ShieldCheck } from "lucide-react";

export default function AnalyticsStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Loop Plays */}
      <div className="p-4 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl flex items-center justify-between shadow-3xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-zinc-400">Total Loop Plays Today</span>
          <span className="block text-lg font-bold text-zinc-900 dark:text-white mt-1">18,426 plays</span>
          <span className="text-[9px] text-emerald-500 font-semibold mt-0.5 block">↑ 12.4% vs yesterday</span>
        </div>
        <Play className="w-5 h-5 text-zinc-400" />
      </div>

      {/* Screen Uptime */}
      <div className="p-4 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl flex items-center justify-between shadow-3xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-zinc-400">Average Uptime</span>
          <span className="block text-lg font-bold text-emerald-600 dark:text-emerald-500 mt-1">98.7% rating</span>
          <span className="text-[9px] text-zinc-450 mt-0.5 block">Target baseline SLA: 98.5%</span>
        </div>
        <Clock className="w-5 h-5 text-emerald-500" />
      </div>

      {/* Sensor Triggers */}
      <div className="p-4 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl flex items-center justify-between shadow-3xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-zinc-400">Sensor Triggers</span>
          <span className="block text-lg font-bold text-zinc-900 dark:text-white mt-1">6,250 events</span>
          <span className="text-[9px] text-[#2859D9] dark:text-[#6F96FF] font-semibold mt-0.5 block">Motion probes most active</span>
        </div>
        <Activity className="w-5 h-5 text-[#2859D9]" />
      </div>

      {/* Compliance SLA score */}
      <div className="p-4 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl flex items-center justify-between shadow-3xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-zinc-400">SLA compliance score</span>
          <span className="block text-lg font-bold text-zinc-900 dark:text-white mt-1">99.4% ratio</span>
          <span className="text-[9px] text-emerald-500 font-semibold mt-0.5 block">All outlets conforming</span>
        </div>
        <ShieldCheck className="w-5 h-5 text-zinc-400" />
      </div>
    </div>
  );
}
