"use client";

import React from "react";
import { AlertCircle, AlertTriangle, ShieldAlert, CheckCircle } from "lucide-react";

export interface AlertIncident {
  id: string;
  deviceName: string;
  issue: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  groupName: string;
  startTime: string;
  duration: string;
  status: "Active" | "Acknowledged" | "Resolved";
}

interface AlertsStatsBannerProps {
  alerts: AlertIncident[];
}

export default function AlertsStatsBanner({ alerts }: AlertsStatsBannerProps) {
  const total = alerts.filter((a) => a.status !== "Resolved").length;
  const critical = alerts.filter((a) => a.severity === "Critical" && a.status !== "Resolved").length;
  const high = alerts.filter((a) => a.severity === "High" && a.status !== "Resolved").length;
  const medium = alerts.filter((a) => a.severity === "Medium" && a.status !== "Resolved").length;
  const low = alerts.filter((a) => a.severity === "Low" && a.status !== "Resolved").length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {/* Total Alerts */}
      <div className="p-4 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl flex items-center justify-between shadow-3xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-zinc-400">Total Active</span>
          <span className="block text-xl font-bold text-zinc-900 dark:text-white mt-1">{total} Incidents</span>
        </div>
        <ShieldAlert className="w-5 h-5 text-zinc-400" />
      </div>

      {/* Critical */}
      <div className="p-4 bg-white dark:bg-[#111722] border border-red-100 dark:border-red-950/20 rounded-xl flex items-center justify-between shadow-3xs border-l-4 border-l-red-500">
        <div>
          <span className="text-[10px] uppercase font-bold text-red-500">Critical</span>
          <span className="block text-xl font-bold text-red-650 dark:text-red-400 mt-1">{critical} Alert</span>
        </div>
        <AlertCircle className="w-5 h-5 text-red-500 animate-pulse" />
      </div>

      {/* High */}
      <div className="p-4 bg-white dark:bg-[#111722] border border-orange-100 dark:border-orange-950/20 rounded-xl flex items-center justify-between shadow-3xs border-l-4 border-l-orange-500">
        <div>
          <span className="text-[10px] uppercase font-bold text-orange-500">High</span>
          <span className="block text-xl font-bold text-orange-650 dark:text-orange-400 mt-1">{high} Alert</span>
        </div>
        <AlertTriangle className="w-5 h-5 text-orange-500" />
      </div>

      {/* Medium */}
      <div className="p-4 bg-white dark:bg-[#111722] border border-amber-100 dark:border-amber-950/20 rounded-xl flex items-center justify-between shadow-3xs border-l-4 border-l-amber-500">
        <div>
          <span className="text-[10px] uppercase font-bold text-amber-500">Medium</span>
          <span className="block text-xl font-bold text-amber-650 dark:text-amber-400 mt-1">{medium} Alert</span>
        </div>
        <AlertTriangle className="w-5 h-5 text-amber-500" />
      </div>

      {/* Low */}
      <div className="p-4 bg-white dark:bg-[#111722] border border-zinc-100 dark:border-zinc-800 rounded-xl flex items-center justify-between shadow-3xs border-l-4 border-l-zinc-500">
        <div>
          <span className="text-[10px] uppercase font-bold text-zinc-500">Low</span>
          <span className="block text-xl font-bold text-zinc-700 dark:text-zinc-300 mt-1">{low} Alerts</span>
        </div>
        <CheckCircle className="w-5 h-5 text-zinc-400" />
      </div>
    </div>
  );
}
