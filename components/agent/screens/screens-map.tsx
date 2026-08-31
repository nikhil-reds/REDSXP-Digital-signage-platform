"use client";

import React from "react";
import { Map } from "lucide-react";
import { ScreenDevice } from "./screens-table";
import { Card, StatusDot, type Status } from "@/components/ui";

interface ScreensMapProps {
  screens: ScreenDevice[];
  onSelectScreen: (screen: ScreenDevice) => void;
  selectedScreenId: string | null;
}

// Custom mock coordinates for map representation
const mapPositions: Record<string, { top: string; left: string }> = {
  "Koramangala Entrance": { top: "68%", left: "34%" },
  "MG Road Menu Board 01": { top: "48%", left: "50%" },
  "MG Road Menu Board 02": { top: "52%", left: "48%" },
  "Phoenix Mall Display": { top: "42%", left: "76%" },
  "Indiranagar Screen 03": { top: "34%", left: "58%" },
  "Airport T2 Counter 04": { top: "14%", left: "62%" },
};

const DEVICE_STATUS: Record<ScreenDevice["status"], Status> = {
  Online: "online",
  Delayed: "warning",
  Offline: "error",
};

const PIN_TONE: Record<Status, string> = {
  online: "bg-app-accent-text",
  warning: "bg-app-warning",
  error: "bg-app-danger",
  unknown: "bg-app-muted",
};

export default function ScreensMap({
  screens,
  onSelectScreen,
  selectedScreenId,
}: ScreensMapProps) {
  const counts = {
    online: screens.filter((s) => s.status === "Online").length,
    warning: screens.filter((s) => s.status === "Delayed").length,
    error: screens.filter((s) => s.status === "Offline").length,
  };

  return (
    <Card
      size="panel"
      className="flex-1 flex flex-col min-w-0 bg-app-surface-alt overflow-hidden min-h-[550px] relative justify-center items-center select-none"
    >
      {/* Schematic Map Background */}
      <svg
        className="w-full h-full opacity-20 absolute inset-0 text-app-muted"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        {[20, 40, 60, 80].map((x) => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="100" stroke="currentColor" strokeWidth="0.5" />
        ))}
        {[20, 40, 60, 80].map((y) => (
          <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} stroke="currentColor" strokeWidth="0.5" />
        ))}
        <path d="M0,50 L100,50" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M50,0 L50,100" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>

      {/* Floating Panel Legend */}
      <Card
        size="row"
        padded
        className="absolute top-4 left-4 z-10 space-y-2 max-w-[220px]"
      >
        <h4 className="text-caption font-semibold text-app-text uppercase tracking-headline flex items-center gap-1.5">
          <Map className="w-3.5 h-3.5 text-app-muted" />
          Regional Map Legend
        </h4>
        <StatusDot status="online" label={`Online / Live Uptime (${counts.online})`} />
        <StatusDot status="warning" label={`Delayed Heartbeats (${counts.warning})`} />
        <StatusDot status="error" label={`Offline players (${counts.error})`} />
      </Card>

      {/* Plot active screen locations */}
      {screens.map((screen) => {
        const pos = mapPositions[screen.name] || { top: "50%", left: "50%" };
        const isSelected = selectedScreenId === screen.id;
        const status = DEVICE_STATUS[screen.status];

        return (
          <button
            key={screen.id}
            type="button"
            onClick={() => onSelectScreen(screen)}
            style={{ top: pos.top, left: pos.left }}
            aria-label={`${screen.name} — ${screen.status}`}
            className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent-text rounded-full ${
              isSelected ? "scale-125 z-20" : "hover:scale-110"
            }`}
          >
            <span
              className={`absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full opacity-60 animate-ping ${PIN_TONE[status]}`}
            />
            <span
              className={`block w-3.5 h-3.5 rounded-full border-2 border-app-surface ${PIN_TONE[status]} ${
                isSelected ? "ring-4 ring-app-accent-text/30" : ""
              }`}
            />

            {/* Hover Tooltip Overlay */}
            <span className="absolute top-5 left-1/2 -translate-x-1/2 block bg-app-surface border border-app-border p-2.5 rounded-lg shadow-xs z-20 text-left opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity pointer-events-none w-52">
              <span className="block text-body font-semibold text-app-text">{screen.name}</span>
              <span className="block text-caption text-app-muted uppercase tracking-headline mt-0.5">
                {screen.location}
              </span>

              <span className="border-t border-app-border my-1.5 pt-1.5 flex flex-col gap-1 block">
                <span className="flex justify-between items-center gap-2 text-caption text-app-muted">
                  <span>Current:</span>
                  <span className="font-semibold text-app-text truncate max-w-[110px]">
                    {screen.content}
                  </span>
                </span>
                <span className="flex justify-between items-center gap-2 text-caption text-app-muted">
                  <span>Status:</span>
                  <StatusDot status={status} label={screen.status} />
                </span>
              </span>
              <span className="text-caption text-app-accent-text font-semibold block text-center mt-1">
                Click to open details
              </span>
            </span>
          </button>
        );
      })}
    </Card>
  );
}
