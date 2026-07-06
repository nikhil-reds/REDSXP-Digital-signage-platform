"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

export default function StatusBanner() {
  return (
    <div className="bg-amber-50/70 dark:bg-amber-955/15 border-l-4 border-amber-500 p-4.5 rounded-r-xl flex items-start gap-3.5 shadow-xs">
      <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 rounded-lg shrink-0 mt-0.5">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-bold text-amber-800 dark:text-amber-400">
            Platform Status: Degraded
          </h2>
          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-350 border border-amber-200/50">
            2 services degraded
          </span>
        </div>
        <p className="text-xs text-amber-700 dark:text-amber-400/90 mt-1 font-medium">
          2 services degraded — Telemetry SQS, Razorpay Webhooks
        </p>
      </div>
    </div>
  );
}
