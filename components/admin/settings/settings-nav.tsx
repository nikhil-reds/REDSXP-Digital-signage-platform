"use client";

import React from "react";
import {
  Sliders,
  Palette,
  Lock,
  CreditCard,
  Mail,
  HardDrive,
  Code,
  ShieldCheck,
  Ban
} from "lucide-react";

interface SettingsNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function SettingsNav({ activeTab, setActiveTab }: SettingsNavProps) {
  const tabs = [
    { name: "General", icon: Sliders },
    { name: "Branding", icon: Palette },
    { name: "Authentication & SSO", icon: Lock },
    { name: "Billing & Payments", icon: CreditCard },
    { name: "Email & Notifications", icon: Mail },
    { name: "Storage & CDN", icon: HardDrive },
    { name: "API & Webhooks", icon: Code },
    { name: "Security & Compliance", icon: ShieldCheck },
    { name: "Maintenance Mode", icon: Ban }
  ];

  return (
    <div className="w-64 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl overflow-hidden shadow-xs p-3 space-y-1 h-fit shrink-0 select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.name === activeTab;

        return (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
              isActive
                ? "bg-blue-50/70 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-bold"
                : "text-zinc-550 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-850/50"
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${
              isActive ? "text-blue-600 dark:text-blue-400" : "text-zinc-400"
            }`} />
            <span className="truncate">{tab.name}</span>
          </button>
        );
      })}
    </div>
  );
}
