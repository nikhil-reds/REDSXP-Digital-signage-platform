"use client";

import React from "react";

const signups = [
  { name: "Blue Tokai Coffee", plan: "Growth", joined: "28 Jun", mrr: "₹0", status: "Trial" },
  { name: "Decathlon India", plan: "Business", joined: "24 Jun", mrr: "₹1,04,500", status: "Active" },
  { name: "Café Coffee Day", plan: "Business", joined: "18 Jun", mrr: "₹1,29,990", status: "Active" },
  { name: "Apollo Pharmacies", plan: "Enterprise", joined: "12 Jun", mrr: "₹2,48,000", status: "Active" },
  { name: "PVR INOX", plan: "Enterprise", joined: "6 Jun", mrr: "₹2,95,000", status: "Active" }
];

const failedPayments = [
  { name: "Metro Brands", invoice: "INV-2026-06263", amount: "₹1,06,188", retry: "3 Jul" },
  { name: "Urban Ladder", invoice: "INV-2026-06209", amount: "₹49,990", retry: "Suspended" },
  { name: "Fabindia", invoice: "INV-2026-06198", amount: "₹34,990", retry: "4 Jul" },
  { name: "Wow! Momo", invoice: "INV-2026-06187", amount: "₹18,990", retry: "5 Jul" },
  { name: "Chai Point", invoice: "INV-2026-06172", amount: "₹14,990", retry: "5 Jul" }
];

export default function TablesGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Recent Tenant Signups */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg overflow-hidden shadow-xs">
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Recent Tenant Signups</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-400 dark:text-zinc-500 font-semibold border-b border-zinc-100 dark:border-zinc-800">
                <th className="p-3">Tenant</th>
                <th className="p-3">Plan</th>
                <th className="p-3">Joined</th>
                <th className="p-3 text-right">MRR</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {signups.map((item) => (
                <tr
                  key={item.name}
                  className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30 transition-colors"
                >
                  <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">
                    {item.name}
                  </td>
                  <td className="p-3 text-zinc-500 dark:text-zinc-400">
                    {item.plan}
                  </td>
                  <td className="p-3 text-zinc-400 dark:text-zinc-500">
                    {item.joined}
                  </td>
                  <td className="p-3 text-right font-bold text-zinc-800 dark:text-zinc-200">
                    {item.mrr}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-sm font-medium text-[10px] inline-flex items-center ${
                        item.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100/50 dark:border-amber-900/30"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Failed Payments */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg overflow-hidden shadow-xs">
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Failed Payments</h2>
          <span className="bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-450 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-rose-100/50 dark:border-rose-900/20">
            7 tenants
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-400 dark:text-zinc-500 font-semibold border-b border-zinc-100 dark:border-zinc-800">
                <th className="p-3">Tenant</th>
                <th className="p-3">Invoice</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3">Retry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {failedPayments.map((item) => (
                <tr
                  key={item.name}
                  className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30 transition-colors"
                >
                  <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">
                    {item.name}
                  </td>
                  <td className="p-3 text-zinc-400 dark:text-zinc-500 font-mono text-[10px]">
                    {item.invoice}
                  </td>
                  <td className="p-3 text-right font-bold text-red-650 dark:text-red-400">
                    {item.amount}
                  </td>
                  <td className="p-3">
                    <span
                      className={`font-semibold ${
                        item.retry === "Suspended"
                          ? "text-zinc-450 dark:text-zinc-500 font-normal"
                          : "text-red-650 dark:text-red-400"
                      }`}
                    >
                      {item.retry}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
