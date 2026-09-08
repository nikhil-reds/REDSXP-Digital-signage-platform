import React from "react";
import { Download } from "lucide-react";
import StatsGrid from "@/components/admin/overview/stats-grid";
import TrendsCharts from "@/components/admin/overview/trends-charts";
import StatusHealthGrid from "@/components/admin/overview/status-health-grid";
import TablesGrid from "@/components/admin/overview/tables-grid";
import ActivityFeed from "@/components/admin/overview/activity-feed";
import { Button, PageShell } from "@/components/ui";

export default function AdminOverviewPage() {
  return (
    <PageShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-heading text-h5 font-semibold tracking-headline text-app-text">
            Platform Overview
          </h1>
          <p className="mt-1 text-body text-app-muted">
            Cross-tenant performance for 1–30 June 2026 · Updated 4:30 PM IST
          </p>
        </div>
        <Button variant="primary" size="sm" icon={Download} className="self-start sm:self-auto">Export report</Button>
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
    </PageShell>
  );
}
