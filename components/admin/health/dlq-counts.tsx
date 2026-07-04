"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, Layers } from "lucide-react";

export default function DlqCounts() {
  const queues = [
    {
      name: "Telemetry DLQ",
      count: 0,
      status: "nominal",
      icon: CheckCircle2,
      iconColor: "text-emerald-500",
      borderClass: "border-zinc-200/80 dark:border-zinc-800"
    },
    {
      name: "Billing DLQ",
      count: 0,
      status: "nominal",
      icon: CheckCircle2,
      iconColor: "text-emerald-500",
      borderClass: "border-zinc-200/80 dark:border-zinc-800"
    },
    {
      name: "Notification DLQ",
      count: 2,
      status: "warning",
      icon: AlertTriangle,
      iconColor: "text-amber-500",
      borderClass: "border-zinc-200/80 dark:border-zinc-800 border-l-4 border-l-amber-500"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-zinc-50 dark:bg-zinc-850 text-zinc-650 dark:text-zinc-300 rounded-lg shadow-xs">
          <Layers className="w-4 h-4 text-zinc-550" />
        </div>
        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
          Dead-Letter Queue Counts
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {queues.map((q) => {
          const StatusIcon = q.icon;
          const isWarning = q.status === "warning";

          return (
            <div
              key={q.name}
              className={`bg-white dark:bg-zinc-900 border p-4.5 rounded-xl flex items-center justify-between shadow-xs hover:shadow-sm transition-all duration-200 ${q.borderClass}`}
            >
              <div>
                <span className="block text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">
                  {q.name}
                </span>
                <span
                  className={`block text-2xl font-bold tracking-tight mt-1.5 ${
                    isWarning ? "text-amber-650 dark:text-amber-450" : "text-zinc-900 dark:text-zinc-50"
                  }`}
                >
                  {q.count}
                </span>
              </div>
              <StatusIcon className={`w-5 h-5 shrink-0 ${q.iconColor}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
