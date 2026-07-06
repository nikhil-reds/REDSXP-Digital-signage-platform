"use client";

import React, { useState } from "react";
import { X, PlaySquare, Layers, Calendar, Clock, Globe, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";

interface ScheduleFormModalProps {
  onClose: () => void;
  onSuccess: (newSchedule: any) => void;
}

export default function ScheduleFormModal({ onClose, onSuccess }: ScheduleFormModalProps) {
  const [playlist, setPlaylist] = useState("Monsoon Café Promotions");
  const [target, setTarget] = useState("Bengaluru Flagship Stores");
  const [startDate, setStartDate] = useState("2026-07-04");
  const [endDate, setEndDate] = useState("2026-08-31");
  const [startTime, setStartTime] = useState("16:00");
  const [endTime, setEndTime] = useState("21:30");
  const [priority, setPriority] = useState("40");
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST)");
  const [days, setDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);

  const toggleDay = (day: string) => {
    if (days.includes(day)) {
      setDays(days.filter((d) => d !== day));
    } else {
      setDays([...days, day]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess({
      id: `sch-${Date.now()}`,
      playlistName: playlist,
      targetGroup: target,
      timeRange: `${startTime} - ${endTime}`,
      days: days.join(", "),
      priority: parseInt(priority) || 30,
      screensCount: 21,
      status: "Scheduled"
    });
  };

  return (
    <div className="fixed inset-0 bg-black/55 dark:bg-black/80 flex items-center justify-center z-50 animate-fadeIn font-sans">
      <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl w-[500px] max-w-full shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E2E6EC] dark:border-[#283243] flex justify-between items-center bg-[#F6F7F9]/50 dark:bg-[#171F2C]/20">
          <div>
            <h3 className="font-bold text-sm text-[#18202B] dark:text-[#F2F5F8]">
              Create Content Schedule
            </h3>
            <p className="text-[10px] text-[#657080] dark:text-[#9AA7B7] mt-0.5">
              Deploy playlists on target displays with timeline calendar boundaries and override rules.
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-4">
            {/* Playlist Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Signage Playlist
              </label>
              <select
                value={playlist}
                onChange={(e) => setPlaylist(e.target.value)}
                className="w-full px-3 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-705 dark:text-zinc-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="Monsoon Café Promotions">Monsoon Café Promotions</option>
                <option value="Breakfast Menu">Breakfast Menu</option>
                <option value="Lunch Combos">Lunch Combos</option>
                <option value="Weekend Live Music">Weekend Live Music</option>
                <option value="Independence Day Campaign">Independence Day Campaign</option>
              </select>
            </div>

            {/* Target Screen / Group */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Target Screen Group
              </label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full px-3 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-705 dark:text-zinc-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="Bengaluru Flagship Stores">Bengaluru Flagships</option>
                <option value="Mall Stores">Mall Stores</option>
                <option value="Airport Outlets">Airport Outlets</option>
                <option value="Menu Boards">Menu Boards</option>
                <option value="Drive-through Displays">Drive-through Displays</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Dates Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-1.5 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-1.5 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Daily Hours Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Daily Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3.5 py-1.5 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Daily End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3.5 py-1.5 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Days of week checklist */}
          <div className="flex flex-col gap-1.5">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Days of Week</span>
            <div className="flex justify-between gap-1 select-none">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                const isActive = days.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer text-center ${
                      isActive
                        ? "bg-[#2859D9]/10 text-[#2859D9] border-[#2859D9]"
                        : "bg-white dark:bg-zinc-900 border-[#E2E6EC] dark:border-[#283243] text-zinc-500"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priority Slider */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Schedule Priority (1 - 100)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3.5 py-1.5 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none font-bold font-mono"
              />
            </div>

            {/* Timezone Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Display Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-705 dark:text-zinc-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
                <option value="UTC">UTC / GMT</option>
              </select>
            </div>
          </div>

          {/* Sync preview */}
          <div className="p-3.5 border border-blue-100 dark:border-blue-900/30 bg-blue-50/20 dark:bg-blue-950/10 rounded-xl space-y-1.5">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-[#2859D9] dark:text-[#6F96FF] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Impact Preview Analysis
            </h4>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal">
              This deployment targeting group "{target}" will sync schedules config files to <span className="font-bold text-zinc-800 dark:text-white">21 active players</span>. Overlap verification shows zero priority overrides for the selected dates.
            </p>
          </div>

        </form>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#E2E6EC] dark:border-[#283243] flex gap-2 justify-end bg-[#F6F7F9]/50 dark:bg-[#171F2C]/20 shrink-0 font-sans">
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
            className="px-4 py-2 bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] text-xs font-bold rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            Publish Schedule
          </button>
        </div>

      </div>
    </div>
  );
}
