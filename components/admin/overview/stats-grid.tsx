"use client";

import React from "react";
import {
  TrendingUp,
  Globe,
  Building2,
  Monitor,
  Wifi,
  UserMinus,
  AlertTriangle,
  Cloud
} from "lucide-react";

export default function StatsGrid() {
  const stats = [
    {
      name: "MRR",
      value: "₹18,42,600",
      change: "+ 12.8% vs prev",
      changeType: "up",
      icon: TrendingUp,
      iconColor: "text-zinc-400 dark:text-zinc-500"
    },
    {
      name: "ARR",
      value: "₹2,21,11,200",
      change: "Annual run rate",
      changeType: "neutral",
      icon: Globe,
      iconColor: "text-zinc-400 dark:text-zinc-500"
    },
    {
      name: "Active Tenants",
      value: "186",
      change: "+ 14 this month",
      changeType: "up",
      icon: Building2,
      iconColor: "text-zinc-400 dark:text-zinc-500"
    },
    {
      name: "Total Screens",
      value: "4,862",
      change: "Across all tenants",
      changeType: "neutral",
      icon: Monitor,
      iconColor: "text-zinc-400 dark:text-zinc-500"
    },
    {
      name: "Online Screens",
      value: "4,517",
      change: "92.9% online rate",
      changeType: "online",
      icon: Wifi,
      iconColor: "text-emerald-500"
    },
    {
      name: "Churn",
      value: "1.8%",
      change: "- 0.4pp",
      changeType: "up", // green, down in churn is good!
      icon: UserMinus,
      iconColor: "text-emerald-500"
    },
    {
      name: "Failed Payments",
      value: "7 tenants",
      change: "₹1,26,470 at risk",
      changeType: "danger",
      icon: AlertTriangle,
      iconColor: "text-red-500"
    },
    {
      name: "CDN Bandwidth Cost",
      value: "₹7,84,300",
      change: "126 TB transferred",
      changeType: "neutral",
      icon: Cloud,
      iconColor: "text-zinc-400 dark:text-zinc-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isMRR = stat.name === "MRR";

        return (
          <div
            key={stat.name}
            className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-4 rounded-lg shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                {stat.name}
              </span>
              <Icon className={`w-4.5 h-4.5 ${stat.iconColor}`} />
            </div>

            <div className="mt-3.5">
              <span className={`text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 ${stat.changeType === "danger" ? "text-red-600 dark:text-red-500" : ""}`}>
                {stat.value}
              </span>
              
              <div className="mt-1 flex items-center">
                {stat.changeType === "up" && (
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-500 flex items-center">
                    <span className="mr-0.5">↗</span> {stat.change}
                  </span>
                )}
                {stat.changeType === "online" && (
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    {stat.change}
                  </span>
                )}
                {stat.changeType === "danger" && (
                  <span className="text-[11px] font-semibold text-red-650 dark:text-red-400">
                    {stat.change}
                  </span>
                )}
                {stat.changeType === "neutral" && (
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    {stat.change}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
