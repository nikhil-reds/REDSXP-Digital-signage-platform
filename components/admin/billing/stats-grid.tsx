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

export default function BillingStatsGrid() {
  const stats = [
    {
      name: "MRR",
      value: "₹18,42,600",
      change: "+12.8%",
      changeType: "up",
      icon: TrendingUp,
      iconColor: "text-emerald-500"
    },
    {
      name: "ARR",
      value: "₹2,21,11,200",
      change: "Annualized",
      changeType: "neutral",
      icon: Calendar,
      iconColor: "text-zinc-400 dark:text-zinc-500"
    },
    {
      name: "Net Revenue",
      value: "₹17,28,040",
      change: "Jun 2026",
      changeType: "neutral",
      icon: Receipt,
      iconColor: "text-zinc-400 dark:text-zinc-500"
    },
    {
      name: "ARPU",
      value: "₹9,905",
      change: "Per tenant",
      changeType: "neutral",
      icon: User,
      iconColor: "text-zinc-400 dark:text-zinc-500"
    },
    {
      name: "LTV",
      value: "₹1,65,083",
      change: "Lifetime value",
      changeType: "neutral",
      icon: DollarSign,
      iconColor: "text-zinc-400 dark:text-zinc-500"
    },
    {
      name: "Churn",
      value: "1.8%",
      change: "-0.4 pp",
      changeType: "up", // green drop is good
      icon: TrendingDown,
      iconColor: "text-emerald-500"
    },
    {
      name: "Trial Conv.",
      value: "68.4%",
      change: "Conversion",
      changeType: "neutral",
      icon: Percent,
      iconColor: "text-zinc-400 dark:text-zinc-500"
    },
    {
      name: "Outstanding",
      value: "₹1,26,470",
      change: "At risk",
      changeType: "danger",
      icon: AlertTriangle,
      iconColor: "text-red-500"
    },
    {
      name: "Failed Pmts",
      value: "7",
      change: "Tenants",
      changeType: "danger",
      icon: XOctagon,
      iconColor: "text-red-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isDanger = stat.changeType === "danger";

        return (
          <div
            key={stat.name}
            className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-4 rounded-lg shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                {stat.name}
              </span>
              <Icon className={`w-4 h-4 ${stat.iconColor}`} />
            </div>

            <div className="mt-3.5">
              <span
                className={`text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 ${
                  isDanger ? "text-red-650 dark:text-red-500" : ""
                }`}
              >
                {stat.value}
              </span>

              <div className="mt-1 flex items-center">
                {stat.changeType === "up" && (
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-500 flex items-center">
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
