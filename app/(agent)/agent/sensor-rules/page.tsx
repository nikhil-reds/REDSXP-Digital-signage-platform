"use client";

import React, { useState } from "react";
import { Search, Plus, Filter, Zap, Activity, ShieldCheck, ChevronDown } from "lucide-react";
import RulesList, { AutomationRule } from "@/components/agent/sensor-rules/rules-list";
import RuleFormModal from "@/components/agent/sensor-rules/rule-form-modal";
import RuleLogsTrends from "@/components/agent/sensor-rules/rule-logs-trends";

const initialRules: AutomationRule[] = [
  {
    id: "rul-1",
    name: "Proximity Promo",
    sensorType: "Motion",
    condition: "Motion > 1",
    action: "Play Walk-in Offer for 30s",
    priority: 80,
    target: "Bengaluru Flagship Stores",
    schedule: "Mon–Sun, 8 AM–10 PM",
    triggersCount: 142,
    active: true
  },
  {
    id: "rul-2",
    name: "Brightness Adjuster",
    sensorType: "Light",
    condition: "Light > 800 lux",
    action: "Set screen brightness to 100%",
    priority: 90,
    target: "All screens",
    schedule: "Mon–Sun, 6 AM–6 PM",
    triggersCount: 88,
    active: true
  },
  {
    id: "rul-3",
    name: "Cold Weather Hot Drinks",
    sensorType: "Temperature",
    condition: "Temp < 18°C",
    action: "Play Hot Brews menu for 60s",
    priority: 70,
    target: "Indiranagar",
    schedule: "Mon–Sun, all day",
    triggersCount: 0,
    active: false
  },
  {
    id: "rul-4",
    name: "Crowd detector",
    sensorType: "Camera",
    condition: "Camera crowd > 5",
    action: "Play Group Combos for 45s",
    priority: 85,
    target: "Phoenix Mall",
    schedule: "Fri–Sun, 12 PM–9 PM",
    triggersCount: 64,
    active: true
  }
];

export default function AgentSensorRulesPage() {
  const [rules, setRules] = useState<AutomationRule[]>(initialRules);
  const [search, setSearch] = useState("");
  const [sensorFilter, setSensorFilter] = useState("All");
  
  // Modals state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);

  // Filters application
  const filteredRules = rules.filter((rule) => {
    const matchesSearch = rule.name.toLowerCase().includes(search.toLowerCase()) ||
                          rule.target.toLowerCase().includes(search.toLowerCase());
    
    const matchesSensor = sensorFilter === "All" || rule.sensorType === sensorFilter;

    return matchesSearch && matchesSensor;
  });

  const handleToggleRule = (id: string, active: boolean) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, active } : r)));
  };

  const handleSaveRule = (saved: AutomationRule) => {
    const exists = rules.some((r) => r.id === saved.id);
    if (exists) {
      setRules(rules.map((r) => (r.id === saved.id ? saved : r)));
    } else {
      setRules([...rules, saved]);
    }
    setShowFormModal(false);
    setEditingRule(null);
  };

  const handleEditTrigger = (rule: AutomationRule) => {
    setEditingRule(rule);
    setShowFormModal(true);
  };

  return (
    <div className="py-6 px-8 space-y-6 mx-auto font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E6EC] dark:border-[#283243] pb-5 shrink-0">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-55 tracking-tight flex items-center gap-2">
            Local Automation & Sensor Rules
          </h1>
          <p className="text-xs text-[#657080] dark:text-[#9AA7B7]">
            Build edge triggers (motion, camera, lux, temp) to override scheduled menus dynamically.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingRule(null);
            setShowFormModal(true);
          }}
          className="flex items-center gap-1.5 bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] px-3.5 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Sensor Rule</span>
        </button>
      </div>

      {/* Stats counter panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400">Total Rules</span>
            <span className="block text-lg font-bold text-zinc-900 dark:text-white mt-1">{rules.length} rules</span>
          </div>
          <Zap className="w-5 h-5 text-zinc-400" />
        </div>
        <div className="p-4 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400">Active Rules</span>
            <span className="block text-lg font-bold text-emerald-600 dark:text-emerald-500 mt-1">
              {rules.filter((r) => r.active).length} deployed
            </span>
          </div>
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
        </div>
        <div className="p-4 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400">Total Triggers Today</span>
            <span className="block text-lg font-bold text-zinc-900 dark:text-white mt-1">
              {rules.reduce((acc, curr) => acc + curr.triggersCount, 0)} triggers
            </span>
          </div>
          <Activity className="w-5 h-5 text-amber-500" />
        </div>
      </div>

      {/* Query Filters */}
      <div className="p-4 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search rules, targets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-[#18202B] dark:text-[#F2F5F8] placeholder-zinc-450 focus:outline-none"
          />
        </div>

        {/* Sensor selector */}
        <div className="relative">
          <select
            value={sensorFilter}
            onChange={(e) => setSensorFilter(e.target.value)}
            className="w-full pl-8 pr-8 py-1.5 border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-[#F6F7F9] dark:bg-[#171F2C]/50 text-xs text-zinc-700 dark:text-zinc-300 font-bold focus:outline-none appearance-none cursor-pointer"
          >
            <option value="All">All Sensor Types</option>
            <option value="Motion">Motion Sensors</option>
            <option value="Light">Light Lux Sensors</option>
            <option value="Temperature">Temperature Probes</option>
            <option value="Camera">Camera Analytics</option>
          </select>
          <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
        </div>
      </div>

      {/* Rules list table */}
      <div className="flex-1">
        <RulesList
          rules={filteredRules}
          onToggleRule={handleToggleRule}
          onEditRule={handleEditTrigger}
        />
      </div>

      {/* Diagnostics panel */}
      <RuleLogsTrends />

      {/* Rule Form Modal */}
      {showFormModal && (
        <RuleFormModal
          rule={editingRule}
          onClose={() => {
            setShowFormModal(false);
            setEditingRule(null);
          }}
          onSave={handleSaveRule}
        />
      )}

    </div>
  );
}
