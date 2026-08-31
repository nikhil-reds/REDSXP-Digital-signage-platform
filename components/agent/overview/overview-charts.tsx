"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { ChartCard, CHART_GRID, CHART_SERIES, chartAxisProps } from "@/components/ui";

const sensorActivityData = [
  { time: "08:00", triggers: 120 },
  { time: "10:00", triggers: 340 },
  { time: "12:00", triggers: 560 },
  { time: "14:00", triggers: 450 },
  { time: "16:00", triggers: 680 },
  { time: "18:00", triggers: 820 },
  { time: "20:00", triggers: 600 },
  { time: "22:00", triggers: 244 },
];

const playTrendData = [
  { day: "Sun", plays: 12400 },
  { day: "Mon", plays: 14100 },
  { day: "Tue", plays: 15300 },
  { day: "Wed", plays: 16800 },
  { day: "Thu", plays: 15900 },
  { day: "Fri", plays: 17200 },
  { day: "Sat", plays: 18426 },
];

/** Tooltip chrome shared by both charts so they read as one system. */
const tooltipStyle = {
  background: "var(--app-surface)",
  border: "1px solid var(--app-border)",
  borderRadius: "8px",
  color: "var(--app-text)",
  fontSize: "12px",
} as const;

const formatPlays = (val: number) =>
  val >= 1000 ? `${(val / 1000).toFixed(1)}k` : `${val}`;

/**
 * Loaded via next/dynamic with ssr:false — Recharts measures the DOM, so it
 * cannot render on the server. That replaces the previous mounted-flag effect.
 */
export default function OverviewCharts() {
  return (
    <>
      <ChartCard
        title="Sensor Activity (24h)"
        description="Triggers across PIR, Temp, Sound, GPIO"
        height={224}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sensorActivityData} margin={{ top: 10, right: 0, left: -30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_GRID} />
            <XAxis dataKey="time" {...chartAxisProps} />
            <YAxis {...chartAxisProps} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--app-surface-alt)" }} />
            <Bar
              dataKey="triggers"
              name="Triggers"
              fill={CHART_SERIES[0]}
              radius={[3, 3, 0, 0]}
              maxBarSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Proof-of-Play Trend"
        description="Daily total content loop plays"
        height={224}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={playTrendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="popColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_SERIES[0]} stopOpacity={0.25} />
                <stop offset="95%" stopColor={CHART_SERIES[0]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_GRID} />
            <XAxis dataKey="day" {...chartAxisProps} />
            <YAxis tickFormatter={formatPlays} {...chartAxisProps} />
            <Tooltip
              formatter={(value) => [Number(value).toLocaleString("en-IN"), "Plays"]}
              contentStyle={tooltipStyle}
              cursor={{ stroke: CHART_GRID }}
            />
            <Area
              type="monotone"
              dataKey="plays"
              stroke={CHART_SERIES[0]}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#popColor)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  );
}
