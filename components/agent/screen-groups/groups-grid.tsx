"use client";

import React from "react";
import { PlaySquare, Calendar, MapPin, AlertTriangle, Edit2 } from "lucide-react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  type Tone,
} from "@/components/ui";

export interface ScreenGroup {
  id: string;
  name: string;
  screensCount: number;
  onlinePercentage: number;
  playlist: string;
  schedule: string;
  locationsCount: number;
  alertsCount: number;
  lastDeployment: string;
}

interface GroupsGridProps {
  groups: ScreenGroup[];
  onEditGroup: (group: ScreenGroup) => void;
}

/** Uptime → tone. Green is healthy, amber degraded, red failing. */
function uptimeTone(pct: number): Tone {
  if (pct >= 95) return "accent";
  if (pct >= 85) return "warning";
  return "danger";
}

const TONE_TEXT: Record<Tone, string> = {
  neutral: "text-app-muted",
  accent: "text-app-accent-text",
  warning: "text-app-warning-text",
  danger: "text-app-danger-text",
};

export default function GroupsGrid({ groups, onEditGroup }: GroupsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {groups.map((group) => {
        const isWarning = group.alertsCount > 0;
        return (
          <Card key={group.id} size="panel" className="flex flex-col">
            <CardHeader divided>
              <div className="min-w-0">
                <span className="block text-caption font-semibold uppercase tracking-headline text-app-muted">
                  Screen Group
                </span>
                <h3 className="font-heading text-h6 font-semibold tracking-headline text-app-text truncate mt-0.5">
                  {group.name}
                </h3>
              </div>
              <IconButton
                icon={Edit2}
                variant="secondary"
                size="sm"
                onClick={() => onEditGroup(group)}
                aria-label={`Edit ${group.name}`}
                title="Edit group config"
              />
            </CardHeader>

            <CardBody className="flex-1">
              {/* Core Stats Row */}
              <div className="grid grid-cols-3 gap-2.5 bg-app-surface-alt p-3 rounded-lg border border-app-border text-center select-none">
                <div>
                  <span className="block text-body font-semibold text-app-text">
                    {group.screensCount}
                  </span>
                  <span className="text-caption text-app-muted font-semibold uppercase tracking-headline">
                    Screens
                  </span>
                </div>
                <div className="border-x border-app-border">
                  <span
                    className={`block text-body font-semibold ${TONE_TEXT[uptimeTone(group.onlinePercentage)]}`}
                  >
                    {group.onlinePercentage}%
                  </span>
                  <span className="text-caption text-app-muted font-semibold uppercase tracking-headline">
                    Online
                  </span>
                </div>
                <div>
                  <span
                    className={`block text-body font-semibold ${
                      isWarning ? "text-app-danger-text" : "text-app-muted"
                    }`}
                  >
                    {group.alertsCount}
                  </span>
                  <span className="text-caption text-app-muted font-semibold uppercase tracking-headline">
                    Alerts
                  </span>
                </div>
              </div>

              {/* Details Fields — icons are neutral; colour carries meaning only */}
              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-body">
                  <PlaySquare className="w-4 h-4 text-app-muted shrink-0" />
                  <span className="text-app-muted">Playlist:</span>
                  <span className="font-semibold text-app-text truncate">{group.playlist}</span>
                </div>
                <div className="flex items-center gap-2 text-body">
                  <Calendar className="w-4 h-4 text-app-muted shrink-0" />
                  <span className="text-app-muted">Schedule:</span>
                  <span className="font-semibold text-app-text truncate">{group.schedule}</span>
                </div>
                <div className="flex items-center gap-2 text-body">
                  <MapPin className="w-4 h-4 text-app-muted shrink-0" />
                  <span className="text-app-muted">Locations:</span>
                  <span className="font-semibold text-app-text">{group.locationsCount} outlets</span>
                </div>
              </div>
            </CardBody>

            <CardFooter>
              <span className="text-caption text-app-muted">Last Sync: {group.lastDeployment}</span>
              {isWarning && (
                <span className="text-caption font-semibold text-app-danger-text flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Incidents Active
                </span>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
