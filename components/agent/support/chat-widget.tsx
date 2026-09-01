"use client";

import React, { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Badge, Card, IconButton, TextInput } from "@/components/ui";
import { SupportTicket } from "./tickets-list";

interface ChatMessage { id: string; sender: string; role: "helpdesk" | "operator"; text: string; time: string }

export default function ChatWidget({ ticket }: { ticket: SupportTicket | null }) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => ticket ? [{ id: "1", sender: "IT Helpdesk", role: "helpdesk", text: `Support has been assigned to ticket #${ticket.ticketNumber}. Current state: ${ticket.status}.`, time: "Just now" }] : []);
  const [text, setText] = useState("");

  const send = (event: React.FormEvent) => {
    event.preventDefault(); if (!ticket || !text.trim()) return;
    setMessages((current) => [...current, { id: `msg-${Date.now()}`, sender: "Aarav Mehta (You)", role: "operator", text: text.trim(), time: "Just now" }]); setText("");
  };

  if (!ticket) return <Card size="panel" padded className="flex h-[450px] w-full flex-col items-center justify-center gap-2 text-center lg:w-80"><MessageSquare className="h-8 w-8 text-app-muted" /><h3 className="font-heading text-h6 font-semibold text-app-text">Live support chat</h3><p className="max-w-[220px] text-body text-app-muted">Select an active ticket to chat with support.</p></Card>;

  return <Card size="panel" className="flex h-[450px] w-full flex-col overflow-hidden lg:w-80">
    <div className="flex items-center justify-between gap-3 border-b border-app-border bg-app-surface-alt p-4"><div className="min-w-0"><span className="block text-caption font-semibold text-app-muted">Ticket #{ticket.ticketNumber}</span><span className="block truncate text-body font-semibold text-app-text">{ticket.subject}</span></div><Badge tone="accent">{ticket.category}</Badge></div>
    <div className="flex-1 space-y-4 overflow-y-auto bg-app-surface p-4">{messages.map((message) => <div key={message.id} className={`flex max-w-[230px] flex-col ${message.role === "operator" ? "ml-auto items-end" : "items-start"}`}><span className="mb-1 text-caption font-semibold text-app-muted">{message.sender}</span><div className={`rounded-xl border p-3 text-body ${message.role === "operator" ? "rounded-tr-none border-app-accent bg-app-accent text-app-accent-on" : "rounded-tl-none border-app-border bg-app-surface-alt text-app-text"}`}>{message.text}</div><span className="mt-1 text-caption text-app-muted">{message.time}</span></div>)}</div>
    <form onSubmit={send} className="flex gap-2 border-t border-app-border bg-app-surface p-3"><TextInput value={text} onChange={(event) => setText(event.target.value)} placeholder="Type support reply…" aria-label="Support reply" /><IconButton type="submit" variant="primary" icon={Send} aria-label="Send reply" /></form>
  </Card>;
}
