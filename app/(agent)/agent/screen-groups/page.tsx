"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Search, Layers, List, Grid, Plus, ChevronDown } from "lucide-react";
import GroupsGrid, { ScreenGroup } from "@/components/agent/screen-groups/groups-grid";
import GroupsTable from "@/components/agent/screen-groups/groups-table";
import GroupEditModal from "@/components/agent/screen-groups/group-edit-modal";
import { fetchScreenGroups } from "@/components/agent/screen-groups/api";

export default function AgentScreenGroupsPage() {
  const [groups, setGroups] = useState<ScreenGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<ScreenGroup | null>(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  const loadGroups = useCallback(() => {
    return fetchScreenGroups()
      .then(setGroups)
      .catch((err) => console.error("Failed to load screen groups:", err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  // Search filter
  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.playlist.toLowerCase().includes(search.toLowerCase()) ||
    g.schedule.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaved = () => {
    setSelectedGroup(null);
    setIsCreatingGroup(false);
    loadGroups();
  };

  return (
    <div className="py-6 px-8 space-y-6 mx-auto font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E6EC] dark:border-[#283243] pb-5 shrink-0">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
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
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
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
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
              title="Table List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Create Group Button */}
          <button
            onClick={() => setIsCreatingGroup(true)}
            className="flex items-center gap-1.5 bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] px-3.5 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
          >
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
            className="w-full pl-9 pr-3 py-1.5 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-[#18202B] dark:text-[#F2F5F8] placeholder-zinc-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Render Area */}
      <div className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center text-xs font-semibold text-zinc-400 dark:text-zinc-500 min-h-[300px]">
            Loading screen groups…
          </div>
        ) : groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 text-center min-h-[300px] border border-dashed border-[#E2E6EC] dark:border-[#283243] rounded-xl">
            <Layers className="w-6 h-6 text-zinc-400 dark:text-zinc-500" />
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">No screen groups yet.</p>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">Create a group to organize screens and bulk-deploy content.</p>
          </div>
        ) : viewMode === "grid" ? (
          <GroupsGrid groups={filteredGroups} onEditGroup={(g) => setSelectedGroup(g)} />
        ) : (
          <GroupsTable groups={filteredGroups} onEditGroup={(g) => setSelectedGroup(g)} />
        )}
      </div>

      {/* Render Modal */}
      {(selectedGroup || isCreatingGroup) && (
        <GroupEditModal
          group={selectedGroup}
          onClose={() => {
            setSelectedGroup(null);
            setIsCreatingGroup(false);
          }}
          onSaved={handleSaved}
        />
      )}

    </div>
  );
}
