"use client";

import React from "react";
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

const dailyActiveData = [
  { name: "1 Jun", current: 4100, previous: 3880 },
  { name: "5 Jun", current: 4280, previous: 3950 },
  { name: "10 Jun", current: 4350, previous: 4020 },
  { name: "15 Jun", current: 4420, previous: 4090 },
  { name: "20 Jun", current: 4460, previous: 4120 },
  { name: "25 Jun", current: 4517, previous: 4180 }
];

const tenantsData = [
  { name: "Wk1", active: 5, churn: 1 },
  { name: "Wk2", active: 4, churn: 2 },
  { name: "Wk3", active: 3.5, churn: 1 },
  { name: "Wk4", active: 3, churn: 1 }
];

export default function AnalyticsTrendsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Daily Active Screens */}
      <div className="flex flex-col justify-between rounded-xl border border-app-border bg-app-surface p-5 shadow-xs">
        <div>
          <h2 className="text-body font-bold text-app-text">Daily Active Screens</h2>
          <p className="mt-0.5 text-caption text-app-muted">Online screen count over June 2026 · dashed = prior period</p>
        </div>

        <div className="h-64 mt-4 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyActiveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--app-border)" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="var(--app-muted)" />
              <YAxis
                tickLine={false}
                axisLine={false}
                stroke="var(--app-muted)"
                domain={[3800, 4600]}
                ticks={[3800, 4000, 4200, 4400, 4600]}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--app-surface)",
                  border: "1px solid var(--app-border)",
                  borderRadius: "8px"
                }}
              />
              <Line
                type="monotone"
                dataKey="current"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={{ r: 3, fill: "var(--chart-1)" }}
              />
              <Line
                type="monotone"
                dataKey="previous"
                stroke="var(--app-muted)"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* New Tenants vs Churned */}
      <div className="flex flex-col justify-between rounded-xl border border-app-border bg-app-surface p-5 shadow-xs">
        <div>
          <h2 className="text-body font-bold text-app-text">New Tenants vs Churned</h2>
          <p className="mt-0.5 text-caption text-app-muted">Weekly acquisition and cancellations</p>
        </div>

        <div className="h-64 mt-4 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tenantsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }} barGap={5}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--app-border)" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="var(--app-muted)" />
              <YAxis
                tickLine={false}
                axisLine={false}
                stroke="var(--app-muted)"
                domain={[0, 8]}
                ticks={[0, 2, 4, 6, 8]}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--app-surface)",
                  border: "1px solid var(--app-border)",
                  borderRadius: "8px"
                }}
              />
              <Bar dataKey="active" name="New Tenants" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={35} />
              <Bar dataKey="churn" name="Churned" fill="var(--app-danger)" radius={[4, 4, 0, 0]} maxBarSize={35} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
