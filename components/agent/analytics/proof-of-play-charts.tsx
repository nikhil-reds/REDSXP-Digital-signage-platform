"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from "recharts";
import { Clock, PlaySquare, Activity } from "lucide-react";

// Data matching the guidelines
const uptimeData = [
  { day: "Day 1", uptime: 98.2 },
  { day: "Day 2", uptime: 98.5 },
  { day: "Day 3", uptime: 98.7 },
  { day: "Day 4", uptime: 98.9 },
  { day: "Day 5", uptime: 99.1 },
  { day: "Day 6", uptime: 98.6 },
  { day: "Day 7", uptime: 98.7 }
];

const playlistPlaysData = [
  { name: "Monsoon Café", plays: 6420 },
  { name: "Lunch Combos", plays: 5840 },
  { name: "Breakfast Menu", plays: 4286 },
  { name: "Weekend Music", plays: 1880 }
];

const sensorTriggersData = [
  { type: "Motion", count: 2450, color: "#F59E0B" },
  { type: "Light", count: 1840, color: "#3B82F6" },
  { type: "Camera", count: 1120, color: "#8B5CF6" },
  { type: "Temperature", count: 840, color: "#EF4444" }
];

export default function ProofOfPlayCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. Uptime Compliance */}
      <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl p-4 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-zinc-400" />
            7-Day Uptime Compliance
          </h3>
          <p className="text-[10px] text-zinc-400 mt-0.5">Average compliance trend log.</p>
        </div>
        <div className="h-44 w-full text-[9px] font-bold">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={uptimeData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E6EC" />
              <XAxis dataKey="day" stroke="#9AA7B7" tickLine={false} />
              <YAxis domain={[95, 100]} stroke="#9AA7B7" tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="uptime" stroke="#10B981" fill="#10B981" fillOpacity={0.06} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Playlist Plays */}
      <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl p-4 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider flex items-center gap-1.5">
            <PlaySquare className="w-4 h-4 text-zinc-400" />
            Loop Plays by Playlist
          </h3>
          <p className="text-[10px] text-zinc-400 mt-0.5">Total play cycles evaluated today.</p>
        </div>
        <div className="h-44 w-full text-[9px] font-bold">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={playlistPlaysData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E6EC" />
              <XAxis dataKey="name" stroke="#9AA7B7" tickLine={false} />
              <YAxis stroke="#9AA7B7" tickLine={false} />
              <Tooltip />
              <Bar dataKey="plays" fill="#2859D9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Sensor Triggers */}
      <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl p-4 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-zinc-400" />
            Sensor Trigger Distributions
          </h3>
          <p className="text-[10px] text-zinc-400 mt-0.5">Activation counts by hardware type.</p>
        </div>
        <div className="h-44 w-full text-[9px] font-bold">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sensorTriggersData} layout="vertical" margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E6EC" />
              <XAxis type="number" stroke="#9AA7B7" tickLine={false} />
              <YAxis dataKey="type" type="category" stroke="#9AA7B7" tickLine={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {sensorTriggersData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
