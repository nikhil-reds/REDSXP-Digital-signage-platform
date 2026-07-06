"use client";

import React from "react";
import { MessageSquare, AlertCircle, CheckCircle, HelpCircle } from "lucide-react";

export interface SupportTicket {
  id: string;
  ticketNumber: number;
  subject: string;
  category: "Hardware" | "Network" | "Content" | "General";
  priority: "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved";
  lastUpdated: string;
}

interface TicketsListProps {
  tickets: SupportTicket[];
  selectedId: string | null;
  onSelectTicket: (ticket: SupportTicket) => void;
  onCloseTicket: (id: string) => void;
}

export default function TicketsList({
  tickets,
  selectedId,
  onSelectTicket,
  onCloseTicket
}: TicketsListProps) {
  return (
    <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl overflow-hidden shadow-xs flex-1 flex flex-col min-h-0">
      
      <div className="overflow-y-auto flex-1">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F6F7F9] dark:bg-[#171F2C]/50 text-[#657080] dark:text-[#9AA7B7] font-bold border-b border-[#E2E6EC] dark:border-[#283243] select-none">
              <th className="p-3.5">ID</th>
              <th className="p-3.5">Subject Description</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Priority</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Last Updated</th>
              <th className="p-3.5 text-right pr-6">Chat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E6EC] dark:divide-[#283243]">
            {tickets.map((ticket) => {
              const isSelected = selectedId === ticket.id;
              const isHigh = ticket.priority === "High";
              const isMed = ticket.priority === "Medium";
              const isResolved = ticket.status === "Resolved";

              return (
                <tr
                  key={ticket.id}
                  onClick={() => onSelectTicket(ticket)}
                  className={`hover:bg-[#F6F7F9]/30 dark:hover:bg-[#171F2C]/10 transition-all cursor-pointer ${
                    isSelected ? "bg-[#2859D9]/5 dark:bg-[#6F96FF]/5 font-semibold" : ""
                  }`}
                >
                  <td className="p-3.5 text-zinc-400 font-mono font-bold">
                    #{ticket.ticketNumber}
                  </td>
                  <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-50">
                    {ticket.subject}
                  </td>
                  
                  <td className="p-3.5 text-zinc-550 dark:text-zinc-400">
                    {ticket.category}
                  </td>

                  {/* Priority Tag */}
                  <td className="p-3.5">
                    <span className={`text-[9px] font-bold uppercase ${
                      isHigh ? "text-red-500" : isMed ? "text-amber-500" : "text-zinc-400"
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>

                  {/* Status Tag */}
                  <td className="p-3.5">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border inline-flex items-center gap-1 ${
                      isResolved
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450 border-emerald-100/50"
                        : ticket.status === "In Progress"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-450 border-blue-100/50"
                        : "bg-red-50 text-red-705 dark:bg-red-950/20 dark:text-red-400 border-red-100/50 animate-pulse"
                    }`}>
                      {isResolved && <CheckCircle className="w-2.5 h-2.5" />}
                      <span>{ticket.status}</span>
                    </span>
                  </td>

                  <td className="p-3.5 text-zinc-400 font-mono text-[10px]">
                    {ticket.lastUpdated}
                  </td>

                  {/* Chat Icon link */}
                  <td className="p-3.5 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => onSelectTicket(ticket)}
                        className={`p-1 rounded hover:bg-[#F6F7F9] dark:hover:bg-[#171F2C] cursor-pointer ${
                          isSelected ? "text-[#2859D9] dark:text-[#6F96FF]" : "text-zinc-450"
                        }`}
                        title="Open Live Chat"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      
                      {/* Close button if resolved */}
                      {isResolved && (
                        <button
                          onClick={() => onCloseTicket(ticket.id)}
                          className="px-2 py-0.5 border border-[#E2E6EC] dark:border-[#283243] hover:bg-zinc-50 dark:hover:bg-zinc-800 text-[9px] font-bold rounded text-zinc-500 cursor-pointer"
                        >
                          Archive
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
