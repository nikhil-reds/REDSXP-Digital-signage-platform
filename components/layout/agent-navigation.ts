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
  UserRound,
  ShieldCheck
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const navItems: NavItem[] = [
  { name: "Overview", href: "/agent", icon: LayoutDashboard },
  { name: "Screens", href: "/agent/screens", icon: Monitor },
  { name: "Screen Groups", href: "/agent/screen-groups", icon: Layers },
  { name: "Media Library", href: "/agent/media", icon: Image },
  { name: "Playlists", href: "/agent/playlists", icon: PlaySquare },
  { name: "Schedules", href: "/agent/schedules", icon: Calendar },
  { name: "Sensor Rules", href: "/agent/sensor-rules", icon: Zap },
  { name: "Alerts", href: "/agent/alerts", icon: AlertTriangle },
  { name: "Analytics", href: "/agent/analytics", icon: LineChart },
  { name: "Reports", href: "/agent/reports", icon: FileText },
  { name: "Activity Log", href: "/agent/activity-log", icon: History },
  { name: "Workspace Users", href: "/agent/users", icon: UserRound },
  { name: "Roles & Permissions", href: "/agent/roles", icon: ShieldCheck },
  { name: "Help & Support", href: "/agent/support", icon: LifeBuoy },
];

