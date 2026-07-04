"use client";

import React from "react";
import { Users, Clock, Eye, Play, FileText, Zap } from "lucide-react";

export default function AnalyticsStatsGrid() {
  const stats = [
    {
      name: "Total Sessions",
      value: "1,24,830",
      change: "+8.4% vs prev",
      changeType: "up",
      icon: Users
    },
    {
      name: "Avg Session Duration",
      value: "4m 32s",
      change: "Per session",
      changeType: "neutral",
      icon: Clock
    },
    {
      name: "Screen Impressions",
      value: "3,21,40,000",
      change: "June 2026",
      changeType: "neutral",
      icon: Eye
    },
    {
      name: "Content Plays",
      value: "87,64,200",
      change: "June 2026",
      changeType: "neutral",
      icon: Play
    },
    {
      name: "PoP Reports",
      value: "14,320",
      change: "Generated",
      changeType: "neutral",
      icon: FileText
    },
    {
      name: "API Calls (30d)",
      value: "2,18,40,000",
      change: "Total requests",
      changeType: "neutral",
      icon: Zap
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isUp = stat.changeType === "up";

        return (
          <div
            key={stat.name}
            className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-4 rounded-lg shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start gap-1.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 truncate">
                {stat.name}
              </span>
              <Icon className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
            </div>

            <div className="mt-3.5">
              <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {stat.value}
              </span>

              <div className="mt-1 flex items-center">
                {isUp ? (
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-500 flex items-center">
                    ↗ {stat.change}
                  </span>
                ) : (
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">
                    {stat.change}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
