"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button, FieldLabel, Modal, Select, TextInput } from "@/components/ui";
import { SupportTicket } from "./tickets-list";

export default function TicketCreateModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (ticket: SupportTicket) => void }) {
  const [subject, setSubject] = useState(""); const [category, setCategory] = useState<SupportTicket["category"]>("Hardware"); const [priority, setPriority] = useState<SupportTicket["priority"]>("Medium"); const [description, setDescription] = useState("");
  return <Modal open onClose={onClose} title="Create support ticket" description="Submit an issue to IT Operations." size="md"><form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSuccess({ id: `tkt-${Date.now()}`, ticketNumber: Math.floor(Math.random() * 500) + 1050, subject, category, priority, status: "Open", lastUpdated: "Just now" }); }}>
    <div><FieldLabel htmlFor="ticket-subject">Issue subject</FieldLabel><TextInput id="ticket-subject" value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Describe the issue briefly" required /></div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div><FieldLabel htmlFor="ticket-category">Category</FieldLabel><Select id="ticket-category" value={category} onChange={(event) => setCategory(event.target.value as SupportTicket["category"])}><option>Hardware</option><option>Network</option><option>Content</option><option>General</option></Select></div><div><FieldLabel htmlFor="ticket-priority">Priority</FieldLabel><Select id="ticket-priority" value={priority} onChange={(event) => setPriority(event.target.value as SupportTicket["priority"])}><option>High</option><option>Medium</option><option>Low</option></Select></div></div>
    <div><FieldLabel htmlFor="ticket-description">Details and description</FieldLabel><textarea id="ticket-description" value={description} onChange={(event) => setDescription(event.target.value)} rows={5} className="w-full rounded-lg border border-app-border bg-app-surface-alt px-3 py-2 text-body text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text" required /></div>
    <div className="flex justify-end gap-2 border-t border-app-border pt-4"><Button type="button" size="sm" onClick={onClose}>Discard</Button><Button type="submit" size="sm" variant="primary" icon={Send}>Submit ticket</Button></div>
  </form></Modal>;
}
