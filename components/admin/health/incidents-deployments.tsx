"use client";

import React from "react";
import { AlertCircle, Rocket } from "lucide-react";

export default function IncidentsDeployments() {
  const incidents = [
    {
      title: "Telemetry SQS queue depth elevated",
      badge: "Investigating",
      badgeClass: "bg-app-warning-surface text-app-warning-text border-app-border",
      subtext: "Since 3:47 PM IST · 43m elapsed"
    },
    {
      title: "Razorpay webhook retry failures",
      badge: "Monitoring",
      badgeClass: "bg-app-accent-surface text-app-accent-text border-app-accent-border",
      subtext: "Since 2:04 PM IST · 2h 28m elapsed"
    }
  ];

  const deployments = [
    {
      version: "v3.14.2",
      service: "api-server",
      status: "Success",
      statusClass: "bg-app-accent-surface text-app-accent-text border-app-accent-border",
      subtext: "2 Jul, 1:12 PM IST · deployed by Neha Rao"
    },
    {
      version: "v3.14.1",
      service: "telemetry-worker",
      status: "Rollback",
      statusClass: "bg-app-danger-surface text-app-danger-text border-app-danger-border",
      subtext: "1 Jul, 9:48 PM IST · deployed by Arjun Mehta"
    },
    {
      version: "v3.14.0",
      service: "web-dashboard",
      status: "Success",
      statusClass: "bg-app-accent-surface text-app-accent-text border-app-accent-border",
      subtext: "1 Jul, 6:30 PM IST · deployed by Vikram Singh"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 1. Active Incidents Column */}
      <div className="flex flex-col justify-between rounded-xl border border-app-border bg-app-surface p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <div className="rounded-lg bg-app-danger-surface p-1.5 text-app-danger-text shadow-xs">
            <AlertCircle className="h-4 w-4" />
          </div>
          <div>
            <h2 className="flex items-center gap-1.5 text-body font-bold text-app-text">
              Active Incidents
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-400 mt-1 select-none border border-zinc-200/50 dark:border-zinc-700/50 inline-block">
              2 open
            </span>
          </div>
        </div>

        <div className="space-y-3 flex-1 text-xs">
          {incidents.map((inc) => (
            <div
              key={inc.title}
              className="space-y-1.5 rounded-xl border border-app-border bg-app-surface-alt p-3.5 transition-shadow hover:shadow-xs"
            >
              <div className="flex justify-between items-start gap-3">
                <span className="font-semibold leading-snug text-app-text">
                  {inc.title}
                </span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold border shrink-0 ${inc.badgeClass}`}>
                  {inc.badge}
                </span>
              </div>
              <p className="text-[10px] text-app-muted">{inc.subtext}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Recent Deployments Column */}
      <div className="flex flex-col justify-between rounded-xl border border-app-border bg-app-surface p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <div className="rounded-lg bg-app-accent-surface p-1.5 text-app-accent-text shadow-xs">
            <Rocket className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-body font-bold text-app-text">
              Recent Deployments
            </h2>
            <span className="text-[10px] text-zinc-400 mt-1 uppercase font-semibold block">Continuous Delivery</span>
          </div>
        </div>

        <div className="space-y-3 flex-1 text-xs">
          {deployments.map((dep) => (
            <div
              key={dep.version + dep.service}
              className="space-y-1.5 rounded-xl border border-app-border bg-app-surface-alt p-3.5 transition-shadow hover:shadow-xs"
            >
              <div className="flex justify-between items-start gap-3">
                <span className="font-mono font-semibold text-app-text">
                  {dep.version} <span className="text-zinc-400 dark:text-zinc-500 font-sans font-medium">·</span> {dep.service}
                </span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold border shrink-0 ${dep.statusClass}`}>
                  {dep.status}
                </span>
              </div>
              <p className="text-[10px] text-app-muted">{dep.subtext}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
