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
      <h2 className="text-body font-bold text-app-text">Global Feature Flags</h2>

      <div className="overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="select-none border-b border-app-border bg-app-surface-alt font-bold text-app-muted">
                <th className="p-3.5">Flag Name</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Rollout %</th>
                <th className="p-3.5 text-center">Tenant Overrides</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border">
              {flags.map((flag) => (
                <tr
                  key={flag.id}
                  className="transition-colors hover:bg-app-surface-alt"
                >
                  {/* Flag Name */}
                  <td className="p-3.5 font-mono text-[11px] font-semibold text-app-text">
                    {flag.name}
                  </td>
                  {/* Description */}
                  <td className="p-3.5 text-app-muted">
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
                      <div className="peer h-4 w-7 rounded-full bg-app-border after:absolute after:left-[2px] after:top-[2px] after:h-3 after:w-3 after:rounded-full after:border after:border-app-border after:bg-app-surface after:transition-all after:content-[''] peer-checked:bg-app-accent peer-checked:after:translate-x-full peer-focus:outline-none" />
                    </label>
                  </td>
                  {/* Rollout Progress Bar */}
                  <td className="p-3.5 w-44">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-app-surface-alt">
                        <div
                          className="h-full rounded-full bg-app-accent"
                          style={{ width: `${flag.rollout}%` }}
                        />
                      </div>
                      <span className="shrink-0 font-mono text-[10px] font-bold text-app-text">
                        {flag.rollout}%
                      </span>
                    </div>
                  </td>
                  {/* Tenant Overrides */}
                  <td className="p-3.5 text-center">
                    {flag.overrides > 0 ? (
                      <span className="rounded-full border border-app-border bg-app-surface-alt px-2 py-0.5 text-[10px] font-semibold text-app-muted">
                        {flag.overrides} overrides
                      </span>
                    ) : (
                      <span className="font-medium text-app-muted">—</span>
                    )}
                  </td>
                  {/* Actions */}
                  <td className="p-3.5">
                    <div className="flex items-center justify-center">
                      <button className="flex cursor-pointer items-center gap-1 rounded-lg border border-app-border px-2.5 py-1 text-[11px] font-bold text-app-text shadow-xs transition-colors hover:bg-app-surface-alt">
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
