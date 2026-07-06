"use client";

import React from "react";
import { MapPin, Wifi, Clock, WifiOff, Map } from "lucide-react";
import { ScreenDevice } from "./screens-table";

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
  "Airport T2 Counter 04": { top: "14%", left: "62%" }
};

export default function ScreensMap({ screens, onSelectScreen, selectedScreenId }: ScreensMapProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F6F7F9] dark:bg-[#090D14] border border-[#E2E6EC] dark:border-[#283243] rounded-xl overflow-hidden shadow-xs min-h-[550px] relative justify-center items-center select-none">
      
      {/* Schematic Map Background */}
      <svg className="w-full h-full opacity-20 dark:opacity-10 absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grids */}
        <line x1="20" y1="0" x2="20" y2="100" stroke="currentColor" strokeWidth="0.5" />
        <line x1="40" y1="0" x2="40" y2="100" stroke="currentColor" strokeWidth="0.5" />
        <line x1="60" y1="0" x2="60" y2="100" stroke="currentColor" strokeWidth="0.5" />
        <line x1="80" y1="0" x2="80" y2="100" stroke="currentColor" strokeWidth="0.5" />
        <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="0.5" />
        <line x1="0" y1="40" x2="100" y2="40" stroke="currentColor" strokeWidth="0.5" />
        <line x1="0" y1="60" x2="100" y2="60" stroke="currentColor" strokeWidth="0.5" />
        <line x1="0" y1="80" x2="100" y2="80" stroke="currentColor" strokeWidth="0.5" />
        
        {/* Main highways */}
        <path d="M0,50 L100,50" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M50,0 L50,100" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>

      {/* Floating Panel Legend */}
      <div className="absolute top-4 left-4 bg-white/90 dark:bg-[#111722]/90 border border-[#E2E6EC] dark:border-[#283243] p-3.5 rounded-lg shadow-sm z-10 space-y-2 text-[10px] font-semibold text-zinc-500 max-w-[200px]">
        <h4 className="font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Map className="w-3.5 h-3.5 text-[#2859D9] dark:text-[#6F96FF]" />
          Regional Map Legend
        </h4>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Online / Live Uptime ({screens.filter((s) => s.status === "Online").length})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Delayed Heartbeats ({screens.filter((s) => s.status === "Delayed").length})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span>Offline players ({screens.filter((s) => s.status === "Offline").length})</span>
        </div>
      </div>

      {/* Plot active screen locations */}
      {screens.map((screen) => {
        const pos = mapPositions[screen.name] || { top: "50%", left: "50%" };
        const isSelected = selectedScreenId === screen.id;

        return (
          <div
            key={screen.id}
            onClick={() => onSelectScreen(screen)}
            style={{ top: pos.top, left: pos.left }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10 transition-transform ${
              isSelected ? "scale-125 z-20" : "hover:scale-110"
            }`}
          >
            {/* Pulsing indicator ring */}
            <span
              className={`absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full opacity-60 animate-ping ${
                screen.status === "Online"
                  ? "bg-emerald-400"
                  : screen.status === "Delayed"
                  ? "bg-amber-400"
                  : "bg-red-400"
              }`}
            />
            
            {/* Core Pin Element */}
            <div
              className={`w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#090D14] flex items-center justify-center shadow-lg ${
                screen.status === "Online"
                  ? "bg-emerald-500"
                  : screen.status === "Delayed"
                  ? "bg-amber-500"
                  : "bg-red-500"
              } ${isSelected ? "ring-4 ring-blue-500/25" : ""}`}
            />

            {/* Hover Tooltip Overlay */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] p-2.5 rounded-lg shadow-lg z-25 text-left opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-48 font-sans">
              <span className="block text-xs font-bold text-zinc-900 dark:text-white leading-tight">
                {screen.name}
              </span>
              <span className="block text-[9px] text-zinc-400 dark:text-zinc-500 mt-0.5 uppercase tracking-wide">
                {screen.location}
              </span>
              
              <div className="border-t border-[#E2E6EC] dark:border-[#283243] my-1.5 pt-1.5 flex flex-col gap-1 text-[10px]">
                <div className="flex justify-between items-center text-zinc-500">
                  <span>Current:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-[90px]">{screen.content}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-500">
                  <span>Status:</span>
                  <span
                    className={`font-bold ${
                      screen.status === "Online"
                        ? "text-emerald-500"
                        : screen.status === "Delayed"
                        ? "text-amber-500"
                        : "text-red-500"
                    }`}
                  >
                    {screen.status}
                  </span>
                </div>
              </div>
              <span className="text-[9px] text-[#2859D9] dark:text-[#6F96FF] font-bold block text-center mt-1">
                Click to Open Details Drawer
              </span>
            </div>
            
          </div>
        );
      })}

    </div>
  );
}
