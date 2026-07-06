"use client";

import React, { useState } from "react";
import { Plus, Search, Filter, MessageSquare, ShieldCheck, ChevronDown } from "lucide-react";
import TicketsList, { SupportTicket } from "@/components/agent/support/tickets-list";
import TicketCreateModal from "@/components/agent/support/ticket-create-modal";
import ChatWidget from "@/components/agent/support/chat-widget";

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
    <div className="py-6 px-8 h-full flex flex-col min-h-0 overflow-hidden font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E6EC] dark:border-[#283243] pb-5 shrink-0">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-55 tracking-tight flex items-center gap-2">
            Support Helpdesk & Live Chat
          </h1>
          <p className="text-xs text-[#657080] dark:text-[#9AA7B7]">
            File hardware maintenance requests, report connectivity drops, and chat directly with operations specialists.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] px-3.5 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Support Ticket</span>
        </button>
      </div>

      {/* Query Filters */}
      <div className="p-4 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-6 shrink-0">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search tickets, IDs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-[#18202B] dark:text-[#F2F5F8] placeholder-zinc-450 focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-8 pr-8 py-1.5 border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-[#F6F7F9] dark:bg-[#171F2C]/50 text-xs text-zinc-705 dark:text-zinc-300 font-bold focus:outline-none appearance-none cursor-pointer"
          >
            <option value="All">All Ticket States</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
        </div>

        {/* Priority Filter */}
        <div className="relative">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full pl-8 pr-8 py-1.5 border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-[#F6F7F9] dark:bg-[#171F2C]/50 text-xs text-zinc-705 dark:text-zinc-300 font-bold focus:outline-none appearance-none cursor-pointer"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full pl-8 pr-8 py-1.5 border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-[#F6F7F9] dark:bg-[#171F2C]/50 text-xs text-zinc-705 dark:text-zinc-300 font-bold focus:outline-none appearance-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Hardware">Hardware</option>
            <option value="Network">Network</option>
            <option value="Content">Content</option>
            <option value="General">General</option>
          </select>
          <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
        </div>
      </div>

      {/* Main split dashboard panel */}
      <div className="flex-1 flex gap-6 min-h-0">
        
        {/* Left Side: Ticket list queue */}
        <TicketsList
          tickets={filteredTickets}
          selectedId={selectedTicket?.id || null}
          onSelectTicket={(t) => setSelectedTicket(t)}
          onCloseTicket={handleCloseTicket}
        />

        {/* Right Side: Live chat widget mockup */}
        <div className="shrink-0">
          <ChatWidget ticket={selectedTicket} />
        </div>

      </div>

      {/* Ticket Create Form Overlay */}
      {showCreateModal && (
        <TicketCreateModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateTicketSuccess}
        />
      )}

    </div>
  );
}
