"use client";

import React, { useState } from "react";
import { Check, Calendar } from "lucide-react";

export default function CreditPanel() {
  const [tenant, setTenant] = useState("");
  const [amount, setAmount] = useState("12000");
  const [reason, setReason] = useState("");
  const [expiryDate, setExpiryDate] = useState("2026-07-31");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Applied adjustment: ₹${Number(amount).toLocaleString()} to Tenant`);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-xl shadow-xs">
      <div className="flex items-start gap-2.5 mb-4">
        <div className="p-2 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg shadow-xs">
          <Check className="w-4.5 h-4.5 text-zinc-550" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Manual Credit / Discount</h2>
          <p className="text-[11px] text-zinc-450 mt-0.5">Apply an adjustment to a tenant</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        {/* Tenant Select */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-500">Tenant</label>
          <select
            value={tenant}
            onChange={(e) => setTenant(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-50/50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
          >
            <option value="">Select tenant</option>
            <option value="1">Reliance Retail Media</option>
            <option value="2">Apollo Pharmacies</option>
            <option value="3">PVR INOX</option>
            <option value="4">Decathlon India</option>
            <option value="5">Café Coffee Day</option>
          </select>
        </div>

        {/* Credit Amount */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-500">Credit Amount (₹)</label>
          <div className="flex rounded-lg overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80">
            <span className="bg-zinc-50 dark:bg-zinc-850 px-3.5 py-2 border-r border-zinc-200/80 dark:border-zinc-800/80 text-zinc-500 select-none">
              ₹
            </span>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-950 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Reason Textarea */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-500">Reason</label>
          <textarea
            placeholder="Goodwill credit for downtime..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full h-16 px-3 py-2 bg-zinc-50/50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-450 focus:outline-none resize-none"
          />
        </div>

        {/* Expiry Date */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-500">Expiry Date</label>
          <div className="relative">
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full pl-3 pr-9 py-2 bg-zinc-50/50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer font-medium"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="w-full py-2 bg-zinc-950 hover:bg-zinc-850 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:opacity-95 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer mt-4"
        >
          <Check className="w-4 h-4" />
          <span>Apply Credit</span>
        </button>
      </form>
    </div>
  );
}
