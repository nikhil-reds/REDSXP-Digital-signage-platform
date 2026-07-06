"use client";

import React, { useState } from "react";
import { Edit2 } from "lucide-react";

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rollout: number; // percentage
  overrides: number; // 0 represents "—"
}

const initialFlags: FeatureFlag[] = [
  { id: "1", name: "sensor_triggered_content", description: "Play content based on sensor input events", enabled: true, rollout: 100, overrides: 0 },
  { id: "2", name: "ai_content_suggestions", description: "AI-generated playlist recommendations", enabled: true, rollout: 25, overrides: 3 },
  { id: "3", name: "bulk_device_commands", description: "Send commands to multiple devices at once", enabled: true, rollout: 100, overrides: 0 },
  { id: "4", name: "advanced_analytics_v2", description: "New analytics engine with drill-down", enabled: true, rollout: 50, overrides: 7 },
  { id: "5", name: "white_label_email", description: "Send transactional emails from tenant domain", enabled: true, rollout: 100, overrides: 0 }
];

export default function FeatureFlags() {
  const [flags, setFlags] = useState<FeatureFlag[]>(initialFlags);

  const handleToggle = (id: string) => {
    setFlags(
      flags.map((flag) => (flag.id === id ? { ...flag, enabled: !flag.enabled } : flag))
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Global Feature Flags</h2>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-450 dark:text-zinc-550 font-bold border-b border-zinc-150 dark:border-zinc-800 select-none">
                <th className="p-3.5">Flag Name</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Rollout %</th>
                <th className="p-3.5 text-center">Tenant Overrides</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
              {flags.map((flag) => (
                <tr
                  key={flag.id}
                  className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30 transition-colors"
                >
                  {/* Flag Name */}
                  <td className="p-3.5 font-mono text-[11px] font-semibold text-zinc-900 dark:text-zinc-100">
                    {flag.name}
                  </td>
                  {/* Description */}
                  <td className="p-3.5 text-zinc-550 dark:text-zinc-400">
                    {flag.description}
                  </td>
                  {/* Status Toggle */}
                  <td className="p-3.5">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={flag.enabled}
                        onChange={() => handleToggle(flag.id)}
                        className="sr-only peer"
                      />
                      <div className="w-7 h-4 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-zinc-600 peer-checked:bg-zinc-950 dark:peer-checked:bg-zinc-100" />
                    </label>
                  </td>
                  {/* Rollout Progress Bar */}
                  <td className="p-3.5 w-44">
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-zinc-850 dark:bg-zinc-200 h-full rounded-full"
                          style={{ width: `${flag.rollout}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-zinc-850 dark:text-zinc-200 font-bold shrink-0">
                        {flag.rollout}%
                      </span>
                    </div>
                  </td>
                  {/* Tenant Overrides */}
                  <td className="p-3.5 text-center">
                    {flag.overrides > 0 ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-300">
                        {flag.overrides} overrides
                      </span>
                    ) : (
                      <span className="text-zinc-400 dark:text-zinc-500 font-medium">—</span>
                    )}
                  </td>
                  {/* Actions */}
                  <td className="p-3.5">
                    <div className="flex items-center justify-center">
                      <button className="flex items-center gap-1 text-[11px] font-bold text-zinc-805 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-100 transition-colors border border-zinc-200/60 dark:border-zinc-800 px-2.5 py-1 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer shadow-xs">
                        <Edit2 className="w-3 h-3 text-zinc-500" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
