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
      iconColor: "text-app-accent-text",
      borderClass: "border-app-border"
    },
    {
      name: "Billing DLQ",
      count: 0,
      status: "nominal",
      icon: CheckCircle2,
      iconColor: "text-app-accent-text",
      borderClass: "border-app-border"
    },
    {
      name: "Notification DLQ",
      count: 2,
      status: "warning",
      icon: AlertTriangle,
      iconColor: "text-app-warning-text",
      borderClass: "border-app-border border-l-4 border-l-app-warning"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-app-surface-alt p-1.5 text-app-muted shadow-xs">
          <Layers className="h-4 w-4" />
        </div>
        <h2 className="text-body font-bold text-app-text">
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
              className={`flex items-center justify-between rounded-xl border bg-app-surface p-4.5 shadow-xs transition-all duration-200 hover:shadow-sm ${q.borderClass}`}
            >
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-app-muted">
                  {q.name}
                </span>
                <span
                  className={`block text-2xl font-bold tracking-tight mt-1.5 ${
                    isWarning ? "text-app-warning-text" : "text-app-text"
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
