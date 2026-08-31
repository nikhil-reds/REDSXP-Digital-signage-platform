"use client";

import React from "react";
import NextImage from "next/image";
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
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-app-border bg-app-surface font-sans">
      {/* Brand Header */}
      <div className="flex items-center gap-3 border-b border-app-border p-4">
        <NextImage
          src="/reds-xos-logo.png"
          alt="REDS XOS Logo"
          width={132}
          height={28}
          className="h-7 w-auto object-contain"
          priority
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
                  ? "bg-app-accent-surface text-app-text font-semibold"
                  : "text-app-muted hover:text-app-text hover:bg-app-surface-alt"
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-md bg-app-accent-text" />
              )}
              
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                  isActive
                    ? "text-app-accent-text"
                    : "text-app-muted group-hover:text-app-text"
                }`}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-app-border bg-app-surface-alt p-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-app-accent text-caption font-semibold text-app-accent-on ring-2 ring-app-surface">
            PS
          </div>
          <div className="flex flex-col min-w-0">
            <span className="mb-1 truncate text-body font-semibold leading-none text-app-text">
              Priya Sharma
            </span>
            <span className="truncate text-caption leading-none text-app-muted">
              Super Admin
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          title="Sign out"
          className="shrink-0 rounded-lg p-1.5 text-app-muted transition-colors hover:bg-app-surface hover:text-app-danger-text"
          aria-label="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
