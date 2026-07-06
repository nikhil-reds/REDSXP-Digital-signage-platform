"use client";

import React from "react";
import { User, CreditCard, RefreshCw, AlertCircle, HardDrive } from "lucide-react";

const activities = [
  {
    id: 1,
    actor: "Priya Sharma",
    action: "impersonated",
    target: "Metro Brands",
    suffix: "for support",
    time: "16:12 IST",
    icon: User,
    iconBg: "bg-zinc-50 dark:bg-zinc-800 text-zinc-500"
  },
  {
    id: 2,
    actor: "Arjun Mehta",
    action: "applied a",
    target: "₹12,000 credit",
    suffix: "to Café Coffee Day",
    time: "15:48 IST",
    icon: CreditCard,
    iconBg: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-550 dark:text-emerald-400"
  },
  {
    id: 3,
    actor: "Neha Rao",
    action: "changed Business plan storage from",
    target: "200 GB to 250 GB",
    suffix: "",
    time: "14:36 IST",
    icon: HardDrive,
    iconBg: "bg-zinc-50 dark:bg-zinc-800 text-zinc-500"
  },
  {
    id: 4,
    actor: "System",
    action: "retried",
    target: "Razorpay webhook",
    suffix: "— failed",
    time: "14:04 IST",
    icon: RefreshCw,
    iconBg: "bg-red-50 dark:bg-red-950/20 text-red-500"
  },
  {
    id: 5,
    actor: "Vikram Singh",
    action: "suspended",
    target: "Urban Ladder",
    suffix: "after 3 failed payments",
    time: "11:22 IST",
    icon: AlertCircle,
    iconBg: "bg-red-50 dark:bg-red-950/20 text-red-500"
  }
];

export default function ActivityFeed() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg overflow-hidden shadow-xs">
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-baseline gap-2">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Recent Admin Activity</h2>
        <span className="text-[10px] text-zinc-400 dark:text-zinc-500">All times in IST</span>
      </div>

      <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div
              key={activity.id}
              className="p-3.5 flex items-center justify-between gap-4 hover:bg-zinc-50/20 dark:hover:bg-zinc-900/30 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-1.5 rounded-lg flex items-center justify-center shrink-0 ${activity.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-350 leading-relaxed truncate">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {activity.actor}{" "}
                  </span>
                  <span>{activity.action} </span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {activity.target}
                  </span>
                  {activity.suffix && <span> {activity.suffix}</span>}
                </p>
              </div>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium shrink-0">
                {activity.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
