"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/providers/theme-provider";
import {
  Search,
  Calendar,
  ChevronDown,
  Bell,
  Sun,
  Moon,
  Monitor,
  LayoutDashboard,
  Globe,
  CreditCard,
  LineChart,
  SlidersHorizontal,
  Megaphone,
  Mail,
  FileText,
  Activity,
  Settings,
  Users
} from "lucide-react";

const routeMetadata: Record<
  string,
  { title: string; icon: React.ComponentType<{ className?: string }> }
> = {
  "/admin": { title: "Overview", icon: LayoutDashboard },
  "/admin/tenants": { title: "Tenants", icon: Globe },
  "/admin/billing": { title: "Billing & Revenue", icon: CreditCard },
  "/admin/analytics": { title: "Platform Analytics", icon: LineChart },
  "/admin/devices": { title: "Devices", icon: Monitor },
  "/admin/plans": { title: "Plans & Features", icon: SlidersHorizontal },
  "/admin/announcements": { title: "Announcements", icon: Megaphone },
  "/admin/emails": { title: "Email Templates", icon: Mail },
  "/admin/audit-logs": { title: "Audit Logs", icon: FileText },
  "/admin/health": { title: "System Health", icon: Activity },
  "/admin/settings": { title: "Platform Settings", icon: Settings },
  "/admin/users": { title: "Admin Users", icon: Users },
};

export default function AdminNavbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Get active metadata based on current pathname
  const activeMetadata = Object.entries(routeMetadata).find(([route]) =>
    route === "/admin" ? pathname === "/admin" : pathname?.startsWith(route)
  )?.[1] || { title: "Overview", icon: LayoutDashboard };

  const Icon = activeMetadata.icon;

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between px-2 shrink-0 font-sans">
      {/* Left side: Page Title & Search */}
      <div className="flex items-center gap-6 flex-1 max-w-2xl">
        <div className="flex items-center gap-2.5 text-zinc-900 dark:text-zinc-50 shrink-0">
          <Icon className="w-5 h-5 text-zinc-500" />
          <span className="font-semibold text-base">{activeMetadata.title}</span>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search tenants, devices, invoices..."
            className="w-full pl-9 pr-4 py-1.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-50 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right side: Actions & User */}
      <div className="flex items-center gap-4">
        {/* Date Selector */}
        <button className="flex items-center gap-2 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors shadow-sm cursor-pointer">
          <Calendar className="w-4 h-4 text-zinc-500" />
          <span>1–30 June 2026</span>
          <ChevronDown className="w-4 h-4 text-zinc-400" />
        </button>

        {/* Notification Bell */}
        <button className="relative p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-colors shadow-sm cursor-pointer">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] font-bold text-white rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-white dark:border-zinc-950">
            3
          </span>
        </button>

        {/* Theme Toggles */}
        <div className="flex items-center gap-0.5 p-0.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/50 shadow-sm">
          <button
            onClick={() => setTheme("light")}
            title="Light Mode"
            className={`p-1.5 rounded-md transition-all duration-200 cursor-pointer ${
              theme === "light"
                ? "bg-white dark:bg-zinc-800 shadow-xs text-zinc-900 dark:text-zinc-50"
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-350"
            }`}
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTheme("dark")}
            title="Dark Mode"
            className={`p-1.5 rounded-md transition-all duration-200 cursor-pointer ${
              theme === "dark"
                ? "bg-white dark:bg-zinc-800 shadow-xs text-zinc-900 dark:text-zinc-50"
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-350"
            }`}
          >
            <Moon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTheme("system")}
            title="System Mode"
            className={`p-1.5 rounded-md transition-all duration-200 cursor-pointer ${
              theme === "system"
                ? "bg-white dark:bg-zinc-800 shadow-xs text-zinc-900 dark:text-zinc-50"
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-350"
            }`}
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>

        {/* User Initial Avatar */}
        <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold flex items-center justify-center ring-2 ring-white dark:ring-zinc-950 shadow-sm shrink-0 select-none">
          PS
        </div>
      </div>
    </header>
  );
}
