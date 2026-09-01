"use client";

import React from "react";
import { ArrowUp, ArrowDown, Plus, Minus } from "lucide-react";

export default function SubscriptionMovementPanel() {
  const items = [
    {
      name: "Upgrades",
      value: "8",
      icon: ArrowUp,
      colorClass: "text-app-accent-text bg-app-accent-surface border-app-accent-border"
    },
    {
      name: "Downgrades",
      value: "2",
      icon: ArrowDown,
      colorClass: "text-app-warning-text bg-app-warning-surface border-app-border"
    },
    {
      name: "New",
      value: "14",
      icon: Plus,
      colorClass: "text-app-text bg-app-surface-alt border-app-border"
    },
    {
      name: "Churned",
      value: "3",
      icon: Minus,
      colorClass: "text-app-danger-text bg-app-danger-surface border-app-danger-border"
    }
  ];

  return (
    <div className="rounded-xl border border-app-border bg-app-surface p-5 shadow-xs">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-body font-bold text-app-text">Subscription Movement</h2>
        <span className="text-[10px] font-semibold uppercase text-app-muted">June 2026</span>
      </div>

      <div className="grid grid-cols-2 gap-3.5 text-xs">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className={`p-3 border rounded-lg flex flex-col justify-between h-20 ${item.colorClass}`}
            >
              <div className="flex items-center gap-1.5 font-semibold">
                <div className="p-0.5 rounded-full border border-current shrink-0">
                  <Icon className="w-2.5 h-2.5" />
                </div>
                <span className="text-[10px] uppercase tracking-wider">{item.name}</span>
              </div>
              <span className="mt-2 text-2xl font-bold leading-none tracking-tight text-app-text">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
