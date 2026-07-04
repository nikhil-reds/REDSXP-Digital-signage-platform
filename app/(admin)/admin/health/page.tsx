import React from "react";
import { RefreshCw } from "lucide-react";
import StatusBanner from "@/components/admin/health/status-banner";
import ServicesGrid from "@/components/admin/health/services-grid";
import LatencyChart from "@/components/admin/health/latency-chart";
import IncidentsDeployments from "@/components/admin/health/incidents-deployments";
import DlqCounts from "@/components/admin/health/dlq-counts";

export default function SystemHealthPage() {
  return (
    <div className="py-6 px-15 space-y-6 mx-auto font-sans ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            System Health
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Real-time platform monitoring and service status.
          </p>
        </div>
        <div className="flex items-center gap-3.5 self-start sm:self-auto text-xs">
          <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-semibold uppercase tracking-wider select-none">
            Last refreshed: 2 Jul 2026, 4:30 PM IST
          </span>
          <button className="flex items-center gap-1.5 bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 px-3.5 py-1.5 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-sm cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 1. Status Banner */}
      <StatusBanner />

      {/* 2. Services Grid status check */}
      <ServicesGrid />

      {/* 3. API Latency Chart */}
      <LatencyChart />

      {/* 4. Incidents & Deployments Row */}
      <IncidentsDeployments />

      {/* 5. Dead-Letter Queues section */}
      <DlqCounts />
    </div>
  );
}
