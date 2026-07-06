"use client";

import React from "react";
import { Zap, Edit2, Play, Eye, EyeOff, BarChart2 } from "lucide-react";

export interface AutomationRule {
  id: string;
  name: string;
  sensorType: "Motion" | "Light" | "Temperature" | "Camera";
  condition: string;
  action: string;
  priority: number;
  target: string;
  schedule: string;
  triggersCount: number;
  active: boolean;
}

interface RulesListProps {
  rules: AutomationRule[];
  onToggleRule: (id: string, active: boolean) => void;
  onEditRule: (rule: AutomationRule) => void;
}

export default function RulesList({ rules, onToggleRule, onEditRule }: RulesListProps) {
  return (
    <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F6F7F9] dark:bg-[#171F2C]/50 text-[#657080] dark:text-[#9AA7B7] font-bold border-b border-[#E2E6EC] dark:border-[#283243] select-none">
              <th className="p-3.5">Rule Name</th>
              <th className="p-3.5">Sensor Trigger</th>
              <th className="p-3.5">Action Output</th>
              <th className="p-3.5">Priority</th>
              <th className="p-3.5">Target Scope</th>
              <th className="p-3.5">Active Times</th>
              <th className="p-3.5 text-center">Triggers</th>
              <th className="p-3.5 text-center">State</th>
              <th className="p-3.5 w-12 text-center">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E6EC] dark:divide-[#283243]">
            {rules.map((rule) => {
              return (
                <tr
                  key={rule.id}
                  className={`hover:bg-[#F6F7F9]/30 dark:hover:bg-[#171F2C]/10 transition-all ${
                    !rule.active ? "opacity-65" : ""
                  }`}
                >
                  <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                    <Zap className={`w-3.5 h-3.5 ${rule.active ? "text-amber-500" : "text-zinc-400"}`} />
                    <span>{rule.name}</span>
                  </td>
                  <td className="p-3.5 font-semibold text-zinc-700 dark:text-zinc-350">
                    <span className="px-2 py-0.5 rounded-sm bg-zinc-50 dark:bg-zinc-800 border border-[#E2E6EC] dark:border-[#283243] font-mono text-[10px]">
                      {rule.condition}
                    </span>
                  </td>
                  <td className="p-3.5 text-[#2859D9] dark:text-[#6F96FF] font-semibold">
                    {rule.action}
                  </td>
                  <td className="p-3.5 text-zinc-450 font-bold font-mono">
                    P-{rule.priority}
                  </td>
                  <td className="p-3.5 text-zinc-550 dark:text-zinc-400">
                    {rule.target}
                  </td>
                  <td className="p-3.5 text-zinc-450 text-[11px]">
                    {rule.schedule}
                  </td>
                  
                  {/* Triggers Count */}
                  <td className="p-3.5 text-center font-mono font-bold text-zinc-800 dark:text-zinc-200">
                    {rule.triggersCount}
                  </td>

                  {/* Active Toggle Switch */}
                  <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleRule(rule.id, !rule.active)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                        rule.active ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                          rule.active ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>

                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => onEditRule(rule)}
                      className="p-1 rounded-md text-zinc-400 hover:bg-[#F6F7F9] dark:hover:bg-[#171F2C] hover:text-[#2859D9] dark:hover:text-[#6F96FF] cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
