"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

export default function StatusBanner() {
  return (
    <div className="flex items-start gap-3.5 rounded-r-xl border-l-4 border-app-warning bg-app-warning-surface p-4.5 shadow-xs">
      <div className="mt-0.5 shrink-0 rounded-lg bg-app-surface p-2 text-app-warning-text">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-body font-bold text-app-warning-text">
            Platform Status: Degraded
          </h2>
          <span className="rounded-full border border-app-border bg-app-surface px-2 py-0.5 text-[9px] font-bold text-app-warning-text">
            2 services degraded
          </span>
        </div>
        <p className="mt-1 text-caption font-medium text-app-warning-text">
          2 services degraded — Telemetry SQS, Razorpay Webhooks
        </p>
      </div>
    </div>
  );
}
