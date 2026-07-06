"use client";

import React, { useState } from "react";
import { Search, ChevronDown, ArrowUpDown } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  type: "Banner" | "Modal" | "Email";
  audience: string;
  status: "Live" | "Scheduled" | "Expired";
  scheduledAt: string;
  expiresAt: string;
  impressions: string;
}

interface AnnouncementsTableProps {
  announcements: Announcement[];
  onSelectAnnouncement: (announcement: Announcement) => void;
  onAddNewClick: () => void;
}

export default function AnnouncementsTable({
  announcements,
  onSelectAnnouncement,
  onAddNewClick
}: AnnouncementsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [audienceFilter, setAudienceFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  // Filtering
  const filtered = announcements.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    const matchesAudience = audienceFilter === "All" || item.audience.includes(audienceFilter);
    const matchesType = typeFilter === "All" || item.type === typeFilter;
    return matchesSearch && matchesStatus && matchesAudience && matchesType;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl overflow-hidden shadow-xs">
      {/* Top filter toolbar */}
      <div className="p-4 border-b border-zinc-150 dark:border-zinc-800 flex flex-wrap gap-2.5 items-center bg-zinc-50/20 dark:bg-zinc-900/10">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8.5 pr-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-3 pr-8 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300 font-semibold focus:outline-none appearance-none cursor-pointer"
          >
            <option value="All">Status</option>
            <option value="Live">Live</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Expired">Expired</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
        </div>

        {/* Audience Filter */}
        <div className="relative">
          <select
            value={audienceFilter}
            onChange={(e) => setAudienceFilter(e.target.value)}
            className="pl-3 pr-8 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300 font-semibold focus:outline-none appearance-none cursor-pointer"
          >
            <option value="All">Audience</option>
            <option value="All Tenants">All Tenants</option>
            <option value="Business">Business</option>
            <option value="Enterprise">Enterprise</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
        </div>

        {/* Type Filter */}
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="pl-3 pr-8 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300 font-semibold focus:outline-none appearance-none cursor-pointer"
          >
            <option value="All">Type</option>
            <option value="Banner">Banner</option>
            <option value="Modal">Modal</option>
            <option value="Email">Email</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
        </div>
      </div>

      {/* Main Table view */}
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center select-none bg-white dark:bg-zinc-900">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Announcements</h2>
          <p className="text-xs text-zinc-450 mt-0.5">Showing 1–6 of 18</p>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase cursor-pointer hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
          <ArrowUpDown className="w-3.5 h-3.5" />
          Sortable table
        </span>
      </div>

      <div className="overflow-x-auto flex-1 min-h-0">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-400 dark:text-zinc-500 font-bold border-b border-zinc-150 dark:border-zinc-800 select-none">
              <th className="p-3.5">Title</th>
              <th className="p-3.5">Type</th>
              <th className="p-3.5">Audience</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Scheduled At</th>
              <th className="p-3.5">Expires At</th>
              <th className="p-3.5">Impressions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filtered.map((item) => (
              <tr
                key={item.id}
                onClick={() => onSelectAnnouncement(item)}
                className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/20 transition-colors cursor-pointer"
              >
                <td className="p-3.5 font-semibold text-zinc-900 dark:text-zinc-100 max-w-[200px] leading-snug">
                  {item.title}
                </td>
                <td className="p-3.5">
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                      item.type === "Modal"
                        ? "bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400 border-purple-100/50"
                        : item.type === "Banner"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border-blue-100/50"
                        : "bg-teal-50 text-teal-700 dark:bg-teal-950/20 dark:text-teal-400 border-teal-100/50"
                    }`}
                  >
                    {item.type}
                  </span>
                </td>
                <td className="p-3.5 text-zinc-500 dark:text-zinc-400 leading-snug max-w-[140px]">
                  {item.audience}
                </td>
                <td className="p-3.5">
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-semibold border inline-flex items-center gap-1.5 ${
                      item.status === "Live"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100/50"
                        : item.status === "Scheduled"
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-100/50"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200/50"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.status === "Live"
                          ? "bg-emerald-500"
                          : item.status === "Scheduled"
                          ? "bg-amber-500"
                          : "bg-zinc-400"
                      }`}
                    />
                    {item.status}
                  </span>
                </td>
                <td className="p-3.5 text-zinc-500 dark:text-zinc-400 leading-snug max-w-[120px]">
                  {item.scheduledAt}
                </td>
                <td className="p-3.5 text-zinc-500 dark:text-zinc-400 leading-snug max-w-[120px]">
                  {item.expiresAt}
                </td>
                <td className="p-3.5 font-bold text-zinc-800 dark:text-zinc-200">
                  {item.impressions}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30 flex items-center justify-between text-xs text-zinc-500 select-none">
        <span>Showing 1–6 of 18</span>
        <div className="flex items-center gap-1.5">
          <button className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300 font-semibold cursor-pointer">
            Previous
          </button>
          
          <button className="w-8 h-8 rounded-lg bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 font-bold flex items-center justify-center cursor-pointer">
            1
          </button>
          <button className="w-8 h-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center cursor-pointer">
            2
          </button>
          <button className="w-8 h-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center cursor-pointer">
            3
          </button>

          <button className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300 font-semibold cursor-pointer">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
