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
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl overflow-hidden shadow-xs flex flex-col">
      {/* Tabs list */}
      <div className="flex border-b border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-2 gap-1 overflow-x-auto select-none">
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs border border-zinc-200/50 dark:border-zinc-700/50"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Toolbar / Filters */}
      <div className="p-4 border-b border-zinc-150 dark:border-zinc-800 flex flex-wrap gap-3 items-center justify-between">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8.5 pr-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-50"
          />
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* Status Select */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-3 pr-8 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300 font-medium focus:outline-none appearance-none cursor-pointer"
            >
              <option value="All">Status: All</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
              <option value="Due">Due</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 pointer-events-none" />
          </div>

          {/* Date Select */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300 font-semibold shadow-xs hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span>Date</span>
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </button>

          {/* Export CSV */}
          <button className="flex items-center gap-1 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300 font-semibold shadow-xs hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            <span>Export CSV</span>
          </button>

          {/* Export PDF */}
          <button className="flex items-center gap-1 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300 font-semibold shadow-xs hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
            <FileText className="w-3.5 h-3.5 text-zinc-500" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-450 dark:text-zinc-550 font-bold border-b border-zinc-150 dark:border-zinc-800 select-none">
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
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
            {filteredInvoices.map((inv) => {
              const isFailed = inv.status === "Payment Failed";
              const isDue = inv.status === "Due";

              return (
                <tr
                  key={inv.id}
                  className={`hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30 transition-colors ${
                    isFailed ? "bg-rose-50/30 dark:bg-rose-950/10" : isDue ? "bg-amber-50/20 dark:bg-amber-950/10" : ""
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
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-900/20"
                          : inv.status === "Payment Failed"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border-rose-100/50 dark:border-rose-900/20"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-100/50 dark:border-amber-900/20"
                      }`}
                    >
                      <span
                        className={`w-1 h-1 rounded-full ${
                          inv.status === "Paid" ? "bg-emerald-500" : inv.status === "Payment Failed" ? "bg-rose-500" : "bg-amber-500"
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
      <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/30 dark:bg-zinc-900/30 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-450 select-none">
        <span>Showing 5 of 248 invoices</span>
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

          <button className="flex items-center gap-1 px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300 cursor-pointer">
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
