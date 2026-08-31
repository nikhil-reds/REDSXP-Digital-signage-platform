"use client";

import React from "react";
import { Users, Clock, Eye, Play, FileText, Zap } from "lucide-react";
import { StatGrid, StatTile } from "@/components/ui";

export default function AnalyticsStatsGrid() {
  const stats = [
    {
      name: "Total Sessions",
      value: "1,24,830",
      change: "+8.4% vs prev",
      changeType: "up",
      icon: Users
    },
    {
      name: "Avg Session Duration",
      value: "4m 32s",
      change: "Per session",
      changeType: "neutral",
      icon: Clock
    },
    {
      name: "Screen Impressions",
      value: "3,21,40,000",
      change: "June 2026",
      changeType: "neutral",
      icon: Eye
    },
    {
      name: "Content Plays",
      value: "87,64,200",
      change: "June 2026",
      changeType: "neutral",
      icon: Play
    },
    {
      name: "PoP Reports",
      value: "14,320",
      change: "Generated",
      changeType: "neutral",
      icon: FileText
    },
    {
      name: "API Calls (30d)",
      value: "2,18,40,000",
      change: "Total requests",
      changeType: "neutral",
      icon: Zap
    }
  ];

  return (
    <StatGrid columns={3} className="xl:grid-cols-6">
      {stats.map((stat) => (
        <StatTile key={stat.name} label={stat.name} value={stat.value} icon={stat.icon} tone={stat.changeType === "up" ? "accent" : "neutral"}>
          <span className={stat.changeType === "up" ? "text-caption font-semibold text-app-accent-text" : "text-caption text-app-muted"}>
            {stat.changeType === "up" ? "↗ " : ""}{stat.change}
          </span>
        </StatTile>
      ))}
    </StatGrid>
  );
}
