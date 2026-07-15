"use client";

import React from "react";
import { Monitor, Layers, PlaySquare, Calendar, MapPin, AlertTriangle, Edit2, Play } from "lucide-react";

export interface ScreenGroup {
  id: string;
  name: string;
  screensCount: number;
  onlinePercentage: number;
  playlist: string;
  schedule: string;
  locationsCount: number;
  alertsCount: number;
  lastDeployment: string;
}

interface GroupsGridProps {
  groups: ScreenGroup[];
  onEditGroup: (group: ScreenGroup) => void;
}

export default function GroupsGrid({ groups, onEditGroup }: GroupsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {groups.map((group) => {
        const isWarning = group.alertsCount > 0;
        return (
          <div
            key={group.id}
            className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl shadow-xs hover:shadow-sm hover:border-[#2859D9]/20 dark:hover:border-[#6F96FF]/20 transition-all duration-200 p-5 flex flex-col justify-between"
          >
            {/* Header */}
            <div className="flex justify-between items-start gap-4 pb-3 border-b border-[#E2E6EC] dark:border-[#283243]">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#657080] dark:text-[#9AA7B7]">
                  Screen Group
                </span>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white truncate leading-snug mt-0.5">
                  {group.name}
                </h3>
              </div>
              <button
                onClick={() => onEditGroup(group)}
                className="p-1.5 rounded-lg border border-[#E2E6EC] dark:border-[#283243] hover:bg-[#F6F7F9] dark:hover:bg-zinc-800 text-zinc-500 hover:text-[#2859D9] dark:hover:text-[#6F96FF] cursor-pointer shrink-0 transition-colors"
                title="Edit Group Config"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Core Stats Row */}
            <div className="grid grid-cols-3 gap-2.5 my-4 bg-[#F6F7F9] dark:bg-[#171F2C] p-3 rounded-lg border border-[#E2E6EC] dark:border-[#283243] text-center select-none">
              <div>
                <span className="block text-xs font-bold text-zinc-900 dark:text-zinc-50">{group.screensCount}</span>
                <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wide">Screens</span>
              </div>
              <div className="border-x border-[#E2E6EC] dark:border-[#283243]">
                <span className={`block text-xs font-bold ${
                  group.onlinePercentage >= 95
                    ? "text-emerald-500"
                    : group.onlinePercentage >= 85
                    ? "text-amber-500"
                    : "text-red-500"
                }`}>
                  {group.onlinePercentage}%
                </span>
                <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wide">Online</span>
              </div>
              <div>
                <span className={`block text-xs font-bold ${isWarning ? "text-red-500" : "text-zinc-400"}`}>
                  {group.alertsCount}
                </span>
                <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wide">Alerts</span>
              </div>
            </div>

            {/* Details Fields */}
            <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
              <div className="flex items-center gap-2">
                <PlaySquare className="w-4 h-4 text-[#2859D9] dark:text-[#6F96FF] shrink-0" />
                <span className="text-zinc-400 font-medium">Playlist:</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-100 truncate">{group.playlist}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500 shrink-0" />
                <span className="text-zinc-400 font-medium">Schedule:</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-100 truncate">{group.schedule}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-zinc-400 font-medium">Locations:</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-100">{group.locationsCount} outlets</span>
              </div>
            </div>

            {/* Footer last deployment */}
            <div className="border-t border-[#E2E6EC] dark:border-[#283243] mt-4 pt-3 flex justify-between items-center text-[10px] text-zinc-400 dark:text-zinc-500">
              <span>Last Sync: {group.lastDeployment}</span>
              {isWarning && (
                <span className="text-[9px] font-bold text-red-500 flex items-center gap-0.5 animate-pulse">
                  <AlertTriangle className="w-3 h-3" /> Incidents Active
                </span>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
}
