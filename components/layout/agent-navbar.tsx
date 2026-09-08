"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/providers/theme-provider";
import {
  Search,
  Menu,
  Calendar,
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
  LifeBuoy
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

interface AgentNavbarProps {
  isMenuOpen?: boolean;
  onMenuClick?: () => void;
}

export default function AgentNavbar({
  isMenuOpen = false,
  onMenuClick,
}: AgentNavbarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Get active metadata based on current pathname
  const activeMetadata = Object.entries(routeMetadata).find(([route]) =>
    route === "/agent" ? pathname === "/agent" : pathname?.startsWith(route)
  )?.[1] || { title: "Overview", icon: LayoutDashboard };

  const Icon = activeMetadata.icon;

  const themeButtonClass = (isActive: boolean) =>
    `p-1.5 rounded-md transition-all duration-200 cursor-pointer ${
      isActive
        ? "bg-app-surface shadow-xs text-app-text"
        : "text-app-muted hover:text-app-text"
    }`;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-app-border bg-app-surface px-4 font-sans sm:px-6">
      {/* Left side: Page Title & Search */}
      <div className="flex min-w-0 max-w-2xl flex-1 items-center gap-3 sm:gap-6">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          aria-haspopup="true"
          aria-expanded={isMenuOpen}
          className="inline-flex rounded-lg border border-app-border p-2 text-app-muted transition-colors hover:bg-app-surface-alt hover:text-app-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent-text md:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2.5 text-app-text shrink-0">
          <Icon className="hidden h-4.5 w-4.5 text-app-muted sm:block" />
          {/* Sora is drawn tight — headlines take positive tracking, never tight */}
          <h1 className="font-heading font-semibold text-h6 tracking-headline truncate">
            {activeMetadata.title}
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
          <input
            type="text"
            placeholder="Search screens, groups, playlists, media, alerts…"
            className="w-full pl-9 pr-4 py-1.5 bg-app-surface-alt border border-app-border rounded-lg text-body text-app-text placeholder-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent-text transition-all duration-200"
          />
        </div>
      </div>

      {/* Right side: Actions & Status */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Live connection status — brand green, this is product state not an alert */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 border border-app-border bg-app-surface-alt rounded-md text-caption font-semibold text-app-muted">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-app-accent-text opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-app-accent-text" />
          </span>
          <span>Live Context</span>
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 border border-app-border rounded-lg hover:bg-app-surface-alt text-app-muted hover:text-app-text transition-colors shadow-xs cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-2 -right-2 bg-app-danger text-app-danger-on text-caption font-semibold rounded-full min-w-5 h-5 px-1 flex items-center justify-center border-2 border-app-surface leading-none">
            6
          </span>
        </button>

        {/* Theme Toggles */}
        <div className="flex items-center gap-0.5 p-0.5 border border-app-border rounded-lg bg-app-surface-alt shadow-xs">
          <button
            onClick={() => setTheme("light")}
            title="Light Mode"
            className={themeButtonClass(theme === "light")}
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTheme("dark")}
            title="Dark Mode"
            className={themeButtonClass(theme === "dark")}
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTheme("system")}
            title="System Mode"
            className={themeButtonClass(theme === "system")}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Region context select indicator */}
        <div className="text-caption text-app-muted font-semibold border-l border-app-border pl-4 hidden md:flex items-center gap-1">
          <span>Bengaluru Region</span>
        </div>
      </div>
    </header>
  );
}
