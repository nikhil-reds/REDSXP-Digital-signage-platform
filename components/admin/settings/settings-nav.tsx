"use client";

import React from "react";
import { Card } from "@/components/ui";
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

/** Each navigation choice has a real destination in the current settings form. */
export const SETTINGS_SECTION_BY_TAB: Record<string, string> = {
  General: "platform-identity",
  Branding: "platform-identity",
  "Authentication & SSO": "platform-identity",
  "Billing & Payments": "trial-onboarding",
  "Email & Notifications": "trial-onboarding",
  "Storage & CDN": "tenant-defaults",
  "API & Webhooks": "tenant-defaults",
  "Security & Compliance": "maintenance-mode",
  "Maintenance Mode": "maintenance-mode",
};

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
    <Card size="panel" padded className="h-fit w-64 shrink-0 select-none space-y-1 overflow-hidden !p-3 lg:sticky lg:top-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.name === activeTab;

        return (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-body font-semibold transition-colors cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent-text ${
              isActive
                ? "bg-app-accent-surface text-app-text"
                : "text-app-muted hover:bg-app-surface-alt hover:text-app-text"
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${
              isActive ? "text-app-accent-text" : "text-app-muted"
            }`} />
            <span className="truncate">{tab.name}</span>
          </button>
        );
      })}
    </Card>
  );
}
