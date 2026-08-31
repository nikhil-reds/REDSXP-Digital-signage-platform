"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Server } from "lucide-react";
import { Badge, Card } from "@/components/ui";

export interface LogEntry { id: string; user: string; avatarLetter: string; role: "Operator" | "System" | "Admin"; event: string; target: string; time: string; severity: "Info" | "Warning" | "Critical"; detailPayload: string }

export default function ActivityFeed({ logs }: { logs: LogEntry[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  return <div className="space-y-4">
    {logs.map((log) => {
      const expanded = expandedId === log.id;
      const tone = log.severity === "Critical" ? "danger" : log.severity === "Warning" ? "warning" : "neutral";
      return <Card key={log.id} size="widget" padded className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-app-border bg-app-accent-surface text-caption font-semibold text-app-accent-text">{log.role === "System" ? <Server className="h-4 w-4" /> : log.avatarLetter}</div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="text-body font-semibold text-app-text">{log.user}</span><Badge>{log.role}</Badge></div><p className="mt-1 text-body text-app-muted">{log.event}</p></div></div>
          <div className="shrink-0 text-right"><time className="block text-caption text-app-muted">{log.time}</time><Badge tone={tone} className="mt-1">{log.severity}</Badge></div>
        </div>
        <div className="flex flex-col justify-between gap-2 border-t border-app-border pt-3 sm:flex-row sm:items-center"><span className="text-caption text-app-muted">Target: <strong className="text-app-text">{log.target}</strong></span><button type="button" onClick={() => setExpandedId(expanded ? null : log.id)} className="inline-flex cursor-pointer items-center gap-1 text-caption font-semibold text-app-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent-text">{expanded ? "Hide details" : "Inspect payload"}{expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}</button></div>
        {expanded && <pre className="overflow-x-auto rounded-lg border border-app-border bg-app-surface-alt p-3 text-caption leading-relaxed text-app-muted">{log.detailPayload}</pre>}
      </Card>;
    })}
    {logs.length === 0 && <Card size="panel" padded><p className="py-10 text-center text-body text-app-muted">No audit events match the current filters.</p></Card>}
  </div>;
}
