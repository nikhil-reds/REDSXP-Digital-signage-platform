"use client";

import React, { useState } from "react";
import { X, PlaySquare, Calendar, Monitor, Sparkles, WifiOff, CheckCircle2 } from "lucide-react";
import { ScreenGroup } from "./groups-grid";

interface GroupEditModalProps {
  group: ScreenGroup;
  onClose: () => void;
  onSave: (updated: ScreenGroup) => void;
}

// Mock available screens list for assignments
const mockScreens = [
  { id: "scr-1", name: "Koramangala Entrance", group: "Bengaluru Flagship Stores", assigned: true },
  { id: "scr-2", name: "MG Road Menu Board 01", group: "Menu Boards", assigned: true },
  { id: "scr-3", name: "MG Road Menu Board 02", group: "Menu Boards", assigned: true },
  { id: "scr-4", name: "Phoenix Mall Display", group: "Mall Stores", assigned: true },
  { id: "scr-5", name: "Indiranagar Screen 03", group: "Bengaluru Flagship Stores", assigned: true },
  { id: "scr-6", name: "Airport T2 Counter 04", group: "Airport Outlets", assigned: true },
  { id: "scr-7", name: "Whitefield Store 01", group: "None", assigned: false },
  { id: "scr-8", name: "Whitefield Store 02", group: "None", assigned: false },
  { id: "scr-9", name: "Jayanagar Screen 01", group: "None", assigned: false },
  { id: "scr-10", name: "Jayanagar Screen 02", group: "None", assigned: false }
];

export default function GroupEditModal({ group, onClose, onSave }: GroupEditModalProps) {
  const [name, setName] = useState(group.name);
  const [playlist, setPlaylist] = useState(group.playlist);
  const [schedule, setSchedule] = useState(group.schedule);
  
  // Manage assigned screen IDs
  const [assignedIds, setAssignedIds] = useState<string[]>(() => {
    // Initial assignment matching the screen group name
    return mockScreens
      .filter((s) => s.group === group.name)
      .map((s) => s.id);
  });

  const handleToggleScreen = (id: string, checked: boolean) => {
    if (checked) {
      setAssignedIds([...assignedIds, id]);
    } else {
      setAssignedIds(assignedIds.filter((x) => x !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...group,
      name,
      playlist,
      schedule,
      screensCount: assignedIds.length
    });
  };

  return (
    <div className="fixed inset-0 bg-black/55 dark:bg-black/80 flex items-center justify-center z-50 animate-fadeIn font-sans">
      <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl w-[520px] max-w-full shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E2E6EC] dark:border-[#283243] flex justify-between items-center bg-[#F6F7F9]/50 dark:bg-[#171F2C]/20">
          <div>
            <h3 className="font-bold text-sm text-[#18202B] dark:text-[#F2F5F8]">
              Configure Screen Group
            </h3>
            <p className="text-[10px] text-[#657080] dark:text-[#9AA7B7] mt-0.5">
              Edit playlist, schedule allocation, and screen assignments.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-55 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          
          {/* Group Name input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Group Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-[#18202B] dark:text-[#F2F5F8] focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Playlist dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Assigned Playlist
              </label>
              <select
                value={playlist}
                onChange={(e) => setPlaylist(e.target.value)}
                className="w-full px-3 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-700 dark:text-zinc-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="Monsoon Café Promotions">Monsoon Café Promotions</option>
                <option value="Airport Express Menu">Airport Express Menu</option>
                <option value="Lunch Combos">Lunch Combos</option>
                <option value="Breakfast Menu">Breakfast Menu</option>
              </select>
            </div>

            {/* Schedule dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Active Schedule
              </label>
              <select
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="w-full px-3 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-700 dark:text-zinc-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="Monsoon Promotions (4:00 PM–9:30 PM)">Monsoon Promotions</option>
                <option value="Airport Express Menu (All day)">Airport Express Menu</option>
                <option value="Lunch Combos (11:00 AM–4:00 PM)">Lunch Combos</option>
                <option value="Breakfast Menu (6:00 AM–11:00 AM)">Breakfast Menu</option>
              </select>
            </div>
          </div>

          {/* Screen Allocations List */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Assign Screens ({assignedIds.length} screens assigned)
            </label>
            <div className="border border-[#E2E6EC] dark:border-[#283243] rounded-lg max-h-40 overflow-y-auto divide-y divide-[#E2E6EC] dark:divide-[#283243] bg-white dark:bg-zinc-950 p-1">
              {mockScreens.map((s) => {
                const isAssigned = assignedIds.includes(s.id);
                return (
                  <label
                    key={s.id}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-[#F6F7F9]/50 dark:hover:bg-[#171F2C]/20 rounded-md cursor-pointer text-xs transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isAssigned}
                      onChange={(e) => handleToggleScreen(s.id, e.target.checked)}
                      className="rounded border-[#E2E6EC] dark:border-[#283243] focus:ring-[#2859D9]"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="block font-bold text-zinc-800 dark:text-zinc-200">
                        {s.name}
                      </span>
                      {s.group !== "None" && s.group !== group.name && (
                        <span className="text-[9px] text-amber-500 font-semibold uppercase">
                          Warning: Currently in group "{s.group}"
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Publish Preview Panel */}
          <div className="p-3.5 border border-blue-100 dark:border-blue-900/30 bg-blue-50/20 dark:bg-blue-950/10 rounded-xl space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#2859D9] dark:text-[#6F96FF] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Publish Impact Summary
            </h4>
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 space-y-1 leading-relaxed">
              <p>● Changes will immediately sync to <span className="font-bold text-zinc-700 dark:text-zinc-200">{assignedIds.length} players</span>.</p>
              {group.alertsCount > 0 ? (
                <p className="flex items-center gap-1 text-amber-600 dark:text-amber-500 font-semibold">
                  <WifiOff className="w-3 h-3 shrink-0" />
                  1 player ({group.name} offline device) is currently disconnected and will receive this manifest upon next heartbeat check-in.
                </p>
              ) : (
                <p className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500 font-semibold">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  All targeted screens are online and will update in &lt;10 seconds.
                </p>
              )}
            </div>
          </div>

        </form>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#E2E6EC] dark:border-[#283243] flex gap-2 justify-end bg-[#F6F7F9]/50 dark:bg-[#171F2C]/20 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#E2E6EC] dark:border-[#283243] text-xs font-bold rounded-lg text-zinc-650 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Discard
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] text-xs font-bold rounded-lg hover:opacity-90 transition-opacity cursor-pointer animate-pulse"
          >
            Publish Changes
          </button>
        </div>

      </div>
    </div>
  );
}
