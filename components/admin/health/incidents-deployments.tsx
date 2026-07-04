"use client";

import React from "react";
import { AlertCircle, Rocket } from "lucide-react";

export default function IncidentsDeployments() {
  const incidents = [
    {
      title: "Telemetry SQS queue depth elevated",
      badge: "Investigating",
      badgeClass: "bg-amber-50 text-amber-700 dark:bg-amber-955/20 dark:text-amber-400 border-amber-100/50",
      subtext: "Since 3:47 PM IST · 43m elapsed"
    },
    {
      title: "Razorpay webhook retry failures",
      badge: "Monitoring",
      badgeClass: "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border-blue-100/50",
      subtext: "Since 2:04 PM IST · 2h 28m elapsed"
    }
  ];

  const deployments = [
    {
      version: "v3.14.2",
      service: "api-server",
      status: "Success",
      statusClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100/50",
      subtext: "2 Jul, 1:12 PM IST · deployed by Neha Rao"
    },
    {
      version: "v3.14.1",
      service: "telemetry-worker",
      status: "Rollback",
      statusClass: "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-455 border border-rose-100/50",
      subtext: "1 Jul, 9:48 PM IST · deployed by Arjun Mehta"
    },
    {
      version: "v3.14.0",
      service: "web-dashboard",
      status: "Success",
      statusClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100/50",
      subtext: "1 Jul, 6:30 PM IST · deployed by Vikram Singh"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 1. Active Incidents Column */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-xl shadow-xs flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-zinc-50 dark:bg-zinc-850 text-zinc-650 dark:text-zinc-300 rounded-lg shadow-xs">
            <AlertCircle className="w-4 h-4 text-zinc-550" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
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
              className="p-3.5 border border-zinc-150 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950/50 space-y-1.5 hover:shadow-xs transition-shadow"
            >
              <div className="flex justify-between items-start gap-3">
                <span className="font-semibold text-zinc-900 dark:text-zinc-50 leading-snug">
                  {inc.title}
                </span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold border shrink-0 ${inc.badgeClass}`}>
                  {inc.badge}
                </span>
              </div>
              <p className="text-[10px] text-zinc-450">{inc.subtext}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Recent Deployments Column */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-xl shadow-xs flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-zinc-50 dark:bg-zinc-850 text-zinc-650 dark:text-zinc-300 rounded-lg shadow-xs">
            <Rocket className="w-4 h-4 text-zinc-550" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
              Recent Deployments
            </h2>
            <span className="text-[10px] text-zinc-400 mt-1 uppercase font-semibold block">Continuous Delivery</span>
          </div>
        </div>

        <div className="space-y-3 flex-1 text-xs">
          {deployments.map((dep) => (
            <div
              key={dep.version + dep.service}
              className="p-3.5 border border-zinc-150 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950/50 space-y-1.5 hover:shadow-xs transition-shadow"
            >
              <div className="flex justify-between items-start gap-3">
                <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-50">
                  {dep.version} <span className="text-zinc-400 dark:text-zinc-500 font-sans font-medium">·</span> {dep.service}
                </span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold border shrink-0 ${dep.statusClass}`}>
                  {dep.status}
                </span>
              </div>
              <p className="text-[10px] text-zinc-450">{dep.subtext}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
