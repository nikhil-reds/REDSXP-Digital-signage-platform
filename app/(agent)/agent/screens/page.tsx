"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Monitor,
  Map,
  Plus,
  Activity,
  Layers,
  MapPin,
  Cpu,
  ShieldAlert,
  ChevronDown
} from "lucide-react";
import ScreensTable, { ScreenDevice } from "@/components/agent/screens/screens-table";
import ScreensMap from "@/components/agent/screens/screens-map";
import ScreensDetailDrawer from "@/components/agent/screens/screens-detail-drawer";
import ScreenCreateModal from "@/components/agent/screens/screen-create-modal";
import { createScreen, fetchScreens } from "@/components/agent/screens/api";

function uniqueSorted(values: (string | undefined)[]): string[] {
  return Array.from(new Set(values.filter((v): v is string => Boolean(v)))).sort();
}

export default function AgentScreensPage() {
  const [screens, setScreens] = useState<ScreenDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "map">("table");
  const [selectedScreen, setSelectedScreen] = useState<ScreenDevice | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filters State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [groupFilter, setGroupFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [modelFilter, setModelFilter] = useState("All");
  const [alertsFilter, setAlertsFilter] = useState("All");

  useEffect(() => {
    fetchScreens()
      .then(setScreens)
      .catch((err) => console.error("Failed to load screens:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const groupOptions = uniqueSorted(screens.map((s) => s.group));
  const locationOptions = uniqueSorted(screens.map((s) => s.location));
  const modelOptions = uniqueSorted(screens.map((s) => s.model));

  const handleCreateScreen: React.ComponentProps<typeof ScreenCreateModal>["onCreate"] = async (payload) => {
    const created = await createScreen(payload);
    setScreens((prev) => [created, ...prev]);
    setIsCreateModalOpen(false);
  };

  // Filter application
  const filteredScreens = screens.filter((screen) => {
    const matchesSearch =
      screen.name.toLowerCase().includes(search.toLowerCase()) ||
      screen.location.toLowerCase().includes(search.toLowerCase()) ||
      screen.model.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || screen.status === statusFilter;
    const matchesGroup = groupFilter === "All" || screen.group === groupFilter;
    const matchesLocation = locationFilter === "All" || screen.location === locationFilter;
    const matchesModel = modelFilter === "All" || screen.model === modelFilter;
    
    const matchesAlerts =
      alertsFilter === "All" ||
      (alertsFilter === "Alerts Only" && screen.alertsCount > 0) ||
      (alertsFilter === "Clear Only" && screen.alertsCount === 0);

    return matchesSearch && matchesStatus && matchesGroup && matchesLocation && matchesModel && matchesAlerts;
  });

  return (
    <div className="flex h-full overflow-hidden relative">
      <div className="flex-1 flex flex-col min-w-0 p-6 space-y-6 overflow-y-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E6EC] dark:border-[#283243] pb-5 shrink-0">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Screens & Device Players
            </h1>
            <p className="text-xs text-[#657080] dark:text-[#9AA7B7]">
              Monitor hardware heartbeats, active playlists, rules automations, and errors.
            </p>
          </div>
          
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-0.5 p-0.5 border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-white dark:bg-[#111722] shadow-xs">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition-all duration-200 cursor-pointer ${
                  viewMode === "table"
                    ? "bg-[#F6F7F9] dark:bg-[#171F2C] text-[#2859D9] dark:text-[#6F96FF]"
                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                }`}
                title="Table List View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`p-1.5 rounded-md transition-all duration-200 cursor-pointer ${
                  viewMode === "map"
                    ? "bg-[#F6F7F9] dark:bg-[#171F2C] text-[#2859D9] dark:text-[#6F96FF]"
                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                }`}
                title="Map Cluster View"
              >
                <Map className="w-4 h-4" />
              </button>
            </div>

            {/* Add Screen action */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] px-3.5 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Screen</span>
            </button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <div className="p-4 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl space-y-3 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search screen, location, model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-[#18202B] dark:text-[#F2F5F8] placeholder-zinc-400 focus:outline-none"
              />
            </div>

            {/* Status Selector */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-8 pr-8 py-1.5 border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-[#F6F7F9] dark:bg-[#171F2C]/50 text-xs text-zinc-700 dark:text-zinc-300 font-bold focus:outline-none appearance-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Online">Online</option>
                <option value="Delayed">Delayed</option>
                <option value="Offline">Offline</option>
              </select>
              <Activity className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            </div>

            {/* Group Selector */}
            <div className="relative">
              <select
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
                className="w-full pl-8 pr-8 py-1.5 border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-[#F6F7F9] dark:bg-[#171F2C]/50 text-xs text-zinc-700 dark:text-zinc-300 font-bold focus:outline-none appearance-none cursor-pointer"
              >
                <option value="All">All Screen Groups</option>
                {groupOptions.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
              <Layers className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            </div>

            {/* Location Selector */}
            <div className="relative">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-8 pr-8 py-1.5 border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-[#F6F7F9] dark:bg-[#171F2C]/50 text-xs text-zinc-700 dark:text-zinc-300 font-bold focus:outline-none appearance-none cursor-pointer"
              >
                <option value="All">All Locations</option>
                {locationOptions.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex gap-3 max-w-lg">
            {/* Model Selector */}
            <div className="relative w-1/2">
              <select
                value={modelFilter}
                onChange={(e) => setModelFilter(e.target.value)}
                className="w-full pl-8 pr-8 py-1.5 border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-[#F6F7F9] dark:bg-[#171F2C]/50 text-xs text-zinc-700 dark:text-zinc-300 font-bold focus:outline-none appearance-none cursor-pointer"
              >
                <option value="All">All Hardware Models</option>
                {modelOptions.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
              <Cpu className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            </div>

            {/* Alerts Selector */}
            <div className="relative w-1/2">
              <select
                value={alertsFilter}
                onChange={(e) => setAlertsFilter(e.target.value)}
                className="w-full pl-8 pr-8 py-1.5 border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-[#F6F7F9] dark:bg-[#171F2C]/50 text-xs text-zinc-700 dark:text-zinc-300 font-bold focus:outline-none appearance-none cursor-pointer"
              >
                <option value="All">All Alerts</option>
                <option value="Alerts Only">With active alerts</option>
                <option value="Clear Only">No active alerts</option>
              </select>
              <ShieldAlert className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Main Render Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center text-xs font-semibold text-zinc-400 dark:text-zinc-500 min-h-[400px]">
              Loading screens…
            </div>
          ) : screens.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center min-h-[400px] border border-dashed border-[#E2E6EC] dark:border-[#283243] rounded-xl">
              <Monitor className="w-6 h-6 text-zinc-400 dark:text-zinc-500" />
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">No screens yet.</p>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500">Add your first screen to get started.</p>
            </div>
          ) : viewMode === "table" ? (
            <ScreensTable
              screens={filteredScreens}
              onSelectScreen={(screen) => setSelectedScreen(screen)}
              selectedScreenId={selectedScreen?.id || null}
            />
          ) : (
            <ScreensMap
              screens={filteredScreens}
              onSelectScreen={(screen) => setSelectedScreen(screen)}
              selectedScreenId={selectedScreen?.id || null}
            />
          )}
        </div>

      </div>

      {/* Sliding detail drawer panel */}
      {selectedScreen && (
        <ScreensDetailDrawer
          screen={selectedScreen}
          onClose={() => setSelectedScreen(null)}
        />
      )}

      {isCreateModalOpen && (
        <ScreenCreateModal onClose={() => setIsCreateModalOpen(false)} onCreate={handleCreateScreen} />
      )}

    </div>
  );
}
