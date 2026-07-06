"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function OnboardingSettings() {
  const [trialDuration, setTrialDuration] = useState("14 days");
  const [template, setTemplate] = useState("Welcome Email (v3)");
  const [allowExtension, setAllowExtension] = useState(true);
  const [maxExtensions, setMaxExtensions] = useState("1");
  const [autoSuspend, setAutoSuspend] = useState(true);
  const [gracePeriod, setGracePeriod] = useState("3 days");

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-xl shadow-xs space-y-4">
      {/* Header info */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
            Trial & Onboarding
          </h2>
          <p className="text-xs text-zinc-450 mt-0.5">
            Trial lifecycle and onboarding automation
          </p>
        </div>
        <span className="text-[10px] px-2 py-0.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 font-bold rounded-full select-none">
          Saved
        </span>
      </div>

      {/* Input fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Default Trial Duration */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-500">Default Trial Duration</label>
          <input
            type="text"
            value={trialDuration}
            onChange={(e) => setTrialDuration(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
          />
        </div>

        {/* Welcome Email Template */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-500">Welcome Email Template</label>
          <div className="relative">
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full pl-3 pr-8 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300 font-semibold focus:outline-none appearance-none cursor-pointer"
            >
              <option value="Welcome Email (v3)">Welcome Email (v3)</option>
              <option value="Welcome Email (v2)">Welcome Email (v2)</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* Trial Extension Allowed */}
        <div className="p-3 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg flex items-center justify-between bg-white dark:bg-zinc-950/50">
          <div>
            <span className="block font-semibold text-zinc-800 dark:text-zinc-250 leading-none">Trial Extension Allowed</span>
            <span className="block text-[10px] text-zinc-400 mt-1 select-none font-medium leading-none">
              Allow admins to extend trials
            </span>
          </div>
          {/* Toggle Switch */}
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={allowExtension}
              onChange={() => setAllowExtension(!allowExtension)}
              className="sr-only peer"
            />
            <div className="w-7 h-4 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-zinc-650 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500" />
          </label>
        </div>

        {/* Max Trial Extensions */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-500">Max Trial Extensions</label>
          <input
            type="text"
            value={maxExtensions}
            onChange={(e) => setMaxExtensions(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
          />
        </div>

        {/* Auto-suspend on Trial Expiry */}
        <div className="p-3 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg flex items-center justify-between bg-white dark:bg-zinc-950/50">
          <div>
            <span className="block font-semibold text-zinc-800 dark:text-zinc-250 leading-none">Auto-suspend on Trial Expiry</span>
            <span className="block text-[10px] text-zinc-400 mt-1 select-none font-medium leading-none">
              Suspend access when trial ends
            </span>
          </div>
          {/* Toggle Switch */}
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={autoSuspend}
              onChange={() => setAutoSuspend(!autoSuspend)}
              className="sr-only peer"
            />
            <div className="w-7 h-4 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-zinc-650 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500" />
          </label>
        </div>

        {/* Grace Period after Expiry */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-500">Grace Period after Expiry</label>
          <input
            type="text"
            value={gracePeriod}
            onChange={(e) => setGracePeriod(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
