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
  Layers,
  Image,
  PlaySquare,
  Zap,
  AlertTriangle,
  LineChart,
  FileText,
  History,
  LifeBuoy,
  Wifi,
  Sparkles
} from "lucide-react";

const routeMetadata: Record<
  string,
  { title: string; icon: React.ComponentType<{ className?: string }> }
> = {
  "/agent": { title: "Operations Overview", icon: LayoutDashboard },
  "/agent/screens": { title: "Screens & Players", icon: Monitor },
  "/agent/screen-groups": { title: "Screen Groups", icon: Layers },
  "/agent/media": { title: "Media Library", icon: Image },
  "/agent/playlists": { title: "Playlist Builder", icon: PlaySquare },
  "/agent/schedules": { title: "Content Schedules", icon: Calendar },
  "/agent/sensor-rules": { title: "Edge Sensor Rules", icon: Zap },
  "/agent/alerts": { title: "Alerts & Incidents", icon: AlertTriangle },
  "/agent/analytics": { title: "Analytics & KPIs", icon: LineChart },
  "/agent/reports": { title: "Reports Generator", icon: FileText },
  "/agent/activity-log": { title: "Activity Log", icon: History },
  "/agent/support": { title: "Help & Support", icon: LifeBuoy },
};

export default function AgentNavbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Get active metadata based on current pathname
  const activeMetadata = Object.entries(routeMetadata).find(([route]) =>
    route === "/agent" ? pathname === "/agent" : pathname?.startsWith(route)
  )?.[1] || { title: "Overview", icon: LayoutDashboard };

  const Icon = activeMetadata.icon;

  return (
    <header className="h-16 border-b border-[#E2E6EC] dark:border-[#283243] bg-white dark:bg-[#111722] flex items-center justify-between px-6 shrink-0 font-sans">
      {/* Left side: Page Title & Search */}
      <div className="flex items-center gap-6 flex-1 max-w-2xl">
        <div className="flex items-center gap-2.5 text-[#18202B] dark:text-[#F2F5F8] shrink-0">
          <Icon className="w-4.5 h-4.5 text-[#657080] dark:text-[#9AA7B7]" />
          <span className="font-semibold text-sm tracking-tight">{activeMetadata.title}</span>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#657080] dark:text-[#9AA7B7]" />
          <input
            type="text"
            placeholder="Search screens, groups, playlists, media, alerts..."
            className="w-full pl-9 pr-4 py-1.5 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-[#18202B] dark:text-[#F2F5F8] placeholder-[#657080]/70 dark:placeholder-[#9AA7B7]/50 focus:outline-none focus:ring-1 focus:ring-[#2859D9] dark:focus:ring-[#6F96FF] transition-all duration-200"
          />
        </div>
      </div>

      {/* Right side: Actions & Status */}
      <div className="flex items-center gap-4">
        {/* Live connection status */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 border border-[#E2E6EC] dark:border-[#283243] bg-[#F6F7F9] dark:bg-[#171F2C] rounded-md text-[10px] font-semibold text-[#657080] dark:text-[#9AA7B7]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Live Context</span>
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 border border-[#E2E6EC] dark:border-[#283243] rounded-lg hover:bg-[#F6F7F9] dark:hover:bg-[#171F2C] text-[#657080] dark:text-[#9AA7B7] transition-colors shadow-xs cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 bg-[#FF2244] text-[9px] font-bold text-white rounded-full w-4 h-4 flex items-center justify-center border-2 border-white dark:border-[#111722]">
            6
          </span>
        </button>

        {/* Theme Toggles */}
        <div className="flex items-center gap-0.5 p-0.5 border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-[#F6F7F9] dark:bg-[#171F2C]/50 shadow-xs">
          <button
            onClick={() => setTheme("light")}
            title="Light Mode"
            className={`p-1.5 rounded-md transition-all duration-200 cursor-pointer ${
              theme === "light"
                ? "bg-white dark:bg-zinc-800 shadow-xs text-zinc-900 dark:text-zinc-50"
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTheme("dark")}
            title="Dark Mode"
            className={`p-1.5 rounded-md transition-all duration-200 cursor-pointer ${
              theme === "dark"
                ? "bg-white dark:bg-zinc-800 shadow-xs text-zinc-900 dark:text-zinc-50"
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTheme("system")}
            title="System Mode"
            className={`p-1.5 rounded-md transition-all duration-200 cursor-pointer ${
              theme === "system"
                ? "bg-white dark:bg-zinc-800 shadow-xs text-zinc-900 dark:text-zinc-50"
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Region context select indicator */}
        <div className="text-[11px] text-[#657080] dark:text-[#9AA7B7] font-semibold border-l border-[#E2E6EC] dark:border-[#283243] pl-4 hidden md:flex items-center gap-1">
          <span>Bengaluru Region</span>
        </div>
      </div>
    </header>
  );
}
