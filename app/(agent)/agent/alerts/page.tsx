"use client";

import React, { useState } from "react";
import { Filter } from "lucide-react";
import { PageShell, SearchInput, Select, Toolbar } from "@/components/ui";
import AlertsStatsBanner, { AlertIncident } from "@/components/agent/alerts/alerts-stats-banner";
import AlertsTable from "@/components/agent/alerts/alerts-table";
import AlertsActionModal, { AlertActionData } from "@/components/agent/alerts/alerts-action-modal";

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

  const handleModalConfirm = (data?: AlertActionData) => {
    if (modalType === "reboot") {
      alert(`Reboot signal sent successfully to device player: ${targetDevice}`);
    } else if (modalType === "ticket") {
      if (data) alert(`IT Support Ticket submitted successfully:\nCategory: ${data.category}\nSubject: ${data.subject}`);
    }
    setModalType(null);
    setTargetAlert(null);
  };

  return (
    <PageShell>
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-app-border pb-5 shrink-0">
        <div>
          <h1 className="font-heading text-h5 font-semibold tracking-headline text-app-text">
            Alerts & Incidents Cockpit
          </h1>
          <p className="text-body text-app-muted mt-1">
            Diagnose hardware heat alarms, offline heartbeat timeouts, storage limit events, and network sync lags.
          </p>
        </div>
      </div>

      {/* Stats counter panel */}
      <AlertsStatsBanner alerts={incidents} />

      {/* Query Filters */}
      <Toolbar className="grid grid-cols-1 gap-3 rounded-xl border border-app-border bg-app-surface p-4 sm:grid-cols-3">
          <SearchInput
            placeholder="Search alerts or devices…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            icon={Filter}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Incident States</option>
            <option value="Active">Active</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="Resolved">Resolved</option>
          </Select>
          <Select
            icon={Filter}
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
          >
            <option value="All">All Screen Groups</option>
            <option value="Flagship">Flagship Outlets</option>
            <option value="Menu Boards">Menu Boards</option>
            <option value="Mall Stores">Mall Stores</option>
            <option value="Airport Outlets">Airport Outlets</option>
          </Select>
      </Toolbar>

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

    </PageShell>
  );
}
