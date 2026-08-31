"use client";

import React from "react";
import { Archive, MessageSquare } from "lucide-react";
import { Badge, Button, IconButton, TableCard, Td, Th, Tr } from "@/components/ui";

export interface SupportTicket { id: string; ticketNumber: number; subject: string; category: "Hardware" | "Network" | "Content" | "General"; priority: "High" | "Medium" | "Low"; status: "Open" | "In Progress" | "Resolved"; lastUpdated: string }

export default function TicketsList({ tickets, selectedId, onSelectTicket, onCloseTicket }: { tickets: SupportTicket[]; selectedId: string | null; onSelectTicket: (ticket: SupportTicket) => void; onCloseTicket: (id: string) => void }) {
  return <TableCard title="Support tickets" description={`${tickets.length} ticket${tickets.length === 1 ? "" : "s"} matching the current filters`} icon={MessageSquare} className="min-h-0 flex-1">
    <table className="w-full min-w-[820px] border-collapse text-left"><thead className="bg-app-surface-alt"><tr><Th>ID</Th><Th>Subject</Th><Th>Category</Th><Th>Priority</Th><Th>Status</Th><Th>Last updated</Th><Th className="text-right">Actions</Th></tr></thead>
      <tbody>{tickets.map((ticket) => {
        const selected = selectedId === ticket.id;
        const resolved = ticket.status === "Resolved";
        const priorityTone = ticket.priority === "High" ? "danger" : ticket.priority === "Medium" ? "warning" : "neutral";
        const statusTone = resolved ? "accent" : ticket.status === "Open" ? "danger" : "neutral";
        return <Tr key={ticket.id} interactive selected={selected} onClick={() => onSelectTicket(ticket)}>
          <Td className="font-semibold text-app-muted">#{ticket.ticketNumber}</Td><Td className="font-semibold">{ticket.subject}</Td><Td className="text-app-muted">{ticket.category}</Td><Td><Badge tone={priorityTone}>{ticket.priority}</Badge></Td><Td><Badge tone={statusTone}>{ticket.status}</Badge></Td><Td className="text-app-muted">{ticket.lastUpdated}</Td>
          <Td className="text-right" onClick={(event) => event.stopPropagation()}><div className="inline-flex gap-1"><IconButton size="sm" icon={MessageSquare} aria-label={`Open chat for ticket ${ticket.ticketNumber}`} title="Open live chat" onClick={() => onSelectTicket(ticket)} />{resolved && <Button size="sm" icon={Archive} onClick={() => onCloseTicket(ticket.id)}>Archive</Button>}</div></Td>
        </Tr>;
      })}{tickets.length === 0 && <Tr><Td colSpan={7} className="py-12 text-center text-app-muted">No tickets match the current filters.</Td></Tr>}</tbody>
    </table>
  </TableCard>;
}
