"use client";

import React from "react";
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

// Donut Chart Data
const planData = [
  { name: "Starter", value: 12, color: "var(--app-warning)", label: "Starter 12%" },
  { name: "Growth", value: 28, color: "var(--chart-1)", label: "Growth 28%" },
  { name: "Business", value: 38, color: "var(--chart-2)", label: "Business 38%" },
  { name: "Enterprise", value: 22, color: "var(--app-text)", label: "Enterprise 22%" }
];

// Stacked Area Data
const playsCategoryData = [
  { name: "1 Jun", video: 400000, audio: 250000, images: 150000 },
  { name: "6 Jun", video: 450000, audio: 280000, images: 180000 },
  { name: "11 Jun", video: 500000, audio: 310000, images: 200000 }
];

// Top Tenants Data
const topTenants = [
  { name: "Reliance Retail Media", value: "8,42,00,000", percent: 95 },
  { name: "PVR INOX", value: "6,10,00,050", percent: 75 },
  { name: "Apollo Pharmacies", value: "4,38,00,000", percent: 55 },
  { name: "Café Coffee Day", value: "3,12,00,000", percent: 45 },
  { name: "Decathlon India", value: "2,87,00,000", percent: 40 }
];

export default function AnalyticsDistributionSection() {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return `${value}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. Sessions by Plan Donut */}
      <div className="flex flex-col justify-between rounded-xl border border-app-border bg-app-surface p-5 shadow-xs">
        <div>
          <h2 className="text-body font-bold text-app-text">Sessions by Plan</h2>
          <p className="mt-0.5 text-caption text-app-muted">Distribution across plan tiers</p>
        </div>

        <div className="h-40 relative flex items-center justify-center mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={planData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={55}
                paddingAngle={3}
                dataKey="value"
              >
                {planData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-2 grid grid-cols-2 gap-2 border-t border-app-border pt-3.5 text-[10px] font-medium">
          {planData.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-app-muted">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Content Plays by Category */}
      <div className="flex flex-col justify-between rounded-xl border border-app-border bg-app-surface p-5 shadow-xs">
        <div>
          <h2 className="text-body font-bold text-app-text">Content Plays by Category</h2>
          <p className="mt-0.5 text-caption text-app-muted">Stacked area · June 2026</p>
        </div>

        <div className="h-40 mt-4 w-full text-[10px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={playsCategoryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="var(--app-muted)" />
              <YAxis
                tickFormatter={formatCurrency}
                tickLine={false}
                axisLine={false}
                stroke="var(--app-muted)"
                domain={[0, 1000000]}
                ticks={[0, 250000, 500000, 750000, 1000000]}
              />
              <Tooltip
                formatter={(value) => [Number(value).toLocaleString(), ""]}
                contentStyle={{
                  background: "var(--app-surface)",
                  border: "1px solid var(--app-border)",
                  borderRadius: "8px"
                }}
              />
              <Area type="monotone" dataKey="video" stackId="1" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.4} />
              <Area type="monotone" dataKey="audio" stackId="1" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.4} />
              <Area type="monotone" dataKey="images" stackId="1" stroke="var(--app-warning)" fill="var(--app-warning)" fillOpacity={0.4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-2 flex items-center justify-between border-t border-app-border pt-3 text-[10px] font-medium text-app-muted">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-xs bg-app-accent" /> Video
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-xs bg-app-warning" /> Audio
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-xs bg-app-danger" /> Images
          </span>
        </div>
      </div>

      {/* 3. Top 5 Tenants by Screen Impressions */}
      <div className="flex flex-col justify-between rounded-xl border border-app-border bg-app-surface p-5 shadow-xs">
        <div>
          <h2 className="text-body font-bold text-app-text">Top 5 Tenants by Screen Impressions</h2>
          <p className="mt-0.5 text-caption text-app-muted">June 2026 · total impressions</p>
        </div>

        <div className="space-y-3.5 mt-4 flex-1">
          {topTenants.map((tenant) => (
            <div key={tenant.name} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-app-text">
                <span className="truncate max-w-[150px]">{tenant.name}</span>
                <span className="font-mono text-app-text">{tenant.value}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-app-surface-alt">
                <div
                  className="h-full rounded-full bg-app-accent"
                  style={{ width: `${tenant.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
