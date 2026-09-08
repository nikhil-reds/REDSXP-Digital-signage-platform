"use client";

import React from "react";
import { Activity, BarChart2, Clock, Zap } from "lucide-react";
import { Card, CardHeading, ProgressBar } from "@/components/ui";

interface RuleLog {
  time: string;
  deviceName: string;
  triggerDetails: string;
  ruleName: string;
  outputDetails: string;
}

const mockLogs: RuleLog[] = [
  {
    time: "4:18 PM",
    deviceName: "Koramangala Entrance",
    triggerDetails: "Motion count > 1 detected",
    ruleName: "Proximity Promo",
    outputDetails: "Walk-in Offer playlist played for 30s. Reverted to standard loop.",
  },
  {
    time: "3:42 PM",
    deviceName: "Indiranagar Screen 03",
    triggerDetails: "Temperature fell to 17.5°C (< 18°C)",
    ruleName: "Cold Weather Hot Drinks",
    outputDetails: "Hot Brews menu loaded for 60s. Reverted.",
  },
  {
    time: "2:15 PM",
    deviceName: "Phoenix Mall Display",
    triggerDetails: "Camera crowd count reached 7 (> 5)",
    ruleName: "Crowd detector",
    outputDetails: "Group Combos menu loaded for 45s. Reverted.",
  },
  {
    time: "1:04 PM",
    deviceName: "MG Road Menu Board 01",
    triggerDetails: "Light sensor detected 820 lux (> 800 lux)",
    ruleName: "Brightness Adjuster",
    outputDetails: "Set panel display brightness limit to 100%.",
  },
];

const triggerTrends = [
  { label: "Proximity Promo (Motion)", count: 142, percent: 72 },
  { label: "Brightness Adjuster (Light)", count: 88, percent: 45 },
  { label: "Crowd Detector (Camera)", count: 64, percent: 32 },
];

export default function RuleLogsTrends() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card size="widget" padded className="flex flex-col gap-5 lg:col-span-1">
        <CardHeading
          size="widget"
          title="Trigger count trends"
          description="Sensor rule activation cycles during the last 24 hours."
          icon={BarChart2}
        />

        <div className="flex flex-1 flex-col justify-center gap-4">
          {triggerTrends.map((trend) => (
            <div key={trend.label}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-caption">
                <span className="truncate font-semibold text-app-muted">{trend.label}</span>
                <span className="shrink-0 font-semibold text-app-text">
                  {trend.count} cycles
                </span>
              </div>
              <ProgressBar value={trend.percent} />
            </div>
          ))}
        </div>
      </Card>

      <Card size="widget" padded className="space-y-5 lg:col-span-2">
        <CardHeading
          size="widget"
          title="Live automation activity"
          description="Rule triggers evaluated at the display edge, newest first."
          icon={Activity}
        />

        <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
          {mockLogs.map((log) => (
            <article
              key={`${log.deviceName}-${log.time}`}
              className="flex items-start gap-3 rounded-lg border border-app-border bg-app-surface-alt p-3 transition-colors hover:border-app-border-strong"
            >
              <div className="mt-0.5 shrink-0 rounded-md border border-app-border bg-app-accent-surface p-2 text-app-accent-text">
                <Zap className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                  <h4 className="text-body font-semibold text-app-text">{log.deviceName}</h4>
                  <time className="flex shrink-0 items-center gap-1 text-caption text-app-muted">
                    <Clock className="h-3 w-3" />
                    {log.time}
                  </time>
                </div>
                <p className="mt-1 text-caption text-app-muted">
                  Trigger: <span className="font-semibold text-app-text">{log.triggerDetails}</span>{" "}
                  ({log.ruleName})
                </p>
                <p className="mt-1 text-caption text-app-muted">Action: {log.outputDetails}</p>
              </div>
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
}
