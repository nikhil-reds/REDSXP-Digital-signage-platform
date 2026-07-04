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
  { stage: "Signups", count: 248, conversion: "—", bgColor: "bg-blue-650 dark:bg-blue-700", textColor: "text-white" },
  { stage: "Trial Started", count: 231, conversion: "93.1%", bgColor: "bg-blue-500 dark:bg-blue-600", textColor: "text-white" },
  { stage: "Activated", count: 198, conversion: "85.7%", bgColor: "bg-blue-400 dark:bg-blue-500", textColor: "text-white" },
  { stage: "Paid", count: 174, conversion: "87.9%", bgColor: "bg-blue-305 dark:bg-blue-400 text-zinc-900", textColor: "text-blue-950" },
  { stage: "Retained (90d)", count: 161, conversion: "92.5%", bgColor: "bg-blue-100 dark:bg-blue-200 text-zinc-900", textColor: "text-blue-900" }
];

export default function TenantGrowthFunnel() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-xl shadow-xs flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
            Tenant Growth Funnel
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">Signup to retention conversion · June 2026</p>
        </div>
        <Filter className="w-4 h-4 text-zinc-400" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center flex-1">
        {/* Table representation */}
        <div className="sm:col-span-2 overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-zinc-450 dark:text-zinc-500 font-semibold border-b border-zinc-100 dark:border-zinc-800">
                <th className="pb-2">Stage</th>
                <th className="pb-2 text-right">Count</th>
                <th className="pb-2 text-right">Conversion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {funnelData.map((item) => (
                <tr key={item.stage} className="hover:bg-zinc-50/20 dark:hover:bg-zinc-900/10">
                  <td className="py-2.5 font-medium text-zinc-700 dark:text-zinc-350 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    {item.stage}
                  </td>
                  <td className="py-2.5 text-right font-bold text-zinc-900 dark:text-zinc-50">
                    {item.count}
                  </td>
                  <td className={`py-2.5 text-right font-bold ${item.conversion === "—" ? "text-zinc-400" : "text-emerald-600 dark:text-emerald-500"}`}>
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
                <ArrowDown className="w-3 h-3 my-0.5 text-zinc-400 animate-bounce" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
