"use client";

import React, { useEffect, useState } from "react";
import { X, WifiOff, HardDrive, RefreshCw, AlertCircle, AlertTriangle, FileText, CheckCircle } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

interface Device {
  id: string;
  name: string;
  tenant: string;
  serial: string;
  model: string;
  status: "Online" | "Delayed" | "Offline";
  location: string;
}

interface DeviceDetailProps {
  device: Device;
  onClose: () => void;
}

// 24-hour uptime area chart mockup data (flat high line dipping to 0 at the end)
const uptimeChartData = [
  { time: "0", uptime: 100 },
  { time: "4", uptime: 100 },
  { time: "8", uptime: 100 },
  { time: "12", uptime: 100 },
  { time: "16", uptime: 100 },
  { time: "20", uptime: 100 },
  { time: "23", uptime: 0 }
];

export default function DeviceDetail({ device, onClose }: DeviceDetailProps) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = ["Overview", "Heartbeat", "Uptime", "Errors", "Cmds"];

  const handleRestart = () => {
    alert(`Sending remote restart command to ${device.name}...`);
  };

  return (
    <div className="w-96 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 flex flex-col h-full font-sans shadow-xl shrink-0 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-zinc-150 dark:border-zinc-800 flex justify-between items-start">
        <div className="flex items-start gap-2.5">
          <div className="p-2 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-lg shrink-0 mt-0.5">
            <WifiOff className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
              {device.name}
            </h2>
            <div className="mt-1.5">
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-455 border border-rose-100/50">
                {device.status}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-zinc-405 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Metadata Overview grid */}
      <div className="p-4 grid grid-cols-2 gap-y-3.5 gap-x-4 border-b border-zinc-150 dark:border-zinc-800 text-xs">
        <div>
          <span className="block text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500">Serial</span>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 block">{device.serial}</span>
        </div>
        <div>
          <span className="block text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500">Tenant</span>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 block">{device.tenant}</span>
        </div>
        <div>
          <span className="block text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500">Firmware</span>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 block">8.4.12</span>
        </div>
        <div>
          <span className="block text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500">Location</span>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 block">{device.location}</span>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="p-3 bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-150 dark:border-zinc-800 flex gap-1 overflow-x-auto select-none">
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs border border-zinc-200/50 dark:border-zinc-700/50"
                  : "text-zinc-500 hover:text-zinc-850 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Overview content */}
      <div className="p-4 space-y-4 flex-1 text-xs">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Last Heartbeat */}
          <div className="p-3 border border-zinc-200/85 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 flex flex-col justify-between h-18">
            <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-semibold uppercase tracking-wider block">
              Last heartbeat
            </span>
            <span className="text-sm font-bold text-red-650 dark:text-red-400 block mt-1">
              18 min ago
            </span>
          </div>

          {/* Playlist */}
          <div className="p-3 border border-zinc-200/85 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 flex flex-col justify-between h-18">
            <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-semibold uppercase tracking-wider block">
              Playlist
            </span>
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate block mt-1">
              Wellness Week
            </span>
          </div>
        </div>

        {/* Storage card */}
        <div className="p-3 border border-zinc-200/85 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 space-y-2">
          <div className="flex justify-between items-center text-[10px] font-semibold uppercase tracking-wider text-zinc-450 dark:text-zinc-500">
            <span className="flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5" />
              Storage used
            </span>
            <span className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">41% - 6.6 / 16 GB</span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div className="bg-zinc-850 dark:bg-zinc-200 h-full rounded-full" style={{ width: "41%" }} />
          </div>
        </div>

        {/* 24-hour uptime Area Chart Card */}
        <div className="p-3 border border-zinc-200/85 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              24-hour uptime
            </span>
            <span className="text-[10px] font-semibold text-zinc-450 dark:text-zinc-400">Offline last 18m</span>
          </div>

          {/* Area Chart visualization */}
          <div className="h-28 w-full select-none">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={uptimeChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Area
                    type="stepAfter"
                    dataKey="uptime"
                    stroke="#10b981"
                    strokeWidth={1.5}
                    fill="url(#uptimeGrad)"
                  />
                  <defs>
                    <linearGradient id="uptimeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* 5-block indicators */}
          <div className="flex gap-1">
            <div className="flex-1 h-2 rounded-sm bg-emerald-500" />
            <div className="flex-1 h-2 rounded-sm bg-emerald-500" />
            <div className="flex-1 h-2 rounded-sm bg-emerald-500" />
            <div className="flex-1 h-2 rounded-sm bg-emerald-500" />
            <div className="flex-1 h-2 rounded-sm bg-rose-500 animate-pulse" />
          </div>
        </div>

        {/* Recent errors log list */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
            Recent errors
          </span>

          <div className="space-y-2">
            {/* Heartbeat timeout card */}
            <div className="p-3 bg-rose-50/70 border border-rose-100/50 dark:bg-rose-950/15 dark:border-rose-900/30 rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-455 shrink-0 mt-0.5" />
              <div>
                <span className="block font-semibold text-rose-800 dark:text-rose-400">Heartbeat timeout</span>
                <span className="block text-[10px] text-rose-650 dark:text-rose-450/90 mt-0.5">
                  Device unreachable after 90s - 16:12 IST
                </span>
              </div>
            </div>

            {/* Playback stalled card */}
            <div className="p-3 bg-amber-50/70 border border-amber-100/50 dark:bg-amber-955/15 dark:border-amber-900/30 rounded-xl flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-550 shrink-0 mt-0.5" />
              <div>
                <span className="block font-semibold text-amber-800 dark:text-amber-400">Playback stalled</span>
                <span className="block text-[10px] text-amber-650 dark:text-amber-450/90 mt-0.5">
                  Asset load failed - 16:04 IST
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Remote Restart button */}
        <button
          onClick={handleRestart}
          className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer mt-6"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Remote Restart</span>
        </button>
      </div>
    </div>
  );
}
