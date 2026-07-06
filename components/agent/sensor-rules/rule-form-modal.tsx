"use client";

import React, { useState } from "react";
import { X, Zap, Cpu, Settings, Clock, Sparkles } from "lucide-react";
import { AutomationRule } from "./rules-list";

interface RuleFormModalProps {
  rule?: AutomationRule | null;
  onClose: () => void;
  onSave: (rule: AutomationRule) => void;
}

export default function RuleFormModal({ rule, onClose, onSave }: RuleFormModalProps) {
  const [name, setName] = useState(rule?.name || "New Automation Rule");
  const [sensorType, setSensorType] = useState<"Motion" | "Light" | "Temperature" | "Camera">(rule?.sensorType || "Motion");
  const [condition, setCondition] = useState(rule?.condition || "Motion > 1");
  const [action, setAction] = useState(rule?.action || "Play Walk-in Offer for 30s");
  const [priority, setPriority] = useState(rule?.priority.toString() || "80");
  const [target, setTarget] = useState(rule?.target || "Bengaluru Flagship Stores");
  const [schedule, setSchedule] = useState(rule?.schedule || "Mon–Sun, 8 AM–10 PM");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: rule?.id || `rule-${Date.now()}`,
      name,
      sensorType,
      condition,
      action,
      priority: parseInt(priority) || 50,
      target,
      schedule,
      triggersCount: rule?.triggersCount || 0,
      active: rule?.active !== undefined ? rule.active : true
    });
  };

  return (
    <div className="fixed inset-0 bg-black/55 dark:bg-black/80 flex items-center justify-center z-50 animate-fadeIn font-sans">
      <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl w-[480px] max-w-full shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E2E6EC] dark:border-[#283243] flex justify-between items-center bg-[#F6F7F9]/50 dark:bg-[#171F2C]/20">
          <div>
            <h3 className="font-bold text-sm text-[#18202B] dark:text-[#F2F5F8]">
              {rule ? "Edit Automation Rule" : "Create Sensor Rule"}
            </h3>
            <p className="text-[10px] text-[#657080] dark:text-[#9AA7B7] mt-0.5">
              Define conditional actions that override standard schedules upon sensor triggers.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-55 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          
          {/* Rule Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Rule Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-[#18202B] dark:text-[#F2F5F8] focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Sensor Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Trigger Sensor
              </label>
              <select
                value={sensorType}
                onChange={(e) => setSensorType(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-705 dark:text-zinc-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="Motion">Motion Detector</option>
                <option value="Light">Light Lux Sensor</option>
                <option value="Temperature">Temperature Probe</option>
                <option value="Camera">Camera Analytics</option>
              </select>
            </div>

            {/* Condition expression */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Condition Parameter
              </label>
              <input
                type="text"
                placeholder="e.g. Motion > 1"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Action Output */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Action Output Campaign
              </label>
              <input
                type="text"
                placeholder="e.g. Play Walk-in Offer for 30s"
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none font-bold"
                required
              />
            </div>

            {/* Target Scope */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Target Display Scope
              </label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full px-3 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-705 dark:text-zinc-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="Bengaluru Flagship Stores">Bengaluru Flagships</option>
                <option value="All screens">All Screens</option>
                <option value="Indiranagar">Indiranagar Screen 03</option>
                <option value="Phoenix Mall">Phoenix Mall Display</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priority override */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Rule Priority Override</label>
              <input
                type="number"
                min="1"
                max="100"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3.5 py-1.5 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none font-mono font-bold"
              />
            </div>

            {/* Active Times schedule */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Active Operational Hours</label>
              <input
                type="text"
                placeholder="e.g. Mon–Sun, 8 AM–10 PM"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="w-full px-3.5 py-1.5 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Sync warning */}
          <div className="p-3.5 border border-blue-100 dark:border-blue-900/30 bg-blue-50/20 dark:bg-blue-950/10 rounded-xl space-y-1.5">
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-[#2859D9] dark:text-[#6F96FF] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Manifest Deployment Check
            </h4>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Applying this local automation rule will deploy sensor configurations and timeout behaviors to selected players. Manifest execution is automated at the hardware edge.
            </p>
          </div>

        </form>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#E2E6EC] dark:border-[#283243] flex gap-2 justify-end bg-[#F6F7F9]/50 dark:bg-[#171F2C]/20 shrink-0 font-sans">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#E2E6EC] dark:border-[#283243] text-xs font-bold rounded-lg text-zinc-650 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Discard
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] text-xs font-bold rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            Deploy Automation Rule
          </button>
        </div>

      </div>
    </div>
  );
}
