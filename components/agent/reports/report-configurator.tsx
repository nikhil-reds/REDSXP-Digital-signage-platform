"use client";

import React, { useState } from "react";
import { FileText, Calendar, Layers, Activity, Clock, Settings, Sparkles } from "lucide-react";

interface ReportConfiguratorProps {
  onGenerate: (config: any) => void;
}

export default function ReportConfigurator({ onGenerate }: ReportConfiguratorProps) {
  const [category, setCategory] = useState("SLA Reports");
  const [dateRange, setDateRange] = useState("Last 7 Days");
  const [granularity, setGranularity] = useState("Daily");
  const [target, setTarget] = useState("Bengaluru Flagship Stores");
  const [format, setFormat] = useState("PDF");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      category,
      dateRange,
      granularity,
      target,
      format
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl p-5 space-y-4 font-sans text-xs flex flex-col justify-between"
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-55 uppercase tracking-wider flex items-center gap-1.5 border-b border-[#E2E6EC] dark:border-[#283243] pb-2">
            <Settings className="w-4 h-4 text-[#2859D9]" />
            Report Settings Parameters
          </h3>
          <p className="text-[10px] text-zinc-400 mt-1">Configure database query criteria.</p>
        </div>

        {/* Report Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Report Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-705 dark:text-zinc-300 font-bold focus:outline-none cursor-pointer"
          >
            <option value="SLA Reports">SLA Compliance & Uptime Reports</option>
            <option value="Proof of Play Reports">Proof-of-Play & Counts Reports</option>
            <option value="Sensor Automation Reports">Sensor Automation Triggers Reports</option>
            <option value="Incident Logs Reports">Incident Logs & Reboots Reports</option>
          </select>
        </div>

        {/* Date scope */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Date Range preset</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-3 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-705 dark:text-zinc-300 font-bold focus:outline-none cursor-pointer"
          >
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            <option value="Last 7 Days">Last 7 Days (Standard)</option>
            <option value="Last 30 Days">Last 30 Days (Monthly)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Granularity */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Granularity</label>
            <select
              value={granularity}
              onChange={(e) => setGranularity(e.target.value)}
              className="w-full px-3 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-705 dark:text-zinc-300 font-bold focus:outline-none cursor-pointer"
            >
              <option value="Summary">Summary</option>
              <option value="Daily">Daily splits</option>
              <option value="Hourly">Hourly logs</option>
            </select>
          </div>

          {/* Format choice */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Output Format</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormat("PDF")}
                className={`py-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer text-center ${
                  format === "PDF"
                    ? "bg-[#2859D9]/10 text-[#2859D9] border-[#2859D9]"
                    : "bg-white dark:bg-zinc-900 border-[#E2E6EC] dark:border-[#283243] text-zinc-500"
                }`}
              >
                PDF
              </button>
              <button
                type="button"
                onClick={() => setFormat("CSV")}
                className={`py-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer text-center ${
                  format === "CSV"
                    ? "bg-[#2859D9]/10 text-[#2859D9] border-[#2859D9]"
                    : "bg-white dark:bg-zinc-900 border-[#E2E6EC] dark:border-[#283243] text-zinc-500"
                }`}
              >
                CSV
              </button>
            </div>
          </div>
        </div>

        {/* Target display choice */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Target Display Scope</label>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full px-3 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-705 dark:text-zinc-300 font-bold focus:outline-none cursor-pointer"
          >
            <option value="Bengaluru Flagship Stores">Bengaluru Flagships</option>
            <option value="All Groups">All Groups (Complete Network)</option>
            <option value="Menu Boards">Menu Boards</option>
            <option value="Mall Stores">Mall Stores</option>
            <option value="Airport Outlets">Airport Outlets</option>
          </select>
        </div>

      </div>

      <button
        type="submit"
        className="w-full py-2.5 bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] text-xs font-bold rounded-lg hover:opacity-90 transition-opacity cursor-pointer mt-4 flex items-center justify-center gap-1.5 shadow-sm"
      >
        <Sparkles className="w-4 h-4" />
        <span>Generate Custom Report</span>
      </button>

    </form>
  );
}
