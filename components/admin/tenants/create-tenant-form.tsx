"use client";

import React, { useState } from "react";
import { X, Calendar, Loader2, AlertCircle } from "lucide-react";
import type { PlanOption } from "@/components/admin/tenants/tenants-table";

export interface CreateTenantPayload {
  name: string;
  slug: string;
  planId: string;
  trialEndDate: string;
  primaryColor: string;
  brandLogoUrl: string;
  customDomain: string;
}

interface CreateTenantFormProps {
  planOptions: PlanOption[];
  isSaving: boolean;
  error: string | null;
  onClose: () => void;
  onSave: (tenant: CreateTenantPayload) => void;
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function CreateTenantForm({
  planOptions,
  isSaving,
  error,
  onClose,
  onSave,
}: CreateTenantFormProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [planId, setPlanId] = useState("");
  const [trialEndDate, setTrialEndDate] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#1A4E8C");
  const [brandLogoUrl, setBrandLogoUrl] = useState("");
  const [customDomain, setCustomDomain] = useState("");

  const handleNameChange = (value: string) => {
    setName(value);
    if (!isSlugEdited) setSlug(slugify(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim() || isSaving) return;
    onSave({
      name: name.trim(),
      slug: slug.trim(),
      planId,
      trialEndDate: planId ? trialEndDate : "",
      primaryColor,
      brandLogoUrl: brandLogoUrl.trim(),
      customDomain: customDomain.trim(),
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
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-app-danger-border bg-app-danger-surface px-3 py-2 text-[11px] font-medium text-app-danger-text">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tenant Name */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-app-muted">Tenant Name</label>
          <input
            type="text"
            placeholder="e.g. Acme Retail Pvt Ltd"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full rounded-lg border border-app-border bg-app-surface-alt px-3 py-2 text-caption text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent-text"
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
              placeholder="acme-retail"
              value={slug}
              onChange={(e) => {
                setIsSlugEdited(true);
                setSlug(e.target.value);
              }}
              className="w-full bg-app-surface px-3 py-2 text-caption text-app-text placeholder:text-app-muted focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Plan Select — sourced from the plans table */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-app-muted">Plan</label>
          <select
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            className="w-full cursor-pointer rounded-lg border border-app-border bg-app-surface-alt px-3 py-2 text-caption text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
          >
            <option value="">No plan (assign later)</option>
            {planOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          {planOptions.length === 0 && (
            <span className="text-[10px] text-app-muted">
              No plans exist yet — create them under Plans &amp; Features first.
            </span>
          )}
        </div>

        {/* Trial End Date */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-app-muted">Trial End Date</label>
          <div className="relative">
            <input
              type="date"
              value={trialEndDate}
              onChange={(e) => setTrialEndDate(e.target.value)}
              disabled={!planId}
              className="w-full cursor-pointer rounded-lg border border-app-border bg-app-surface-alt py-2 pl-3 pr-9 text-caption text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-muted" />
          </div>
          <span className="text-[10px] text-app-muted">
            Leave empty to start the subscription as active instead of a trial.
          </span>
        </div>

        {/* Brand Logo URL */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-app-muted">Logo URL</label>
          <input
            type="url"
            placeholder="https://cdn.example.com/logo.svg"
            value={brandLogoUrl}
            onChange={(e) => setBrandLogoUrl(e.target.value)}
            className="w-full rounded-lg border border-app-border bg-app-surface-alt px-3 py-2 text-caption text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent-text"
          />
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

        {/* Custom Domain */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-app-muted">Custom Domain</label>
          <input
            type="text"
            placeholder="screens.acme.in"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            className="w-full rounded-lg border border-app-border bg-app-surface-alt px-3 py-2 text-caption text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent-text"
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
            disabled={isSaving}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-app-accent px-4 py-2 font-semibold text-app-accent-on shadow-xs transition-colors hover:bg-app-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{isSaving ? "Saving…" : "Save"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
