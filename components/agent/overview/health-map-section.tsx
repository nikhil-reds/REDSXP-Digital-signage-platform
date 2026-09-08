"use client";

import React from "react";
import { AlertCircle, Database, Smartphone } from "lucide-react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardHeading,
  StatusDot,
  type Status,
} from "@/components/ui";

type Incident = {
  id: string;
  status: Extract<Status, "error" | "warning">;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
};

const incidents: Incident[] = [
  {
    id: "inc-1",
    status: "error",
    title: "MG Road Menu Board 02 offline",
    subtitle: "Offline for 18 mins · Last heartbeat 4:12 PM",
    icon: Smartphone,
  },
  {
    id: "inc-2",
    status: "warning",
    title: "Phoenix Marketcity Display storage warning",
    subtitle: "Disk space at 94% (6.2 GB free) · Sync throttled",
    icon: Database,
  },
  {
    id: "inc-3",
    status: "warning",
    title: "Staff-call button pressed at Koramangala",
    subtitle: "Awaiting acknowledgement · Active for 2 mins",
    icon: AlertCircle,
  },
];

const INCIDENT_SKIN: Record<Incident["status"], string> = {
  error: "bg-app-danger-surface border-app-danger/30 text-app-danger-text",
  warning: "bg-app-warning-surface border-app-warning/30 text-app-warning-text",
};

/** Map pins reuse the status vocabulary rather than raw emerald/amber/red. */
const PIN_TONE: Record<Status, string> = {
  online: "bg-app-accent-text",
  warning: "bg-app-warning",
  error: "bg-app-danger",
  unknown: "bg-app-muted",
};

const pins: { id: string; status: Status; label: string; className: string; pulse?: boolean }[] = [
  { id: "kor", status: "online", label: "Koramangala (3)", className: "top-2/3 left-1/3", pulse: true },
  { id: "ind", status: "warning", label: "Indiranagar (1)", className: "top-1/3 left-2/3", pulse: true },
  { id: "mgr", status: "error", label: "MG Road (1 Offline)", className: "top-1/2 left-1/2", pulse: true },
  { id: "wht", status: "online", label: "Whitefield (4)", className: "top-1/2 left-[80%]" },
  { id: "air", status: "online", label: "Kempegowda Airport (8)", className: "top-[16%] left-[60%]" },
];

export default function HealthMapSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 1. Screen Health & Segmented Bar */}
      <Card size="panel" className="flex flex-col">
        <CardHeader>
          <CardHeading
            size="panel"
            title="Screen Health Summary"
            description="Assigned screen connection state"
          />
        </CardHeader>

        <CardBody className="flex-1 flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="h-6 w-full flex rounded-md overflow-hidden">
              <div className="bg-app-accent h-full" style={{ width: "91.6%" }} title="91.6% Online" />
              <div className="bg-app-warning h-full" style={{ width: "4.2%" }} title="4.2% Delayed" />
              <div className="bg-app-danger h-full" style={{ width: "4.2%" }} title="4.2% Offline" />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center bg-app-surface-alt p-2.5 rounded-lg border border-app-border">
              <div>
                <span className="block text-body font-semibold text-app-accent-text">91.6%</span>
                <span className="text-caption text-app-muted uppercase tracking-headline font-semibold">
                  Uptime
                </span>
              </div>
              <div className="border-x border-app-border">
                <span className="block text-body font-semibold text-app-warning-text">4.2%</span>
                <span className="text-caption text-app-muted uppercase tracking-headline font-semibold">
                  Delayed
                </span>
              </div>
              <div>
                <span className="block text-body font-semibold text-app-danger-text">4.2%</span>
                <span className="text-caption text-app-muted uppercase tracking-headline font-semibold">
                  Alerts
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 border-t border-app-border pt-4 mt-4">
            {[
              { status: "online" as Status, label: "Online (Normal Uptime)", count: 44 },
              { status: "warning" as Status, label: "Delayed Heartbeats (>30s)", count: 2 },
              { status: "error" as Status, label: "Offline / Incidents (>90s)", count: 2 },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center gap-2">
                <StatusDot status={row.status} label={row.label} />
                <span className="text-body font-semibold text-app-text">{row.count}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* 2. Bengaluru Location Map */}
      <Card size="panel" className="flex flex-col">
        <CardHeader>
          <CardHeading
            size="panel"
            title="Live Regional Map"
            description="Bengaluru City · 19 active locations"
          />
        </CardHeader>

        <CardBody className="flex-1">
          <div className="h-44 relative bg-app-surface-alt border border-app-border rounded-lg overflow-hidden flex items-center justify-center">
            <svg
              className="w-full h-full opacity-30 absolute inset-0 text-app-muted"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              {[10, 30, 50, 70, 90].map((x) => (
                <line key={`v${x}`} x1={x} y1="0" x2={x} y2="100" stroke="currentColor" strokeWidth="0.5" />
              ))}
              {[20, 40, 60, 80].map((y) => (
                <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} stroke="currentColor" strokeWidth="0.5" />
              ))}
              <path
                d="M15,15 Q50,0 85,15 T95,85 T15,85 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            </svg>

            {pins.map((pin) => (
              <div key={pin.id} className={`absolute group cursor-pointer ${pin.className}`} title={pin.label}>
                {pin.pulse && (
                  <span
                    className={`absolute inline-flex h-3 w-3 rounded-full opacity-75 animate-ping ${PIN_TONE[pin.status]}`}
                  />
                )}
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${PIN_TONE[pin.status]}`} />
                <span className="absolute top-3 left-1/2 -translate-x-1/2 bg-app-surface border border-app-border text-app-text text-caption font-semibold px-1.5 py-0.5 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {pin.label}
                </span>
              </div>
            ))}
          </div>
        </CardBody>

        <CardFooter>
          <span className="text-caption text-app-muted">Active clusters: 5 regions</span>
          <button className="text-body font-semibold text-app-accent-text hover:underline cursor-pointer">
            Open Map View
          </button>
        </CardFooter>
      </Card>

      {/* 3. Needs Attention list */}
      <Card size="panel" className="flex flex-col">
        <CardHeader>
          <CardHeading
            size="panel"
            title="Needs Attention"
            description="Incidents affecting SLA target"
          />
        </CardHeader>

        <CardBody className="flex-1">
          <div className="space-y-2.5">
            {incidents.map((inc) => {
              const Icon = inc.icon;
              return (
                <div
                  key={inc.id}
                  className={`flex gap-3 p-3 border rounded-lg ${INCIDENT_SKIN[inc.status]}`}
                >
                  <Icon className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-body font-semibold text-app-text truncate">{inc.title}</h4>
                    <span className="text-caption text-app-muted mt-1 block">{inc.subtitle}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>

        <CardFooter>
          <span className="text-caption text-app-muted">Total active incidents: 3</span>
          <button className="text-body font-semibold text-app-accent-text hover:underline cursor-pointer">
            View All Incidents
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
