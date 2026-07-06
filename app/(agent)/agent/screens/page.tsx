"use client";

import React, { useState } from "react";
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

const initialScreens: ScreenDevice[] = [
  {
    id: "scr-1",
    name: "Koramangala Entrance",
    location: "Koramangala 5th Block",
    group: "Bengaluru Flagship Stores",
    model: "XD1035",
    status: "Online",
    content: "Walk-in Offer",
    firmware: "9.0.145",
    storage: "48%",
    heartbeat: "14s ago",
    alertsCount: 0,
    alertsSeverity: "none"
  },
  {
    id: "scr-2",
    name: "MG Road Menu Board 01",
    location: "MG Road",
    group: "Menu Boards",
    model: "XT1144",
    status: "Online",
    content: "Lunch Combos",
    firmware: "9.0.145",
    storage: "62%",
    heartbeat: "9s ago",
    alertsCount: 0,
    alertsSeverity: "none"
  },
  {
    id: "scr-3",
    name: "MG Road Menu Board 02",
    location: "MG Road",
    group: "Menu Boards",
    model: "XT1144",
    status: "Offline",
    content: "Lunch Combos",
    firmware: "9.0.145",
    storage: "58%",
    heartbeat: "18m ago",
    alertsCount: 1,
    alertsSeverity: "critical"
  },
  {
    id: "scr-4",
    name: "Phoenix Mall Display",
    location: "Mahadevapura",
    group: "Mall Stores",
    model: "XC2055",
    status: "Online",
    content: "Monsoon Café Promotions",
    firmware: "9.0.145",
    storage: "94%",
    heartbeat: "21s ago",
    alertsCount: 1,
    alertsSeverity: "high"
  },
  {
    id: "scr-5",
    name: "Indiranagar Screen 03",
    location: "Indiranagar",
    group: "Bengaluru Flagship Stores",
    model: "XD1035",
    status: "Delayed",
    content: "Rewards QR July",
    firmware: "8.5.31",
    storage: "32%",
    heartbeat: "72s ago",
    alertsCount: 1,
    alertsSeverity: "medium"
  },
  {
    id: "scr-6",
    name: "Airport T2 Counter 04",
    location: "Kempegowda Airport",
    group: "Airport Outlets",
    model: "LS425",
    status: "Online",
    content: "Airport Express Menu",
    firmware: "9.0.145",
    storage: "12%",
    heartbeat: "18s ago",
    alertsCount: 0,
    alertsSeverity: "none"
  }
];

export default function AgentScreensPage() {
  const [viewMode, setViewMode] = useState<"table" | "map">("table");
  const [selectedScreen, setSelectedScreen] = useState<ScreenDevice | null>(null);

  // Filters State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [groupFilter, setGroupFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [modelFilter, setModelFilter] = useState("All");
  const [alertsFilter, setAlertsFilter] = useState("All");

  // Filter application
  const filteredScreens = initialScreens.filter((screen) => {
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
                    : "text-zinc-400 hover:text-zinc-650"
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
                    : "text-zinc-400 hover:text-zinc-650"
                }`}
                title="Map Cluster View"
              >
                <Map className="w-4 h-4" />
              </button>
            </div>

            {/* Add Screen action */}
            <button className="flex items-center gap-1.5 bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] px-3.5 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity shadow-sm cursor-pointer">
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
                className="w-full pl-9 pr-3 py-1.5 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-[#18202B] dark:text-[#F2F5F8] placeholder-zinc-450 focus:outline-none"
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
                <option value="Bengaluru Flagship Stores">Flagship Stores</option>
                <option value="Mall Stores">Mall Stores</option>
                <option value="Airport Outlets">Airport Outlets</option>
                <option value="Menu Boards">Menu Boards</option>
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
                <option value="Koramangala 5th Block">Koramangala</option>
                <option value="MG Road">MG Road</option>
                <option value="Mahadevapura">Mahadevapura</option>
                <option value="Indiranagar">Indiranagar</option>
                <option value="Kempegowda Airport">Kempegowda Airport</option>
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
                <option value="XD1035">XD1035 Series</option>
                <option value="XT1144">XT1144 Series</option>
                <option value="XC2055">XC2055 Series</option>
                <option value="LS425">LS425 Series</option>
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
          {viewMode === "table" ? (
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

    </div>
  );
}
