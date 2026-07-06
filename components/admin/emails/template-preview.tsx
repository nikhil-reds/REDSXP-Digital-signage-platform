"use client";

import React, { useState, useEffect } from "react";
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
  const [body, setBody] = useState(template.body);

  // Sync state when selected template changes
  useEffect(() => {
    setSubject(template.subject);
    setFromName(template.fromName);
    setBody(template.body);
  }, [template]);

  const tabs = ["HTML Editor", "Visual Preview", "Plain Text", "Send Test"];

  const handleSave = () => {
    onSave(template.id, subject, fromName, body);
  };

  return (
    <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl shadow-xs overflow-hidden flex flex-col h-full">
      {/* Editor Header */}
      <div className="p-4 border-b border-zinc-150 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
            {template.name}
          </h2>
          <p className="text-[11px] text-zinc-450 dark:text-zinc-500 mt-0.5">
            Visual preview of the selected template
          </p>
        </div>

        {/* Action Tabs */}
        <div className="flex bg-zinc-50 dark:bg-zinc-850 p-0.5 rounded-lg text-[10px] font-semibold text-zinc-500 select-none">
          {tabs.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                type="button"
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-blue-600 dark:bg-blue-500 text-white shadow-xs"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
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
            <label className="font-semibold text-zinc-500">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-zinc-500">From Name</label>
            <input
              type="text"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Variables chips list */}
        <div className="p-3 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg bg-zinc-50/20 dark:bg-zinc-900/10 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 dark:text-zinc-500 block">
            Variables
          </span>
          <div className="flex flex-wrap gap-1.5">
            {template.variables.map((v) => (
              <span
                key={v}
                className="px-2.5 py-0.5 bg-blue-50/50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-100/50 rounded-full font-mono text-[9px] font-semibold cursor-pointer select-none"
              >
                {v}
              </span>
            ))}
          </div>
        </div>

        {/* Visual Preview Canvas Frame */}
        <div className="border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 p-6 flex justify-center">
          <div className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl shadow-xs overflow-hidden flex flex-col p-6 space-y-5">
            {/* Header logo/brand */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-lg flex items-center justify-center shadow-xs">
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
                className="px-4 py-2 bg-zinc-950 hover:bg-zinc-850 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:opacity-90 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
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
      <div className="p-4 border-t border-zinc-150 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
        <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-medium">
          Last saved 2 Jul 2026, 4:28 PM IST
        </span>

        <div className="flex items-center gap-3 text-xs">
          <button
            type="button"
            className="text-blue-650 hover:underline dark:text-blue-400 font-semibold cursor-pointer"
          >
            Revert to Default
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-3.5 py-1.5 border border-zinc-200 dark:border-zinc-800 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 rounded-lg font-semibold text-zinc-700 dark:text-zinc-300 transition-colors shadow-xs cursor-pointer"
          >
            Save Template
          </button>
          <button
            type="button"
            className="px-3.5 py-1.5 bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
          >
            Send Test Email
          </button>
        </div>
      </div>
    </div>
  );
}
