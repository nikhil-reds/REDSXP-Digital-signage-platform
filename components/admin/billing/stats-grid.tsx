"use client";

import React from "react";
import {
  TrendingUp,
  Calendar,
  Receipt,
  User,
  DollarSign,
  TrendingDown,
  Percent,
  AlertTriangle,
  XOctagon
} from "lucide-react";
import { StatGrid, StatTile } from "@/components/ui";

export default function BillingStatsGrid() {
  const stats = [
    {
      name: "MRR",
      value: "₹18,42,600",
      change: "+12.8%",
      changeType: "up",
      icon: TrendingUp,
      tone: "accent" as const
    },
    {
      name: "ARR",
      value: "₹2,21,11,200",
      change: "Annualized",
      changeType: "neutral",
      icon: Calendar,
      tone: "neutral" as const
    },
    {
      name: "Net Revenue",
      value: "₹17,28,040",
      change: "Jun 2026",
      changeType: "neutral",
      icon: Receipt,
      tone: "neutral" as const
    },
    {
      name: "ARPU",
      value: "₹9,905",
      change: "Per tenant",
      changeType: "neutral",
      icon: User,
      tone: "neutral" as const
    },
    {
      name: "LTV",
      value: "₹1,65,083",
      change: "Lifetime value",
      changeType: "neutral",
      icon: DollarSign,
      tone: "neutral" as const
    },
    {
      name: "Churn",
      value: "1.8%",
      change: "-0.4 pp",
      changeType: "up", // green drop is good
      icon: TrendingDown,
      tone: "accent" as const
    },
    {
      name: "Trial Conv.",
      value: "68.4%",
      change: "Conversion",
      changeType: "neutral",
      icon: Percent,
      tone: "neutral" as const
    },
    {
      name: "Outstanding",
      value: "₹1,26,470",
      change: "At risk",
      changeType: "danger",
      icon: AlertTriangle,
      tone: "danger" as const
    },
    {
      name: "Failed Pmts",
      value: "7",
      change: "Tenants",
      changeType: "danger",
      icon: XOctagon,
      tone: "danger" as const
    }
  ];

  return (
    <StatGrid columns={3}>
      {stats.map((stat) => (
        <StatTile key={stat.name} label={stat.name} value={stat.value} icon={stat.icon} tone={stat.tone}>
          <span className={stat.changeType === "danger" ? "text-caption font-semibold text-app-danger-text" : stat.changeType === "up" ? "text-caption font-semibold text-app-accent-text" : "text-caption text-app-muted"}>
            {stat.change}
          </span>
        </StatTile>
      ))}
    </StatGrid>
  );
}
