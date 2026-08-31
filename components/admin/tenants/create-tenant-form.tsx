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
  const [primaryColor, setPrimaryColor] = useState("#0F7A4F");
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
    <div className="flex h-full w-96 shrink-0 flex-col overflow-y-auto border-l border-app-border bg-app-surface font-sans text-app-text shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-app-border p-4">
        <div>
          <h2 className="text-body font-bold text-app-text">Create Tenant</h2>
          <p className="mt-0.5 text-[11px] text-app-muted">
            Provision a new tenant workspace
          </p>
        </div>
        <button
          onClick={onClose}
          className="cursor-pointer rounded-lg p-1 text-app-muted transition-colors hover:bg-app-surface-alt hover:text-app-text"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4 flex-1 text-xs">
        {/* Tenant Name */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-app-muted">Tenant Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-app-border bg-app-surface-alt px-3 py-2 text-caption text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
            required
          />
        </div>

        {/* Slug */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-app-muted">Slug</label>
          <div className="flex overflow-hidden rounded-lg border border-app-border">
            <span className="select-none border-r border-app-border bg-app-surface-alt px-3 py-2 text-app-muted">
              rubenius.app/
            </span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full bg-app-surface px-3 py-2 text-caption text-app-text focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Owner Details */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-app-muted">Owner Name</label>
            <input
              type="text"
              placeholder="Full name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full rounded-lg border border-app-border bg-app-surface-alt px-3 py-2 text-caption text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent-text"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-app-muted">Owner Email</label>
            <input
              type="email"
              placeholder="owner@acme.in"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              className="w-full rounded-lg border border-app-border bg-app-surface-alt px-3 py-2 text-caption text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent-text"
            />
          </div>
        </div>

        {/* Plan Select */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-app-muted">Plan</label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value as "Enterprise" | "Business" | "Growth")}
            className="w-full cursor-pointer rounded-lg border border-app-border bg-app-surface-alt px-3 py-2 text-caption text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
          >
            <option value="Enterprise">Enterprise</option>
            <option value="Business">Business</option>
            <option value="Growth">Growth</option>
          </select>
        </div>

        {/* Trial End Date */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-app-muted">Trial End Date</label>
          <div className="relative">
            <input
              type="date"
              value={trialEndDate}
              onChange={(e) => setTrialEndDate(e.target.value)}
              className="w-full cursor-pointer rounded-lg border border-app-border bg-app-surface-alt py-2 pl-3 pr-9 text-caption text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
            />
            <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-muted" />
          </div>
        </div>

        {/* Screen Quota & Storage */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-app-muted">Screen Quota</label>
            <input
              type="text"
              placeholder="e.g. 50"
              value={screenQuota}
              onChange={(e) => setScreenQuota(e.target.value)}
              className="w-full rounded-lg border border-app-border bg-app-surface-alt px-3 py-2 text-caption text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent-text"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-app-muted">Storage Limit</label>
            <input
              type="text"
              placeholder="e.g. 250 GB"
              value={storageLimit}
              onChange={(e) => setStorageLimit(e.target.value)}
              className="w-full rounded-lg border border-app-border bg-app-surface-alt px-3 py-2 text-caption text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent-text"
            />
          </div>
        </div>

        {/* Logo File Upload */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-app-muted">Logo</label>
          <div className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-app-border bg-app-surface-alt p-4 text-center transition-colors hover:border-app-accent-border">
            <Upload className="h-4 w-4 text-app-muted" />
            <span className="text-[10px] font-medium text-app-muted">Upload logo (PNG, SVG)</span>
          </div>
        </div>

        {/* Primary Color Picker */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-app-muted">Primary Color</label>
          <div className="flex items-center gap-2 rounded-lg border border-app-border bg-app-surface-alt px-3 py-1.5">
            <div
              className="w-5 h-5 rounded-md shadow-xs shrink-0"
              style={{ backgroundColor: primaryColor }}
            />
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-full bg-transparent font-mono text-caption font-medium uppercase text-app-text focus:outline-none"
            />
          </div>
        </div>

        {/* White-label Name */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-app-muted">White-label Name</label>
          <input
            type="text"
            value={whiteLabelName}
            onChange={(e) => setWhiteLabelName(e.target.value)}
            className="w-full rounded-lg border border-app-border bg-app-surface-alt px-3 py-2 text-caption text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
          />
        </div>

        {/* Custom Domain */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-app-muted">Custom Domain</label>
          <input
            type="text"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            className="w-full rounded-lg border border-app-border bg-app-surface-alt px-3 py-2 text-caption text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
          />
        </div>

        {/* Actions Button Panel */}
        <div className="mt-6 flex items-center justify-end gap-2 border-t border-app-border pt-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-app-border bg-app-surface px-4 py-2 font-semibold text-app-text transition-colors hover:bg-app-surface-alt"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-app-accent px-4 py-2 font-semibold text-app-accent-on shadow-xs transition-colors hover:bg-app-accent-hover"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
