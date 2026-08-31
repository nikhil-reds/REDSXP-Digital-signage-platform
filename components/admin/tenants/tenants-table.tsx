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
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-xs">
      {/* Header section with title and Add button */}
      <div className="flex items-center justify-between gap-4 border-b border-app-border p-4">
        <div>
          <h2 className="text-title font-bold text-app-text">Tenant Management</h2>
          <p className="mt-0.5 text-caption text-app-muted">
            186 active tenants · 23 on trial
          </p>
        </div>
        <button
          onClick={onAddTenantClick}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-app-accent px-3.5 py-1.5 text-caption font-semibold text-app-accent-on shadow-xs transition-colors hover:bg-app-accent-hover"
        >
          <span>+ Add Tenant</span>
        </button>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-app-border bg-app-surface-alt p-4">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-xs">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-app-muted" />
            <input
              type="text"
              placeholder="Search by name, domain, owner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-app-border bg-app-surface py-1.5 pl-8.5 pr-3 text-caption text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent-text"
            />
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="cursor-pointer appearance-none rounded-lg border border-app-border bg-app-surface py-1.5 pl-3 pr-8 text-caption font-medium text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
            >
              <option value="All">Status: All</option>
              <option value="Active">Active</option>
              <option value="Trial">Trial</option>
              <option value="Past Due">Past Due</option>
              <option value="Suspended">Suspended</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-app-muted" />
          </div>

          {/* Plan Filter */}
          <div className="relative">
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="cursor-pointer appearance-none rounded-lg border border-app-border bg-app-surface py-1.5 pl-3 pr-8 text-caption font-medium text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
            >
              <option value="All">Plan: All</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Business">Business</option>
              <option value="Growth">Growth</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-app-muted" />
          </div>

          {/* Columns Config */}
          <button className="flex cursor-pointer items-center gap-1 rounded-lg border border-app-border bg-app-surface px-3 py-1.5 text-caption font-semibold text-app-text shadow-xs transition-colors hover:bg-app-surface-alt">
            <LayoutGrid className="h-3.5 w-3.5 text-app-muted" />
            <span>Columns</span>
          </button>

          {/* Export CSV */}
          <button className="flex cursor-pointer items-center gap-1 rounded-lg border border-app-border bg-app-surface px-3 py-1.5 text-caption font-semibold text-app-text shadow-xs transition-colors hover:bg-app-surface-alt">
            <Download className="h-3.5 w-3.5 text-app-muted" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-caption">
          <thead>
            <tr className="select-none border-b border-app-border bg-app-surface-alt font-bold text-app-muted">
              <th className="p-3.5 w-10 text-center">
                <input
                  type="checkbox"
                  checked={filteredTenants.length > 0 && selectedIds.length === filteredTenants.length}
                  onChange={toggleSelectAll}
                  className="h-3.5 w-3.5 cursor-pointer rounded border-app-border accent-app-accent-text"
                />
              </th>
              <th className="p-3.5 font-bold">
                <span className="flex cursor-pointer items-center gap-1 hover:text-app-text">
                  Tenant <ArrowUpDown className="h-3 w-3 text-app-muted" />
                </span>
              </th>
              <th className="p-3.5 font-bold">Status</th>
              <th className="p-3.5 font-bold">Plan</th>
              <th className="p-3.5 font-bold">
                <span className="flex cursor-pointer items-center justify-end gap-1 hover:text-app-text">
                  MRR <ArrowUpDown className="h-3 w-3 text-app-muted" />
                </span>
              </th>
              <th className="p-3.5 font-bold text-center">Screens</th>
              <th className="p-3.5 font-bold">Storage</th>
              <th className="p-3.5 font-bold">Custom Domain</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-app-border">
            {filteredTenants.map((tenant) => {
              const isSelected = selectedIds.includes(tenant.id);
              const storageInfo = formatStorage(tenant.storageUsed, tenant.storageTotal);

              return (
                <tr
                  key={tenant.id}
                  className={`transition-colors hover:bg-app-surface-alt ${
                    isSelected ? "bg-app-accent-surface" : ""
                  }`}
                >
                  <td className="p-3.5 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(tenant.id)}
                      className="h-3.5 w-3.5 cursor-pointer rounded border-app-border accent-app-accent-text"
                    />
                  </td>
                  <td className="p-3.5 font-semibold text-app-text">
                    {tenant.name}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border inline-flex items-center gap-1 ${
                        tenant.status === "Active"
                          ? "border-app-accent-border bg-app-accent-surface text-app-accent-text"
                          : tenant.status === "Trial"
                          ? "border-app-border bg-app-warning-surface text-app-warning-text"
                          : tenant.status === "Past Due"
                          ? "border-app-danger-border bg-app-danger-surface text-app-danger-text"
                          : "border-app-border bg-app-surface-alt text-app-muted"
                      }`}
                    >
                      <span
                        className={`w-1 h-1 rounded-full ${
                          tenant.status === "Active"
                            ? "bg-app-accent-text"
                            : tenant.status === "Trial"
                            ? "bg-amber-500"
                            : tenant.status === "Past Due"
                            ? "bg-app-danger-text"
                            : "bg-app-muted"
                        }`}
                      />
                      {tenant.status}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="rounded-md border border-app-border bg-app-surface-alt px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-app-muted">
                      {tenant.plan}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-bold text-app-text">
                    ₹{tenant.mrr.toLocaleString("en-IN")}
                  </td>
                  <td className="p-3.5 text-center font-medium text-app-text">
                    {tenant.screensActive}/{tenant.screensTotal}
                  </td>
                  <td className="p-3.5">
                    <div className="flex flex-col gap-1 w-24">
                      <span className="text-[10px] font-medium text-app-muted">
                        {storageInfo.text}
                      </span>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-app-surface-alt">
                        <div
                          className="h-full bg-app-accent-text"
                          style={{ width: `${storageInfo.percent}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="max-w-[120px] truncate p-3.5 font-mono text-[11px] text-app-muted" title={tenant.customDomain}>
                    {tenant.customDomain}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex select-none items-center justify-between border-t border-app-border bg-app-surface-alt p-4 text-caption text-app-muted">
        <span>Showing 1–8 of 186 tenants</span>
        <div className="flex items-center gap-1">
          <button className="flex cursor-pointer items-center gap-1 rounded-lg border border-app-border bg-app-surface px-2.5 py-1.5 text-app-text transition-colors hover:bg-app-surface-alt disabled:opacity-50" disabled>
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>
          
          <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-app-accent font-bold text-app-accent-on">
            1
          </button>
          <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-app-text hover:bg-app-surface">
            2
          </button>
          <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-app-text hover:bg-app-surface">
            3
          </button>
          <span className="px-1 text-app-muted">...</span>
          <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-app-text hover:bg-app-surface">
            24
          </button>

          <button className="flex cursor-pointer items-center gap-1 rounded-lg border border-app-border bg-app-surface px-2.5 py-1.5 text-app-text transition-colors hover:bg-app-surface-alt">
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
