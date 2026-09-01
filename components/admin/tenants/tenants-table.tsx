"use client";

import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  Download,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: "Active" | "Trial" | "Past Due" | "Suspended";
  plan: string | null;
  mrr: number;
  screensActive: number;
  screensTotal: number;
  storageUsedGb: number;
  storageLimitGb: number | null;
  customDomain: string | null;
  createdAt: string;
}

export interface TenantsPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface TenantsSummary {
  total: number;
  active: number;
  trial: number;
  pastDue: number;
  suspended: number;
}

export interface PlanOption {
  id: string;
  name: string;
}

interface TenantsTableProps {
  tenants: Tenant[];
  pagination: TenantsPagination;
  summary: TenantsSummary;
  planOptions: PlanOption[];
  search: string;
  status: string;
  plan: string;
  isLoading: boolean;
  error: string | null;
  onFilterChange: (next: { status?: string; plan?: string; search?: string }) => void;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  onAddTenantClick: () => void;
}

const STATUS_OPTIONS = [
  { value: "ALL", label: "Status: All" },
  { value: "ACTIVE", label: "Active" },
  { value: "TRIAL", label: "Trial" },
  { value: "PAST_DUE", label: "Past Due" },
  { value: "SUSPENDED", label: "Suspended" },
];

function formatStorageValue(gb: number) {
  if (gb >= 1024) return `${(gb / 1024).toFixed(1)} TB`;
  if (gb > 0 && gb < 1) return `${(gb * 1024).toFixed(0)} MB`;
  return `${gb.toFixed(gb % 1 === 0 ? 0 : 1)} GB`;
}

function formatStorage(used: number, limit: number | null) {
  if (limit === null || limit <= 0) {
    return { text: formatStorageValue(used), percent: null as number | null };
  }
  return {
    text: `${formatStorageValue(used)}/${formatStorageValue(limit)}`,
    percent: Math.min((used / limit) * 100, 100),
  };
}

