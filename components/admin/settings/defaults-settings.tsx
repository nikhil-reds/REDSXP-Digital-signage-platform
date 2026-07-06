"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function DefaultsSettings() {
  const [defaultPlan, setDefaultPlan] = useState("Starter");
  const [maxScreens, setMaxScreens] = useState("5");
  const [maxStorage, setMaxStorage] = useState("50 GB");
  const [allowUpgrade, setAllowUpgrade] = useState(true);
  const [allowDowngrade, setAllowDowngrade] = useState(false);
  const [requireVerification, setRequireVerification] = useState(true);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-xl shadow-xs space-y-4">
      {/* Header info */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
            Tenant Defaults
          </h2>
          <p className="text-xs text-zinc-450 mt-0.5">
            Default provisioning settings for new tenants
          </p>
        </div>
        <span className="text-[10px] px-2 py-0.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 font-bold rounded-full select-none">
          Saved
        </span>
      </div>

      {/* Input fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Default Plan on Signup */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-500">Default Plan on Signup</label>
          <div className="relative">
            <select
              value={defaultPlan}
              onChange={(e) => setDefaultPlan(e.target.value)}
              className="w-full pl-3 pr-8 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300 font-semibold focus:outline-none appearance-none cursor-pointer"
            >
              <option value="Starter">Starter</option>
              <option value="Growth">Growth</option>
              <option value="Business">Business</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* Max Screens per Tenant */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-500">Max Screens per Tenant</label>
          <input
            type="text"
            value={maxScreens}
            onChange={(e) => setMaxScreens(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-105 placeholder-zinc-400 focus:outline-none"
          />
        </div>

        {/* Max Storage per Tenant */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-zinc-500">Max Storage per Tenant</label>
          <input
            type="text"
            value={maxStorage}
            onChange={(e) => setMaxStorage(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-105 placeholder-zinc-400 focus:outline-none"
          />
        </div>

        {/* Allow Tenant Self-service Upgrade */}
        <div className="p-3 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg flex items-center justify-between bg-white dark:bg-zinc-950/50">
          <div>
            <span className="block font-semibold text-zinc-800 dark:text-zinc-250 leading-none">Allow Tenant Self-service Upgrade</span>
            <span className="block text-[10px] text-zinc-400 mt-1 select-none font-medium leading-none">
              Tenants can upgrade plans without approval
            </span>
          </div>
          {/* Toggle Switch */}
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={allowUpgrade}
              onChange={() => setAllowUpgrade(!allowUpgrade)}
              className="sr-only peer"
            />
            <div className="w-7 h-4 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-zinc-650 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500" />
          </label>
        </div>

        {/* Allow Tenant Self-service Downgrade */}
        <div className="p-3 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg flex items-center justify-between bg-white dark:bg-zinc-950/50">
          <div>
            <span className="block font-semibold text-zinc-800 dark:text-zinc-250 leading-none">Allow Tenant Self-service Downgrade</span>
            <span className="block text-[10px] text-zinc-400 mt-1 select-none font-medium leading-none">
              Requires admin approval
            </span>
          </div>
          {/* Toggle Switch */}
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={allowDowngrade}
              onChange={() => setAllowDowngrade(!allowDowngrade)}
              className="sr-only peer"
            />
            <div className="w-7 h-4 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-zinc-650 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500" />
          </label>
        </div>

        {/* Require Domain Verification */}
        <div className="p-3 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg flex items-center justify-between bg-white dark:bg-zinc-950/50">
          <div>
            <span className="block font-semibold text-zinc-800 dark:text-zinc-250 leading-none">Require Domain Verification</span>
            <span className="block text-[10px] text-zinc-400 mt-1 select-none font-medium leading-none">
              Verify custom domains before activation
            </span>
          </div>
          {/* Toggle Switch */}
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={requireVerification}
              onChange={() => setRequireVerification(!requireVerification)}
              className="sr-only peer"
            />
            <div className="w-7 h-4 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-zinc-650 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500" />
          </label>
        </div>
      </div>
    </div>
  );
}
