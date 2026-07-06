"use client";

import React, { useState } from "react";
import { X, Upload, Calendar } from "lucide-react";

interface CreateTenantFormProps {
  onClose: () => void;
  onSave: (tenant: {
    name: string;
    slug: string;
    ownerName: string;
    ownerEmail: string;
    plan: "Enterprise" | "Business" | "Growth";
    trialEndDate: string;
    screenQuota: number;
    storageLimit: number; // in GB
    primaryColor: string;
    whiteLabelName: string;
    customDomain: string;
  }) => void;
}

export default function CreateTenantForm({ onClose, onSave }: CreateTenantFormProps) {
  const [name, setName] = useState("Acme Retail Pvt Ltd");
  const [slug, setSlug] = useState("acme-retail");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [plan, setPlan] = useState<"Enterprise" | "Business" | "Growth">("Enterprise");
  const [trialEndDate, setTrialEndDate] = useState("2026-07-16");
  const [screenQuota, setScreenQuota] = useState("50");
  const [storageLimit, setStorageLimit] = useState("250");
  const [primaryColor, setPrimaryColor] = useState("#2457D6");
  const [whiteLabelName, setWhiteLabelName] = useState("Acme Signage");
  const [customDomain, setCustomDomain] = useState("screens.acme.in");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;
    onSave({
      name,
      slug,
      ownerName,
      ownerEmail,
      plan,
      trialEndDate,
      screenQuota: Number(screenQuota) || 0,
      storageLimit: Number(storageLimit) || 0,
      primaryColor,
      whiteLabelName,
      customDomain
    });
  };

  return (
    <div className="w-96 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 flex flex-col h-full font-sans shadow-xl shrink-0 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-zinc-150 dark:border-zinc-800 flex items-start justify-between">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Create Tenant</h2>
          <p className="text-[11px] text-zinc-450 dark:text-zinc-400 mt-0.5">
            Provision a new tenant workspace
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4 flex-1 text-xs">
        {/* Tenant Name */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-500">Tenant Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-50/50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-50"
            required
          />
        </div>

        {/* Slug */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-500">Slug</label>
          <div className="flex rounded-lg overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80">
            <span className="bg-zinc-50 dark:bg-zinc-850 px-3 py-2 border-r border-zinc-200/80 dark:border-zinc-800/80 text-zinc-450 select-none">
              rubenius.app/
            </span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-950 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Owner Details */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-zinc-500">Owner Name</label>
            <input
              type="text"
              placeholder="Full name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50/50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-50"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-zinc-500">Owner Email</label>
            <input
              type="email"
              placeholder="owner@acme.in"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50/50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Plan Select */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-500">Plan</label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value as any)}
            className="w-full px-3 py-2 bg-zinc-50/50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
          >
            <option value="Enterprise">Enterprise</option>
            <option value="Business">Business</option>
            <option value="Growth">Growth</option>
          </select>
        </div>

        {/* Trial End Date */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-500">Trial End Date</label>
          <div className="relative">
            <input
              type="date"
              value={trialEndDate}
              onChange={(e) => setTrialEndDate(e.target.value)}
              className="w-full pl-3 pr-9 py-2 bg-zinc-50/50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* Screen Quota & Storage */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-zinc-500">Screen Quota</label>
            <input
              type="text"
              placeholder="e.g. 50"
              value={screenQuota}
              onChange={(e) => setScreenQuota(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50/50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-zinc-500">Storage Limit</label>
            <input
              type="text"
              placeholder="e.g. 250 GB"
              value={storageLimit}
              onChange={(e) => setStorageLimit(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50/50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Logo File Upload */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-500">Logo</label>
          <div className="border border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-450/60 dark:hover:border-zinc-600 transition-colors p-4 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer bg-zinc-50/30 dark:bg-zinc-950/20">
            <Upload className="w-4 h-4 text-zinc-400" />
            <span className="text-[10px] font-medium text-zinc-500">Upload logo (PNG, SVG)</span>
          </div>
        </div>

        {/* Primary Color Picker */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-500">Primary Color</label>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50/50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg">
            <div
              className="w-5 h-5 rounded-md shadow-xs shrink-0"
              style={{ backgroundColor: primaryColor }}
            />
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-full bg-transparent text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none uppercase font-mono font-medium"
            />
          </div>
        </div>

        {/* White-label Name */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-500">White-label Name</label>
          <input
            type="text"
            value={whiteLabelName}
            onChange={(e) => setWhiteLabelName(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-50/50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
          />
        </div>

        {/* Custom Domain */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-500">Custom Domain</label>
          <input
            type="text"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-50/50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
          />
        </div>

        {/* Actions Button Panel */}
        <div className="flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800/80 pt-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-semibold hover:opacity-95 shadow-xs transition-all cursor-pointer"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