function toCsv(tenants: Tenant[]) {
  const header = [
    "Name",
    "Slug",
    "Status",
    "Plan",
    "MRR",
    "Screens Online",
    "Screens Total",
    "Storage Used (GB)",
    "Storage Limit (GB)",
    "Custom Domain",
  ];
  const rows = tenants.map((tenant) => [
    tenant.name,
    tenant.slug,
    tenant.status,
    tenant.plan ?? "",
    tenant.mrr,
    tenant.screensActive,
    tenant.screensTotal,
    tenant.storageUsedGb,
    tenant.storageLimitGb ?? "",
    tenant.customDomain ?? "",
  ]);
  return [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

export default function TenantsTable({
  tenants,
  pagination,
  summary,
  planOptions,
  search,
  status,
  plan,
  isLoading,
  error,
  onFilterChange,
  onPageChange,
  onRefresh,
  onAddTenantClick,
}: TenantsTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === tenants.length ? [] : tenants.map((t) => t.id));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(
      selectedIds.includes(id)
        ? selectedIds.filter((item) => item !== id)
        : [...selectedIds, id],
    );
  };

  const exportCsv = () => {
    const blob = new Blob([toCsv(tenants)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tenants-page-${pagination.page}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const firstRow = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.pageSize + 1;
  const lastRow = Math.min(pagination.page * pagination.pageSize, pagination.total);
  const pageNumbers = Array.from({ length: pagination.totalPages }, (_, index) => index + 1).filter(
    (number) =>
      number === 1 ||
      number === pagination.totalPages ||
      Math.abs(number - pagination.page) <= 1,
  );

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-xs">
      {/* Header section with title and Add button */}
      <div className="flex items-center justify-between gap-4 border-b border-app-border p-4">
        <div>
          <h2 className="text-title font-bold text-app-text">Tenant Management</h2>
          <p className="mt-0.5 text-caption text-app-muted">
            {summary.total} {summary.total === 1 ? "tenant" : "tenants"} · {summary.active} active ·{" "}
            {summary.trial} on trial
            {summary.pastDue > 0 ? ` · ${summary.pastDue} past due` : ""}
            {summary.suspended > 0 ? ` · ${summary.suspended} suspended` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-app-border bg-app-surface px-3 py-1.5 text-caption font-semibold text-app-text shadow-xs transition-colors hover:bg-app-surface-alt"
            title="Refresh tenants"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-app-muted ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={onAddTenantClick}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-app-accent px-3.5 py-1.5 text-caption font-semibold text-app-accent-on shadow-xs transition-colors hover:bg-app-accent-hover"
          >
            <span>+ Add Tenant</span>
          </button>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-app-border bg-app-surface-alt p-4">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-xs">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-app-muted" />
            <input
              type="text"
              placeholder="Search by name, slug or domain..."
              value={search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="w-full rounded-lg border border-app-border bg-app-surface py-1.5 pl-8.5 pr-3 text-caption text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent-text"
            />
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="cursor-pointer appearance-none rounded-lg border border-app-border bg-app-surface py-1.5 pl-3 pr-8 text-caption font-medium text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-app-muted" />
          </div>

          {/* Plan Filter — options come from the plans table */}
          <div className="relative">
            <select
              value={plan}
              onChange={(e) => onFilterChange({ plan: e.target.value })}
              disabled={planOptions.length === 0}
              className="cursor-pointer appearance-none rounded-lg border border-app-border bg-app-surface py-1.5 pl-3 pr-8 text-caption font-medium text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="ALL">Plan: All</option>
              {planOptions.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-app-muted" />
          </div>

          {/* Export CSV */}
          <button
            onClick={exportCsv}
            disabled={tenants.length === 0}
            className="flex cursor-pointer items-center gap-1 rounded-lg border border-app-border bg-app-surface px-3 py-1.5 text-caption font-semibold text-app-text shadow-xs transition-colors hover:bg-app-surface-alt disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5 text-app-muted" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 border-b border-app-danger-border bg-app-danger-surface px-4 py-2.5 text-caption font-medium text-app-danger-text">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tenants Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-left text-caption">
          <thead>
            <tr className="select-none border-b border-app-border bg-app-surface-alt font-bold text-app-muted">
              <th className="p-3.5 w-10 text-center">
                <input
                  type="checkbox"
                  checked={tenants.length > 0 && selectedIds.length === tenants.length}
                  onChange={toggleSelectAll}
                  className="h-3.5 w-3.5 cursor-pointer rounded border-app-border accent-app-accent-text"
                />
              </th>
              <th className="p-3.5 font-bold">
                <span className="flex items-center gap-1">
                  Tenant <ArrowUpDown className="h-3 w-3 text-app-muted" />
                </span>
              </th>
              <th className="p-3.5 font-bold">Status</th>
              <th className="p-3.5 font-bold">Plan</th>
              <th className="p-3.5 font-bold text-right">MRR</th>
              <th className="p-3.5 font-bold text-center">Screens</th>
              <th className="p-3.5 font-bold">Storage</th>
              <th className="p-3.5 font-bold">Custom Domain</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-app-border">
            {isLoading && tenants.length === 0 && (
              <tr>
                <td colSpan={8} className="p-10 text-center text-app-muted">
                  <Loader2 className="mx-auto mb-2 h-4 w-4 animate-spin" />
                  Loading tenants…
                </td>
              </tr>
            )}

            {!isLoading && tenants.length === 0 && !error && (
              <tr>
                <td colSpan={8} className="p-10 text-center text-app-muted">
                  {search || status !== "ALL" || plan !== "ALL"
                    ? "No tenants match these filters."
                    : "No tenants yet. Use “Add Tenant” to provision the first workspace."}
                </td>
              </tr>
            )}

            {tenants.map((tenant) => {
              const isSelected = selectedIds.includes(tenant.id);
              const storageInfo = formatStorage(tenant.storageUsedGb, tenant.storageLimitGb);

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
                    <div className="flex flex-col">
                      <span>{tenant.name}</span>
                      <span className="font-mono text-[10px] font-normal text-app-muted">
                        {tenant.slug}
                      </span>
                    </div>
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
                    {tenant.plan ? (
                      <span className="rounded-md border border-app-border bg-app-surface-alt px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-app-muted">
                        {tenant.plan}
                      </span>
                    ) : (
                      <span className="text-app-muted">—</span>
                    )}
                  </td>
                  <td className="p-3.5 text-right font-bold text-app-text">
                    {tenant.mrr > 0 ? `₹${tenant.mrr.toLocaleString("en-IN")}` : <span className="font-normal text-app-muted">—</span>}
                  </td>
                  <td className="p-3.5 text-center font-medium text-app-text">
                    {tenant.screensActive}/{tenant.screensTotal}
                  </td>
                  <td className="p-3.5">
                    <div className="flex flex-col gap-1 w-24">
                      <span className="text-[10px] font-medium text-app-muted">
                        {storageInfo.text}
                      </span>
                      {storageInfo.percent !== null && (
                        <div className="h-1 w-full overflow-hidden rounded-full bg-app-surface-alt">
                          <div
                            className="h-full bg-app-accent-text"
                            style={{ width: `${storageInfo.percent}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td
                    className="max-w-[140px] truncate p-3.5 font-mono text-[11px] text-app-muted"
                    title={tenant.customDomain ?? undefined}
                  >
                    {tenant.customDomain ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex select-none items-center justify-between border-t border-app-border bg-app-surface-alt p-4 text-caption text-app-muted">
        <span>
          {pagination.total === 0
            ? "No tenants to show"
            : `Showing ${firstRow}–${lastRow} of ${pagination.total} ${
                pagination.total === 1 ? "tenant" : "tenants"
              }`}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="flex cursor-pointer items-center gap-1 rounded-lg border border-app-border bg-app-surface px-2.5 py-1.5 text-app-text transition-colors hover:bg-app-surface-alt disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {pageNumbers.map((number, index) => (
            <React.Fragment key={number}>
              {index > 0 && number - pageNumbers[index - 1] > 1 && (
                <span className="px-1 text-app-muted">...</span>
              )}
              <button
                onClick={() => onPageChange(number)}
                className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg ${
                  number === pagination.page
                    ? "bg-app-accent font-bold text-app-accent-on"
                    : "text-app-text hover:bg-app-surface"
                }`}
              >
                {number}
              </button>
            </React.Fragment>
          ))}

          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="flex cursor-pointer items-center gap-1 rounded-lg border border-app-border bg-app-surface px-2.5 py-1.5 text-app-text transition-colors hover:bg-app-surface-alt disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
