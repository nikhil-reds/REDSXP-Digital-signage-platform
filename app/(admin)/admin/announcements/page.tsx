"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import AnnouncementsTable from "@/components/admin/announcements/announcements-table";
import AnnouncementForm from "@/components/admin/announcements/announcement-form";
import { Button } from "@/components/ui";

interface Announcement {
  id: string;
  title: string;
  type: "Banner" | "Modal" | "Email";
  audience: string;
  status: "Live" | "Scheduled" | "Expired";
  scheduledAt: string;
  expiresAt: string;
  impressions: string;
}

const initialAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Platform Maintenance – 5 Jul 2026",
    type: "Modal",
    audience: "All Tenants",
    status: "Live",
    scheduledAt: "4 Jul 10:00 PM IST",
    expiresAt: "5 Jul 6:00 AM IST",
    impressions: "186"
  },
  {
    id: "2",
    title: "New AI Content Suggestions Feature",
    type: "Banner",
    audience: "Growth + Business + Enterprise",
    status: "Scheduled",
    scheduledAt: "6 Jul 9:00 AM IST",
    expiresAt: "13 Jul 9:00 AM IST",
    impressions: "—"
  },
  {
    id: "3",
    title: "Razorpay Webhook Delay Notice",
    type: "Banner",
    audience: "All Tenants",
    status: "Expired",
    scheduledAt: "2 Jul 4:00 PM IST",
    expiresAt: "2 Jul 8:00 PM IST",
    impressions: "186"
  },
  {
    id: "4",
    title: "July Billing Cycle Reminder",
    type: "Email",
    audience: "All Tenants",
    status: "Scheduled",
    scheduledAt: "30 Jun 11:00 PM IST",
    expiresAt: "—",
    impressions: "—"
  },
  {
    id: "5",
    title: "Proof-of-Play Export Now Available",
    type: "Banner",
    audience: "Business + Enterprise",
    status: "Live",
    scheduledAt: "25 Jun 9:00 AM IST",
    expiresAt: "9 Jul 9:00 AM IST",
    impressions: "142"
  },
  {
    id: "6",
    title: "Welcome to Rubenius v3.2",
    type: "Modal",
    audience: "All Tenants",
    status: "Expired",
    scheduledAt: "1 Jun 9:00 AM IST",
    expiresAt: "8 Jun 9:00 AM IST",
    impressions: "186"
  }
];

export default function AnnouncementsBroadcastPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [isFormOpen, setIsFormOpen] = useState(true); // Open by default as in the screenshot

  const handleSave = (newAnn: {
    title: string;
    type: "Banner" | "Modal" | "Email";
    audience: string;
    message: string;
    bannerColor: string;
    scheduleEnabled: boolean;
    goLive: string;
    expires: string;
  }) => {
    const formattedGoLive = new Date(newAnn.goLive).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }) + " IST";

    const formattedExpires = newAnn.expires
      ? new Date(newAnn.expires).toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          hour: "numeric",
          minute: "2-digit",
          hour12: true
        }) + " IST"
      : "—";

    const created: Announcement = {
      id: String(announcements.length + 1),
      title: newAnn.title,
      type: newAnn.type,
      audience: newAnn.audience,
      status: newAnn.scheduleEnabled ? "Scheduled" : "Live",
      scheduledAt: formattedGoLive,
      expiresAt: formattedExpires,
      impressions: "—"
    };

    setAnnouncements([created, ...announcements]);
    setIsFormOpen(false);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-app-canvas font-sans text-app-text">
      {/* Main Table section */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-page-title font-bold tracking-tight text-app-text">
              Announcements
            </h1>
            <p className="text-caption text-app-muted">
              Broadcast messages to tenants and end users across the platform
            </p>
          </div>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Announcement</span>
          </Button>
        </div>

        {/* Table list view */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          <AnnouncementsTable
            announcements={announcements}
            onSelectAnnouncement={() => setIsFormOpen(true)}
          />
        </div>
      </div>

      {/* Right Drawer form */}
      {isFormOpen && (
        <AnnouncementForm
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
