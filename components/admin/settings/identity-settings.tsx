"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function IdentitySettings() {
  const [platformName, setPlatformName] = useState("Rubenius");
  const [supportEmail, setSupportEmail] = useState("support@rubenius.com");
  const [supportUrl, setSupportUrl] = useState("https://help.rubenius.com");
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST)");
  const [language, setLanguage] = useState("English (India)");
  const [currency, setCurrency] = useState("INR (₹)");

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-xl shadow-xs space-y-4">
      {/* Header info */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
            Platform Identity
          </h2>
          <p className="text-xs text-zinc-450 mt-0.5">
            Core platform naming and regional defaults
          </p>
        </div>
        <span className="text-[10px] px-2 py-0.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 font-bold rounded-full select-none">
          Saved
        </span>
      </div>

      {/* Input fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Platform Name */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-500">Platform Name</label>
          <input
            type="text"
            value={platformName}
            onChange={(e) => setPlatformName(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
          />
        </div>

        {/* Support Email */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-500">Support Email</label>
          <input
            type="email"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
          />
        </div>

        {/* Support URL */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-500">Support URL</label>
          <input
            type="text"
            value={supportUrl}
            onChange={(e) => setSupportUrl(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
          />
        </div>

        {/* Default Timezone */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-500">Default Timezone</label>
          <div className="relative">
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full pl-3 pr-8 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300 font-semibold focus:outline-none appearance-none cursor-pointer"
            >
              <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
              <option value="UTC">UTC</option>
              <option value="EST">EST</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* Default Language */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-500">Default Language</label>
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full pl-3 pr-8 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300 font-semibold focus:outline-none appearance-none cursor-pointer"
            >
              <option value="English (India)">English (India)</option>
              <option value="English (US)">English (US)</option>
              <option value="Spanish">Spanish</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* Default Currency */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-500">Default Currency</label>
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full pl-3 pr-8 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300 font-semibold focus:outline-none appearance-none cursor-pointer"
            >
              <option value="INR (₹)">INR (₹)</option>
              <option value="USD ($)">USD ($)</option>
              <option value="EUR (€)">EUR (€)</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
