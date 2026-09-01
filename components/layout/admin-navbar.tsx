"use client";

import React from "react";
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
  const themeButtonClass = (active: boolean) =>
    `cursor-pointer rounded-md p-1.5 transition-colors ${
      active ? "bg-app-surface text-app-text shadow-xs" : "text-app-muted hover:text-app-text"
    }`;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-app-border bg-app-surface px-4 font-sans sm:px-6">
      {/* Left side: Page Title & Search */}
      <div className="flex items-center gap-6 flex-1 max-w-2xl">
        <div className="flex shrink-0 items-center gap-2.5 text-app-text">
          <Icon className="h-5 w-5 text-app-muted" />
          <span className="font-heading text-h6 font-semibold tracking-headline">{activeMetadata.title}</span>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-muted" />
          <input
            type="text"
            placeholder="Search tenants, devices, invoices…"
            className="w-full rounded-lg border border-app-border bg-app-surface-alt py-1.5 pl-9 pr-4 text-body text-app-text placeholder-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent-text"
          />
        </div>
      </div>

      {/* Right side: Actions & User */}
      <div className="flex items-center gap-4">
        {/* Date Selector */}
        <button className="flex cursor-pointer items-center gap-2 rounded-lg border border-app-border bg-app-surface px-3 py-1.5 text-body font-semibold text-app-text transition-colors hover:bg-app-surface-alt">
          <Calendar className="w-4 h-4 text-zinc-500" />
          <span>1–30 June 2026</span>
          <ChevronDown className="w-4 h-4 text-zinc-400" />
        </button>

        {/* Notification Bell */}
        <button className="relative cursor-pointer rounded-lg border border-app-border p-2 text-app-muted transition-colors hover:bg-app-surface-alt hover:text-app-text" aria-label="Notifications">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-app-surface bg-app-danger px-1 text-caption font-semibold text-app-danger-on">
            3
          </span>
        </button>

        {/* Theme Toggles */}
        <div className="flex items-center gap-0.5 rounded-lg border border-app-border bg-app-surface-alt p-0.5">
          <button
            onClick={() => setTheme("light")}
            title="Light Mode"
            className={themeButtonClass(theme === "light")}
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTheme("dark")}
            title="Dark Mode"
            className={themeButtonClass(theme === "dark")}
          >
            <Moon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTheme("system")}
            title="System Mode"
            className={themeButtonClass(theme === "system")}
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>

        {/* User Initial Avatar */}
        <div className="flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full bg-app-accent text-caption font-semibold text-app-accent-on ring-2 ring-app-surface">
          PS
        </div>
      </div>
    </header>
  );
}
