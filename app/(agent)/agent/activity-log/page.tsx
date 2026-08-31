"use client";

import React, { useState } from "react";
import { Download, Filter, Trash } from "lucide-react";
import ActivityFeed, { LogEntry } from "@/components/agent/activity-log/activity-feed";
import { Button, PageShell, SearchInput, Select, Toolbar } from "@/components/ui";

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
    <PageShell className="h-full flex flex-col min-h-0 overflow-hidden">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-app-border pb-5 shrink-0">
        <div>
          <h1 className="font-heading text-h5 font-semibold tracking-headline text-app-text">
            Operations Audit Log Feed
          </h1>
          <p className="text-body text-app-muted mt-1">
            Chronological audit log tracking uploader uploads, playlist updates, reboot triggers, and edge sensor analytics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button size="sm" icon={Download}
            onClick={handleExportCSV}
          >
            Export CSV log
          </Button>
          
          <Button size="sm" variant="danger" icon={Trash}
            onClick={handleClearLogs}
          >
            Clear log archive
          </Button>
        </div>
      </div>

      {/* Query Filters */}
      <Toolbar className="my-6 grid shrink-0 grid-cols-1 gap-3 rounded-xl border border-app-border bg-app-surface p-4 sm:grid-cols-3">
          <SearchInput
            placeholder="Search events or targets…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select icon={Filter}
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
          >
            <option value="All">All Operators</option>
            <option value="Aarav">Aarav Mehta</option>
            <option value="Sneha">Sneha Iyer</option>
            <option value="Rohan">Rohan Das</option>
            <option value="System">System Engine</option>
          </Select>
          <Select icon={Filter}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Action Categories</option>
            <option value="Upload">Asset Uploads</option>
            <option value="Publish">Playlist Releases</option>
            <option value="Reboot">Device Reboots</option>
            <option value="Sensor">Sensor Triggers</option>
          </Select>
      </Toolbar>

      {/* Timeline logs feed */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <ActivityFeed logs={filteredLogs} />
      </div>

    </PageShell>
  );
}
