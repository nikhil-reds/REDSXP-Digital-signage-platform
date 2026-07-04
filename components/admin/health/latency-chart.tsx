"use client";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

const latencyData = [
  { name: "16:30", p50: 45, p95: 110, p99: 175 },
  { name: "18:30", p50: 42, p95: 105, p99: 170 },
  { name: "20:30", p50: 40, p95: 100, p99: 165 },
  { name: "22:30", p50: 44, p95: 112, p99: 180 },
  { name: "00:30", p50: 52, p95: 125, p99: 200 },
  { name: "02:30", p50: 60, p95: 148, p99: 260 },
  { name: "04:30", p50: 58, p95: 140, p99: 245 }
];

export default function LatencyChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-xl h-80 animate-pulse" />
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-xl shadow-xs flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">24-Hour API Latency</h2>
          <p className="text-xs text-zinc-450 mt-0.5">
            p50, p95 and p99 response times. Amber region marks Telemetry SQS degradation.
          </p>
        </div>

        {/* Legend */}
        <div className="flex gap-3.5 text-[10px] font-semibold text-zinc-450 shrink-0 select-none">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-teal-500 rounded-full" /> p50
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-amber-500 rounded-full" /> p95
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-red-500 rounded-full" /> p99
          </span>
        </div>
      </div>

      <div className="h-64 mt-6 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={latencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-zinc-150)" className="dark:stroke-zinc-800/40" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="#888888" />
            <YAxis
              tickLine={false}
              axisLine={false}
              stroke="#888888"
              domain={[0, 380] }
              ticks={[0, 95, 190, 285, 380]}
              tickFormatter={(v) => `${v}ms`}
            />
            <Tooltip
              formatter={(value: any) => [`${value}ms`, ""]}
              contentStyle={{
                background: "var(--background)",
                border: "1px solid var(--color-zinc-200)",
                borderRadius: "8px"
              }}
            />
            <Line type="monotone" dataKey="p50" stroke="#14b8a6" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="p95" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="p99" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
