"use client";

import React from "react";
import {
  Server,
  Database,
  Layers,
  Zap,
  MessageSquare,
  Globe,
  HardDrive,
  Webhook,
  Mail,
  Share2,
  Cpu
} from "lucide-react";

interface ServiceItem {
  name: string;
  status: "Healthy" | "Degraded";
  metric: string;
  subtext: string;
  icon: React.ComponentType<any>;
}

export default function ServicesGrid() {
  const services: ServiceItem[] = [
    { name: "API Server", status: "Healthy", metric: "p95 184ms", subtext: "99.99% uptime · checked 12s ago", icon: Server },
    { name: "PostgreSQL", status: "Healthy", metric: "22ms latency", subtext: "61% connections used · checked 12s ago", icon: Database },
    { name: "TimescaleDB", status: "Healthy", metric: "38ms write", subtext: "write latency · checked 15s ago", icon: Layers },
    { name: "Redis", status: "Healthy", metric: "4ms latency", subtext: "87% memory used · checked 10s ago", icon: Zap },
    { name: "Telemetry SQS", status: "Degraded", metric: "18,420 queued", subtext: "oldest 7m 12s · checked 8s ago", icon: MessageSquare },
    { name: "Billing SQS", status: "Healthy", metric: "23 messages", subtext: "queue nominal · checked 9s ago", icon: MessageSquare },
    { name: "CloudFront", status: "Healthy", metric: "96.8% cache hit", subtext: "126 TB served · checked 20s ago", icon: Globe },
    { name: "S3", status: "Healthy", metric: "Operational", subtext: "object storage · checked 22s ago", icon: HardDrive },
    { name: "Razorpay Webhooks", status: "Degraded", metric: "3 failed events", subtext: "awaiting retry · checked 14s ago", icon: Webhook },
    { name: "SES Email", status: "Healthy", metric: "Operational", subtext: "email delivery · checked 18s ago", icon: Mail },
    { name: "WebSocket Gateway", status: "Healthy", metric: "1,284 connections", subtext: "live dashboards · checked 6s ago", icon: Share2 },
    { name: "BrightSign Ingest", status: "Healthy", metric: "Operational", subtext: "telemetry ingest · checked 11s ago", icon: Cpu }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((svc) => {
        const Icon = svc.icon;
        const isDegraded = svc.status === "Degraded";

        return (
          <div
            key={svc.name}
            className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-4 rounded-lg shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-250">
                <Icon className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                {svc.name}
              </span>
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-bold border inline-flex items-center gap-1 ${
                  isDegraded
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-955/20 dark:text-amber-400 border-amber-100/50"
                    : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100/50"
                }`}
              >
                <span className={`w-1 h-1 rounded-full ${isDegraded ? "bg-amber-500" : "bg-emerald-500"}`} />
                {svc.status}
              </span>
            </div>

            <div className="mt-3.5">
              <span
                className={`text-lg font-bold tracking-tight ${
                  isDegraded ? "text-amber-650 dark:text-amber-450" : "text-zinc-900 dark:text-zinc-50"
                }`}
              >
                {svc.metric}
              </span>
              <p className="text-[10px] text-zinc-450 mt-1 truncate">
                {svc.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
