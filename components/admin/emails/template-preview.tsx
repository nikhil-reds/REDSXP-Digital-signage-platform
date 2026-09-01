"use client";

import React, { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";

interface TemplateDetails {
  id: string;
  name: string;
  subject: string;
  fromName: string;
  variables: string[];
  body: string;
}

interface TemplatePreviewProps {
  template: TemplateDetails;
  onSave: (id: string, subject: string, fromName: string, body: string) => void;
}

export default function TemplatePreview({ template, onSave }: TemplatePreviewProps) {
  const [activeTab, setActiveTab] = useState("Visual Preview");
  const [subject, setSubject] = useState(template.subject);
  const [fromName, setFromName] = useState(template.fromName);
  const body = template.body;

  const tabs = ["HTML Editor", "Visual Preview", "Plain Text", "Send Test"];

  const handleSave = () => {
    onSave(template.id, subject, fromName, body);
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-xs">
      {/* Editor Header */}
      <div className="flex flex-col gap-3 border-b border-app-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-body font-bold leading-snug text-app-text">
            {template.name}
          </h2>
          <p className="mt-0.5 text-[11px] text-app-muted">
            Visual preview of the selected template
          </p>
        </div>

        {/* Action Tabs */}
        <div className="flex select-none rounded-lg bg-app-surface-alt p-0.5 text-[10px] font-semibold text-app-muted">
          {tabs.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                type="button"
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-app-accent text-app-accent-on shadow-xs"
                    : "text-app-muted hover:text-app-text"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor Configs scrollable area */}
      <div className="p-4 space-y-4 flex-1 overflow-y-auto text-xs">
        {/* Subject & From Name Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-app-muted">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-app-border bg-app-surface-alt px-3 py-2 text-caption text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-app-muted">From Name</label>
            <input
              type="text"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              className="w-full rounded-lg border border-app-border bg-app-surface-alt px-3 py-2 text-caption text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
            />
          </div>
        </div>

        {/* Variables chips list */}
        <div className="space-y-2 rounded-lg border border-app-border bg-app-surface-alt p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 dark:text-zinc-500 block">
            Variables
          </span>
          <div className="flex flex-wrap gap-1.5">
            {template.variables.map((v) => (
              <span
                key={v}
                className="cursor-pointer select-none rounded-full border border-app-accent-border bg-app-accent-surface px-2.5 py-0.5 font-mono text-[9px] font-semibold text-app-accent-text"
              >
                {v}
              </span>
            ))}
          </div>
        </div>

        {/* Visual Preview Canvas Frame */}
        <div className="flex justify-center rounded-xl border border-app-border bg-app-surface-alt p-6">
          <div className="flex w-full max-w-xl flex-col space-y-5 overflow-hidden rounded-xl border border-app-border bg-app-surface p-6 shadow-xs">
            {/* Header logo/brand */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-app-accent text-app-accent-on shadow-xs">
                <Mail className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-zinc-900 dark:text-zinc-50 text-xs tracking-tight">
                  Rubenius
                </span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold leading-none">
                  Platform Notifications
                </span>
              </div>
            </div>

            {/* Email Body text content */}
            <div className="text-zinc-700 dark:text-zinc-300 space-y-3.5 leading-relaxed pr-2">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">Hi,</p>
              <p className="whitespace-pre-line">{body}</p>
            </div>

            {/* Simulated Action Call Button */}
            <div className="pt-2">
              <button
                type="button"
                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-app-accent px-4 py-2 font-semibold text-app-accent-on shadow-sm transition-colors hover:bg-app-accent-hover"
              >
                <span>Upgrade Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <hr className="border-zinc-100 dark:border-zinc-800 pt-1" />

            {/* Unsubscribe Footer */}
            <p className="text-[10px] text-zinc-450 dark:text-zinc-500 text-center select-none font-medium leading-none">
              If you no longer wish to receive these emails, you can{" "}
              <span className="underline hover:text-zinc-800 dark:hover:text-zinc-300 cursor-pointer">
                unsubscribe
              </span>{" "}
              at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Editor Footer actions bar */}
      <div className="flex select-none flex-col gap-4 border-t border-app-border bg-app-surface-alt p-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-medium">
          Last saved 2 Jul 2026, 4:28 PM IST
        </span>

        <div className="flex items-center gap-3 text-xs">
          <button
            type="button"
            className="cursor-pointer font-semibold text-app-accent-text hover:underline"
          >
            Revert to Default
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="cursor-pointer rounded-lg border border-app-border bg-app-surface px-3.5 py-1.5 font-semibold text-app-text shadow-xs transition-colors hover:bg-app-surface-alt"
          >
            Save Template
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-lg bg-app-accent px-3.5 py-1.5 font-semibold text-app-accent-on shadow-sm transition-colors hover:bg-app-accent-hover"
          >
            Send Test Email
          </button>
        </div>
      </div>
    </div>
  );
}
