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
}

export default function AnnouncementsTable({
  announcements,
  onSelectAnnouncement
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
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-xs">
      {/* Top filter toolbar */}
      <div className="flex flex-wrap items-center gap-2.5 border-b border-app-border bg-app-surface-alt p-4">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-app-muted" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-app-border bg-app-surface py-1.5 pl-8.5 pr-3 text-caption text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent-text"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="cursor-pointer appearance-none rounded-lg border border-app-border bg-app-surface py-1.5 pl-3 pr-8 text-caption font-semibold text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
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
            className="cursor-pointer appearance-none rounded-lg border border-app-border bg-app-surface py-1.5 pl-3 pr-8 text-caption font-semibold text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
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
            className="cursor-pointer appearance-none rounded-lg border border-app-border bg-app-surface py-1.5 pl-3 pr-8 text-caption font-semibold text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
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
      <div className="flex select-none items-center justify-between border-b border-app-border bg-app-surface p-4">
        <div>
          <h2 className="text-body font-bold text-app-text">Announcements</h2>
          <p className="mt-0.5 text-caption text-app-muted">Showing 1–6 of 18</p>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase cursor-pointer hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
          <ArrowUpDown className="w-3.5 h-3.5" />
          Sortable table
        </span>
      </div>

      <div className="overflow-x-auto flex-1 min-h-0">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="select-none border-b border-app-border bg-app-surface-alt font-bold text-app-muted">
              <th className="p-3.5">Title</th>
              <th className="p-3.5">Type</th>
              <th className="p-3.5">Audience</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Scheduled At</th>
              <th className="p-3.5">Expires At</th>
              <th className="p-3.5">Impressions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-app-border">
            {filtered.map((item) => (
              <tr
                key={item.id}
                onClick={() => onSelectAnnouncement(item)}
                className="cursor-pointer transition-colors hover:bg-app-surface-alt"
              >
                <td className="p-3.5 font-semibold text-zinc-900 dark:text-zinc-100 max-w-[200px] leading-snug">
                  {item.title}
                </td>
                <td className="p-3.5">
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                      item.type === "Modal"
                        ? "border-app-border bg-app-surface-alt text-app-text"
                        : item.type === "Banner"
                        ? "border-app-accent-border bg-app-accent-surface text-app-accent-text"
                        : "border-app-border bg-app-warning-surface text-app-warning-text"
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
                        ? "border-app-accent-border bg-app-accent-surface text-app-accent-text"
                        : item.status === "Scheduled"
                        ? "border-app-border bg-app-warning-surface text-app-warning-text"
                        : "border-app-border bg-app-surface-alt text-app-muted"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.status === "Live"
                          ? "bg-app-accent-text"
                          : item.status === "Scheduled"
                          ? "bg-app-warning"
                          : "bg-app-muted"
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
      <div className="flex select-none items-center justify-between border-t border-app-border bg-app-surface-alt p-4 text-caption text-app-muted">
        <span>Showing 1–6 of 18</span>
        <div className="flex items-center gap-1.5">
          <button className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300 font-semibold cursor-pointer">
            Previous
          </button>
          
          <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-app-accent font-bold text-app-accent-on">
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
