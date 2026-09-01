"use client";

import React from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";
import { Activity, Clock, PlaySquare } from "lucide-react";
import { CHART_GRID, CHART_SERIES, ChartCard, chartAxisProps } from "@/components/ui";

const uptimeData = [
  { day: "Day 1", uptime: 98.2 }, { day: "Day 2", uptime: 98.5 },
  { day: "Day 3", uptime: 98.7 }, { day: "Day 4", uptime: 98.9 },
  { day: "Day 5", uptime: 99.1 }, { day: "Day 6", uptime: 98.6 },
  { day: "Day 7", uptime: 98.7 },
];

const playlistPlaysData = [
  { name: "Monsoon Café", plays: 6420 }, { name: "Lunch Combos", plays: 5840 },
  { name: "Breakfast Menu", plays: 4286 }, { name: "Weekend Music", plays: 1880 },
];

const sensorTriggersData = [
  { type: "Motion", count: 2450 }, { type: "Light", count: 1840 },
  { type: "Camera", count: 1120 }, { type: "Temperature", count: 840 },
];

const tooltipStyle = {
  background: "var(--app-surface)", border: "1px solid var(--app-border)",
  borderRadius: 8, color: "var(--app-text)", fontSize: 12,
};

export default function ProofOfPlayCharts() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <ChartCard title="7-day uptime compliance" description="Average compliance trend." icon={Clock} height={190}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={uptimeData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_GRID} />
            <XAxis dataKey="day" {...chartAxisProps} /><YAxis domain={[95, 100]} {...chartAxisProps} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="uptime" stroke={CHART_SERIES[0]} fill={CHART_SERIES[0]} fillOpacity={0.08} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Loop plays by playlist" description="Total play cycles evaluated today." icon={PlaySquare} height={190}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={playlistPlaysData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_GRID} />
            <XAxis dataKey="name" {...chartAxisProps} /><YAxis {...chartAxisProps} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="plays" fill={CHART_SERIES[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Sensor trigger distribution" description="Activation counts by hardware type." icon={Activity} height={190}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sensorTriggersData} layout="vertical" margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={CHART_GRID} />
            <XAxis type="number" {...chartAxisProps} /><YAxis dataKey="type" type="category" {...chartAxisProps} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {sensorTriggersData.map((entry, index) => <Cell key={entry.type} fill={CHART_SERIES[index % 3]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
