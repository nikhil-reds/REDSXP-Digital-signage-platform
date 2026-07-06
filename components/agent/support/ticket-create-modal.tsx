"use client";

import React, { useState } from "react";
import { X, Send, Cpu, Layers } from "lucide-react";

interface TicketCreateModalProps {
  onClose: () => void;
  onSuccess: (newTicket: any) => void;
}

export default function TicketCreateModal({ onClose, onSuccess }: TicketCreateModalProps) {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<"Hardware" | "Network" | "Content" | "General">("Hardware");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess({
      id: `tkt-${Date.now()}`,
      ticketNumber: Math.floor(Math.random() * 500) + 1050,
      subject,
      category,
      priority,
      status: "Open",
      lastUpdated: "Just Now",
      description
    });
  };

  return (
    <div className="fixed inset-0 bg-black/55 dark:bg-black/80 flex items-center justify-center z-50 animate-fadeIn font-sans p-6">
      <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl w-[460px] max-w-full shadow-2xl flex flex-col overflow-hidden text-xs">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E2E6EC] dark:border-[#283243] flex justify-between items-center bg-[#F6F7F9]/50 dark:bg-[#171F2C]/20">
          <div>
            <h3 className="font-bold text-sm text-[#18202B] dark:text-[#F2F5F8]">
              Create Support Ticket
            </h3>
            <p className="text-[10px] text-[#657080] dark:text-[#9AA7B7] mt-0.5">
              Submit hardware, network, or playlist issues to the IT Operations helpdesk.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-55 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Subject */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Issue Subject</label>
            <input
              type="text"
              placeholder="e.g. Indiranagar Screen 03 delayed sync"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-805 dark:text-zinc-200 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Support Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-705 dark:text-zinc-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="Hardware">Hardware</option>
                <option value="Network">Network</option>
                <option value="Content">Content</option>
                <option value="General">General</option>
              </select>
            </div>

            {/* Priority selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-705 dark:text-zinc-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Details body text area */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Details & Description</label>
            <textarea
              placeholder="Provide a detailed description of the offline status or sync lag..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3.5 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-850 dark:text-zinc-200 focus:outline-none leading-relaxed font-mono"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-2 border-t border-[#E2E6EC] dark:border-[#283243]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#E2E6EC] dark:border-[#283243] font-bold rounded-lg text-zinc-650 dark:text-zinc-350 hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] font-bold rounded-lg hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Ticket</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
