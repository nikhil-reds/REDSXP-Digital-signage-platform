"use client";

import React, { useEffect, useState } from "react";
import NextImage from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Monitor,
  Layers,
  Image,
  PlaySquare,
  Calendar,
  Zap,
  AlertTriangle,
  LineChart,
  FileText,
  History,
  LifeBuoy,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Settings
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navItems: NavItem[] = [
  { name: "Overview", href: "/agent", icon: LayoutDashboard },
  { name: "Screens", href: "/agent/screens", icon: Monitor },
  { name: "Screen Groups", href: "/agent/screen-groups", icon: Layers },
  { name: "Media Library", href: "/agent/media", icon: Image },
  { name: "Playlists", href: "/agent/playlists", icon: PlaySquare },
  { name: "Schedules", href: "/agent/schedules", icon: Calendar },
  { name: "Sensor Rules", href: "/agent/sensor-rules", icon: Zap },
  { name: "Alerts", href: "/agent/alerts", icon: AlertTriangle, badge: 6 },
  { name: "Analytics", href: "/agent/analytics", icon: LineChart },
  { name: "Reports", href: "/agent/reports", icon: FileText },
  { name: "Activity Log", href: "/agent/activity-log", icon: History },
  { name: "Help & Support", href: "/agent/support", icon: LifeBuoy },
];

interface AgentSidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function AgentSidebar({
  isMobileOpen = false,
  onMobileClose,
}: AgentSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isVisuallyCollapsed = isCollapsed && !isMobileOpen;

  useEffect(() => {
    onMobileClose?.();
  }, [pathname, onMobileClose]);

  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (response.ok) {
      router.replace("/login");
      router.refresh();
    }
  };

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-reds-black/55 md:hidden"
          onClick={onMobileClose}
        />
      )}
      <aside
        aria-label="Agent navigation"
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-app-border bg-app-surface font-sans transition-transform duration-200 md:relative md:z-auto md:visible md:translate-x-0 md:transition-[width] md:duration-300 ${
          isMobileOpen ? "visible translate-x-0" : "invisible -translate-x-full"
        } ${isCollapsed ? "md:w-20" : "md:w-64"}`}
      >
      {/* Brand Header */}
      <div className="p-4 border-b border-app-border flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          {isVisuallyCollapsed ? (
            <div className="w-6 h-6 flex items-center justify-center shrink-0">
              <NextImage
                src="/reds-xos-logo.png"
                alt="REDS XOS Logo"
                width={24}
                height={24}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          ) : (
            <NextImage
              src="/reds-xos-logo.png"
              alt="REDS XOS Logo"
              width={132}
              height={28}
              className="h-7 w-auto object-contain"
              priority
            />
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden rounded-md border border-app-border p-1 text-app-muted transition-all hover:bg-app-surface-alt hover:text-app-text md:inline-flex"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
        <button
          type="button"
          onClick={onMobileClose}
          className="inline-flex rounded-md border border-app-border p-1.5 text-app-muted transition-colors hover:bg-app-surface-alt hover:text-app-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent-text md:hidden"
          aria-label="Close navigation"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          // Simple route matching: exact check for root, or startsWith for subroutes (avoid false positives with /agent/something matching /agent)
          const isActive =
            item.href === "/agent"
              ? pathname === "/agent"
              : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              title={isVisuallyCollapsed ? item.name : undefined}
              // Green is a surface and a bar here, never the label colour:
              // #0BDA51 on off-white is 1.74:1. The active label stays
              // --app-text (13.7:1 on Green 10 in light, 14.9:1 in dark).
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-body transition-all duration-200 relative group ${
                isActive
                  ? "bg-app-accent-surface text-app-text font-semibold"
                  : "text-app-muted hover:text-app-text hover:bg-app-surface-alt"
              }`}
            >
              {/* Active Indicator Bar — accent-text, not accent: Green 60 on a
                  Green 10 row is 1.78:1, so the bar would vanish in light mode.
                  Green 80 gives 5.24:1 there and stays Green 60 in dark. */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-app-accent-text rounded-r-md" />
              )}

              <Icon
                className={`w-[18px] h-[18px] shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                  isActive
                    ? "text-app-accent-text"
                    : "text-app-muted group-hover:text-app-text"
                }`}
              />

              {!isVisuallyCollapsed && (
                <span className="truncate flex-1">{item.name}</span>
              )}

              {/* Alert Badge — functional red, reserved for system feedback */}
              {!isVisuallyCollapsed && item.badge && (
                <span className="text-caption font-semibold bg-app-danger text-app-danger-on px-1.5 py-0.5 rounded-full shrink-0 leading-none">
                  {item.badge}
                </span>
              )}

              {isVisuallyCollapsed && item.badge && (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-app-danger" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-app-border bg-app-surface-alt flex flex-col gap-3 mt-auto">
        <div className={`flex items-center gap-3 min-w-0 ${isVisuallyCollapsed ? "justify-center" : "justify-between"}`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-app-accent text-app-accent-on text-caption font-semibold flex items-center justify-center ring-2 ring-app-surface shadow-sm shrink-0">
              AM
            </div>
            {!isVisuallyCollapsed && (
              <div className="flex flex-col min-w-0 gap-1">
                <span className="text-body font-semibold text-app-text truncate leading-none">
                  Aarav Mehta
                </span>
                <span className="text-caption text-app-muted truncate leading-none">
                  Operations Agent
                </span>
              </div>
            )}
          </div>

          {!isVisuallyCollapsed && (
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                title="Profile Settings"
                className="p-1 rounded-md text-app-muted hover:text-app-text hover:bg-app-surface-alt cursor-pointer transition-all duration-200"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-1 rounded-md text-app-muted hover:text-app-danger-text hover:bg-app-danger-surface cursor-pointer transition-all duration-200"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Region Information */}
        {!isVisuallyCollapsed && (
          <div className="text-caption font-semibold text-app-muted border-t border-app-border pt-2 flex justify-between items-center gap-2">
            <span className="truncate">Bengaluru Region</span>
            <span className="bg-app-accent-surface text-app-accent-text px-1.5 py-0.5 rounded-sm font-semibold uppercase tracking-headline shrink-0 leading-none">
              CCD-BLR
            </span>
          </div>
        )}
      </div>
      </aside>
    </>
  );
}
