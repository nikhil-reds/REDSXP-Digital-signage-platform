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
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-xs">
      {/* Search and Filters panel */}
      <div className="space-y-3 border-b border-app-border bg-app-surface-alt p-4">
        {/* Row 1: Search and Dropdowns 1-3 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-app-muted" />
            <input
              type="text"
              placeholder="Search device name, serial, tenant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-app-border bg-app-surface py-1.5 pl-8.5 pr-3 text-caption text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent-text"
            />
          </div>

          {/* Tenants Dropdown */}
          <div className="relative">
            <select
              value={tenantFilter}
              onChange={(e) => setTenantFilter(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-lg border border-app-border bg-app-surface py-1.5 pl-8 pr-8 text-caption font-medium text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
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
              className="w-full cursor-pointer appearance-none rounded-lg border border-app-border bg-app-surface py-1.5 pl-8 pr-8 text-caption font-medium text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
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
            <select className="w-full cursor-pointer appearance-none rounded-lg border border-app-border bg-app-surface py-1.5 pl-8 pr-8 text-caption font-medium text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text">
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
            <select className="w-full cursor-pointer appearance-none rounded-lg border border-app-border bg-app-surface py-1.5 pl-8 pr-8 text-caption font-medium text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text">
              <option>All Versions</option>
            </select>
            <Layers className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>

          {/* Location Dropdown */}
          <div className="relative w-1/2">
            <select className="w-full cursor-pointer appearance-none rounded-lg border border-app-border bg-app-surface py-1.5 pl-8 pr-8 text-caption font-medium text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text">
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
        <div className="flex h-20 flex-col justify-between rounded-lg border border-app-accent-border bg-app-accent-surface p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-app-accent-text">
            <span>Online</span>
            <Wifi className="w-3.5 h-3.5" />
          </div>
          <span className="text-xl font-bold leading-none tracking-tight text-app-accent-text">
            4,517
          </span>
        </div>

        {/* Delayed Card */}
        <div className="flex h-20 flex-col justify-between rounded-lg border border-app-border bg-app-warning-surface p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-app-warning-text">
            <span>Delayed</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
          <span className="text-xl font-bold leading-none tracking-tight text-app-warning-text">
            96
          </span>
        </div>

        {/* Offline Card */}
        <div className="flex h-20 flex-col justify-between rounded-lg border border-app-danger-border bg-app-danger-surface p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-app-danger-text">
            <span>Offline</span>
            <WifiOff className="w-3.5 h-3.5" />
          </div>
          <span className="text-xl font-bold leading-none tracking-tight text-app-danger-text">
            249
          </span>
        </div>
      </div>

      {/* Main Table area */}
      <div className="overflow-x-auto flex-1 min-h-0">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="select-none border-b border-app-border bg-app-surface-alt font-bold text-app-muted">
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
          <tbody className="divide-y divide-app-border">
            {filteredDevices.map((device) => {
              const isSelected = selectedDeviceId === device.id;
              return (
                <tr
                  key={device.id}
                  onClick={() => onSelectDevice(device)}
                  className={`cursor-pointer transition-all hover:bg-app-surface-alt ${
                    isSelected ? "bg-app-accent-surface font-medium" : ""
                  }`}
                >
                  <td className="p-3.5 font-semibold text-app-text">
                    {device.name}
                  </td>
                  <td className="p-3.5 text-app-muted">{device.tenant}</td>
                  <td className="p-3.5 font-mono text-[10px] text-app-muted">{device.serial}</td>
                  <td className="p-3.5 text-app-muted">{device.model}</td>
                  <td className="p-3.5">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold border inline-flex items-center gap-1.5 ${
                        device.status === "Online"
                          ? "border-app-accent-border bg-app-accent-surface text-app-accent-text"
                          : device.status === "Delayed"
                          ? "border-app-border bg-app-warning-surface text-app-warning-text"
                          : "border-app-danger-border bg-app-danger-surface text-app-danger-text"
                      }`}
                    >
                      <span
                        className={`w-1 h-1 rounded-full ${
                          device.status === "Online"
                            ? "bg-app-accent-text"
                            : device.status === "Delayed"
                            ? "bg-app-warning"
                            : "bg-app-danger-text"
                        }`}
                      />
                      {device.status}
                    </span>
                  </td>
                  <td className="max-w-[120px] truncate p-3.5 text-app-muted">{device.location}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex select-none items-center justify-between border-t border-app-border bg-app-surface-alt p-4 text-caption text-app-muted">
        <span>1-4 of 4,862 devices</span>
        <div className="flex items-center gap-1">
          <button className="flex items-center justify-center p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer text-zinc-500">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          
          <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-app-accent font-bold text-app-accent-on">
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
