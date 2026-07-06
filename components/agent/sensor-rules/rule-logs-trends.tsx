"use client";

import React from "react";
import { Clock, BarChart2, Activity, Play, Zap } from "lucide-react";

interface RuleLog {
  time: string;
  deviceName: string;
  triggerDetails: string;
  ruleName: string;
  outputDetails: string;
}

const mockLogs: RuleLog[] = [
  {
    time: "4:18 PM",
    deviceName: "Koramangala Entrance",
    triggerDetails: "Motion count > 1 detected",
    ruleName: "Proximity Promo",
    outputDetails: "Walk-in Offer playlist played for 30s. Reverted to standard loop."
  },
  {
    time: "3:42 PM",
    deviceName: "Indiranagar Screen 03",
    triggerDetails: "Temperature fell to 17.5°C (< 18°C)",
    ruleName: "Cold Weather Hot Drinks",
    outputDetails: "Hot Brews menu loaded for 60s. Reverted."
  },
  {
    time: "2:15 PM",
    deviceName: "Phoenix Mall Display",
    triggerDetails: "Camera crowd count reached 7 (> 5)",
    ruleName: "Crowd detector",
    outputDetails: "Group Combos menu loaded for 45s. Reverted."
  },
  {
    time: "1:04 PM",
    deviceName: "MG Road Menu Board 01",
    triggerDetails: "Light sensor detected 820 lux (> 800 lux)",
    ruleName: "Brightness Adjuster",
    outputDetails: "Set panel display brightness limit to 100%."
  }
];

export default function RuleLogsTrends() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 24 hour Trigger trends */}
      <div className="lg:col-span-1 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl p-4 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-zinc-400" />
            Trigger Count Trends
          </h3>
          <p className="text-[10px] text-zinc-400 mt-0.5">Sensor rule activation cycles (24h).</p>
        </div>

        {/* Custom graphic bars representing trigger counts per sensor */}
        <div className="space-y-3.5 flex-1 flex flex-col justify-center select-none text-[10px] font-semibold text-zinc-600 dark:text-zinc-350">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span>Proximity Promo (Motion)</span>
              <span className="font-bold text-zinc-900 dark:text-white">142 cycles</span>
            </div>
            <div className="w-full bg-[#F6F7F9] dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: "72%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span>Brightness Adjuster (Light)</span>
              <span className="font-bold text-zinc-900 dark:text-white">88 cycles</span>
            </div>
            <div className="w-full bg-[#F6F7F9] dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: "45%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span>Crowd Detector (Camera)</span>
              <span className="font-bold text-zinc-900 dark:text-white">64 cycles</span>
            </div>
            <div className="w-full bg-[#F6F7F9] dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: "32%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Trigger logs list feed */}
      <div className="lg:col-span-2 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl p-4 space-y-4">
        <div>
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-zinc-400" />
            Live Automation Activity Logs
          </h3>
          <p className="text-[10px] text-zinc-400 mt-0.5">Chronological feed of rule-triggers evaluated at the display edge.</p>
        </div>

        <div className="space-y-3 max-h-48 overflow-y-auto pr-1 text-xs">
          {mockLogs.map((log, idx) => (
            <div
              key={idx}
              className="p-3 border border-[#E2E6EC] dark:border-[#283243] bg-zinc-50/10 dark:bg-zinc-950/10 rounded-lg flex items-start gap-3.5 hover:bg-zinc-50/30 dark:hover:bg-zinc-950/20 transition-all"
            >
              <div className="p-1.5 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded shrink-0 mt-0.5 border border-amber-100/50">
                <Zap className="w-3.5 h-3.5 shrink-0" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center gap-2 font-bold">
                  <span className="text-zinc-850 dark:text-zinc-200">
                    {log.deviceName}
                  </span>
                  <span className="text-zinc-400 font-mono font-normal text-[9px] flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" /> {log.time}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-550 dark:text-zinc-400 mt-1 font-semibold">
                  Trigger: <span className="font-bold text-zinc-700 dark:text-zinc-300 font-mono">{log.triggerDetails}</span> ({log.ruleName})
                </p>
                <p className="text-[10px] text-zinc-450 mt-0.5 leading-normal">
                  Action: {log.outputDetails}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
