"use client";

import React from "react";
import { Upload, ListPlus, CalendarPlus, Zap, FileDown, Calendar } from "lucide-react";
import {
  Badge,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardHeading,
  type Tone,
} from "@/components/ui";

const currentPlaying: {
  group: string;
  screens: string;
  playlist: string;
  status: string;
  tone: Tone;
}[] = [
  {
    group: "Bengaluru Flagship Stores",
    screens: "12 screens",
    playlist: "Monsoon Café Promotions",
    status: "Synced",
    tone: "accent",
  },
  {
    group: "Mall Stores",
    screens: "14 screens",
    playlist: "Monsoon Café Promotions",
    status: "Synced",
    tone: "accent",
  },
  {
    group: "Airport Outlets",
    screens: "8 screens",
    playlist: "Airport Express Menu",
    status: "Synced",
    tone: "accent",
  },
  {
    group: "Drive-through Displays",
    screens: "6 screens",
    playlist: "Lunch Combos",
    status: "Synced",
    tone: "accent",
  },
  {
    group: "Menu Boards",
    screens: "8 screens",
    playlist: "Lunch Combos",
    status: "Pending Sync",
    tone: "warning",
  },
];

const timelines = [
  {
    time: "06:00 AM – 11:00 AM",
    campaign: "Breakfast Menu Promo",
    scope: "34 active screens · Priority 30",
    active: false,
  },
  {
    time: "11:00 AM – 04:00 PM",
    campaign: "Lunch Combos Campaign",
    scope: "34 active screens · Priority 30",
    active: false,
  },
  {
    time: "04:00 PM – 09:30 PM",
    campaign: "Monsoon Café Promotions",
    scope: "21 screens · Priority 40",
    active: true,
  },
  {
    time: "06:00 PM – 10:00 PM (Fri–Sun)",
    campaign: "Weekend Live Music Teaser",
    scope: "6 screens · Priority 60",
    active: false,
  },
];

const quickActions = [
  { name: "Upload Media", icon: Upload, desc: "Add images, video, HTML5 assets" },
  { name: "Create Playlist", icon: ListPlus, desc: "Sequence content loops" },
  { name: "Schedule Content", icon: CalendarPlus, desc: "Define date, times, target groups" },
  { name: "Add Sensor Rule", icon: Zap, desc: "Create interactive edge triggers" },
  { name: "Export Uptime Report", icon: FileDown, desc: "Download SLA performance PDF" },
];

export default function SchedulesPlayingSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 1. Currently Playing by Screen Group */}
      <Card size="panel" className="flex flex-col">
        <CardHeader>
          <CardHeading
            size="panel"
            title="Currently Playing Content"
            description="Active playlist allocations by screen group"
          />
        </CardHeader>

        <CardBody className="flex-1">
          <div className="divide-y divide-app-border">
            {currentPlaying.map((cp) => (
              <div
                key={cp.group}
                className="py-2.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <span className="block text-body font-semibold text-app-text truncate">
                    {cp.group}
                  </span>
                  <span className="text-caption text-app-muted">
                    {cp.screens} ·{" "}
                    <span className="font-semibold text-app-accent-text">{cp.playlist}</span>
                  </span>
                </div>
                <Badge tone={cp.tone}>{cp.status}</Badge>
              </div>
            ))}
          </div>
        </CardBody>

        <CardFooter>
          <span className="text-caption text-app-muted">Deployments pending: 1</span>
          <button className="text-body font-semibold text-app-accent-text hover:underline cursor-pointer">
            Deployments Manager
          </button>
        </CardFooter>
      </Card>

      {/* 2. Today's Schedule Timeline */}
      <Card size="panel" className="flex flex-col">
        <CardHeader>
          <CardHeading
            size="panel"
            title="Today’s Schedule Timeline"
            description="Campaign rotation schedule for 4 July 2026"
          />
        </CardHeader>

        <CardBody className="flex-1">
          <div className="relative border-l-2 border-app-border ml-2 pl-6 space-y-5">
            {timelines.map((t) => (
              <div key={t.campaign} className="relative">
                <span
                  className={`absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full border-2 bg-app-surface ${
                    t.active ? "border-app-accent-text" : "border-app-border-strong"
                  }`}
                />
                <div className="flex flex-col gap-0.5">
                  <span className="text-caption text-app-muted font-semibold flex items-center gap-1.5 flex-wrap">
                    <Calendar className="w-3 h-3" aria-hidden />
                    {t.time}
                    {t.active && (
                      <Badge tone="accent" variant="filled" uppercase>
                        Active now
                      </Badge>
                    )}
                  </span>
                  <span
                    className={`text-body font-semibold ${
                      t.active ? "text-app-text" : "text-app-muted"
                    }`}
                  >
                    {t.campaign}
                  </span>
                  <span className="text-caption text-app-muted">{t.scope}</span>
                </div>
              </div>
            ))}
          </div>
        </CardBody>

        <CardFooter>
          <span className="text-caption text-app-muted">Active campaigns: 1</span>
          <button className="text-body font-semibold text-app-accent-text hover:underline cursor-pointer">
            Open Scheduler
          </button>
        </CardFooter>
      </Card>

      {/* 3. Quick Actions Panel */}
      <Card size="panel" className="flex flex-col">
        <CardHeader>
          <CardHeading
            size="panel"
            title="Quick Operator Actions"
            description="Operations shortcut workspace"
          />
        </CardHeader>

        <CardBody className="flex-1">
          <div className="space-y-2">
            {quickActions.map((qa) => {
              const Icon = qa.icon;
              return (
                <Card
                  key={qa.name}
                  as="button"
                  size="row"
                  padded
                  interactive
                  className="w-full flex items-center gap-3 text-left group"
                >
                  <span className="p-1.5 rounded-md bg-app-surface-alt border border-app-border text-app-muted group-hover:text-app-accent-text shrink-0">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-body font-semibold text-app-text">{qa.name}</span>
                    <span className="block text-caption text-app-muted truncate">{qa.desc}</span>
                  </span>
                </Card>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
