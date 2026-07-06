"use client";

import React from "react";
import { Upload, ListPlus, CalendarPlus, Zap, FileDown, PlaySquare, Calendar } from "lucide-react";

export default function SchedulesPlayingSection() {
  const currentPlaying = [
    {
      group: "Bengaluru Flagship Stores",
      screens: "12 screens",
      playlist: "Monsoon Café Promotions",
      status: "Synced",
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30"
    },
    {
      group: "Mall Stores",
      screens: "14 screens",
      playlist: "Monsoon Café Promotions",
      status: "Synced",
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30"
    },
    {
      group: "Airport Outlets",
      screens: "8 screens",
      playlist: "Airport Express Menu",
      status: "Synced",
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30"
    },
    {
      group: "Drive-through Displays",
      screens: "6 screens",
      playlist: "Lunch Combos",
      status: "Synced",
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30"
    },
    {
      group: "Menu Boards",
      screens: "8 screens",
      playlist: "Lunch Combos",
      status: "Pending Sync",
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30"
    }
  ];

  const timelines = [
    {
      time: "06:00 AM - 11:00 AM",
      campaign: "Breakfast Menu Promo",
      scope: "34 active screens · Priority 30",
      active: false
    },
    {
      time: "11:00 AM - 04:00 PM",
      campaign: "Lunch Combos Campaign",
      scope: "34 active screens · Priority 30",
      active: false
    },
    {
      time: "04:00 PM - 09:30 PM",
      campaign: "Monsoon Café Promotions",
      scope: "21 screens · Priority 40",
      active: true // Active now at 4:30 PM
    },
    {
      time: "06:00 PM - 10:00 PM (Fri-Sun)",
      campaign: "Weekend Live Music Teaser",
      scope: "6 screens · Priority 60",
      active: false
    }
  ];

  const quickActions = [
    { name: "Upload Media", icon: Upload, desc: "Add images, video, HTML5 assets" },
    { name: "Create Playlist", icon: ListPlus, desc: "Sequence content loops" },
    { name: "Schedule Content", icon: CalendarPlus, desc: "Define date, times, target groups" },
    { name: "Add Sensor Rule", icon: Zap, desc: "Create interactive edge triggers" },
    { name: "Export Uptime Report", icon: FileDown, desc: "Download SLA performance PDF" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Currently Playing by Screen Group */}
      <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] p-5 rounded-xl shadow-xs flex flex-col justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#18202B] dark:text-[#F2F5F8]">Currently Playing Content</h2>
          <p className="text-xs text-[#657080] dark:text-[#9AA7B7] mt-0.5">Active playlist allocations by screen group</p>
        </div>

        <div className="divide-y divide-[#E2E6EC] dark:divide-[#283243] my-4 flex-1">
          {currentPlaying.map((cp, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <span className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  {cp.group}
                </span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  {cp.screens} · <span className="font-medium text-[#2859D9] dark:text-[#6F96FF]">{cp.playlist}</span>
                </span>
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm border shrink-0 ${cp.color}`}>
                {cp.status}
              </span>
            </div>
          ))}
        </div>

        <div className="text-[11px] text-[#657080] dark:text-[#9AA7B7] border-t border-[#E2E6EC] dark:border-[#283243] pt-3 flex justify-between items-center">
          <span>Deployments pending: 1</span>
          <button className="text-[#2859D9] dark:text-[#6F96FF] font-bold hover:underline">Deployments Manager</button>
        </div>
      </div>

      {/* 2. Today's Schedule Timeline */}
      <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] p-5 rounded-xl shadow-xs flex flex-col justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#18202B] dark:text-[#F2F5F8]">Today's Schedule Timeline</h2>
          <p className="text-xs text-[#657080] dark:text-[#9AA7B7] mt-0.5">Campaign rotation schedule for 4 July 2026</p>
        </div>

        <div className="relative border-l-2 border-[#E2E6EC] dark:border-[#283243] ml-2.5 pl-5.5 py-2.5 my-3.5 space-y-5 flex-1">
          {timelines.map((time, idx) => (
            <div key={idx} className="relative">
              {/* Timeline dot */}
              <span
                className={`absolute -left-8.5 top-0.5 w-3.5 h-3.5 rounded-full border-2 bg-white dark:bg-[#111722] ${
                  time.active
                    ? "border-[#2859D9] dark:border-[#6F96FF] ring-4 ring-blue-500/10"
                    : "border-zinc-300 dark:border-zinc-700"
                }`}
              />
              
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {time.time}
                  {time.active && (
                    <span className="text-[9px] bg-emerald-500 text-white px-1 py-0.2 rounded-xs font-bold uppercase tracking-wider ml-1.5 animate-pulse">
                      Active Now
                    </span>
                  )}
                </span>
                <span className={`text-xs font-bold mt-0.5 ${time.active ? "text-zinc-900 dark:text-white" : "text-zinc-650 dark:text-zinc-400"}`}>
                  {time.campaign}
                </span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                  {time.scope}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-[11px] text-[#657080] dark:text-[#9AA7B7] border-t border-[#E2E6EC] dark:border-[#283243] pt-3 flex justify-between items-center">
          <span>Active campaigns: 1</span>
          <button className="text-[#2859D9] dark:text-[#6F96FF] font-bold hover:underline">Open Scheduler</button>
        </div>
      </div>

      {/* 3. Quick Actions Panel */}
      <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] p-5 rounded-xl shadow-xs flex flex-col justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#18202B] dark:text-[#F2F5F8]">Quick Operator Actions</h2>
          <p className="text-xs text-[#657080] dark:text-[#9AA7B7] mt-0.5">Operations shortcut workspace</p>
        </div>

        <div className="space-y-2 mt-4 flex-1">
          {quickActions.map((qa, idx) => {
            const Icon = qa.icon;
            return (
              <button
                key={idx}
                className="w-full flex items-center gap-3 p-2.5 border border-[#E2E6EC] dark:border-[#283243] hover:border-[#2859D9]/30 dark:hover:border-[#6F96FF]/30 hover:bg-[#F6F7F9] dark:hover:bg-[#171F2C] rounded-lg transition-all text-left cursor-pointer group"
              >
                <div className="p-1.5 bg-[#F6F7F9] dark:bg-[#171F2C] border border-[#E2E6EC] dark:border-[#283243] group-hover:border-[#2859D9]/30 dark:group-hover:border-[#6F96FF]/30 rounded text-[#657080] dark:text-[#9AA7B7] group-hover:text-[#2859D9] dark:group-hover:text-[#6F96FF]">
                  <Icon className="w-4 h-4 shrink-0" />
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-bold text-zinc-900 dark:text-zinc-150">
                    {qa.name}
                  </span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate block">
                    {qa.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
