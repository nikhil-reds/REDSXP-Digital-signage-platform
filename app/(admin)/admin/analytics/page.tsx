import React from "react";
import { Download } from "lucide-react";
import AnalyticsStatsGrid from "@/components/admin/analytics/stats-grid";
import AnalyticsTrendsSection from "@/components/admin/analytics/trends-section";
import AnalyticsDistributionSection from "@/components/admin/analytics/distribution-section";
import HourlyEngagementHeatmap from "@/components/admin/analytics/heatmap-section";
import TenantGrowthFunnel from "@/components/admin/analytics/funnel-section";
import { Button, PageShell } from "@/components/ui";

export default function PlatformAnalyticsPage() {
  return (
    <PageShell className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-page-title font-bold tracking-tight text-app-text">
            Platform Analytics
          </h1>
          <p className="text-caption text-app-muted">
            Cross-tenant usage, engagement and growth metrics · As of 2 Jul 2026, 4:30 PM IST
          </p>
        </div>
        <Button className="self-start sm:self-auto">
          <Download className="w-3.5 h-3.5" />
          <span>Export Report</span>
        </Button>
      </div>

      {/* 1. KPIs Stats row */}
      <AnalyticsStatsGrid />

      {/* 2. Trends charts */}
      <AnalyticsTrendsSection />

      {/* 3. Mid tier distribution stats & top lists */}
      <AnalyticsDistributionSection />

      {/* 4. Bottom heatmaps & funnel stages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <HourlyEngagementHeatmap />
        </div>
        <div className="lg:col-span-1">
          <TenantGrowthFunnel />
        </div>
      </div>
    </PageShell>
  );
}
