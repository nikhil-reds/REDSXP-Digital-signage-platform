"use client";

import React, { useState } from "react";
import { BarChart3, Calendar, Download, RefreshCw, ChevronDown } from "lucide-react";
import AnalyticsStats from "@/components/agent/analytics/analytics-stats";
import ProofOfPlayCharts from "@/components/agent/analytics/proof-of-play-charts";
import UptimeHistory from "@/components/agent/analytics/uptime-history";

export default function AgentAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("Last 7 Days");

  const handleExport = (format: "PDF" | "CSV") => {
    alert(`Generating SLA report in ${format} format for selected date range (${timeRange}). Download will start shortly.`);
  };

  return (
    <div className="py-6 px-8 space-y-6 mx-auto font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E6EC] dark:border-[#283243] pb-5 shrink-0">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-55 tracking-tight flex items-center gap-2">
            Analytics & Proof-of-Play
          </h1>
          <p className="text-xs text-[#657080] dark:text-[#9AA7B7]">
            Analyze playlist execution loops, SLA uptime metrics, and correlation data for sensor triggers.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Time range Selector */}
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="pl-8.5 pr-8 py-1.5 border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-white dark:bg-[#111722] text-xs text-zinc-705 dark:text-zinc-300 font-bold focus:outline-none appearance-none cursor-pointer"
            >
              <option value="Today">Today</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
            </select>
            <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>

          {/* Export selectors */}
          <div className="flex items-center gap-1 p-0.5 border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-white dark:bg-[#111722] shadow-xs text-xs">
            <button
              onClick={() => handleExport("PDF")}
              className="px-2.5 py-1 text-[10px] font-bold text-zinc-650 dark:text-zinc-300 hover:bg-[#F6F7F9] dark:hover:bg-[#171F2C] rounded cursor-pointer"
            >
              Export PDF
            </button>
            <button
              onClick={() => handleExport("CSV")}
              className="px-2.5 py-1 text-[10px] font-bold text-zinc-650 dark:text-zinc-350 hover:bg-[#F6F7F9] dark:hover:bg-[#171F2C] rounded border-l border-[#E2E6EC] dark:border-[#283243] cursor-pointer"
            >
              CSV
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats counters grid */}
      <AnalyticsStats />

      {/* Recharts Visualizations Grid */}
      <ProofOfPlayCharts />

      {/* SLA Uptime logs table */}
      <UptimeHistory />

    </div>
  );
}
