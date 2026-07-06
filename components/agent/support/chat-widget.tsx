"use client";

import React, { useState, useEffect } from "react";
import { Send, MessageSquare, User, Server } from "lucide-react";
import { SupportTicket } from "./tickets-list";

interface ChatMessage {
  id: string;
  sender: string;
  role: "helpdesk" | "operator";
  text: string;
  time: string;
}

interface ChatWidgetProps {
  ticket: SupportTicket | null;
}

export default function ChatWidget({ ticket }: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");

  // Update messages based on selected ticket
  useEffect(() => {
    if (!ticket) {
      setMessages([]);
      return;
    }

    // Load mock conversation matching ticket category/issue
    if (ticket.ticketNumber === 1024) {
      setMessages([
        { id: "1", sender: "Rohan (IT Helpdesk)", role: "helpdesk", text: "Hi Aarav, I see MG Road Menu Board 02 went offline. I'm checking the edge logs right now.", time: "15m ago" },
        { id: "2", sender: "Aarav Mehta (You)", role: "operator", text: "Thanks. Let me know if we need a manual site visit or if a remote reboot would clear it.", time: "12m ago" },
        { id: "3", sender: "Rohan (IT Helpdesk)", role: "helpdesk", text: "I'm attempting a remote ping. The ethernet switch shows link lights but no handshake response yet.", time: "8m ago" }
      ]);
    } else if (ticket.ticketNumber === 1020) {
      setMessages([
        { id: "1", sender: "Sneha (IT Helpdesk)", role: "helpdesk", text: "Hi Aarav, Phoenix Mall display eMMC storage is at 94%. We should purge archived video logs.", time: "1h ago" },
        { id: "2", sender: "Aarav Mehta (You)", role: "operator", text: "Agreed. I'll archive the older summer campaign promos now to free up space.", time: "45m ago" },
        { id: "3", sender: "Sneha (IT Helpdesk)", role: "helpdesk", text: "Perfect. Purging the files will clear approximately 40 GB. Let me know once complete.", time: "30m ago" }
      ]);
    } else {
      setMessages([
        { id: "1", sender: "IT Helpdesk", role: "helpdesk", text: `Support agent has been assigned to Ticket #${ticket.ticketNumber}. State: ${ticket.status}`, time: "Just Now" }
      ]);
    }
  }, [ticket]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !ticket) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "Aarav Mehta (You)",
      role: "operator",
      text: text.trim(),
      time: "Just Now"
    };

    setMessages([...messages, newMessage]);
    setText("");

    // Simple auto response simulator
    setTimeout(() => {
      const autoReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "IT Helpdesk Bot",
        role: "helpdesk",
        text: "Thank you for the update. Our support specialists have logged your notes and will reply shortly.",
        time: "Just Now"
      };
      setMessages((current) => [...current, autoReply]);
    }, 1200);
  };

  if (!ticket) {
    return (
      <div className="w-80 border border-[#E2E6EC] dark:border-[#283243] bg-[#F6F7F9]/30 dark:bg-[#111722]/30 rounded-xl flex flex-col items-center justify-center p-6 text-center text-zinc-400 space-y-2 h-[450px]">
        <MessageSquare className="w-8 h-8 text-zinc-300 animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Live Support Chat</span>
        <p className="text-[10px] text-zinc-400 max-w-[200px]">
          Select an active ticket from the helpdesk queue to chat directly with support.
        </p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl flex flex-col h-[450px] overflow-hidden shadow-xs">
      
      {/* Header */}
      <div className="p-3.5 border-b border-[#E2E6EC] dark:border-[#283243] bg-[#F6F7F9]/50 dark:bg-[#171F2C]/30 flex justify-between items-center text-xs shrink-0 select-none">
        <div className="min-w-0">
          <span className="text-[9px] font-bold text-zinc-400 block uppercase">Ticket #{ticket.ticketNumber}</span>
          <span className="font-bold text-zinc-850 dark:text-zinc-50 truncate block max-w-[180px]">{ticket.subject}</span>
        </div>
        <span className="text-[9px] font-bold text-[#2859D9] bg-[#2859D9]/10 px-1.5 py-0.2 rounded border border-[#2859D9]/20 uppercase">
          {ticket.category}
        </span>
      </div>

      {/* Messages Scroll feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-zinc-50/10 dark:bg-zinc-950/10 text-xs">
        {messages.map((msg) => {
          const isOperator = msg.role === "operator";
          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[220px] ${
                isOperator ? "ml-auto items-end" : "mr-auto items-start"
              }`}
            >
              <span className="text-[8px] font-bold text-zinc-400 block mb-0.5">{msg.sender}</span>
              <div
                className={`p-2.5 rounded-xl border leading-relaxed ${
                  isOperator
                    ? "bg-[#2859D9] text-white border-[#2859D9] rounded-tr-none"
                    : "bg-white dark:bg-zinc-900 border-[#E2E6EC] dark:border-[#283243] text-zinc-800 dark:text-zinc-200 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[7px] text-zinc-450 mt-0.5 font-mono">{msg.time}</span>
            </div>
          );
        })}
      </div>

      {/* Bottom text Input field */}
      <form onSubmit={handleSend} className="p-3 border-t border-[#E2E6EC] dark:border-[#283243] flex gap-2 shrink-0 bg-white dark:bg-[#111722]">
        <input
          type="text"
          placeholder="Type support reply..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 px-3 py-1.5 border border-[#E2E6EC] dark:border-[#283243] bg-[#F6F7F9] dark:bg-[#171F2C]/50 rounded-lg text-xs focus:outline-none"
        />
        <button
          type="submit"
          className="p-2 bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] rounded-lg hover:opacity-90 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
}
