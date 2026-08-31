"use client";

import React from "react";
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
  return (
    <div className="flex flex-col justify-between rounded-xl border border-app-border bg-app-surface p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-body font-bold text-app-text">24-Hour API Latency</h2>
          <p className="mt-0.5 text-caption text-app-muted">
            p50, p95 and p99 response times. Amber region marks Telemetry SQS degradation.
          </p>
        </div>

        {/* Legend */}
        <div className="flex shrink-0 select-none gap-3.5 text-[10px] font-semibold text-app-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-2.5 rounded-full bg-app-accent" /> p50
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-2.5 rounded-full bg-app-warning" /> p95
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-2.5 rounded-full bg-app-danger" /> p99
          </span>
        </div>
      </div>

      <div className="h-64 mt-6 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={latencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--app-border)" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="var(--app-muted)" />
            <YAxis
              tickLine={false}
              axisLine={false}
              stroke="var(--app-muted)"
              domain={[0, 380] }
              ticks={[0, 95, 190, 285, 380]}
              tickFormatter={(v) => `${v}ms`}
            />
            <Tooltip
              formatter={(value) => [`${value}ms`, ""]}
              contentStyle={{
                background: "var(--app-surface)",
                border: "1px solid var(--app-border)",
                borderRadius: "8px"
              }}
            />
            <Line type="monotone" dataKey="p50" stroke="var(--chart-1)" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="p95" stroke="var(--app-warning)" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="p99" stroke="var(--app-danger)" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
