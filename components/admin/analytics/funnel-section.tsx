"use client";

import React from "react";
import { Filter, ArrowDown } from "lucide-react";

interface FunnelStage {
  stage: string;
  count: number;
  conversion: string;
  bgColor: string;
  textColor: string;
}

const funnelData: FunnelStage[] = [
  { stage: "Signups", count: 248, conversion: "—", bgColor: "bg-app-accent", textColor: "text-app-accent-on" },
  { stage: "Trial Started", count: 231, conversion: "93.1%", bgColor: "bg-app-accent", textColor: "text-app-accent-on" },
  { stage: "Activated", count: 198, conversion: "85.7%", bgColor: "bg-app-accent-surface", textColor: "text-app-accent-text" },
  { stage: "Paid", count: 174, conversion: "87.9%", bgColor: "bg-app-accent-surface", textColor: "text-app-accent-text" },
  { stage: "Retained (90d)", count: 161, conversion: "92.5%", bgColor: "bg-app-surface-alt", textColor: "text-app-text" }
];

export default function TenantGrowthFunnel() {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-app-border bg-app-surface p-5 shadow-xs">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="flex items-center gap-1.5 text-body font-bold text-app-text">
            Tenant Growth Funnel
          </h2>
          <p className="mt-0.5 text-caption text-app-muted">Signup to retention conversion · June 2026</p>
        </div>
        <Filter className="h-4 w-4 text-app-muted" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center flex-1">
        {/* Table representation */}
        <div className="sm:col-span-2 overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-app-border font-semibold text-app-muted">
                <th className="pb-2">Stage</th>
                <th className="pb-2 text-right">Count</th>
                <th className="pb-2 text-right">Conversion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border">
              {funnelData.map((item) => (
                <tr key={item.stage} className="hover:bg-app-surface-alt">
                  <td className="flex items-center gap-2 py-2.5 font-medium text-app-text">
                    <span className="h-2 w-2 rounded-full bg-app-accent" />
                    {item.stage}
                  </td>
                  <td className="py-2.5 text-right font-bold text-app-text">
                    {item.count}
                  </td>
                  <td className={`py-2.5 text-right font-bold ${item.conversion === "—" ? "text-app-muted" : "text-app-accent-text"}`}>
                    {item.conversion}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vertical visual Funnel Stack */}
        <div className="flex flex-col items-center justify-center py-2 shrink-0">
          {funnelData.map((item, idx) => (
            <React.Fragment key={item.stage}>
              <div
                className={`w-20 py-1.5 rounded-md flex items-center justify-center font-bold text-[11px] shadow-xs select-none ${item.bgColor} ${item.textColor}`}
              >
                {item.count}
              </div>
              {idx < funnelData.length - 1 && (
                <ArrowDown className="my-0.5 h-3 w-3 animate-bounce text-app-muted" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
