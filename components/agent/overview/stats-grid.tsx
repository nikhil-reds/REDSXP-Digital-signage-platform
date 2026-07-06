"use client";

import React from "react";
import { Monitor, AlertTriangle, Play, ShieldAlert, Clock, Database } from "lucide-react";

export default function AgentStatsGrid() {
  const stats = [
    {
      name: "Assigned Screens",
      value: "48",
      details: (
        <div className="flex gap-2.5 mt-1 text-[10px] font-semibold">
          <span className="text-emerald-600 dark:text-emerald-500 flex items-center gap-0.5">
            ● 44 Online
          </span>
          <span className="text-amber-500 dark:text-amber-500 flex items-center gap-0.5">
            ● 2 Delayed
          </span>
          <span className="text-red-500 dark:text-red-500 flex items-center gap-0.5">
            ● 2 Offline
          </span>
        </div>
      ),
      icon: Monitor,
      bgColor: "bg-blue-50/50 dark:bg-blue-950/10",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      name: "Active Alerts",
      value: "6",
      details: (
        <div className="flex gap-2.5 mt-1 text-[10px] font-semibold">
          <span className="text-red-500 dark:text-red-400 flex items-center gap-0.5 animate-pulse">
            ● 1 Critical
          </span>
          <span className="text-amber-500 dark:text-amber-400">
            ● 2 High
          </span>
          <span className="text-zinc-500 dark:text-zinc-400">
            ● 3 Medium/Low
          </span>
        </div>
      ),
      icon: ShieldAlert,
      bgColor: "bg-red-50/50 dark:bg-red-950/10",
      iconColor: "text-red-600 dark:text-red-400"
    },
    {
      name: "Loop Plays Today",
      value: "18,426",
      details: (
        <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-500 mt-1 flex items-center">
          ↗ +14.2% vs yesterday
        </span>
      ),
      icon: Play,
      bgColor: "bg-emerald-50/50 dark:bg-emerald-950/10",
      iconColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      name: "Average Uptime",
      value: "98.7%",
      details: (
        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 flex items-center">
          Past 30 days SLA target 99.0%
        </span>
      ),
      icon: Clock,
      bgColor: "bg-purple-50/50 dark:bg-purple-950/10",
      iconColor: "text-purple-600 dark:text-purple-400"
    },
    {
      name: "Storage Used",
      value: "112 GB",
      details: (
        <div className="mt-1.5 w-full">
          <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="bg-[#2859D9] dark:bg-[#6F96FF] h-full rounded-full" style={{ width: "44.8%" }} />
          </div>
          <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase mt-1 block">
            44.8% of 250 GB Limit
          </span>
        </div>
      ),
      icon: Database,
      bgColor: "bg-zinc-50 dark:bg-zinc-900/50",
      iconColor: "text-zinc-500 dark:text-zinc-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.name}
            className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] p-4.5 rounded-xl shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#657080] dark:text-[#9AA7B7] truncate">
                {stat.name}
              </span>
              <div className={`p-1.5 rounded-lg shrink-0 ${stat.bgColor}`}>
                <Icon className={`w-4 h-4 shrink-0 ${stat.iconColor}`} />
              </div>
            </div>

            <div className="mt-3">
              <span className="text-xl font-bold tracking-tight text-[#18202B] dark:text-[#F2F5F8]">
                {stat.value}
              </span>
              <div className="flex items-center">
                {stat.details}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
