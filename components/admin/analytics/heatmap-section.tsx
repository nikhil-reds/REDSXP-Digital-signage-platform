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
  "bg-app-surface-alt",
  "bg-app-accent-surface",
  "bg-app-accent-border",
  "bg-app-accent",
  "bg-app-accent-hover"
];

export default function HourlyEngagementHeatmap() {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-app-border bg-app-surface p-5 shadow-xs">
      <div>
        <h2 className="text-body font-bold text-app-text">Hourly Engagement Heatmap</h2>
        <p className="mt-0.5 text-caption text-app-muted">Screen activity intensity by hour across days of the week</p>
      </div>

      <div className="mt-6 overflow-x-auto">
        <div className="min-w-[480px]">
          {/* Hour Headers */}
          <div className="mb-1.5 grid select-none gap-1.5 text-center text-[10px] font-semibold text-app-muted" style={{ gridTemplateColumns: "repeat(13, minmax(0, 1fr))" }}>
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
                  <div className="w-10 select-none text-[10px] font-bold text-app-muted">
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
      <div className="mt-5 flex select-none items-center gap-1.5 text-[9px] font-semibold text-app-muted">
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
