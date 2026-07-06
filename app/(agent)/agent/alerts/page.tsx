"use client";

import React, { useState } from "react";
import { Search, Filter, ShieldAlert, Cpu, Bell, ChevronDown } from "lucide-react";
import AlertsStatsBanner, { AlertIncident } from "@/components/agent/alerts/alerts-stats-banner";
import AlertsTable from "@/components/agent/alerts/alerts-table";
import AlertsActionModal from "@/components/agent/alerts/alerts-action-modal";

const initialIncidents: AlertIncident[] = [
  {
    id: "alert-1",
    deviceName: "MG Road Menu Board 02",
    issue: "Offline",
    severity: "Critical",
    groupName: "Menu Boards",
    startTime: "Today, 3:50 PM",
    duration: "18m",
    status: "Active"
  },
  {
    id: "alert-2",
    deviceName: "Phoenix Mall Display",
    issue: "Disk space at 94%",
    severity: "High",
    groupName: "Mall Stores",
    startTime: "Today, 2:08 PM",
    duration: "2h",
    status: "Active"
  },
  {
    id: "alert-3",
    deviceName: "Indiranagar Screen 03",
    issue: "Heartbeat delayed (72s)",
    severity: "Medium",
    groupName: "Bengaluru Flagship Stores",
    startTime: "Today, 3:58 PM",
    duration: "10m",
    status: "Active"
  },
  {
    id: "alert-4",
    deviceName: "Koramangala Entrance",
    issue: "BrightSign temperature at 78°C",
    severity: "Low",
    groupName: "Bengaluru Flagship Stores",
    startTime: "Today, 3:38 PM",
    duration: "30m",
    status: "Active"
  },
  {
    id: "alert-5",
    deviceName: "Airport T2 Counter 04",
    issue: "Content download failed",
    severity: "Low",
    groupName: "Airport Outlets",
    startTime: "Today, 12:08 PM",
    duration: "4h",
    status: "Active"
  },
  {
    id: "alert-6",
    deviceName: "MG Road Menu Board 01",
    issue: "Sync lag detected (12s)",
    severity: "Low",
    groupName: "Menu Boards",
    startTime: "Today, 3:08 PM",
    duration: "1h",
    status: "Active"
  }
];

export default function AgentAlertsPage() {
  const [incidents, setIncidents] = useState<AlertIncident[]>(initialIncidents);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [groupFilter, setGroupFilter] = useState("All");

  // Modals state
  const [modalType, setModalType] = useState<"reboot" | "ticket" | null>(null);
  const [targetDevice, setTargetDevice] = useState<string>("");
  const [targetAlert, setTargetAlert] = useState<AlertIncident | null>(null);

  // Filters application
  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch = incident.deviceName.toLowerCase().includes(search.toLowerCase()) ||
                          incident.issue.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && incident.status === "Active") ||
      (statusFilter === "Acknowledged" && incident.status === "Acknowledged") ||
      (statusFilter === "Resolved" && incident.status === "Resolved");

    const matchesGroup = groupFilter === "All" || incident.groupName.toLowerCase().includes(groupFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesGroup;
  });

  const handleAcknowledge = (id: string) => {
    setIncidents(incidents.map((inc) => (inc.id === id ? { ...inc, status: "Acknowledged" } : inc)));
  };

  const handleResolve = (id: string) => {
    setIncidents(incidents.map((inc) => (inc.id === id ? { ...inc, status: "Resolved" } : inc)));
  };

  const handleRebootTrigger = (deviceName: string) => {
    setTargetDevice(deviceName);
    setModalType("reboot");
  };

  const handleTicketTrigger = (alert: AlertIncident) => {
    setTargetAlert(alert);
    setModalType("ticket");
  };

  const handleModalConfirm = (data?: any) => {
    if (modalType === "reboot") {
      alert(`Reboot signal sent successfully to device player: ${targetDevice}`);
    } else if (modalType === "ticket") {
      alert(`IT Support Ticket submitted successfully:\nCategory: ${data.category}\nSubject: ${data.subject}`);
    }
    setModalType(null);
    setTargetAlert(null);
  };

  return (
    <div className="py-6 px-8 space-y-6 mx-auto font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E6EC] dark:border-[#283243] pb-5 shrink-0">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-55 tracking-tight flex items-center gap-2">
            Alerts & Incidents Cockpit
          </h1>
          <p className="text-xs text-[#657080] dark:text-[#9AA7B7]">
            Diagnose hardware heat alarms, offline heartbeat timeouts, storage limit events, and network sync lags.
          </p>
        </div>
      </div>

      {/* Stats counter panel */}
      <AlertsStatsBanner alerts={incidents} />

      {/* Query Filters */}
      <div className="p-4 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search alerts, devices..."
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
            <option value="All">All Incident States</option>
            <option value="Active">Active</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="Resolved">Resolved</option>
          </select>
          <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
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
            <option value="Flagship">Flagship Outlets</option>
            <option value="Menu Boards">Menu Boards</option>
            <option value="Mall Stores">Mall Stores</option>
            <option value="Airport Outlets">Airport Outlets</option>
          </select>
          <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
        </div>
      </div>

      {/* Main Incidents table */}
      <div className="flex-1">
        <AlertsTable
          alerts={filteredIncidents}
          onAcknowledge={handleAcknowledge}
          onResolve={handleResolve}
          onReboot={handleRebootTrigger}
          onTicket={handleTicketTrigger}
        />
      </div>

      {/* Actions Modal Overlay */}
      {modalType && (
        <AlertsActionModal
          type={modalType}
          deviceName={targetDevice}
          alert={targetAlert}
          onClose={() => {
            setModalType(null);
            setTargetAlert(null);
          }}
          onConfirm={handleModalConfirm}
        />
      )}

    </div>
  );
}
