"use client";

import React from "react";
import { AlertTriangle, Pencil, ShieldCheck } from "lucide-react";
import { ScheduleSummary } from "./api";
import { formatDays } from "./schedule-calendar";
import { Badge, Button, Card, IconButton, Modal } from "@/components/ui";

interface ConflictDialogProps {
  onClose: () => void;
  onEditSchedule: (schedule: ScheduleSummary) => void;
  campaign1: ScheduleSummary;
  campaign2: ScheduleSummary;
}

export default function ConflictDialog({
  onClose,
  onEditSchedule,
  campaign1,
  campaign2,
}: ConflictDialogProps) {
  const winner = campaign2.priority > campaign1.priority ? campaign2 : campaign1;
  const loser = campaign2.priority > campaign1.priority ? campaign1 : campaign2;
  const sharedDays = campaign1.daysOfWeek.filter((d) => campaign2.daysOfWeek.includes(d));

  const campaigns: { label: string; data: ScheduleSummary }[] = [
    { label: "Campaign A", data: campaign1 },
    { label: "Campaign B", data: campaign2 },
  ];

  return (
    <Modal
      open
      onClose={onClose}
      title="Schedule Conflict Detected"
      description="Two campaigns overlap on shared screens. The higher priority wins."
      size="md"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close Dialog
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-2.5 rounded-lg border border-app-warning/30 bg-app-warning-surface p-3">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-app-warning-text" />
          <p className="text-body text-app-warning-text">
            An overlap occurs on{" "}
            <span className="font-semibold">{formatDays(sharedDays)}</span> between{" "}
            <span className="font-semibold">
              {campaign1.dailyStartTime}–{campaign1.dailyEndTime}
            </span>{" "}
            and{" "}
            <span className="font-semibold">
              {campaign2.dailyStartTime}–{campaign2.dailyEndTime}
            </span>{" "}
            on shared screens.
          </p>
        </div>

        <div className="space-y-2">
          {campaigns.map(({ label, data }) => (
            <Card
              key={label}
              size="row"
              padded
              className="flex justify-between items-center gap-3"
            >
              <div className="min-w-0">
                <span className="block text-caption font-semibold uppercase tracking-headline text-app-muted">
                  {label}
                </span>
                <span className="block text-body font-semibold text-app-text mt-0.5 truncate">
                  {data.name}
                </span>
                <span className="block text-caption text-app-muted">
                  {data.dailyStartTime} – {data.dailyEndTime}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge tone={data.id === winner.id ? "accent" : "neutral"}>
                  Priority {data.priority}
                </Badge>
                <IconButton
                  icon={Pencil}
                  size="sm"
                  onClick={() => onEditSchedule(data)}
                  aria-label={`Edit ${data.name}`}
                  title={`Edit ${data.name}`}
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Resolution Winner explanation */}
        <div className="p-3.5 border border-app-accent/30 bg-app-accent-surface rounded-lg space-y-2">
          <h4 className="text-caption font-semibold uppercase tracking-headline text-app-accent-text flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            Conflict Resolution Winner
          </h4>
          <ul className="text-body text-app-muted space-y-1 list-disc pl-4">
            <li>
              <span className="font-semibold text-app-text">“{winner.name}”</span> overrides “
              {loser.name}” because Priority {winner.priority} is higher than Priority{" "}
              {loser.priority}.
            </li>
            <li>
              Displays automatically select the winning manifest on the overlap timeline. Fallback
              assets are ignored.
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
