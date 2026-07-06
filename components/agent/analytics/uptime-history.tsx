"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

interface UptimeRecord {
  id: string;
  name: string;
  location: string;
  uptime: number;
  offlineDuration: string;
  connection: "Good" | "Fair" | "Weak";
  lastSync: string;
}

const mockRecords: UptimeRecord[] = [
  { id: "up-1", name: "Koramangala Entrance", location: "Koramangala 5th Block", uptime: 99.8, offlineDuration: "None", connection: "Good", lastSync: "14s ago" },
  { id: "up-2", name: "MG Road Menu Board 01", location: "MG Road", uptime: 99.7, offlineDuration: "None", connection: "Good", lastSync: "9s ago" },
  { id: "up-3", name: "MG Road Menu Board 02", location: "MG Road", uptime: 96.2, offlineDuration: "18m", connection: "Weak", lastSync: "18m ago" },
  { id: "up-4", name: "Phoenix Mall Display", location: "Mahadevapura", uptime: 98.4, offlineDuration: "None", connection: "Fair", lastSync: "21s ago" },
  { id: "up-5", name: "Indiranagar Screen 03", location: "Indiranagar", uptime: 98.1, offlineDuration: "1.2m", connection: "Fair", lastSync: "72s ago" },
  { id: "up-6", name: "Airport T2 Counter 04", location: "Kempegowda Airport", uptime: 100, offlineDuration: "None", connection: "Good", lastSync: "18s ago" }
];

export default function UptimeHistory() {
  return (
    <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl overflow-hidden shadow-xs">
      <div className="p-4 border-b border-[#E2E6EC] dark:border-[#283243] bg-zinc-50/20 dark:bg-zinc-900/10 flex justify-between items-center text-xs">
        <span className="font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
          Player Connection & Uptime Logs (7 Days SLA)
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F6F7F9] dark:bg-[#171F2C]/50 text-[#657080] dark:text-[#9AA7B7] font-bold border-b border-[#E2E6EC] dark:border-[#283243] select-none">
              <th className="p-3.5">Display Player</th>
              <th className="p-3.5">Store Location</th>
              <th className="p-3.5">Uptime compliance</th>
              <th className="p-3.5">Offline duration</th>
              <th className="p-3.5">Signal Rating</th>
              <th className="p-3.5">Last Manifest Sync</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E6EC] dark:divide-[#283243]">
            {mockRecords.map((rec) => {
              const isLow = rec.uptime < 98.5;
              return (
                <tr key={rec.id} className="hover:bg-[#F6F7F9]/30 dark:hover:bg-[#171F2C]/10 transition-all">
                  <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-50">
                    {rec.name}
                  </td>
                  <td className="p-3.5 text-zinc-500">
                    {rec.location}
                  </td>
                  
                  {/* Uptime compliance */}
                  <td className="p-3.5">
                    <span className={`text-[10px] font-bold inline-flex items-center gap-1 ${
                      isLow ? "text-red-500" : "text-emerald-500"
                    }`}>
                      {isLow ? <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
                      {rec.uptime}%
                    </span>
                  </td>

                  <td className="p-3.5 text-zinc-550 dark:text-zinc-400 font-mono text-[10px]">
                    {rec.offlineDuration}
                  </td>

                  {/* Signal Rating */}
                  <td className="p-3.5">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border inline-flex items-center gap-1.5 ${
                      rec.connection === "Good"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450 border-emerald-100/50"
                        : rec.connection === "Fair"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-450 border-blue-100/50"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-450 border-amber-100/50"
                    }`}>
                      {rec.connection}
                    </span>
                  </td>

                  <td className="p-3.5 text-zinc-400 font-mono text-[10px]">
                    {rec.lastSync}
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
