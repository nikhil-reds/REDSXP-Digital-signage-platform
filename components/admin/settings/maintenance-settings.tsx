"use client";

import React, { useState } from "react";

export default function MaintenanceSettings() {
  const [enabled, setEnabled] = useState(false);
  const [ipWhitelist, setIpWhitelist] = useState("");
  const [message, setMessage] = useState("We are performing scheduled maintenance....");

  const handleActivate = () => {
    alert("Activating maintenance mode globally...");
  };

  return (
    <div className="bg-amber-50/20 dark:bg-amber-955/5 border border-amber-250 dark:border-amber-900/40 p-5 rounded-xl shadow-xs space-y-4 text-xs">
      {/* Header info */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-bold text-amber-850 dark:text-amber-500 leading-snug">
            Maintenance Mode
          </h2>
          <p className="text-xs text-amber-700 dark:text-amber-500/80 mt-0.5">
            Temporarily restrict platform access during scheduled work
          </p>
        </div>
        <span className="text-[10px] px-2 py-0.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 font-bold rounded-full select-none">
          Saved
        </span>
      </div>

      {/* Input fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Enable Maintenance Mode */}
        <div className="p-3 border border-amber-200/50 dark:border-amber-900/20 rounded-lg flex items-center justify-between bg-white/40 dark:bg-zinc-950/20 h-14">
          <div>
            <span className="block font-semibold text-zinc-800 dark:text-zinc-250 leading-none">Enable Maintenance Mode</span>
            <span className="block text-[10px] text-zinc-400 mt-1 select-none font-medium leading-none">
              Currently disabled
            </span>
          </div>
          {/* Toggle Switch */}
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={enabled}
              onChange={() => setEnabled(!enabled)}
              className="sr-only peer"
            />
            <div className="w-7 h-4 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-805 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-zinc-650 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500" />
          </label>
        </div>

        {/* Allowed IPs Whitelist */}
        <div className="flex flex-col gap-1.5 justify-end">
          <label className="font-semibold text-zinc-500">Allowed IPs Whitelist</label>
          <input
            type="text"
            placeholder="Admin bypass IPs"
            value={ipWhitelist}
            onChange={(e) => setIpWhitelist(e.target.value)}
            className="w-full px-3 py-2 bg-white/60 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-450 focus:outline-none h-9"
          />
        </div>
      </div>

      {/* Maintenance Message */}
      <div className="flex flex-col gap-1.5">
        <label className="font-semibold text-zinc-500">Maintenance Message</label>
        <textarea
          placeholder="We are performing scheduled maintenance...."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-20 px-3 py-2 bg-white/60 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-450 focus:outline-none resize-none"
        />
      </div>

      {/* Footer bar */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
        <span className="text-[10px] text-amber-800 dark:text-amber-500 font-semibold leading-relaxed">
          This will display a maintenance page to all tenants and end users.
        </span>

        <button
          type="button"
          onClick={handleActivate}
          className="px-4 py-2 border border-red-200 dark:border-red-900/40 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 rounded-lg text-xs font-bold text-red-650 dark:text-red-400 transition-colors shadow-xs cursor-pointer text-center"
        >
          Activate Maintenance Mode
        </button>
      </div>
    </div>
  );
}
