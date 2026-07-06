"use client";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

const trendData = [
  { name: "1 Jun", mrr: 1550000, net: 1450000 },
  { name: "6 Jun", mrr: 1680000, net: 1580000 },
  { name: "11 Jun", mrr: 1750000, net: 1650000 },
  { name: "16 Jun", mrr: 1842600, net: 1728040 }
];

const planContributionData = [
  { name: "1 Jun", starter: 150000, growth: 350000, business: 450000, enterprise: 600000 },
  { name: "6 Jun", starter: 160000, growth: 380000, business: 480050, enterprise: 661150 },
  { name: "11 Jun", starter: 170000, growth: 400000, business: 500000, enterprise: 701200 },
  { name: "16 Jun", starter: 180000, growth: 430000, business: 541200, enterprise: 750000 }
];

export default function BillingChartsSection() {
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
      {/* 1. Revenue Trend Line Chart */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-lg shadow-xs flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Revenue Trend</h2>
            <p className="text-xs text-zinc-450 mt-0.5">MRR vs Net Revenue · June 2026</p>
          </div>
          {/* Legend indicator */}
          <div className="flex gap-3 text-[10px] font-semibold text-zinc-450">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" /> MRR
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-500" /> Net
            </span>
          </div>
        </div>

        <div className="h-60 mt-6 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-zinc-150)" className="dark:stroke-zinc-800/40" />
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
              <Line type="monotone" dataKey="mrr" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="net" stroke="#14b8a6" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Revenue by Plan Stacked Area Chart */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-lg shadow-xs flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Revenue by Plan</h2>
            <p className="text-xs text-zinc-450 mt-0.5">Stacked contribution · June 2026</p>
          </div>
          {/* Legend indicators */}
          <div className="flex gap-2.5 text-[9px] font-semibold text-zinc-450">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Starter
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" /> Growth
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Business
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" /> Enterprise
            </span>
          </div>
        </div>

        <div className="h-60 mt-6 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={planContributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-zinc-150)" className="dark:stroke-zinc-800/40" />
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
              <Area type="monotone" dataKey="starter" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} />
              <Area type="monotone" dataKey="growth" stackId="1" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.2} />
              <Area type="monotone" dataKey="business" stackId="1" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} />
              <Area type="monotone" dataKey="enterprise" stackId="1" stroke="#0f172a" fill="#0f172a" fillOpacity={0.25} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
