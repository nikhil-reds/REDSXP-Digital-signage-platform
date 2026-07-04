"use client";

import React from "react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];

// Intensity values (0 to 4) representing color shades
const heatmapData: Record<string, number[]> = {
  Mon: [0, 0, 0, 1, 2, 3, 4, 4, 3, 2, 1, 0],
  Tue: [0, 0, 0, 1, 2, 3, 4, 4, 3, 2, 1, 0],
  Wed: [0, 0, 0, 2, 3, 4, 4, 4, 3, 2, 1, 0],
  Thu: [0, 0, 0, 1, 2, 3, 4, 4, 3, 2, 1, 0],
  Fri: [0, 0, 1, 2, 3, 4, 4, 4, 4, 3, 2, 1],
  Sat: [0, 0, 0, 1, 1, 2, 3, 3, 2, 2, 1, 0],
  Sun: [0, 0, 0, 0, 1, 2, 2, 3, 2, 1, 0, 0]
};

// Shading class mapping
const intensityColors = [
  "bg-zinc-100 dark:bg-zinc-800/40",                 // Low (0)
  "bg-blue-100 dark:bg-blue-950/20 text-blue-900",    // 1
  "bg-blue-300 dark:bg-blue-900/40 text-blue-900",    // 2
  "bg-blue-500 dark:bg-blue-700/60 text-white",       // 3
  "bg-blue-600 dark:bg-blue-600 text-white"           // High (4)
];

export default function HourlyEngagementHeatmap() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-xl shadow-xs flex flex-col justify-between">
      <div>
        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Hourly Engagement Heatmap</h2>
        <p className="text-xs text-zinc-400 mt-0.5">Screen activity intensity by hour across days of the week</p>
      </div>

      <div className="mt-6 overflow-x-auto">
        <div className="min-w-[480px]">
          {/* Hour Headers */}
          <div className="grid gap-1.5 mb-1.5 text-[10px] text-zinc-400 font-semibold text-center select-none" style={{ gridTemplateColumns: "repeat(13, minmax(0, 1fr))" }}>
            <div className="text-left font-bold text-transparent">Day</div>
            {hours.map((hr) => (
              <div key={hr} className="w-6 mx-auto">
                {hr}
              </div>
            ))}
          </div>

          {/* Grid rows */}
          <div className="space-y-1.5">
            {days.map((day) => {
              const rowValues = heatmapData[day] || Array(12).fill(0);
              return (
                <div key={day} className="grid gap-1.5 items-center" style={{ gridTemplateColumns: "repeat(13, minmax(0, 1fr))" }}>
                  <div className="text-[10px] text-zinc-455 dark:text-zinc-400 font-bold select-none w-10">
                    {day}
                  </div>
                  {rowValues.map((val, idx) => (
                    <div
                      key={idx}
                      className={`w-6 h-6 rounded-md ${intensityColors[val]} transition-all duration-200 hover:scale-105`}
                      title={`${day} @ ${hours[idx]}:00 - Intensity Level ${val}`}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Heatmap Legend */}
      <div className="flex items-center gap-1.5 text-[9px] font-semibold text-zinc-450 dark:text-zinc-500 mt-5 select-none">
        <span>Low</span>
        <div className="flex items-center gap-1">
          {intensityColors.map((colorClass, idx) => (
            <div key={idx} className={`w-3.5 h-3.5 rounded-sm ${colorClass}`} />
          ))}
        </div>
        <span>High</span>
      </div>
    </div>
  );
}
