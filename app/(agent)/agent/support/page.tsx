"use client";

import React, { useState } from "react";
import { Filter, Plus } from "lucide-react";
import TicketsList, { SupportTicket } from "@/components/agent/support/tickets-list";
import TicketCreateModal from "@/components/agent/support/ticket-create-modal";
import ChatWidget from "@/components/agent/support/chat-widget";
import { Button, PageShell, SearchInput, Select, Toolbar } from "@/components/ui";

const initialTickets: SupportTicket[] = [
  {
    id: "tkt-1",
    ticketNumber: 1024,
    subject: "Offline player on MG Road Menu Board 02",
    category: "Network",
    priority: "High",
    status: "Open",
    lastUpdated: "18m ago"
  },
  {
    id: "tkt-2",
    ticketNumber: 1020,
    subject: "Phoenix Mall Display storage full",
    category: "Hardware",
    priority: "Medium",
    status: "In Progress",
    lastUpdated: "2h ago"
  },
  {
    id: "tkt-3",
    ticketNumber: 1015,
    subject: "Indiranagar Screen 03 delayed sync",
    category: "Content",
    priority: "Medium",
    status: "Resolved",
    lastUpdated: "1 day ago"
  }
];

export default function AgentSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(initialTickets[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filters State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Filters application
  const filteredTickets = tickets.filter((tkt) => {
    const matchesSearch = tkt.subject.toLowerCase().includes(search.toLowerCase()) ||
                          tkt.ticketNumber.toString().includes(search);
    
    const matchesStatus = statusFilter === "All" || tkt.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || tkt.priority === priorityFilter;
    const matchesCategory = categoryFilter === "All" || tkt.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const handleCreateTicketSuccess = (newTicket: SupportTicket) => {
    setTickets([newTicket, ...tickets]);
    setSelectedTicket(newTicket);
    setShowCreateModal(false);
  };

  const handleCloseTicket = (id: string) => {
    setTickets(tickets.filter((t) => t.id !== id));
    if (selectedTicket?.id === id) {
      setSelectedTicket(tickets.length > 1 ? tickets[0] : null);
    }
  };

  return (
    <PageShell className="h-full flex flex-col min-h-0 overflow-hidden">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-app-border pb-5 shrink-0">
        <div>
          <h1 className="font-heading text-h5 font-semibold tracking-headline text-app-text">
            Support Helpdesk & Live Chat
          </h1>
          <p className="text-body text-app-muted mt-1">
            File hardware maintenance requests, report connectivity drops, and chat directly with operations specialists.
          </p>
        </div>

        <Button variant="primary" size="sm" icon={Plus}
          onClick={() => setShowCreateModal(true)}
          className="self-start sm:self-auto"
        >
          New support ticket
        </Button>
      </div>

      {/* Query Filters */}
      <Toolbar className="my-6 grid shrink-0 grid-cols-1 gap-3 rounded-xl border border-app-border bg-app-surface p-4 sm:grid-cols-2 lg:grid-cols-4">
          <SearchInput
            placeholder="Search tickets or IDs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select icon={Filter}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Ticket States</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </Select>
          <Select icon={Filter}
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Select>
          <Select icon={Filter}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Hardware">Hardware</option>
            <option value="Network">Network</option>
            <option value="Content">Content</option>
            <option value="General">General</option>
          </Select>
      </Toolbar>

      {/* Main split dashboard panel */}
      <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row">
        
        {/* Left Side: Ticket list queue */}
        <TicketsList
          tickets={filteredTickets}
          selectedId={selectedTicket?.id || null}
          onSelectTicket={(t) => setSelectedTicket(t)}
          onCloseTicket={handleCloseTicket}
        />

        {/* Right Side: Live chat widget mockup */}
        <div className="shrink-0">
          <ChatWidget key={selectedTicket?.id ?? "no-ticket"} ticket={selectedTicket} />
        </div>

      </div>

      {/* Ticket Create Form Overlay */}
      {showCreateModal && (
        <TicketCreateModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateTicketSuccess}
        />
      )}

    </PageShell>
  );
}
