"use client";

import React, { useState } from "react";
import { Search, Download, Trash, Filter, ClipboardList, ChevronDown } from "lucide-react";
import ActivityFeed, { LogEntry } from "@/components/agent/activity-log/activity-feed";

const initialLogs: LogEntry[] = [
  {
    id: "log-1",
    user: "Aarav Mehta",
    avatarLetter: "AM",
    role: "Operator",
    event: "Published playlist \"Monsoon Café Promotions\" to Bengaluru Flagship Stores (12 screens)",
    target: "Bengaluru Flagship Stores",
    time: "4 Jul, 3:42 PM IST",
    severity: "Info",
    detailPayload: `{
  "action": "PUBLISH_PLAYLIST",
  "playlistName": "Monsoon Café Promotions",
  "version": "v1.2",
  "targetGroup": "Bengaluru Flagship Stores",
  "affectedNodes": 12,
  "manifest_diff": {
    "added": ["Monsoon_Cold_Coffee_15s.mp4"],
    "removed": ["Summer_Frappe_Special_15s.mp4"]
  }
}`
  },
  {
    id: "log-2",
    user: "Sneha Iyer",
    avatarLetter: "SI",
    role: "Operator",
    event: "Uploaded asset \"Breakfast_Combo_Landscape.jpg\"",
    target: "Media Library Database",
    time: "4 Jul, 2:15 PM IST",
    severity: "Info",
    detailPayload: `{
  "action": "UPLOAD_ASSET",
  "fileName": "Breakfast_Combo_Landscape.jpg",
  "fileSize": "4.2 MB",
  "dimensions": "1920×1080",
  "mimeType": "image/jpeg",
  "checksum": "sha256:7f81a182bf9d"
}`
  },
  {
    id: "log-3",
    user: "System Edge",
    avatarLetter: "SYS",
    role: "System",
    event: "Automated trigger: motion sensor on Koramangala Entrance activated Proximity Promo rule",
    target: "Koramangala Entrance (XD1035)",
    time: "4 Jul, 1:30 PM IST",
    severity: "Info",
    detailPayload: `{
  "action": "SENSOR_TRIGGER",
  "ruleId": "rule_prox_promo_88",
  "sensorType": "Motion",
  "reading": "motion_detected (value: 2)",
  "playlistApplied": "Walk-in Offer",
  "timeout": "30s",
  "status": "SUCCESS_REVERTED"
}`
  },
  {
    id: "log-4",
    user: "Rohan Das",
    avatarLetter: "RD",
    role: "Operator",
    event: "Modified schedule \"Weekend Live Music\" (changed priority to 60)",
    target: "Schedules Database",
    time: "3 Jul, 5:45 PM IST",
    severity: "Warning",
    detailPayload: `{
  "action": "MODIFY_SCHEDULE",
  "scheduleName": "Weekend Live Music",
  "fieldsChanged": {
    "priority": {
      "oldValue": 40,
      "newValue": 60
    }
  },
  "justification": "Avoid loop pre-emption from general promotional assets during peak hours"
}`
  },
  {
    id: "log-5",
    user: "Aarav Mehta",
    avatarLetter: "AM",
    role: "Operator",
    event: "Forced remote sync to MG Road Menu Board 01",
    target: "MG Road Menu Board 01 (XT1144)",
    time: "3 Jul, 2:00 PM IST",
    severity: "Info",
    detailPayload: `{
  "action": "FORCE_SYNC",
  "deviceId": "dev_xt1144_mgr01",
  "handshake": "SUCCESS (code: 200)",
  "syncTimeMs": 1420,
  "manifestApplied": "mf_8f21c_ccd"
}`
  },
  {
    id: "log-6",
    user: "System Edge",
    avatarLetter: "SYS",
    role: "System",
    event: "BrightSign reboot command executed on MG Road Menu Board 02 (triggered via offline alert)",
    target: "MG Road Menu Board 02 (XT1144)",
    time: "3 Jul, 11:30 AM IST",
    severity: "Critical",
    detailPayload: `{
  "action": "REMOTE_REBOOT",
  "triggerSource": "offline_alarm_timeout_15m",
  "commandPayload": "sys_reboot --force",
  "gatewayResponse": {
    "code": 200,
    "status": "COMMAND_RECEIVED"
  }
}`
  }
];

