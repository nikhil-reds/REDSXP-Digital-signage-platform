"use client";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

const mrrData = [
  { name: "Wk1", current: 1600000, previous: 1300000 },
  { name: "Wk2", current: 1750000, previous: 1350000 },
  { name: "Wk3", current: 1800000, previous: 1450000 },
  { name: "Wk4", current: 1842600, previous: 1500000 }
];

const tenantsData = [
  { name: "Wk1", active: 5, churn: 1 },
  { name: "Wk2", active: 4, churn: 2 },
  { name: "Wk3", active: 3, churn: 0 },
  { name: "Wk4", active: 3, churn: 1 }
];

export default function TrendsCharts() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-xl h-80 animate-pulse" />
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-xl h-80 animate-pulse" />
      </div>
    );
  }

  // Format currency for Y axis (e.g. 500k, 1M, 1.5M, 2M)
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* MRR Trend Chart */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-lg shadow-xs flex flex-col justify-between">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">MRR Trend — June 2026</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Current period vs previous period (dashed)</p>
        </div>

        <div className="h-64 mt-4 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mrrData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-zinc-100)" className="dark:stroke-zinc-800/50" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="#888888" />
              <YAxis
                tickFormatter={formatCurrency}
                tickLine={false}
                axisLine={false}
                stroke="#888888"
                domain={[0, 2000000]}
                ticks={[0, 500000, 1000000, 1500000, 2000000]}
              />
              <Tooltip
                formatter={(value: any) => [`₹${Number(value || 0).toLocaleString("en-IN")}`, ""]}
                contentStyle={{
                  background: "var(--background)",
                  border: "1px solid var(--color-zinc-200)",
                  borderRadius: "8px"
                }}
              />
              <Line
                type="monotone"
                dataKey="current"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 3, fill: "#2563eb" }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="previous"
                stroke="#94a3b8"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* New Tenants vs Churn Chart */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-lg shadow-xs flex flex-col justify-between">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">New Tenants vs Churn</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Weekly acquisition and cancellations</p>
        </div>

        <div className="h-64 mt-4 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tenantsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }} barGap={5}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-zinc-100)" className="dark:stroke-zinc-800/50" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="#888888" />
              <YAxis
                tickLine={false}
                axisLine={false}
                stroke="#888888"
                domain={[0, 8]}
                ticks={[0, 2, 4, 6, 8]}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--background)",
                  border: "1px solid var(--color-zinc-200)",
                  borderRadius: "8px"
                }}
              />
              <Bar dataKey="active" name="New Tenants" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={35} />
              <Bar dataKey="churn" name="Churn" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={35} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
