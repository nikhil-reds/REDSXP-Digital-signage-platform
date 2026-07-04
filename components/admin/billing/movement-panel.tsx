"use client";

import React from "react";
import { ArrowUp, ArrowDown, Plus, Minus } from "lucide-react";

export default function SubscriptionMovementPanel() {
  const items = [
    {
      name: "Upgrades",
      value: "8",
      icon: ArrowUp,
      colorClass: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100/50 dark:border-emerald-900/20"
    },
    {
      name: "Downgrades",
      value: "2",
      icon: ArrowDown,
      colorClass: "text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-100/50 dark:border-amber-900/20"
    },
    {
      name: "New",
      value: "14",
      icon: Plus,
      colorClass: "text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 border-zinc-200/50 dark:border-zinc-700/30"
    },
    {
      name: "Churned",
      value: "3",
      icon: Minus,
      colorClass: "text-red-650 bg-red-50 dark:bg-red-950/20 border-red-100/50 dark:border-red-900/20"
    }
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-xl shadow-xs">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Subscription Movement</h2>
        <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-semibold uppercase">June 2026</span>
      </div>

      <div className="grid grid-cols-2 gap-3.5 text-xs">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className={`p-3 border rounded-lg flex flex-col justify-between h-20 ${item.colorClass}`}
            >
              <div className="flex items-center gap-1.5 font-semibold text-zinc-500 dark:text-zinc-400">
                <div className="p-0.5 rounded-full border border-current shrink-0">
                  <Icon className="w-2.5 h-2.5" />
                </div>
                <span className="text-[10px] uppercase tracking-wider">{item.name}</span>
              </div>
              <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-none mt-2">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
