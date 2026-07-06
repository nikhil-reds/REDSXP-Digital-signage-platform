"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Coffee,
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
  Sparkles
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

export default function AgentSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`relative border-r border-[#E2E6EC] dark:border-[#283243] bg-white dark:bg-[#111722] flex flex-col h-screen shrink-0 font-sans transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-[#E2E6EC] dark:border-[#283243] flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-[#2859D9] dark:bg-[#6F96FF] text-white rounded-xl p-1.5 flex items-center justify-center w-8 h-8 shadow-xs shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-[#18202B] dark:text-[#F2F5F8] text-base tracking-tight truncate">
              Rubenius Agent
            </span>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md text-[#657080] dark:text-[#9AA7B7] hover:bg-[#F6F7F9] dark:hover:bg-[#171F2C] border border-[#E2E6EC] dark:border-[#283243] transition-all cursor-pointer"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Tenant Context Box */}
      {!isCollapsed && (
        <div className="mx-3 mt-4 p-3 rounded-lg bg-[#F6F7F9] dark:bg-[#171F2C] border border-[#E2E6EC] dark:border-[#283243] flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-800 text-white flex items-center justify-center shrink-0">
            <Coffee className="w-4.5 h-4.5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-[#18202B] dark:text-[#F2F5F8] truncate leading-tight">
              Café Coffee Day
            </span>
            <span className="text-[10px] text-[#657080] dark:text-[#9AA7B7] uppercase tracking-wider font-semibold">
              Business Plan
            </span>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
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
              title={isCollapsed ? item.name : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 relative group ${
                isActive
                  ? "bg-[#F6F7F9] dark:bg-[#171F2C] text-[#2859D9] dark:text-[#6F96FF] font-bold"
                  : "text-[#657080] hover:text-[#18202B] dark:text-[#9AA7B7] dark:hover:text-[#F2F5F8] hover:bg-[#F6F7F9] dark:hover:bg-[#171F2C]/50"
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#2859D9] dark:bg-[#6F96FF] rounded-r-md" />
              )}
              
              <Icon
                className={`w-[18px] h-[18px] shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                  isActive
                    ? "text-[#2859D9] dark:text-[#6F96FF]"
                    : "text-[#657080] dark:text-[#9AA7B7] group-hover:text-[#18202B] dark:group-hover:text-[#F2F5F8]"
                }`}
              />
              
              {!isCollapsed && (
                <span className="truncate flex-1">{item.name}</span>
              )}

              {/* Alert Badge */}
              {!isCollapsed && item.badge && (
                <span className="text-[10px] font-bold bg-[#FF2244] text-white px-1.5 py-0.5 rounded-full shrink-0">
                  {item.badge}
                </span>
              )}
              
              {isCollapsed && item.badge && (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF2244]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-[#E2E6EC] dark:border-[#283243] bg-[#F6F7F9]/50 dark:bg-[#111722]/50 flex flex-col gap-3 mt-auto">
        <div className={`flex items-center gap-3 min-w-0 ${isCollapsed ? "justify-center" : "justify-between"}`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-orange-600 text-white text-xs font-bold flex items-center justify-center ring-2 ring-white dark:ring-[#111722] shadow-sm shrink-0">
              AM
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-[#18202B] dark:text-[#F2F5F8] truncate leading-none mb-1">
                  Aarav Mehta
                </span>
                <span className="text-[10px] text-[#657080] dark:text-[#9AA7B7] truncate leading-none">
                  Operations Agent
                </span>
              </div>
            )}
          </div>
          
          {!isCollapsed && (
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                title="Profile Settings"
                className="p-1 rounded-md text-[#657080] dark:text-[#9AA7B7] hover:text-[#18202B] dark:hover:text-[#F2F5F8] hover:bg-[#E2E6EC] dark:hover:bg-[#171F2C]"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              <button
                title="Sign out"
                className="p-1 rounded-md text-[#657080] dark:text-[#9AA7B7] hover:text-[#FF2244] hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Region Information */}
        {!isCollapsed && (
          <div className="text-[10px] font-semibold text-[#657080] dark:text-[#9AA7B7] border-t border-[#E2E6EC] dark:border-[#283243] pt-2 flex justify-between items-center">
            <span>Bengaluru Region</span>
            <span className="text-[9px] bg-[#2859D9]/10 text-[#2859D9] dark:bg-[#6F96FF]/10 dark:text-[#6F96FF] px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider">
              CCD-BLR
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
