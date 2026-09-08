"use client";

import React from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { Badge, TableCard, Td, Th, Tr } from "@/components/ui";

interface UptimeRecord {
  id: string; name: string; location: string; uptime: number; offlineDuration: string;
  connection: "Good" | "Fair" | "Weak"; lastSync: string;
}

const mockRecords: UptimeRecord[] = [
  { id: "up-1", name: "Koramangala Entrance", location: "Koramangala 5th Block", uptime: 99.8, offlineDuration: "None", connection: "Good", lastSync: "14s ago" },
  { id: "up-2", name: "MG Road Menu Board 01", location: "MG Road", uptime: 99.7, offlineDuration: "None", connection: "Good", lastSync: "9s ago" },
  { id: "up-3", name: "MG Road Menu Board 02", location: "MG Road", uptime: 96.2, offlineDuration: "18m", connection: "Weak", lastSync: "18m ago" },
  { id: "up-4", name: "Phoenix Mall Display", location: "Mahadevapura", uptime: 98.4, offlineDuration: "None", connection: "Fair", lastSync: "21s ago" },
  { id: "up-5", name: "Indiranagar Screen 03", location: "Indiranagar", uptime: 98.1, offlineDuration: "1.2m", connection: "Fair", lastSync: "72s ago" },
  { id: "up-6", name: "Airport T2 Counter 04", location: "Kempegowda Airport", uptime: 100, offlineDuration: "None", connection: "Good", lastSync: "18s ago" },
];

export default function UptimeHistory() {
  return (
    <TableCard title="Player connection and uptime" description="Seven-day SLA history" icon={ShieldCheck}>
      <table className="w-full min-w-[820px] border-collapse text-left">
        <thead className="bg-app-surface-alt"><tr><Th>Display player</Th><Th>Store location</Th><Th>Uptime compliance</Th><Th>Offline duration</Th><Th>Signal rating</Th><Th>Last manifest sync</Th></tr></thead>
        <tbody>
          {mockRecords.map((record) => {
            const low = record.uptime < 98.5;
            const tone = record.connection === "Good" ? "accent" : record.connection === "Weak" ? "warning" : "neutral";
            return (
              <Tr key={record.id}>
                <Td className="font-semibold">{record.name}</Td>
                <Td className="text-app-muted">{record.location}</Td>
                <Td><span className={`inline-flex items-center gap-1 font-semibold ${low ? "text-app-danger-text" : "text-app-accent-text"}`}>{low ? <AlertTriangle className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}{record.uptime}%</span></Td>
                <Td className="text-app-muted">{record.offlineDuration}</Td>
                <Td><Badge tone={tone}>{record.connection}</Badge></Td>
                <Td className="text-app-muted">{record.lastSync}</Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </TableCard>
  );
}
