"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { CheckCircle, AlertTriangle } from "lucide-react";

// Donut Chart Data
const statusData = [
  { name: "Online", value: 4517, color: "#10b981" },
  { name: "Delayed", value: 96, color: "#f59e0b" },
  { name: "Offline", value: 249, color: "#ef4444" }
];

// Stacked Bar Data
const revenuePlanData = [
  { name: "Apr", basic: 200000, professional: 600000, enterprise: 900000 },
  { name: "May", basic: 230000, professional: 700000, enterprise: 950000 },
  { name: "Jun", basic: 300000, professional: 750000, enterprise: 1042600 }
];

export default function StatusHealthGrid() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-xl h-72 animate-pulse" />
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-xl h-72 animate-pulse" />
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-xl h-72 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. Screens Status */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-lg shadow-xs flex flex-col justify-between">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Screens Status</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Live heartbeat distribution</p>
        </div>

        <div className="h-36 relative flex items-center justify-center mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={52}
                paddingAngle={3}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="space-y-1.5 text-xs mt-2 border-t border-zinc-100 dark:border-zinc-800/60 pt-3">
          {statusData.map((item) => (
            <div key={item.name} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-zinc-600 dark:text-zinc-450">{item.name}</span>
              </div>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">
                {item.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Revenue by Plan */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-lg shadow-xs flex flex-col justify-between">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Revenue by Plan</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Monthly recurring revenue split</p>
        </div>

        <div className="h-36 mt-4 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenuePlanData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="#888888" fontSize={10} />
              <YAxis tick={false} axisLine={false} />
              <Bar dataKey="basic" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} maxBarSize={30} />
              <Bar dataKey="professional" stackId="a" fill="#2563eb" radius={[0, 0, 0, 0]} maxBarSize={30} />
              <Bar dataKey="enterprise" stackId="a" fill="#0f172a" radius={[3, 3, 0, 0]} className="dark:fill-zinc-50" maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex justify-between items-center text-[10px] mt-2 border-t border-zinc-100 dark:border-zinc-800/60 pt-3 text-zinc-450 font-medium">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#10b981] rounded-xs" /> Basic
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#2563eb] rounded-xs" /> Professional
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#0f172a] dark:bg-zinc-550 rounded-xs" /> Enterprise
          </span>
        </div>
      </div>

      {/* 3. Platform Health */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-lg shadow-xs flex flex-col justify-between">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Platform Health</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Service status · last checked 4:29 PM</p>
        </div>

        {/* Health Checklist */}
        <div className="space-y-2 mt-4 flex-1">
          <div className="flex items-center justify-between text-xs py-0.5">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-zinc-650 dark:text-zinc-350">API</span>
            </div>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">99.99%</span>
          </div>

          <div className="flex items-center justify-between text-xs py-0.5">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-zinc-650 dark:text-zinc-350">PostgreSQL</span>
            </div>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">99.98%</span>
          </div>

          <div className="flex items-center justify-between text-xs py-0.5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-zinc-650 dark:text-zinc-350">Telemetry SQS</span>
            </div>
            <span className="font-bold text-amber-600 dark:text-amber-500">Degraded</span>
          </div>

          <div className="flex items-center justify-between text-xs py-0.5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-zinc-650 dark:text-zinc-350">Razorpay Webhooks</span>
            </div>
            <span className="font-bold text-amber-600 dark:text-amber-500">Degraded</span>
          </div>
        </div>

        {/* Amber status alert box */}
        <div className="bg-amber-50/70 border border-amber-100/80 dark:bg-amber-950/20 dark:border-amber-900/30 p-2.5 rounded-lg mt-3 text-[10px] text-amber-800 dark:text-amber-450 leading-relaxed font-medium">
          2 services degraded. 18,420 queued messages · 3 webhook retries pending.
        </div>
      </div>
    </div>
  );
}
