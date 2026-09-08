"use client";

import React from "react";
import { Activity, Clock, Play, ShieldCheck } from "lucide-react";
import { StatGrid, StatTile } from "@/components/ui";

export default function AnalyticsStats() {
  return (
    <StatGrid columns={4}>
      <StatTile label="Total loop plays today" value="18,426" icon={Play} trend={{ direction: "up", value: "12.4% vs yesterday" }} />
      <StatTile label="Average uptime" value="98.7%" icon={Clock} tone="accent"><span className="text-caption text-app-muted">Target SLA: 98.5%</span></StatTile>
      <StatTile label="Sensor triggers" value="6,250" icon={Activity}><span className="text-caption text-app-muted">Motion probes most active</span></StatTile>
      <StatTile label="SLA compliance" value="99.4%" icon={ShieldCheck} tone="accent"><span className="text-caption text-app-muted">All outlets conforming</span></StatTile>
    </StatGrid>
  );
}
