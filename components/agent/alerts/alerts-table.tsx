"use client";

import React from "react";
import { AlertCircle, AlertTriangle, ShieldCheck, RefreshCw, Send, CheckCircle } from "lucide-react";
import { AlertIncident } from "./alerts-stats-banner";

interface AlertsTableProps {
  alerts: AlertIncident[];
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
  onReboot: (deviceName: string) => void;
  onTicket: (alert: AlertIncident) => void;
}

export default function AlertsTable({
  alerts,
  onAcknowledge,
  onResolve,
  onReboot,
  onTicket
}: AlertsTableProps) {
  return (
    <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F6F7F9] dark:bg-[#171F2C]/50 text-[#657080] dark:text-[#9AA7B7] font-bold border-b border-[#E2E6EC] dark:border-[#283243] select-none">
              <th className="p-3.5">Severity</th>
              <th className="p-3.5">Issue Detail</th>
              <th className="p-3.5">Device Name</th>
              <th className="p-3.5">Target Group</th>
              <th className="p-3.5">Start Time</th>
              <th className="p-3.5">Duration</th>
              <th className="p-3.5">Status State</th>
              <th className="p-3.5 text-right pr-6">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E6EC] dark:divide-[#283243]">
            {alerts.map((alert) => {
              const isCrit = alert.severity === "Critical";
              const isHigh = alert.severity === "High";
              const isMed = alert.severity === "Medium";
              
              const isResolved = alert.status === "Resolved";
              const isAcked = alert.status === "Acknowledged";

              return (
                <tr
                  key={alert.id}
                  className={`hover:bg-[#F6F7F9]/30 dark:hover:bg-[#171F2C]/10 transition-all ${
                    isResolved ? "opacity-50" : ""
                  }`}
                >
                  {/* Severity Badge */}
                  <td className="p-3.5">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold border inline-flex items-center gap-1 ${
                        isCrit
                          ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border-red-100/50"
                          : isHigh
                          ? "bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400 border-orange-100/50"
                          : isMed
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-100/50"
                          : "bg-zinc-50 text-zinc-650 dark:bg-zinc-800 dark:text-zinc-350 border-zinc-200"
                      }`}
                    >
                      {isCrit && <AlertCircle className="w-2.5 h-2.5 animate-pulse" />}
                      <span>{alert.severity}</span>
                    </span>
                  </td>

                  {/* Issue Detail */}
                  <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-50">
                    {alert.issue}
                  </td>
                  
                  <td className="p-3.5 text-zinc-550 dark:text-zinc-400">
                    {alert.deviceName}
                  </td>
                  <td className="p-3.5 text-zinc-500">
                    {alert.groupName}
                  </td>
                  <td className="p-3.5 text-zinc-400 font-mono text-[10px]">
                    {alert.startTime}
                  </td>
                  <td className="p-3.5 text-zinc-500 font-semibold font-mono text-[10px]">
                    {alert.duration}
                  </td>

                  {/* Status chip */}
                  <td className="p-3.5 font-semibold">
                    <span className={`text-[9px] uppercase tracking-wider ${
                      isResolved
                        ? "text-emerald-500"
                        : isAcked
                        ? "text-[#2859D9] dark:text-[#6F96FF]"
                        : "text-red-500 font-bold"
                    }`}>
                      ● {alert.status}
                    </span>
                  </td>

                  {/* Actions column */}
                  <td className="p-3.5 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                    <div className="inline-flex items-center gap-1.5">
                      
                      {/* Acknowledge Action */}
                      {!isAcked && !isResolved && (
                        <button
                          onClick={() => onAcknowledge(alert.id)}
                          className="px-2.5 py-1 bg-white dark:bg-zinc-900 border border-[#E2E6EC] dark:border-[#283243] rounded text-[9px] font-bold text-[#2859D9] dark:text-[#6F96FF] hover:bg-zinc-50 cursor-pointer"
                          title="Acknowledge Alert"
                        >
                          Ack
                        </button>
                      )}

                      {/* Resolve Action */}
                      {isAcked && !isResolved && (
                        <button
                          onClick={() => onResolve(alert.id)}
                          className="px-2.5 py-1 bg-white dark:bg-zinc-900 border border-[#E2E6EC] dark:border-[#283243] rounded text-[9px] font-bold text-emerald-600 hover:bg-zinc-50 cursor-pointer"
                          title="Resolve Alert"
                        >
                          Resolve
                        </button>
                      )}

                      {/* Support Ticket Action */}
                      {!isResolved && (
                        <button
                          onClick={() => onTicket(alert)}
                          className="p-1 text-zinc-450 hover:bg-[#F6F7F9] dark:hover:bg-[#171F2C] rounded hover:text-[#2859D9] cursor-pointer"
                          title="Create Support Ticket"
                        >
                          <Send className="w-3 h-3" />
                        </button>
                      )}

                      {/* Reboot Action */}
                      {!isResolved && (
                        <button
                          onClick={() => onReboot(alert.deviceName)}
                          className="p-1 text-zinc-450 hover:bg-[#F6F7F9] dark:hover:bg-[#171F2C] rounded hover:text-red-500 cursor-pointer"
                          title="Reboot Player"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </button>
                      )}

                      {isResolved && (
                        <span className="text-[9px] text-zinc-400 font-bold flex items-center gap-0.5">
                          <CheckCircle className="w-3 h-3 text-emerald-500" /> Resolved
                        </span>
                      )}

                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
