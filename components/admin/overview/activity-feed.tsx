"use client";

import React from "react";
import { AlertCircle, CreditCard, HardDrive, RefreshCw, User } from "lucide-react";
import { Card, CardHeading } from "@/components/ui";

const activities = [
  { id: 1, actor: "Priya Sharma", action: "impersonated", target: "Metro Brands", suffix: "for support", time: "16:12 IST", icon: User, tone: "neutral" },
  { id: 2, actor: "Arjun Mehta", action: "applied a", target: "₹12,000 credit", suffix: "to Café Coffee Day", time: "15:48 IST", icon: CreditCard, tone: "accent" },
  { id: 3, actor: "Neha Rao", action: "changed Business plan storage to", target: "250 GB", suffix: "", time: "14:36 IST", icon: HardDrive, tone: "neutral" },
  { id: 4, actor: "System", action: "retried", target: "Razorpay webhook", suffix: "— failed", time: "14:04 IST", icon: RefreshCw, tone: "danger" },
  { id: 5, actor: "Vikram Singh", action: "suspended", target: "Urban Ladder", suffix: "after 3 failed payments", time: "11:22 IST", icon: AlertCircle, tone: "danger" },
] as const;

export default function ActivityFeed() {
  return <Card size="panel" className="overflow-hidden"><div className="border-b border-app-border p-5"><CardHeading size="panel" title="Recent admin activity" description="All times in IST" /></div><div className="divide-y divide-app-border">{activities.map((activity) => { const Icon = activity.icon; const tone = activity.tone === "danger" ? "bg-app-danger-surface text-app-danger-text" : activity.tone === "accent" ? "bg-app-accent-surface text-app-accent-text" : "bg-app-surface-alt text-app-muted"; return <div key={activity.id} className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-app-surface-alt"><div className="flex min-w-0 items-center gap-3"><span className={`flex shrink-0 items-center justify-center rounded-lg p-2 ${tone}`}><Icon className="h-4 w-4" /></span><p className="truncate text-body text-app-muted"><strong className="text-app-text">{activity.actor}</strong> {activity.action} <strong className="text-app-text">{activity.target}</strong> {activity.suffix}</p></div><time className="shrink-0 text-caption text-app-muted">{activity.time}</time></div>; })}</div></Card>;
}
