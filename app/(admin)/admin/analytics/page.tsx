import React from "react";
import { Download } from "lucide-react";
import AnalyticsStatsGrid from "@/components/admin/analytics/stats-grid";
import AnalyticsTrendsSection from "@/components/admin/analytics/trends-section";
import AnalyticsDistributionSection from "@/components/admin/analytics/distribution-section";
import HourlyEngagementHeatmap from "@/components/admin/analytics/heatmap-section";
import TenantGrowthFunnel from "@/components/admin/analytics/funnel-section";

export default function PlatformAnalyticsPage() {
  return (
    <div className="py-6 px-15 space-y-6 mx-auto font-sans ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Platform Analytics
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Cross-tenant usage, engagement and growth metrics · As of 2 Jul 2026, 4:30 PM IST
          </p>
        </div>
        <button className="flex items-center gap-1.5 bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm cursor-pointer self-start sm:self-auto">
          <Download className="w-3.5 h-3.5" />
          <span>Export Report</span>
        </button>
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
    </div>
  );
}
