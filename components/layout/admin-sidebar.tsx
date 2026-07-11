"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  CreditCard,
  LineChart,
  Monitor,
  SlidersHorizontal,
  Megaphone,
  Mail,
  FileText,
  Activity,
  Settings,
  Users,
  LogOut
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Tenants", href: "/admin/tenants", icon: Globe },
  { name: "Billing & Revenue", href: "/admin/billing", icon: CreditCard },
  { name: "Platform Analytics", href: "/admin/analytics", icon: LineChart },
  { name: "Devices", href: "/admin/devices", icon: Monitor },
  { name: "Plans & Features", href: "/admin/plans", icon: SlidersHorizontal },
  { name: "Announcements", href: "/admin/announcements", icon: Megaphone },
  { name: "Email Templates", href: "/admin/emails", icon: Mail },
  { name: "Audit Logs", href: "/admin/audit-logs", icon: FileText },
  { name: "System Health", href: "/admin/health", icon: Activity },
  { name: "Platform Settings", href: "/admin/settings", icon: Settings },
  { name: "Admin Users", href: "/admin/users", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (response.ok) {
      router.replace("/login");
      router.refresh();
    }
  };

  return (
    <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col h-screen shrink-0 font-sans">
      {/* Brand Header */}
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-900 flex items-center gap-3">
        <img
          src="/reds-tag.svg"
          alt="REDS Logo"
          className="h-9 w-auto object-contain"
        />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {navItems.map((item) => {
          const Icon = item.icon;
          // Simple route matching: exact check for root, or startsWith for subroutes (avoid false positives with /admin/something matching /admin)
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 relative group ${
                isActive
                  ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 font-medium"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-zinc-900 dark:bg-zinc-50 rounded-r-md" />
              )}
              
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                  isActive
                    ? "text-zinc-900 dark:text-zinc-50"
                    : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                }`}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/50 flex items-center justify-between gap-3 mt-auto">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold flex items-center justify-center ring-2 ring-white dark:ring-zinc-950 shadow-sm shrink-0">
            PS
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate leading-none mb-1">
              Priya Sharma
            </span>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate leading-none">
              Super Admin
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          title="Sign out"
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-50 dark:hover:bg-zinc-900 transition-all duration-200 shrink-0"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
