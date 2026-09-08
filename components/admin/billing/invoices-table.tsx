"use client";

import React, { useState } from "react";
import { Search, ChevronDown, Download, FileText, Eye, RefreshCw, Send, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface Invoice {
  id: string;
  tenantName: string;
  amount: number;
  status: "Paid" | "Payment Failed" | "Due";
  issueDate: string;
  duePaidDate: string;
  razorpayId: string;
}

const invoicesData: Invoice[] = [
  { id: "INV-2026-06291", tenantName: "Reliance Retail Media", amount: 454300, status: "Paid", issueDate: "1 Jun 2026", duePaidDate: "1 Jun 2026", razorpayId: "pay_Qx51RLM2" },
  { id: "INV-2026-06288", tenantName: "Apollo Pharmacies", amount: 292640, status: "Paid", issueDate: "1 Jun 2026", duePaidDate: "1 Jun 2026", razorpayId: "pay_Qx7Y2Kd9" },
  { id: "INV-2026-06274", tenantName: "PVR INOX", amount: 348100, status: "Paid", issueDate: "1 Jun 2026", duePaidDate: "1 Jun 2026", razorpayId: "pay_Qx6F84Lp" },
  { id: "INV-2026-06263", tenantName: "Metro Brands", amount: 106188, status: "Payment Failed", issueDate: "1 Jun 2026", duePaidDate: "Retry 3 Jul", razorpayId: "" },
  { id: "INV-2026-06241", tenantName: "Café Coffee Day", amount: 153388, status: "Due", issueDate: "1 Jun 2026", duePaidDate: "Due 5 Jul", razorpayId: "" }
];

export default function InvoicesTable() {
  const [activeTab, setActiveTab] = useState("Invoices");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const tabs = ["Subscriptions", "Invoices", "Failed Payments", "Credits & Discounts", "Webhook Logs"];

  const filteredInvoices = invoicesData.filter((inv) => {
    const matchesSearch = inv.tenantName.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" ||
      (statusFilter === "Paid" && inv.status === "Paid") ||
      (statusFilter === "Failed" && inv.status === "Payment Failed") ||
      (statusFilter === "Due" && inv.status === "Due");
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-xs">
      {/* Tabs list */}
      <div className="flex select-none gap-1 overflow-x-auto border-b border-app-border bg-app-surface-alt p-2">
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "border border-app-border bg-app-surface text-app-text shadow-xs"
                  : "text-app-muted hover:bg-app-surface hover:text-app-text"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-app-border p-4">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-app-muted" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-app-border bg-app-surface-alt py-1.5 pl-8.5 pr-3 text-caption text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent-text"
          />
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* Status Select */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="cursor-pointer appearance-none rounded-lg border border-app-border bg-app-surface py-1.5 pl-3 pr-8 text-caption font-medium text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
            >
              <option value="All">Status: All</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
              <option value="Due">Due</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-app-muted" />
          </div>

          {/* Date Select */}
          <button className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-app-border bg-app-surface px-3 py-1.5 text-caption font-semibold text-app-text shadow-xs transition-colors hover:bg-app-surface-alt">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span>Date</span>
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </button>

          {/* Export CSV */}
          <button className="flex cursor-pointer items-center gap-1 rounded-lg border border-app-border bg-app-surface px-3 py-1.5 text-caption font-semibold text-app-text shadow-xs transition-colors hover:bg-app-surface-alt">
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            <span>Export CSV</span>
          </button>

          {/* Export PDF */}
          <button className="flex cursor-pointer items-center gap-1 rounded-lg border border-app-border bg-app-surface px-3 py-1.5 text-caption font-semibold text-app-text shadow-xs transition-colors hover:bg-app-surface-alt">
            <FileText className="w-3.5 h-3.5 text-zinc-500" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="select-none border-b border-app-border bg-app-surface-alt font-bold text-app-muted">
              <th className="p-3.5">Invoice ID</th>
              <th className="p-3.5">Tenant</th>
              <th className="p-3.5 text-right">Amount (₹)</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Issue Date</th>
              <th className="p-3.5">Due/Paid</th>
              <th className="p-3.5">Razorpay ID</th>
              <th className="p-3.5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-app-border">
            {filteredInvoices.map((inv) => {
              const isFailed = inv.status === "Payment Failed";
              const isDue = inv.status === "Due";

              return (
                <tr
                  key={inv.id}
                  className={`transition-colors hover:bg-app-surface-alt ${
                    isFailed ? "bg-app-danger-surface" : isDue ? "bg-app-warning-surface" : ""
                  }`}
                >
                  <td className="p-3.5 font-semibold text-zinc-900 dark:text-zinc-100">
                    {inv.id}
                  </td>
                  <td className="p-3.5 font-medium text-zinc-800 dark:text-zinc-200">
                    {inv.tenantName}
                  </td>
                  <td className="p-3.5 text-right font-bold text-zinc-900 dark:text-zinc-50">
                    ₹{inv.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border inline-flex items-center gap-1 ${
                        inv.status === "Paid"
                          ? "border-app-accent-border bg-app-accent-surface text-app-accent-text"
                          : inv.status === "Payment Failed"
                          ? "border-app-danger-border bg-app-danger-surface text-app-danger-text"
                          : "border-app-border bg-app-warning-surface text-app-warning-text"
                      }`}
                    >
                      <span
                        className={`w-1 h-1 rounded-full ${
                          inv.status === "Paid" ? "bg-app-accent-text" : inv.status === "Payment Failed" ? "bg-app-danger-text" : "bg-app-warning"
                        }`}
                      />
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-zinc-500 dark:text-zinc-400">
                    {inv.issueDate}
                  </td>
                  <td className="p-3.5 font-medium">
                    {isFailed ? (
                      <span className="text-red-650 dark:text-red-400 font-semibold">
                        {inv.duePaidDate}
                      </span>
                    ) : isDue ? (
                      <span className="text-amber-650 dark:text-amber-550 font-semibold">
                        {inv.duePaidDate}
                      </span>
                    ) : (
                      <span className="text-zinc-500 dark:text-zinc-400">
                        {inv.duePaidDate}
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 font-mono text-[10px] text-zinc-400">
                    {inv.razorpayId || "—"}
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center justify-center gap-2">
                      {isFailed && (
                        <button className="p-1 rounded-md text-zinc-450 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer" title="Retry transaction">
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button className="p-1 rounded-md text-zinc-450 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer" title="View details">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {!isFailed && !isDue && (
                        <button className="p-1 rounded-md text-zinc-450 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer" title="Download invoice">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {isDue && (
                        <button className="p-1 rounded-md text-zinc-450 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer" title="Send reminder">
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex select-none items-center justify-between border-t border-app-border bg-app-surface-alt p-4 text-caption text-app-muted">
        <span>Showing 5 of 248 invoices</span>
        <div className="flex items-center gap-1">
          <button className="flex items-center gap-1 px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300 disabled:opacity-50 cursor-pointer" disabled>
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
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

          <button className="flex items-center gap-1 px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300 cursor-pointer">
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
