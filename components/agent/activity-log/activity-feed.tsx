"use client";

import React, { useState } from "react";
import { User, Server, Cpu, Database, ChevronDown, ChevronUp, Download, CheckCircle2 } from "lucide-react";

export interface LogEntry {
  id: string;
  user: string;
  avatarLetter: string;
  role: "Operator" | "System" | "Admin";
  event: string;
  target: string;
  time: string;
  severity: "Info" | "Warning" | "Critical";
  detailPayload: string;
}

interface ActivityFeedProps {
  logs: LogEntry[];
}

export default function ActivityFeed({ logs }: ActivityFeedProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <div className="space-y-4">
      {logs.map((log) => {
        const isSystem = log.role === "System";
        const isWarning = log.severity === "Warning";
        const isCrit = log.severity === "Critical";
        const isExpanded = expandedId === log.id;

        return (
          <div
            key={log.id}
            className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl overflow-hidden shadow-2xs hover:shadow-sm transition-all duration-200 p-4 space-y-3 font-sans text-xs"
          >
            {/* Header profile row */}
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-3 min-w-0">
                {/* User avatar indicator */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none border ${
                  isSystem
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-550 border-zinc-200 dark:border-zinc-700"
                    : "bg-[#2859D9]/10 text-[#2859D9] border-[#2859D9]/20 dark:bg-[#6F96FF]/10 dark:text-[#6F96FF]"
                }`}>
                  {isSystem ? <Server className="w-4.5 h-4.5" /> : <span>{log.avatarLetter}</span>}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-850 dark:text-zinc-50">
                      {log.user}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-50 dark:bg-[#171F2C] border border-[#E2E6EC] dark:border-[#283243] text-zinc-450 uppercase font-semibold">
                      {log.role}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-0.5 truncate max-w-[400px]">
                    {log.event}
                  </p>
                </div>
              </div>

              {/* Severity/Time */}
              <div className="text-right shrink-0">
                <span className="text-[10px] text-zinc-400 font-mono block">{log.time}</span>
                <span className={`text-[8px] font-bold uppercase tracking-wider mt-1 inline-block ${
                  isCrit ? "text-red-500" : isWarning ? "text-amber-500" : "text-zinc-450"
                }`}>
                  ● {log.severity}
                </span>
              </div>
            </div>

            {/* Target and Actions row */}
            <div className="flex justify-between items-center text-[10px] pt-2 border-t border-[#E2E6EC]/60 dark:border-[#283243]/60">
              <span className="text-zinc-500">
                Target: <span className="font-bold text-zinc-700 dark:text-zinc-200">{log.target}</span>
              </span>

              <button
                onClick={() => toggleExpand(log.id)}
                className="text-[#2859D9] dark:text-[#6F96FF] font-bold hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <span>{isExpanded ? "Hide Details" : "Inspect Payload"}</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Collapsible raw metadata payload block */}
            {isExpanded && (
              <div className="p-3 border border-[#E2E6EC] dark:border-[#283243] bg-zinc-50 dark:bg-zinc-950/60 rounded-lg animate-slideDown overflow-x-auto text-[10px] font-mono leading-relaxed text-zinc-650 dark:text-zinc-350">
                <pre>{log.detailPayload}</pre>
              </div>
            )}

          </div>
        );
      })}
    </div>
  );
}
