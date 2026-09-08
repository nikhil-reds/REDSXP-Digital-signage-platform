"use client";

import React from "react";
import { Monitor, Play, ShieldAlert, Clock, Database } from "lucide-react";
import { ProgressBar, StatGrid, StatTile, StatusDot } from "@/components/ui";

export default function AgentStatsGrid() {
  return (
    <StatGrid columns={5}>
      <StatTile label="Assigned Screens" value="48" icon={Monitor}>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <StatusDot status="online" label="44 Online" />
          <StatusDot status="warning" label="2 Delayed" />
          <StatusDot status="error" label="2 Offline" />
        </div>
      </StatTile>

      {/* Only tiles whose subject genuinely is an error/warning take a tone */}
      <StatTile label="Active Alerts" value="6" icon={ShieldAlert} tone="danger">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <StatusDot status="error" label="1 Critical" />
          <StatusDot status="warning" label="2 High" />
          <StatusDot status="unknown" label="3 Medium/Low" />
        </div>
      </StatTile>

      <StatTile
        label="Loop Plays Today"
        value="18,426"
        icon={Play}
        trend={{ direction: "up", value: "+14.2% vs yesterday" }}
      />

      <StatTile label="Average Uptime" value="98.7%" icon={Clock}>
        <span className="text-caption text-app-muted">
          Past 30 days · SLA target 99.0%
        </span>
      </StatTile>

      <StatTile label="Storage Used" value="112 GB" icon={Database}>
        <ProgressBar value={112} max={250} label="44.8% of 250 GB limit" />
      </StatTile>
    </StatGrid>
  );
}
