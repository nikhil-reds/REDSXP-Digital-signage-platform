"use client";

import React, { useState } from "react";
import { X, WifiOff, HardDrive, RefreshCw, AlertCircle, AlertTriangle } from "lucide-react";
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
  const tabs = ["Overview", "Heartbeat", "Uptime", "Errors", "Cmds"];

  const handleRestart = () => {
    alert(`Sending remote restart command to ${device.name}...`);
  };

  return (
    <div className="flex h-full w-96 shrink-0 flex-col overflow-y-auto border-l border-app-border bg-app-surface font-sans text-app-text shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-app-border p-4">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 shrink-0 rounded-lg bg-app-danger-surface p-2 text-app-danger-text">
            <WifiOff className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-body font-bold leading-snug text-app-text">
              {device.name}
            </h2>
            <div className="mt-1.5">
              <span className="rounded-full border border-app-danger-border bg-app-danger-surface px-2 py-0.5 text-[10px] font-semibold text-app-danger-text">
                {device.status}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="cursor-pointer rounded-lg p-1 text-app-muted transition-colors hover:bg-app-surface-alt hover:text-app-text"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Metadata Overview grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 border-b border-app-border p-4 text-caption">
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
      <div className="flex select-none gap-1 overflow-x-auto border-b border-app-border bg-app-surface-alt p-3">
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "border border-app-border bg-app-surface text-app-text shadow-xs"
                  : "text-app-muted hover:bg-app-surface hover:text-app-text"
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
          <div className="flex h-18 flex-col justify-between rounded-xl border border-app-border bg-app-surface-alt p-3">
            <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-semibold uppercase tracking-wider block">
              Last heartbeat
            </span>
            <span className="mt-1 block text-body font-bold text-app-danger-text">
              18 min ago
            </span>
          </div>

          {/* Playlist */}
          <div className="flex h-18 flex-col justify-between rounded-xl border border-app-border bg-app-surface-alt p-3">
            <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-semibold uppercase tracking-wider block">
              Playlist
            </span>
            <span className="mt-1 block truncate text-body font-bold text-app-text">
              Wellness Week
            </span>
          </div>
        </div>

        {/* Storage card */}
        <div className="space-y-2 rounded-xl border border-app-border bg-app-surface-alt p-3">
          <div className="flex justify-between items-center text-[10px] font-semibold uppercase tracking-wider text-zinc-450 dark:text-zinc-500">
            <span className="flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5" />
              Storage used
            </span>
            <span className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">41% - 6.6 / 16 GB</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-app-surface">
            <div className="h-full rounded-full bg-app-accent" style={{ width: "41%" }} />
          </div>
        </div>

        {/* 24-hour uptime Area Chart Card */}
        <div className="space-y-4 rounded-xl border border-app-border bg-app-surface-alt p-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              24-hour uptime
            </span>
            <span className="text-[10px] font-semibold text-zinc-450 dark:text-zinc-400">Offline last 18m</span>
          </div>

          {/* Area Chart visualization */}
          <div className="h-28 w-full select-none">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={uptimeChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Area
                    type="stepAfter"
                    dataKey="uptime"
                    stroke="var(--chart-1)"
                    strokeWidth={1.5}
                    fill="url(#uptimeGrad)"
                  />
                  <defs>
                    <linearGradient id="uptimeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
          </div>

          {/* 5-block indicators */}
          <div className="flex gap-1">
            <div className="h-2 flex-1 rounded-sm bg-app-accent" />
            <div className="h-2 flex-1 rounded-sm bg-app-accent" />
            <div className="h-2 flex-1 rounded-sm bg-app-accent" />
            <div className="h-2 flex-1 rounded-sm bg-app-accent" />
            <div className="h-2 flex-1 animate-pulse rounded-sm bg-app-danger" />
          </div>
        </div>

        {/* Recent errors log list */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
            Recent errors
          </span>

          <div className="space-y-2">
            {/* Heartbeat timeout card */}
            <div className="flex items-start gap-2.5 rounded-xl border border-app-danger-border bg-app-danger-surface p-3">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-455 shrink-0 mt-0.5" />
              <div>
                <span className="block font-semibold text-rose-800 dark:text-rose-400">Heartbeat timeout</span>
                <span className="block text-[10px] text-rose-650 dark:text-rose-450/90 mt-0.5">
                  Device unreachable after 90s - 16:12 IST
                </span>
              </div>
            </div>

            {/* Playback stalled card */}
            <div className="flex items-start gap-2.5 rounded-xl border border-app-border bg-app-warning-surface p-3">
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
          className="mt-6 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-app-warning py-2.5 text-caption font-semibold text-app-warning-on shadow-sm transition-colors hover:opacity-90"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Remote Restart</span>
        </button>
      </div>
    </div>
  );
}
