"use client";

import React, { useState } from "react";
import {
  Search,
  Building2,
  Activity,
  Cpu,
  Layers,
  MapPin,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Clock,
  WifiOff
} from "lucide-react";

interface Device {
  id: string;
  name: string;
  tenant: string;
  serial: string;
  model: string;
  status: "Online" | "Delayed" | "Offline";
  location: string;
}

interface DevicesListProps {
  devices: Device[];
  selectedDeviceId: string | null;
  onSelectDevice: (device: Device) => void;
}

export default function DevicesList({
  devices,
  selectedDeviceId,
  onSelectDevice
}: DevicesListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [tenantFilter, setTenantFilter] = useState("All");

  // Filtering
  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(search.toLowerCase()) ||
      device.serial.toLowerCase().includes(search.toLowerCase()) ||
      device.tenant.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || device.status === statusFilter;
    const matchesTenant = tenantFilter === "All" || device.tenant === tenantFilter;
    return matchesSearch && matchesStatus && matchesTenant;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl overflow-hidden shadow-xs">
      {/* Search and Filters panel */}
      <div className="p-4 border-b border-zinc-150 dark:border-zinc-800 space-y-3 bg-zinc-50/20 dark:bg-zinc-900/10">
        {/* Row 1: Search and Dropdowns 1-3 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search device name, serial, tenant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8.5 pr-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
            />
          </div>

          {/* Tenants Dropdown */}
          <div className="relative">
            <select
              value={tenantFilter}
              onChange={(e) => setTenantFilter(e.target.value)}
              className="w-full pl-8 pr-8 py-1.5 border border-zinc-200 dark:border-zinc-850 rounded-lg bg-white dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300 font-medium focus:outline-none appearance-none cursor-pointer"
            >
              <option value="All">All Tenants</option>
              <option value="Café Coffee Day">Café Coffee Day</option>
              <option value="Reliance Retail Media">Reliance Retail Media</option>
              <option value="PVR INOX">PVR INOX</option>
              <option value="Apollo Pharmacies">Apollo Pharmacies</option>
            </select>
            <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-8 pr-8 py-1.5 border border-zinc-200 dark:border-zinc-850 rounded-lg bg-white dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300 font-medium focus:outline-none appearance-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Online">Online</option>
              <option value="Delayed">Delayed</option>
              <option value="Offline">Offline</option>
            </select>
            <Activity className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>

          {/* Models Dropdown */}
          <div className="relative">
            <select className="w-full pl-8 pr-8 py-1.5 border border-zinc-200 dark:border-zinc-850 rounded-lg bg-white dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300 font-medium focus:outline-none appearance-none cursor-pointer">
              <option>All Models</option>
            </select>
            <Cpu className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* Row 2: Dropdowns 4-5 */}
        <div className="flex items-center gap-2.5 max-w-sm">
          {/* Versions Dropdown */}
          <div className="relative w-1/2">
            <select className="w-full pl-8 pr-8 py-1.5 border border-zinc-200 dark:border-zinc-850 rounded-lg bg-white dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300 font-medium focus:outline-none appearance-none cursor-pointer">
              <option>All Versions</option>
            </select>
            <Layers className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>

          {/* Location Dropdown */}
          <div className="relative w-1/2">
            <select className="w-full pl-8 pr-8 py-1.5 border border-zinc-200 dark:border-zinc-850 rounded-lg bg-white dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300 font-medium focus:outline-none appearance-none cursor-pointer">
              <option>Location</option>
            </select>
            <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="p-4 grid grid-cols-3 gap-3.5">
        {/* Online Card */}
        <div className="p-3.5 rounded-lg border border-emerald-100 bg-emerald-50/20 dark:bg-emerald-950/10 dark:border-emerald-900/30 flex flex-col justify-between h-20 shadow-xs">
          <div className="flex justify-between items-center text-emerald-700 dark:text-emerald-400 font-semibold text-[10px] uppercase tracking-wider">
            <span>Online</span>
            <Wifi className="w-3.5 h-3.5" />
          </div>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight leading-none">
            4,517
          </span>
        </div>

        {/* Delayed Card */}
        <div className="p-3.5 rounded-lg border border-amber-100 bg-amber-50/20 dark:bg-amber-950/10 dark:border-amber-900/30 flex flex-col justify-between h-20 shadow-xs">
          <div className="flex justify-between items-center text-amber-700 dark:text-amber-400 font-semibold text-[10px] uppercase tracking-wider">
            <span>Delayed</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
          <span className="text-xl font-bold text-amber-600 dark:text-amber-400 tracking-tight leading-none">
            96
          </span>
        </div>

        {/* Offline Card */}
        <div className="p-3.5 rounded-lg border border-rose-100 bg-rose-50/20 dark:bg-rose-950/10 dark:border-rose-900/30 flex flex-col justify-between h-20 shadow-xs">
          <div className="flex justify-between items-center text-rose-705 dark:text-rose-400 font-semibold text-[10px] uppercase tracking-wider">
            <span>Offline</span>
            <WifiOff className="w-3.5 h-3.5" />
          </div>
          <span className="text-xl font-bold text-rose-650 dark:text-rose-450 tracking-tight leading-none">
            249
          </span>
        </div>
      </div>

      {/* Main Table area */}
      <div className="overflow-x-auto flex-1 min-h-0">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-450 dark:text-zinc-550 font-bold border-b border-zinc-150 dark:border-zinc-800 select-none">
              <th className="p-3.5">
                <span className="flex items-center gap-1 cursor-pointer hover:text-zinc-855 dark:hover:text-zinc-200">
                  Device Name <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                </span>
              </th>
              <th className="p-3.5">Tenant</th>
              <th className="p-3.5">Serial</th>
              <th className="p-3.5">Model</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
            {filteredDevices.map((device) => {
              const isSelected = selectedDeviceId === device.id;
              return (
                <tr
                  key={device.id}
                  onClick={() => onSelectDevice(device)}
                  className={`hover:bg-zinc-50/30 dark:hover:bg-zinc-900/20 transition-all cursor-pointer ${
                    isSelected ? "bg-blue-50/20 dark:bg-blue-950/10 font-medium" : ""
                  }`}
                >
                  <td className="p-3.5 text-zinc-900 dark:text-zinc-100 font-semibold">
                    {device.name}
                  </td>
                  <td className="p-3.5 text-zinc-550 dark:text-zinc-400">{device.tenant}</td>
                  <td className="p-3.5 font-mono text-[10px] text-zinc-400">{device.serial}</td>
                  <td className="p-3.5 text-zinc-450">{device.model}</td>
                  <td className="p-3.5">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold border inline-flex items-center gap-1.5 ${
                        device.status === "Online"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100/50"
                          : device.status === "Delayed"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-100/50"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border-rose-100/50"
                      }`}
                    >
                      <span
                        className={`w-1 h-1 rounded-full ${
                          device.status === "Online"
                            ? "bg-emerald-500"
                            : device.status === "Delayed"
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                      />
                      {device.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-zinc-500 truncate max-w-[120px]">{device.location}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/30 dark:bg-zinc-900/30 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-450 select-none">
        <span>1-4 of 4,862 devices</span>
        <div className="flex items-center gap-1">
          <button className="flex items-center justify-center p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer text-zinc-500">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          
          <button className="w-8 h-8 rounded-lg bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 font-bold flex items-center justify-center cursor-pointer">
            1
          </button>
          <button className="w-8 h-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center cursor-pointer">
            2
          </button>
          <button className="w-8 h-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center cursor-pointer">
            3
          </button>

          <button className="flex items-center justify-center p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer text-zinc-550">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Small helper
function ArrowUpDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
      />
    </svg>
  );
}
