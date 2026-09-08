"use client";

import React from "react";
import { Edit2, AlertTriangle } from "lucide-react";
import { ScreenGroup } from "./groups-grid";
import { Badge, Card, IconButton, Td, Th, Tr } from "@/components/ui";

interface GroupsTableProps {
  groups: ScreenGroup[];
  onEditGroup: (group: ScreenGroup) => void;
}

export default function GroupsTable({ groups, onEditGroup }: GroupsTableProps) {
  return (
    <Card size="panel" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-app-surface-alt select-none">
              <Th>Group Name</Th>
              <Th>Screens</Th>
              <Th>Online Uptime</Th>
              <Th>Active Playlist</Th>
              <Th>Active Schedule</Th>
              <Th>Locations</Th>
              <Th>Alerts Warnings</Th>
              <Th>Last Deployment Sync</Th>
              <Th className="w-12 text-center">Edit</Th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => {
              const isWarning = group.alertsCount > 0;
              return (
                <Tr key={group.id} interactive>
                  <Td className="font-semibold">{group.name}</Td>
                  <Td className="text-app-muted">{group.screensCount} screens</Td>

                  <Td>
                    <Badge tone={group.onlinePercentage >= 95 ? "accent" : "warning"}>
                      {group.onlinePercentage}%
                    </Badge>
                  </Td>

                  <Td className="text-app-accent-text font-semibold">{group.playlist}</Td>
                  <Td className="text-app-muted">{group.schedule}</Td>
                  <Td className="text-app-muted">{group.locationsCount} stores</Td>

                  <Td>
                    {isWarning ? (
                      <Badge tone="danger">
                        <AlertTriangle className="w-3 h-3 shrink-0" aria-hidden />
                        {group.alertsCount} Alert
                      </Badge>
                    ) : (
                      <span className="text-caption text-app-muted">—</span>
                    )}
                  </Td>

                  <Td className="text-app-muted">{group.lastDeployment}</Td>

                  <Td className="text-center">
                    <IconButton
                      icon={Edit2}
                      size="sm"
                      onClick={() => onEditGroup(group)}
                      aria-label={`Edit ${group.name}`}
                    />
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
