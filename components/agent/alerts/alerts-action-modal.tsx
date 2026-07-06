"use client";

import React, { useState } from "react";
import { X, Send, AlertTriangle, ShieldCheck, Cpu } from "lucide-react";
import { AlertIncident } from "./alerts-stats-banner";

interface AlertsActionModalProps {
  type: "reboot" | "ticket";
  deviceName?: string;
  alert?: AlertIncident | null;
  onClose: () => void;
  onConfirm: (data?: any) => void;
}

export default function AlertsActionModal({
  type,
  deviceName,
  alert,
  onClose,
  onConfirm
}: AlertsActionModalProps) {
  
  // Ticket Form States
  const [subject, setSubject] = useState(alert ? `[ALERT] - ${alert.issue} on ${alert.deviceName}` : "");
  const [category, setCategory] = useState("Hardware Support");
  const [body, setBody] = useState(alert ? `Active alert detail:\nDevice: ${alert.deviceName}\nGroup: ${alert.groupName}\nSeverity: ${alert.severity}\nTime Started: ${alert.startTime}\nDuration: ${alert.duration}` : "");

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({ subject, category, body });
  };

  return (
    <div className="fixed inset-0 bg-black/55 dark:bg-black/80 flex items-center justify-center z-50 animate-fadeIn font-sans">
      <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl w-[460px] max-w-full shadow-2xl flex flex-col overflow-hidden text-xs">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E2E6EC] dark:border-[#283243] flex justify-between items-center bg-[#F6F7F9]/50 dark:bg-[#171F2C]/20">
          <div>
            <h3 className="font-bold text-sm text-[#18202B] dark:text-[#F2F5F8]">
              {type === "reboot" ? "Reboot Device Player" : "Create Support Ticket"}
            </h3>
            <p className="text-[10px] text-[#657080] dark:text-[#9AA7B7] mt-0.5">
              {type === "reboot" ? "Remote player restart command." : "File incident logs with IT operations."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-55 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* REBOOT DEVICE POPUP */}
        {type === "reboot" && (
          <div className="p-5 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/20 text-red-500 flex items-center justify-center mx-auto border border-red-100/50">
              <Cpu className="w-6 h-6" />
            </div>

            <div className="space-y-1.5 max-w-sm mx-auto">
              <span className="block font-bold text-zinc-850 dark:text-zinc-200">
                Confirm Remote Reboot for "{deviceName}"?
              </span>
              <p className="text-[11px] text-zinc-450 leading-relaxed">
                This command immediately restarts the BrightSign player at the edge. The display will go black for approximately 45–60 seconds.
              </p>
            </div>

            <div className="p-3 bg-amber-50/50 border border-amber-100/50 dark:bg-[#171F2C] dark:border-zinc-800 rounded-lg text-left text-[10px] text-amber-800 dark:text-amber-450 font-medium flex gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
              <span>Safety Warning: Do not reboot during active flagship menu sales cycles unless player heartbeat is offline.</span>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-[#E2E6EC] dark:border-[#283243] font-bold rounded-lg text-zinc-650 dark:text-zinc-350 hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => onConfirm()}
                className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white font-bold rounded-lg transition-colors cursor-pointer shadow-sm animate-pulse"
              >
                Send Reboot Command
              </button>
            </div>
          </div>
        )}

        {/* SUPPORT TICKET FORM */}
        {type === "ticket" && (
          <form onSubmit={handleTicketSubmit} className="p-5 space-y-4">
            {/* Subject */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Ticket Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
                required
              />
            </div>

            {/* Category selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Support Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-705 dark:text-zinc-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="Hardware Support">Hardware & Player Diagnostics</option>
                <option value="Network Support">Network Outages & Sync Lag</option>
                <option value="Content Support">Content Syncing & Playlist Errors</option>
                <option value="General Support">General Maintenance Support</option>
              </select>
            </div>

            {/* Details body text area */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Details & Description</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
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
        )}

      </div>
    </div>
  );
}
