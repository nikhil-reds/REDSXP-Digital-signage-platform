import React from "react";
import { Download } from "lucide-react";
import StatsGrid from "@/components/admin/overview/stats-grid";
import TrendsCharts from "@/components/admin/overview/trends-charts";
import StatusHealthGrid from "@/components/admin/overview/status-health-grid";
import TablesGrid from "@/components/admin/overview/tables-grid";
import ActivityFeed from "@/components/admin/overview/activity-feed";

export default function AdminOverviewPage() {
  return (
    <div className="py-6 px-15 space-y-6  mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Platform Overview
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Cross-tenant performance for 1–30 June 2026 · Updated 4:30 PM IST
          </p>
        </div>
        <button className="flex items-center gap-1.5 bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm cursor-pointer self-start sm:self-auto">
          <Download className="w-3.5 h-3.5" />
          <span>Export report</span>
        </button>
      </div>

      {/* 1. KPIs Grid */}
      <StatsGrid />

      {/* 2. Trends Graphs */}
      <TrendsCharts />

      {/* 3. Screens Status, Plan Revenue, Health check */}
      <StatusHealthGrid />

      {/* 4. Data Tables (Recent Tenants, Failed Payments) */}
      <TablesGrid />

      {/* 5. Activities Logs List */}
      <ActivityFeed />
    </div>
  );
}
