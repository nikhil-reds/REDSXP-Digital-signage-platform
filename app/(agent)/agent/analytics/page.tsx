"use client";

import React, { useState } from "react";
import { Calendar } from "lucide-react";
import AnalyticsStats from "@/components/agent/analytics/analytics-stats";
import ProofOfPlayCharts from "@/components/agent/analytics/proof-of-play-charts";
import UptimeHistory from "@/components/agent/analytics/uptime-history";
import { Button, PageShell, Select } from "@/components/ui";

export default function AgentAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("Last 7 Days");

  const handleExport = (format: "PDF" | "CSV") => {
    alert(`Generating SLA report in ${format} format for selected date range (${timeRange}). Download will start shortly.`);
  };

  return (
    <PageShell>
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-app-border pb-5 shrink-0">
        <div>
          <h1 className="font-heading text-h5 font-semibold tracking-headline text-app-text">
            Analytics & Proof-of-Play
          </h1>
          <p className="text-body text-app-muted mt-1">
            Analyze playlist execution loops, SLA uptime metrics, and correlation data for sensor triggers.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Time range Selector */}
          <Select
              icon={Calendar}
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="Today">Today</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
          </Select>

          {/* Export selectors */}
          <div className="flex items-center gap-1">
            <Button size="sm" onClick={() => handleExport("PDF")}>
              Export PDF
            </Button>
            <Button size="sm" onClick={() => handleExport("CSV")}>
              CSV
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Stats counters grid */}
      <AnalyticsStats />

      {/* Recharts Visualizations Grid */}
      <ProofOfPlayCharts />

      {/* SLA Uptime logs table */}
      <UptimeHistory />

    </PageShell>
  );
}
