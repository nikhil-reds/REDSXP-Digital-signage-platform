"use client";

import React from "react";
import { Edit2, AlertTriangle, Monitor, PlaySquare, Calendar } from "lucide-react";
import { ScreenGroup } from "./groups-grid";

interface GroupsTableProps {
  groups: ScreenGroup[];
  onEditGroup: (group: ScreenGroup) => void;
}

export default function GroupsTable({ groups, onEditGroup }: GroupsTableProps) {
  return (
    <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F6F7F9] dark:bg-[#171F2C]/50 text-[#657080] dark:text-[#9AA7B7] font-bold border-b border-[#E2E6EC] dark:border-[#283243] select-none">
              <th className="p-3.5">Group Name</th>
              <th className="p-3.5">Screens</th>
              <th className="p-3.5">Online Uptime</th>
              <th className="p-3.5">Active Playlist</th>
              <th className="p-3.5">Active Schedule</th>
              <th className="p-3.5">Locations</th>
              <th className="p-3.5">Alerts Warnings</th>
              <th className="p-3.5">Last Deployment Sync</th>
              <th className="p-3.5 w-12 text-center">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E6EC] dark:divide-[#283243]">
            {groups.map((group) => {
              const isWarning = group.alertsCount > 0;
              return (
                <tr
                  key={group.id}
                  className="hover:bg-[#F6F7F9]/30 dark:hover:bg-[#171F2C]/10 transition-all"
                >
                  <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-50">
                    {group.name}
                  </td>
                  <td className="p-3.5 text-zinc-550 dark:text-zinc-400 font-semibold">
                    {group.screensCount} screens
                  </td>
                  
                  {/* Uptime split */}
                  <td className="p-3.5">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold border inline-flex items-center gap-1 ${
                        group.onlinePercentage >= 95
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100/50"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-100/50"
                      }`}
                    >
                      {group.onlinePercentage}%
                    </span>
                  </td>

                  <td className="p-3.5 text-[#2859D9] dark:text-[#6F96FF] font-bold">
                    {group.playlist}
                  </td>
                  <td className="p-3.5 text-zinc-500 font-semibold">
                    {group.schedule}
                  </td>
                  <td className="p-3.5 text-zinc-500">
                    {group.locationsCount} stores
                  </td>

                  {/* Warning Alerts */}
                  <td className="p-3.5">
                    {isWarning ? (
                      <span className="text-[9px] px-2 py-0.5 rounded-sm font-bold bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border border-red-100/50 inline-flex items-center gap-1 animate-pulse">
                        <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                        {group.alertsCount} Alert
                      </span>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </td>
                  
                  <td className="p-3.5 text-zinc-400 font-semibold font-mono text-[10px]">
                    {group.lastDeployment}
                  </td>

                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => onEditGroup(group)}
                      className="p-1 rounded-md text-zinc-450 hover:bg-[#F6F7F9] dark:hover:bg-[#171F2C] hover:text-[#2859D9] dark:hover:text-[#6F96FF] cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
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
