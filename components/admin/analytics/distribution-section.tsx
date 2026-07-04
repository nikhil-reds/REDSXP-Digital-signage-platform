"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

// Donut Chart Data
const planData = [
  { name: "Starter", value: 12, color: "#f59e0b", label: "Starter 12%" },
  { name: "Growth", value: 28, color: "#14b8a6", label: "Growth 28%" },
  { name: "Business", value: 38, color: "#2563eb", label: "Business 38%" },
  { name: "Enterprise", value: 22, color: "#0f172a", label: "Enterprise 22%" }
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-xl h-80 animate-pulse" />
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-xl h-80 animate-pulse" />
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-xl h-80 animate-pulse" />
      </div>
    );
  }

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
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-lg shadow-xs flex flex-col justify-between">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Sessions by Plan</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Distribution across plan tiers</p>
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
        <div className="grid grid-cols-2 gap-2 text-[10px] mt-2 border-t border-zinc-100 dark:border-zinc-800/60 pt-3.5 font-medium">
          {planData.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-zinc-650 dark:text-zinc-450">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Content Plays by Category */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-lg shadow-xs flex flex-col justify-between">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Content Plays by Category</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Stacked area · June 2026</p>
        </div>

        <div className="h-40 mt-4 w-full text-[10px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={playsCategoryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="#888888" />
              <YAxis
                tickFormatter={formatCurrency}
                tickLine={false}
                axisLine={false}
                stroke="#888888"
                domain={[0, 1000000]}
                ticks={[0, 250000, 500000, 750000, 1000000]}
              />
              <Tooltip
                formatter={(value: any) => [Number(value).toLocaleString(), ""]}
                contentStyle={{
                  background: "var(--background)",
                  border: "1px solid var(--color-zinc-200)",
                  borderRadius: "8px"
                }}
              />
              <Area type="monotone" dataKey="video" stackId="1" stroke="#2563eb" fill="#2563eb" fillOpacity={0.4} />
              <Area type="monotone" dataKey="audio" stackId="1" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.45} />
              <Area type="monotone" dataKey="images" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex justify-between items-center text-[10px] mt-2 border-t border-zinc-100 dark:border-zinc-800/60 pt-3 text-zinc-450 font-medium">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#2563eb] rounded-xs" /> Video
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#14b8a6] rounded-xs" /> Audio
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#f59e0b] rounded-xs" /> Images
          </span>
        </div>
      </div>

      {/* 3. Top 5 Tenants by Screen Impressions */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-lg shadow-xs flex flex-col justify-between">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Top 5 Tenants by Screen Impressions</h2>
          <p className="text-xs text-zinc-400 mt-0.5">June 2026 · total impressions</p>
        </div>

        <div className="space-y-3.5 mt-4 flex-1">
          {topTenants.map((tenant) => (
            <div key={tenant.name} className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                <span className="truncate max-w-[150px]">{tenant.name}</span>
                <span className="font-mono text-zinc-900 dark:text-zinc-100">{tenant.value}</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 dark:bg-blue-500 h-full rounded-full"
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
