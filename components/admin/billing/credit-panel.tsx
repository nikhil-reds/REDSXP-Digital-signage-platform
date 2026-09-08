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
    <div className="rounded-xl border border-app-border bg-app-surface p-5 shadow-xs">
      <div className="flex items-start gap-2.5 mb-4">
        <div className="rounded-lg bg-app-accent-surface p-2 text-app-accent-text shadow-xs">
          <Check className="h-4.5 w-4.5" />
        </div>
        <div>
          <h2 className="text-body font-bold text-app-text">Manual Credit / Discount</h2>
          <p className="mt-0.5 text-[11px] text-app-muted">Apply an adjustment to a tenant</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        {/* Tenant Select */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-app-muted">Tenant</label>
          <select
            value={tenant}
            onChange={(e) => setTenant(e.target.value)}
            className="w-full cursor-pointer rounded-lg border border-app-border bg-app-surface-alt px-3 py-2 text-caption text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
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
          <label className="font-semibold text-app-muted">Credit Amount (₹)</label>
          <div className="flex overflow-hidden rounded-lg border border-app-border">
            <span className="select-none border-r border-app-border bg-app-surface-alt px-3.5 py-2 text-app-muted">
              ₹
            </span>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-app-surface px-3 py-2 text-caption text-app-text focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Reason Textarea */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-app-muted">Reason</label>
          <textarea
            placeholder="Goodwill credit for downtime..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="h-16 w-full resize-none rounded-lg border border-app-border bg-app-surface-alt px-3 py-2 text-caption text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent-text"
          />
        </div>

        {/* Expiry Date */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-app-muted">Expiry Date</label>
          <div className="relative">
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full cursor-pointer rounded-lg border border-app-border bg-app-surface-alt py-2 pl-3 pr-9 text-caption font-medium text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
            />
            <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-muted" />
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="mt-4 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-app-accent py-2 text-caption font-semibold text-app-accent-on shadow-sm transition-colors hover:bg-app-accent-hover"
        >
          <Check className="w-4 h-4" />
          <span>Apply Credit</span>
        </button>
      </form>
    </div>
  );
}
