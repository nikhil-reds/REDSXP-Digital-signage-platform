"use client";

import React from "react";
import { AlertCircle, Clock, Database, Smartphone, CheckCircle2 } from "lucide-react";

export default function HealthMapSection() {
  const incidents = [
    {
      id: "inc-1",
      severity: "critical",
      title: "MG Road Menu Board 02 offline",
      subtitle: "Offline for 18 mins · Last heartbeat 4:12 PM",
      icon: Smartphone,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30"
    },
    {
      id: "inc-2",
      severity: "high",
      title: "Phoenix Marketcity Display storage warning",
      subtitle: "Disk space at 94% (6.2 GB free) · Sync throttled",
      icon: Database,
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30"
    },
    {
      id: "inc-3",
      severity: "high",
      title: "Staff-call button pressed at Koramangala",
      subtitle: "Awaiting acknowledgement · Active for 2 mins",
      icon: AlertCircle,
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Screen Health & Segmented Bar */}
      <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] p-5 rounded-xl shadow-xs flex flex-col justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#18202B] dark:text-[#F2F5F8]">Screen Health Summary</h2>
          <p className="text-xs text-[#657080] dark:text-[#9AA7B7] mt-0.5">Assigned screen connection state</p>
        </div>

        {/* Segmented Bar Chart */}
        <div className="my-6 space-y-3.5">
          <div className="h-6 w-full flex rounded-md overflow-hidden shadow-inner">
            <div className="bg-emerald-500 h-full transition-all" style={{ width: "91.6%" }} title="91.6% Online" />
            <div className="bg-amber-500 h-full transition-all" style={{ width: "4.2%" }} title="4.2% Delayed" />
            <div className="bg-red-500 h-full transition-all" style={{ width: "4.2%" }} title="4.2% Offline" />
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center bg-[#F6F7F9] dark:bg-[#171F2C] p-2.5 rounded-lg border border-[#E2E6EC] dark:border-[#283243]">
            <div>
              <span className="block text-xs font-bold text-emerald-600 dark:text-emerald-500">91.6%</span>
              <span className="text-[9px] text-[#657080] dark:text-[#9AA7B7] uppercase font-semibold">Uptime</span>
            </div>
            <div className="border-x border-[#E2E6EC] dark:border-[#283243]">
              <span className="block text-xs font-bold text-amber-500">4.2%</span>
              <span className="text-[9px] text-[#657080] dark:text-[#9AA7B7] uppercase font-semibold">Delayed</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-red-500">4.2%</span>
              <span className="text-[9px] text-[#657080] dark:text-[#9AA7B7] uppercase font-semibold">Alerts</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2 border-t border-[#E2E6EC] dark:border-[#283243] pt-4">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 text-[#657080] dark:text-[#9AA7B7]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Online (Normal Uptime)</span>
            </div>
            <span className="font-bold text-[#18202B] dark:text-[#F2F5F8]">44</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 text-[#657080] dark:text-[#9AA7B7]">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Delayed Heartbeats (&gt;30s)</span>
            </div>
            <span className="font-bold text-[#18202B] dark:text-[#F2F5F8]">2</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 text-[#657080] dark:text-[#9AA7B7]">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>Offline / Incidents (&gt;90s)</span>
            </div>
            <span className="font-bold text-[#18202B] dark:text-[#F2F5F8]">2</span>
          </div>
        </div>
      </div>

      {/* 2. Bengaluru Location Map */}
      <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] p-5 rounded-xl shadow-xs flex flex-col justify-between lg:col-span-1">
        <div>
          <h2 className="text-sm font-bold text-[#18202B] dark:text-[#F2F5F8]">Live Regional Map</h2>
          <p className="text-xs text-[#657080] dark:text-[#9AA7B7] mt-0.5">Bengaluru City · 19 active locations</p>
        </div>

        {/* Map Visual (Mocked with gorgeous vector design) */}
        <div className="h-44 relative bg-[#F6F7F9] dark:bg-[#090D14] border border-[#E2E6EC] dark:border-[#283243] rounded-lg overflow-hidden flex items-center justify-center my-3.5 shadow-inner">
          <svg className="w-full h-full opacity-30 dark:opacity-20 absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Mock street grid lines */}
            <line x1="10" y1="0" x2="10" y2="100" stroke="currentColor" strokeWidth="0.5" />
            <line x1="30" y1="0" x2="30" y2="100" stroke="currentColor" strokeWidth="0.5" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" />
            <line x1="70" y1="0" x2="70" y2="100" stroke="currentColor" strokeWidth="0.5" />
            <line x1="90" y1="0" x2="90" y2="100" stroke="currentColor" strokeWidth="0.5" />
            <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="0.5" />
            <line x1="0" y1="40" x2="100" y2="40" stroke="currentColor" strokeWidth="0.5" />
            <line x1="0" y1="60" x2="100" y2="60" stroke="currentColor" strokeWidth="0.5" />
            <line x1="0" y1="80" x2="100" y2="80" stroke="currentColor" strokeWidth="0.5" />
            {/* Highway loop */}
            <path d="M15,15 Q50,0 85,15 T95,85 T15,85 Z" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          </svg>
          
          {/* Active Glowing Pins */}
          {/* Koramangala */}
          <div className="absolute top-2/3 left-1/3 group cursor-pointer" title="Koramangala Stores (3)">
            <span className="absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-xs" />
            <span className="absolute top-3 left-1/2 -translate-x-1/2 bg-zinc-900/90 text-white text-[8px] font-bold px-1 py-0.5 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Koramangala (3)</span>
          </div>
          {/* Indiranagar */}
          <div className="absolute top-1/3 left-2/3 group cursor-pointer" title="Indiranagar Screen 03 (Delayed)">
            <span className="absolute inline-flex h-3 w-3 rounded-full bg-amber-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 shadow-xs" />
            <span className="absolute top-3 left-1/2 -translate-x-1/2 bg-zinc-900/90 text-white text-[8px] font-bold px-1 py-0.5 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Indiranagar (1)</span>
          </div>
          {/* MG Road */}
          <div className="absolute top-1/2 left-1/2 group cursor-pointer" title="MG Road (1 Offline, 1 Online)">
            <span className="absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-xs" />
            <span className="absolute top-3 left-1/2 -translate-x-1/2 bg-zinc-900/90 text-white text-[8px] font-bold px-1 py-0.5 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">MG Road (1 Offline)</span>
          </div>
          {/* Whitefield */}
          <div className="absolute top-1/2 left-[80%] group cursor-pointer" title="Whitefield Outlet (4)">
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-xs" />
            <span className="absolute top-3 left-1/2 -translate-x-1/2 bg-zinc-900/90 text-white text-[8px] font-bold px-1 py-0.5 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Whitefield (4)</span>
          </div>
          {/* Kempegowda Airport */}
          <div className="absolute top-1/6 left-[60%] group cursor-pointer" title="Airport Outlet (8)">
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-xs" />
            <span className="absolute top-3 left-1/2 -translate-x-1/2 bg-zinc-900/90 text-white text-[8px] font-bold px-1 py-0.5 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Kempegowda Airport (8)</span>
          </div>

          <div className="absolute bottom-2 right-2 bg-white/95 dark:bg-[#111722]/95 border border-[#E2E6EC] dark:border-[#283243] px-2 py-1 rounded shadow-xs text-[9px] font-bold text-zinc-500 dark:text-zinc-400">
            Map Scale: Auto
          </div>
        </div>

        <div className="text-[11px] text-[#657080] dark:text-[#9AA7B7] flex justify-between items-center border-t border-[#E2E6EC] dark:border-[#283243] pt-3">
          <span>Active clusters: 5 regions</span>
          <button className="text-[#2859D9] dark:text-[#6F96FF] font-bold hover:underline">Open Map View</button>
        </div>
      </div>

      {/* 3. Needs Attention list */}
      <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] p-5 rounded-xl shadow-xs flex flex-col justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#18202B] dark:text-[#F2F5F8]">Needs Attention</h2>
          <p className="text-xs text-[#657080] dark:text-[#9AA7B7] mt-0.5">Incidents affecting SLA target</p>
        </div>

        {/* Warning cards */}
        <div className="space-y-2.5 my-3.5 flex-1">
          {incidents.map((inc) => {
            const Icon = inc.icon;
            return (
              <div
                key={inc.id}
                className={`flex gap-3 p-3 border rounded-lg hover:shadow-xs transition-all ${inc.bgColor}`}
              >
                <div className="mt-0.5">
                  <Icon className={`w-4 h-4 shrink-0 ${inc.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight truncate">
                    {inc.title}
                  </h3>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 block">
                    {inc.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-xs text-[#657080] dark:text-[#9AA7B7] flex justify-between items-center border-t border-[#E2E6EC] dark:border-[#283243] pt-3">
          <span>Total active incidents: 3</span>
          <button className="text-[#2859D9] dark:text-[#6F96FF] font-bold hover:underline">View All Incidents</button>
        </div>
      </div>
    </div>
  );
}
