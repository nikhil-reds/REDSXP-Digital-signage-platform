"use client";

import React from "react";
import { AlertCircle, CheckCircle, RefreshCw, Send } from "lucide-react";
import { Badge, Button, IconButton, StatusDot, TableCard, Td, Th, Tr } from "@/components/ui";
import { AlertIncident } from "./alerts-stats-banner";

interface AlertsTableProps {
  alerts: AlertIncident[];
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
  onReboot: (deviceName: string) => void;
  onTicket: (alert: AlertIncident) => void;
}

export default function AlertsTable({
  alerts,
  onAcknowledge,
  onResolve,
  onReboot,
  onTicket,
}: AlertsTableProps) {
  return (
    <TableCard
      title="Incident queue"
      description={`${alerts.length} incident${alerts.length === 1 ? "" : "s"} matching the current filters`}
      icon={AlertCircle}
    >
      <table className="w-full min-w-[1080px] border-collapse text-left">
        <thead className="bg-app-surface-alt">
          <tr>
            <Th>Severity</Th><Th>Issue detail</Th><Th>Device name</Th><Th>Target group</Th>
            <Th>Start time</Th><Th>Duration</Th><Th>Status</Th><Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((incident) => {
            const resolved = incident.status === "Resolved";
            const acknowledged = incident.status === "Acknowledged";
            const severityTone = incident.severity === "Critical" || incident.severity === "High"
              ? "danger" : incident.severity === "Medium" ? "warning" : "neutral";

            return (
              <Tr key={incident.id} className={resolved ? "opacity-60" : undefined}>
                <Td><Badge tone={severityTone}>{incident.severity}</Badge></Td>
                <Td className="font-semibold">{incident.issue}</Td>
                <Td>{incident.deviceName}</Td>
                <Td className="text-app-muted">{incident.groupName}</Td>
                <Td className="text-app-muted">{incident.startTime}</Td>
                <Td className="font-semibold text-app-muted">{incident.duration}</Td>
                <Td>
                  <StatusDot
                    status={resolved ? "online" : acknowledged ? "unknown" : "error"}
                    label={incident.status}
                  />
                </Td>
                <Td className="text-right">
                  <div className="inline-flex items-center gap-1.5">
                    {!acknowledged && !resolved && (
                      <Button size="sm" onClick={() => onAcknowledge(incident.id)}>Acknowledge</Button>
                    )}
                    {acknowledged && !resolved && (
                      <Button size="sm" onClick={() => onResolve(incident.id)}>Resolve</Button>
                    )}
                    {!resolved && (
                      <>
                        <IconButton size="sm" icon={Send} aria-label={`Create ticket for ${incident.deviceName}`} title="Create support ticket" onClick={() => onTicket(incident)} />
                        <IconButton size="sm" icon={RefreshCw} aria-label={`Reboot ${incident.deviceName}`} title="Reboot player" onClick={() => onReboot(incident.deviceName)} />
                      </>
                    )}
                    {resolved && <span className="inline-flex items-center gap-1 text-caption font-semibold text-app-accent-text"><CheckCircle className="h-3.5 w-3.5" />Resolved</span>}
                  </div>
                </Td>
              </Tr>
            );
          })}
          {alerts.length === 0 && <Tr><Td colSpan={8} className="py-12 text-center text-app-muted">No incidents match the current filters.</Td></Tr>}
        </tbody>
      </table>
    </TableCard>
  );
}
