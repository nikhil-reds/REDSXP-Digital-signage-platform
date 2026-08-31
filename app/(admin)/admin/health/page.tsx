import React from "react";
import { RefreshCw } from "lucide-react";
import StatusBanner from "@/components/admin/health/status-banner";
import ServicesGrid from "@/components/admin/health/services-grid";
import LatencyChart from "@/components/admin/health/latency-chart";
import IncidentsDeployments from "@/components/admin/health/incidents-deployments";
import DlqCounts from "@/components/admin/health/dlq-counts";
import { Button, PageShell } from "@/components/ui";

export default function SystemHealthPage() {
  return (
    <PageShell className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-page-title font-bold tracking-tight text-app-text">
            System Health
          </h1>
          <p className="text-caption text-app-muted">
            Real-time platform monitoring and service status.
          </p>
        </div>
        <div className="flex items-center gap-3.5 self-start sm:self-auto text-xs">
          <span className="select-none text-[10px] font-semibold uppercase tracking-wider text-app-muted">
            Last refreshed: 2 Jul 2026, 4:30 PM IST
          </span>
          <Button>
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </Button>
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
    </PageShell>
  );
}
