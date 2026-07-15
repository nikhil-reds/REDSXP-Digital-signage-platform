"use client";

import React from "react";
import { AlertTriangle, X, ShieldCheck } from "lucide-react";
import { ScheduleSummary } from "./api";
import { formatDays } from "./schedule-calendar";

interface ConflictDialogProps {
  onClose: () => void;
  campaign1: ScheduleSummary;
  campaign2: ScheduleSummary;
}

export default function ConflictDialog({ onClose, campaign1, campaign2 }: ConflictDialogProps) {
  const winner = campaign2.priority > campaign1.priority ? campaign2 : campaign1;
  const loser = campaign2.priority > campaign1.priority ? campaign1 : campaign2;

  const sharedDays = campaign1.daysOfWeek.filter((d) => campaign2.daysOfWeek.includes(d));

  return (
    <div className="fixed inset-0 bg-black/55 dark:bg-black/80 flex items-center justify-center z-50 animate-fadeIn font-sans">
      <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl w-[450px] max-w-full shadow-2xl p-5 space-y-4">

        {/* Header */}
        <div className="flex justify-between items-start gap-4 pb-3 border-b border-[#E2E6EC] dark:border-[#283243]">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 font-bold">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-none">
              Schedule Conflict Detected
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-[#F6F7F9] dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conflict Description */}
        <div className="text-xs space-y-3">
          <p className="text-zinc-500 leading-relaxed">
            An overlap occurs on <span className="font-bold text-zinc-800 dark:text-zinc-200">{formatDays(sharedDays)}</span> between{" "}
            <span className="font-bold text-zinc-800 dark:text-zinc-200">
              {campaign1.dailyStartTime}–{campaign1.dailyEndTime}
            </span>{" "}
            and{" "}
            <span className="font-bold text-zinc-800 dark:text-zinc-200">
              {campaign2.dailyStartTime}–{campaign2.dailyEndTime}
            </span>{" "}
            on shared screens.
          </p>

          <div className="space-y-2">
            {/* Overlap Item 1 */}
            <div className="p-3 border border-zinc-250 dark:border-zinc-800 rounded-lg flex justify-between items-center gap-3">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Campaign A</span>
                <span className="block font-bold text-zinc-850 dark:text-zinc-200 mt-0.5">{campaign1.name}</span>
                <span className="text-[9px] text-zinc-400">
                  {campaign1.dailyStartTime} - {campaign1.dailyEndTime}
                </span>
              </div>
              <span className="text-[9px] px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-650 rounded-sm font-bold font-mono">
                Priority {campaign1.priority}
              </span>
            </div>

            {/* Overlap Item 2 */}
            <div className="p-3 border border-zinc-250 dark:border-zinc-800 rounded-lg flex justify-between items-center gap-3">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Campaign B</span>
                <span className="block font-bold text-zinc-850 dark:text-zinc-200 mt-0.5">{campaign2.name}</span>
                <span className="text-[9px] text-zinc-400">
                  {campaign2.dailyStartTime} - {campaign2.dailyEndTime}
                </span>
              </div>
              <span className="text-[9px] px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-650 rounded-sm font-bold font-mono">
                Priority {campaign2.priority}
              </span>
            </div>
          </div>

          {/* Resolution Winner explanation */}
          <div className="p-3.5 border border-emerald-100 dark:border-emerald-950/30 bg-emerald-50/20 dark:bg-emerald-955/10 rounded-xl space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-450 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              Conflict Resolution Winner
            </h4>
            <div className="text-[10px] text-zinc-600 dark:text-zinc-400 leading-normal space-y-1">
              <p>
                ● <span className="font-bold text-zinc-900 dark:text-white">&quot;{winner.name}&quot;</span> overrides &quot;{loser.name}&quot; because Priority {winner.priority} is higher than Priority {loser.priority}.
              </p>
              <p>
                ● Displays will automatically select the winning manifest on the overlap timeline. Fallback assets are ignored.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 font-sans pt-2 border-t border-[#E2E6EC] dark:border-[#283243]">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-[#E2E6EC] dark:border-[#283243] text-xs font-bold rounded-lg text-zinc-650 dark:text-zinc-350 hover:bg-[#F6F7F9] dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Close Dialog
          </button>
          <button
            onClick={() => {
              alert("Priority adjustment console is locked by admin permissions.");
              onClose();
            }}
            className="flex-1 py-2 bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] text-xs font-bold rounded-lg hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
          >
            Adjust Priorities
          </button>
        </div>

      </div>
    </div>
  );
}
