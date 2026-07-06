"use client";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import { User, Shield, Terminal, ArrowUpRight } from "lucide-react";

// Sensor triggers last 24h
const sensorActivityData = [
  { time: "08:00", triggers: 120 },
  { time: "10:00", triggers: 340 },
  { time: "12:00", triggers: 560 },
  { time: "14:00", triggers: 450 },
  { time: "16:00", triggers: 680 },
  { time: "18:00", triggers: 820 },
  { time: "20:00", triggers: 600 },
  { time: "22:00", triggers: 244 }
];

// Proof-of-play last 7 days
const playTrendData = [
  { day: "Sun", plays: 12400 },
  { day: "Mon", plays: 14100 },
  { day: "Tue", plays: 15300 },
  { day: "Wed", plays: 16800 },
  { day: "Thu", plays: 15900 },
  { day: "Fri", plays: 17200 },
  { day: "Sat", plays: 18426 }
];

const activityFeed = [
  {
    id: "act-1",
    agent: "Aarav Mehta",
    action: "Published playlist",
    target: "Monsoon Café Promotions to 21 screens",
    time: "3:42 PM",
    icon: User,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20"
  },
  {
    id: "act-2",
    agent: "Aarav Mehta",
    action: "Restarted player",
    target: "MG Road Menu Board 01 — Successful",
    time: "3:18 PM",
    icon: User,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20"
  },
  {
    id: "act-3",
    agent: "Sneha Iyer",
    action: "Acknowledged warning",
    target: "Phoenix Marketcity Storage warning (94%)",
    time: "2:56 PM",
    icon: Shield,
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/20"
  },
  {
    id: "act-4",
    agent: "System Deployer",
    action: "Pushed manifest",
    target: "mf_8f21c to Bengaluru Flagship Stores",
    time: "2:40 PM",
    icon: Terminal,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20"
  },
  {
    id: "act-5",
    agent: "Rohan Das",
    action: "Updated priority",
    target: "Entrance Motion Promotion from 70 to 80",
    time: "1:24 PM",
    icon: User,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20"
  }
];

export default function TrendsActivitySection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] p-5 rounded-xl h-80 animate-pulse lg:col-span-2" />
        <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] p-5 rounded-xl h-80 animate-pulse lg:col-span-1" />
      </div>
    );
  }

  const formatPlays = (val: number) => {
    if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}k`;
    }
    return `${val}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Charts (Sensor + Proof of play) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sensor Activity last 24h */}
          <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] p-5 rounded-xl shadow-xs flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#18202B] dark:text-[#F2F5F8]">Sensor Activity (24h)</h2>
              <p className="text-xs text-[#657080] dark:text-[#9AA7B7] mt-0.5">Triggers across PIR, Temp, Sound, GPIO</p>
            </div>

            <div className="h-56 mt-4 w-full text-[10px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sensorActivityData} margin={{ top: 10, right: 0, left: -30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E6EC" className="dark:stroke-[#283243]/50" />
                  <XAxis dataKey="time" tickLine={false} axisLine={false} stroke="#657080" />
                  <YAxis tickLine={false} axisLine={false} stroke="#657080" />
                  <Tooltip
                    contentStyle={{
                      background: "var(--background)",
                      border: "1px solid var(--color-zinc-200)",
                      borderRadius: "8px"
                    }}
                  />
                  {/* Violet bar matching sensor automation design rule */}
                  <Bar dataKey="triggers" name="Triggers" fill="#8B5CF6" radius={[3, 3, 0, 0]} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Proof of Play last 7 days */}
          <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] p-5 rounded-xl shadow-xs flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#18202B] dark:text-[#F2F5F8]">Proof-of-Play Trend</h2>
              <p className="text-xs text-[#657080] dark:text-[#9AA7B7] mt-0.5">Daily total content loop plays</p>
            </div>

            <div className="h-56 mt-4 w-full text-[10px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={playTrendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="popColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2859D9" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2859D9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E6EC" className="dark:stroke-[#283243]/50" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="#657080" />
                  <YAxis tickFormatter={formatPlays} tickLine={false} axisLine={false} stroke="#657080" />
                  <Tooltip
                    formatter={(value: any) => [Number(value).toLocaleString("en-IN"), "Plays"]}
                    contentStyle={{
                      background: "var(--background)",
                      border: "1px solid var(--color-zinc-200)",
                      borderRadius: "8px"
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="plays"
                    stroke="#2859D9"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#popColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Recent Activity Feed */}
      <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] p-5 rounded-xl shadow-xs flex flex-col justify-between lg:col-span-1">
        <div>
          <h2 className="text-sm font-bold text-[#18202B] dark:text-[#F2F5F8]">Recent Activity Feed</h2>
          <p className="text-xs text-[#657080] dark:text-[#9AA7B7] mt-0.5">Audit log of regional operator events</p>
        </div>

        <div className="space-y-4 my-4 flex-1">
          {activityFeed.map((feed) => {
            const Icon = feed.icon;
            return (
              <div key={feed.id} className="flex gap-3 text-xs leading-normal">
                <div className={`p-1.5 rounded-lg shrink-0 w-8 h-8 flex items-center justify-center ${feed.bgColor} ${feed.color}`}>
                  <Icon className="w-4 h-4 shrink-0" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-zinc-650 dark:text-zinc-300">
                    <span className="font-bold text-zinc-900 dark:text-white mr-1">{feed.agent}</span>
                    {feed.action}
                  </div>
                  <div className="font-semibold text-[#2859D9] dark:text-[#6F96FF] text-[10px] mt-0.5 truncate">
                    {feed.target}
                  </div>
                  <span className="text-[9px] text-zinc-400 dark:text-zinc-500 block mt-0.5">
                    {feed.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-[11px] text-[#657080] dark:text-[#9AA7B7] border-t border-[#E2E6EC] dark:border-[#283243] pt-3 flex justify-between items-center">
          <span>Active operators: 3</span>
          <button className="text-[#2859D9] dark:text-[#6F96FF] font-bold hover:underline flex items-center gap-0.5">
            Full Audit Trail <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