export default function AgentActivityLogPage() {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  // Filters application
  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.user.toLowerCase().includes(search.toLowerCase()) ||
                          log.event.toLowerCase().includes(search.toLowerCase()) ||
                          log.target.toLowerCase().includes(search.toLowerCase());
    
    const matchesUser = userFilter === "All" || log.user.toLowerCase().includes(userFilter.toLowerCase());
    
    const matchesType =
      typeFilter === "All" ||
      (typeFilter === "Upload" && log.event.toLowerCase().includes("upload")) ||
      (typeFilter === "Publish" && log.event.toLowerCase().includes("publish")) ||
      (typeFilter === "Reboot" && log.event.toLowerCase().includes("reboot")) ||
      (typeFilter === "Sensor" && log.event.toLowerCase().includes("sensor"));

    return matchesSearch && matchesUser && matchesType;
  });

  const handleExportCSV = () => {
    alert("Exporting operations audit log feed to CSV. Your file download will begin shortly.");
  };

  const handleClearLogs = () => {
    if (confirm("Are you sure you want to clear all operational audit logs? This action is irreversible.")) {
      setLogs([]);
    }
  };

  return (
    <div className="py-6 px-8 h-full flex flex-col min-h-0 overflow-hidden font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E6EC] dark:border-[#283243] pb-5 shrink-0">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-55 tracking-tight flex items-center gap-2">
            Operations Audit Log Feed
          </h1>
          <p className="text-xs text-[#657080] dark:text-[#9AA7B7]">
            Chronological audit log tracking uploader uploads, playlist updates, reboot triggers, and edge sensor analytics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E2E6EC] dark:border-[#283243] bg-white dark:bg-[#111722] hover:bg-[#F6F7F9] dark:hover:bg-zinc-800 rounded-lg text-xs font-bold text-zinc-650 dark:text-zinc-300 transition-colors shadow-2xs cursor-pointer animate-pulse"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Log</span>
          </button>
          
          <button
            onClick={handleClearLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-650 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            <Trash className="w-3.5 h-3.5" />
            <span>Clear Logs Archive</span>
          </button>
        </div>
      </div>

      {/* Query Filters */}
      <div className="p-4 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3 my-6 shrink-0">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search events, targets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-[#18202B] dark:text-[#F2F5F8] placeholder-zinc-450 focus:outline-none"
          />
        </div>

        {/* User filter */}
        <div className="relative">
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="w-full pl-8 pr-8 py-1.5 border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-[#F6F7F9] dark:bg-[#171F2C]/50 text-xs text-zinc-705 dark:text-zinc-300 font-bold focus:outline-none appearance-none cursor-pointer"
          >
            <option value="All">All Operators</option>
            <option value="Aarav">Aarav Mehta</option>
            <option value="Sneha">Sneha Iyer</option>
            <option value="Rohan">Rohan Das</option>
            <option value="System">System Engine</option>
          </select>
          <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
        </div>

        {/* Event types filter */}
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full pl-8 pr-8 py-1.5 border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-[#F6F7F9] dark:bg-[#171F2C]/50 text-xs text-zinc-705 dark:text-zinc-300 font-bold focus:outline-none appearance-none cursor-pointer"
          >
            <option value="All">All Action Categories</option>
            <option value="Upload">Asset Uploads</option>
            <option value="Publish">Playlist Releases</option>
            <option value="Reboot">Device Reboots</option>
            <option value="Sensor">Sensor Triggers</option>
          </select>
          <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
        </div>
      </div>

      {/* Timeline logs feed */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <ActivityFeed logs={filteredLogs} />
      </div>

    </div>
  );
}
