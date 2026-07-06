"use client";

import React, { useState } from "react";
import { Search, Layers, List, Grid, Plus, ChevronDown } from "lucide-react";
import GroupsGrid, { ScreenGroup } from "@/components/agent/screen-groups/groups-grid";
import GroupsTable from "@/components/agent/screen-groups/groups-table";
import GroupEditModal from "@/components/agent/screen-groups/group-edit-modal";

const initialGroups: ScreenGroup[] = [
  {
    id: "grp-1",
    name: "Bengaluru Flagship Stores",
    screensCount: 12,
    onlinePercentage: 91,
    playlist: "Monsoon Café Promotions",
    schedule: "Monsoon Promotions (4:00 PM–9:30 PM)",
    locationsCount: 5,
    alertsCount: 0,
    lastDeployment: "2:40 PM"
  },
  {
    id: "grp-2",
    name: "Mall Stores",
    screensCount: 14,
    onlinePercentage: 92,
    playlist: "Monsoon Café Promotions",
    schedule: "Monsoon Promotions (4:00 PM–9:30 PM)",
    locationsCount: 4,
    alertsCount: 1, // Phoenix Mall Display
    lastDeployment: "2:40 PM"
  },
  {
    id: "grp-3",
    name: "Airport Outlets",
    screensCount: 8,
    onlinePercentage: 100,
    playlist: "Airport Express Menu",
    schedule: "Airport Express Menu (All day)",
    locationsCount: 2,
    alertsCount: 0,
    lastDeployment: "1:15 PM"
  },
  {
    id: "grp-4",
    name: "Drive-through Displays",
    screensCount: 6,
    onlinePercentage: 83,
    playlist: "Lunch Combos",
    schedule: "Lunch Combos (11:00 AM–4:00 PM)",
    locationsCount: 3,
    alertsCount: 0,
    lastDeployment: "12:30 PM"
  },
  {
    id: "grp-5",
    name: "Menu Boards",
    screensCount: 8,
    onlinePercentage: 87,
    playlist: "Lunch Combos",
    schedule: "Lunch Combos (11:00 AM–4:00 PM)",
    locationsCount: 5,
    alertsCount: 1, // MG Road Board 02 offline
    lastDeployment: "3:18 PM"
  }
];

export default function AgentScreenGroupsPage() {
  const [groups, setGroups] = useState<ScreenGroup[]>(initialGroups);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<ScreenGroup | null>(null);

  // Search filter
  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.playlist.toLowerCase().includes(search.toLowerCase()) ||
    g.schedule.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveGroup = (updatedGroup: ScreenGroup) => {
    setGroups(groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g)));
    setSelectedGroup(null);
  };

  return (
    <div className="py-6 px-8 space-y-6 mx-auto font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E6EC] dark:border-[#283243] pb-5 shrink-0">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-55 tracking-tight">
            Screen Groups
          </h1>
          <p className="text-xs text-[#657080] dark:text-[#9AA7B7]">
            Organize screens into functional categories to deploy and schedule content loops in bulk.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* View Toggles */}
          <div className="flex items-center gap-0.5 p-0.5 border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-white dark:bg-[#111722] shadow-xs">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-all duration-200 cursor-pointer ${
                viewMode === "grid"
                  ? "bg-[#F6F7F9] dark:bg-[#171F2C] text-[#2859D9] dark:text-[#6F96FF]"
                  : "text-zinc-400 hover:text-zinc-650"
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md transition-all duration-200 cursor-pointer ${
                viewMode === "table"
                  ? "bg-[#F6F7F9] dark:bg-[#171F2C] text-[#2859D9] dark:text-[#6F96FF]"
                  : "text-zinc-400 hover:text-zinc-650"
              }`}
              title="Table List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Create Group Button */}
          <button className="flex items-center gap-1.5 bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] px-3.5 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity shadow-sm cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            <span>Create Group</span>
          </button>
        </div>
      </div>

      {/* Search Input bar */}
      <div className="p-4 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl flex items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search group name, assigned playlists, schedules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-[#18202B] dark:text-[#F2F5F8] placeholder-zinc-450 focus:outline-none"
          />
        </div>
      </div>

      {/* Render Area */}
      <div className="flex-1">
        {viewMode === "grid" ? (
          <GroupsGrid groups={filteredGroups} onEditGroup={(g) => setSelectedGroup(g)} />
        ) : (
          <GroupsTable groups={filteredGroups} onEditGroup={(g) => setSelectedGroup(g)} />
        )}
      </div>

      {/* Render Modal */}
      {selectedGroup && (
        <GroupEditModal
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
          onSave={handleSaveGroup}
        />
      )}

    </div>
  );
}
