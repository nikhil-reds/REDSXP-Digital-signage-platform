"use client";

import React from "react";
import { AlertCircle, AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";
import { StatGrid, StatTile } from "@/components/ui";

export interface AlertIncident {
  id: string;
  deviceName: string;
  issue: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  groupName: string;
  startTime: string;
  duration: string;
  status: "Active" | "Acknowledged" | "Resolved";
}

export default function AlertsStatsBanner({ alerts }: { alerts: AlertIncident[] }) {
  const unresolved = alerts.filter((alert) => alert.status !== "Resolved");
  const count = (severity: AlertIncident["severity"]) =>
    unresolved.filter((alert) => alert.severity === severity).length;

  return (
    <StatGrid columns={5}>
      <StatTile label="Total active" value={`${unresolved.length}`} icon={ShieldAlert} />
      <StatTile label="Critical" value={`${count("Critical")}`} icon={AlertCircle} tone="danger" />
      <StatTile label="High" value={`${count("High")}`} icon={AlertTriangle} tone="danger" />
      <StatTile label="Medium" value={`${count("Medium")}`} icon={AlertTriangle} tone="warning" />
      <StatTile label="Low" value={`${count("Low")}`} icon={CheckCircle} />
    </StatGrid>
  );
}
