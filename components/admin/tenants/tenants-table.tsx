"use client";

import React, { useState } from "react";
import { Search, ChevronDown, Download, LayoutGrid, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

interface Tenant {
  id: string;
  name: string;
  status: "Active" | "Trial" | "Past Due" | "Suspended";
  plan: "Enterprise" | "Business" | "Growth";
  mrr: number;
  screensActive: number;
  screensTotal: number;
  storageUsed: number; // in GB
  storageTotal: number; // in GB
  customDomain: string;
}

interface TenantsTableProps {
  tenants: Tenant[];
  onAddTenantClick: () => void;
}

export default function TenantsTable({ tenants, onAddTenantClick }: TenantsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter logic
  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(search.toLowerCase()) ||
      tenant.customDomain.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || tenant.status === statusFilter;
    const matchesPlan = planFilter === "All" || tenant.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTenants.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTenants.map((t) => t.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Convert storage values for display
  const formatStorage = (used: number, total: number) => {
    const formatValue = (val: number) => {
      if (val >= 1024) {
        return `${(val / 1024).toFixed(1)} TB`;
      }
      return `${val} GB`;
    };
    return {
      text: `${formatValue(used)}/${formatValue(total)}`,
      percent: Math.min((used / total) * 100, 100)
    };
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl overflow-hidden shadow-xs">
      {/* Header section with title and Add button */}
      <div className="p-4 border-b border-zinc-150 dark:border-zinc-800 flex justify-between items-center gap-4">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Tenant Management</h2>
          <p className="text-xs text-zinc-450 dark:text-zinc-400 mt-0.5">
            186 active tenants · 23 on trial
          </p>
        </div>
        <button
          onClick={onAddTenantClick}
          className="flex items-center gap-1.5 bg-blue-600 text-white dark:bg-blue-500 hover:opacity-90 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-opacity cursor-pointer"
        >
          <span>+ Add Tenant</span>
        </button>
      </div>

      {/* Toolbar / Filters */}
      <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-150 dark:border-zinc-800 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-xs">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name, domain, owner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8.5 pr-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/85 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-50"
            />
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-3 pr-8 py-1.5 border border-zinc-200 dark:border-zinc-850 rounded-lg bg-white dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300 font-medium focus:outline-none appearance-none cursor-pointer"
            >
              <option value="All">Status: All</option>
              <option value="Active">Active</option>
              <option value="Trial">Trial</option>
              <option value="Past Due">Past Due</option>
              <option value="Suspended">Suspended</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 pointer-events-none" />
          </div>

          {/* Plan Filter */}
          <div className="relative">
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="pl-3 pr-8 py-1.5 border border-zinc-200 dark:border-zinc-850 rounded-lg bg-white dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300 font-medium focus:outline-none appearance-none cursor-pointer"
            >
              <option value="All">Plan: All</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Business">Business</option>
              <option value="Growth">Growth</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 pointer-events-none" />
          </div>

          {/* Columns Config */}
          <button className="flex items-center gap-1 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300 font-semibold shadow-xs hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
            <LayoutGrid className="w-3.5 h-3.5 text-zinc-500" />
            <span>Columns</span>
          </button>

          {/* Export CSV */}
          <button className="flex items-center gap-1 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300 font-semibold shadow-xs hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-450 dark:text-zinc-500 font-bold border-b border-zinc-150 dark:border-zinc-800/80 select-none">
              <th className="p-3.5 w-10 text-center">
                <input
                  type="checkbox"
                  checked={filteredTenants.length > 0 && selectedIds.length === filteredTenants.length}
                  onChange={toggleSelectAll}
                  className="rounded border-zinc-300 dark:border-zinc-750 accent-zinc-950 dark:accent-zinc-50 w-3.5 h-3.5 cursor-pointer"
                />
              </th>
              <th className="p-3.5 font-bold">
                <span className="flex items-center gap-1 cursor-pointer hover:text-zinc-800 dark:hover:text-zinc-200">
                  Tenant <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                </span>
              </th>
              <th className="p-3.5 font-bold">Status</th>
              <th className="p-3.5 font-bold">Plan</th>
              <th className="p-3.5 font-bold">
                <span className="flex items-center gap-1 justify-end cursor-pointer hover:text-zinc-800 dark:hover:text-zinc-200">
                  MRR <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                </span>
              </th>
              <th className="p-3.5 font-bold text-center">Screens</th>
              <th className="p-3.5 font-bold">Storage</th>
              <th className="p-3.5 font-bold">Custom Domain</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
            {filteredTenants.map((tenant) => {
              const isSelected = selectedIds.includes(tenant.id);
              const storageInfo = formatStorage(tenant.storageUsed, tenant.storageTotal);

              return (
                <tr
                  key={tenant.id}
                  className={`hover:bg-zinc-50/30 dark:hover:bg-zinc-900/20 transition-colors ${
                    isSelected ? "bg-blue-50/10 dark:bg-blue-950/5" : ""
                  }`}
                >
                  <td className="p-3.5 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(tenant.id)}
                      className="rounded border-zinc-300 dark:border-zinc-750 accent-zinc-950 dark:accent-zinc-50 w-3.5 h-3.5 cursor-pointer"
                    />
                  </td>
                  <td className="p-3.5 font-semibold text-zinc-900 dark:text-zinc-50">
                    {tenant.name}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border inline-flex items-center gap-1 ${
                        tenant.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-900/20"
                          : tenant.status === "Trial"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-100/50 dark:border-amber-900/20"
                          : tenant.status === "Past Due"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-450 border-rose-100/50 dark:border-rose-900/20"
                          : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200/50 dark:border-zinc-700/30"
                      }`}
                    >
                      <span
                        className={`w-1 h-1 rounded-full ${
                          tenant.status === "Active"
                            ? "bg-emerald-500"
                            : tenant.status === "Trial"
                            ? "bg-amber-500"
                            : tenant.status === "Past Due"
                            ? "bg-rose-500"
                            : "bg-zinc-400"
                        }`}
                      />
                      {tenant.status}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/40 px-2 py-0.5 rounded-md">
                      {tenant.plan}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-bold text-zinc-900 dark:text-zinc-50">
                    ₹{tenant.mrr.toLocaleString("en-IN")}
                  </td>
                  <td className="p-3.5 text-center font-medium text-zinc-700 dark:text-zinc-300">
                    {tenant.screensActive}/{tenant.screensTotal}
                  </td>
                  <td className="p-3.5">
                    <div className="flex flex-col gap-1 w-24">
                      <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-medium">
                        {storageInfo.text}
                      </span>
                      <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1 rounded-full overflow-hidden">
                        <div
                          className="bg-zinc-850 dark:bg-zinc-200 h-full"
                          style={{ width: `${storageInfo.percent}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-zinc-450 dark:text-zinc-500 truncate max-w-[120px]" title={tenant.customDomain}>
                    {tenant.customDomain}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/30 dark:bg-zinc-900/30 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-450 select-none">
        <span>Showing 1–8 of 186 tenants</span>
        <div className="flex items-center gap-1">
          <button className="flex items-center gap-1 px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300 disabled:opacity-50 cursor-pointer" disabled>
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>
          
          <button className="w-8 h-8 rounded-lg bg-blue-600 dark:bg-blue-500 text-white font-bold flex items-center justify-center cursor-pointer">
            1
          </button>
          <button className="w-8 h-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center cursor-pointer">
            2
          </button>
          <button className="w-8 h-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center cursor-pointer">
            3
          </button>
          <span className="px-1 text-zinc-400">...</span>
          <button className="w-8 h-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center cursor-pointer">
            24
          </button>

          <button className="flex items-center gap-1 px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300 cursor-pointer">
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
