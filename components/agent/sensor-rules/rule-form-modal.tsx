"use client";

import React, { useState } from "react";
import { Sparkles, X } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex animate-fadeIn items-center justify-center bg-black/55 p-4 font-sans dark:bg-black/80">
      <div className="flex max-h-[85vh] w-[480px] max-w-full flex-col overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-app-border bg-app-surface-alt p-5">
          <div>
            <h3 className="font-heading text-h6 font-semibold tracking-headline text-app-text">
              {rule ? "Edit Automation Rule" : "Create Sensor Rule"}
            </h3>
            <p className="mt-1 text-body text-app-muted">
              Define conditional actions that override standard schedules upon sensor triggers.
            </p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-app-muted transition-colors hover:bg-app-surface hover:text-app-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent-text"
            aria-label="Close sensor rule form"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto p-5 text-body">
          
          {/* Rule Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-caption font-semibold uppercase tracking-headline text-app-muted">
              Rule Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-app-border bg-app-surface-alt px-3.5 py-2 text-body text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Sensor Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-caption font-semibold uppercase tracking-headline text-app-muted">
                Trigger Sensor
              </label>
              <select
                value={sensorType}
                onChange={(e) => setSensorType(e.target.value as AutomationRule["sensorType"])}
                className="w-full cursor-pointer rounded-lg border border-app-border bg-app-surface-alt px-3 py-2 text-body font-semibold text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
              >
                <option value="Motion">Motion Detector</option>
                <option value="Light">Light Lux Sensor</option>
                <option value="Temperature">Temperature Probe</option>
                <option value="Camera">Camera Analytics</option>
              </select>
            </div>

            {/* Condition expression */}
            <div className="flex flex-col gap-1.5">
              <label className="text-caption font-semibold uppercase tracking-headline text-app-muted">
                Condition Parameter
              </label>
              <input
                type="text"
                placeholder="e.g. Motion > 1"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full rounded-lg border border-app-border bg-app-surface-alt px-3.5 py-2 text-body text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Action Output */}
            <div className="flex flex-col gap-1.5">
              <label className="text-caption font-semibold uppercase tracking-headline text-app-muted">
                Action Output Campaign
              </label>
              <input
                type="text"
                placeholder="e.g. Play Walk-in Offer for 30s"
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full rounded-lg border border-app-border bg-app-surface-alt px-3.5 py-2 text-body font-semibold text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
                required
              />
            </div>

            {/* Target Scope */}
            <div className="flex flex-col gap-1.5">
              <label className="text-caption font-semibold uppercase tracking-headline text-app-muted">
                Target Display Scope
              </label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full cursor-pointer rounded-lg border border-app-border bg-app-surface-alt px-3 py-2 text-body font-semibold text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
              >
                <option value="Bengaluru Flagship Stores">Bengaluru Flagships</option>
                <option value="All screens">All Screens</option>
                <option value="Indiranagar">Indiranagar Screen 03</option>
                <option value="Phoenix Mall">Phoenix Mall Display</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Priority override */}
            <div className="flex flex-col gap-1.5">
              <label className="text-caption font-semibold uppercase tracking-headline text-app-muted">Rule Priority Override</label>
              <input
                type="number"
                min="1"
                max="100"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-lg border border-app-border bg-app-surface-alt px-3.5 py-2 text-body font-semibold text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
              />
            </div>

            {/* Active Times schedule */}
            <div className="flex flex-col gap-1.5">
              <label className="text-caption font-semibold uppercase tracking-headline text-app-muted">Active Operational Hours</label>
              <input
                type="text"
                placeholder="e.g. Mon–Sun, 8 AM–10 PM"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="w-full rounded-lg border border-app-border bg-app-surface-alt px-3.5 py-2 text-body text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text"
              />
            </div>
          </div>

          {/* Sync warning */}
          <div className="space-y-1.5 rounded-xl border border-app-border bg-app-accent-surface p-3.5">
            <h4 className="flex items-center gap-1.5 text-caption font-semibold uppercase tracking-headline text-app-accent-text">
              <Sparkles className="w-3.5 h-3.5" />
              Manifest Deployment Check
            </h4>
            <p className="text-caption leading-relaxed text-app-muted">
              Applying this local automation rule will deploy sensor configurations and timeout behaviors to selected players. Manifest execution is automated at the hardware edge.
            </p>
          </div>

        </form>

        {/* Footer actions */}
        <div className="flex shrink-0 justify-end gap-2 border-t border-app-border bg-app-surface-alt p-4 font-sans">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-app-border bg-app-surface px-4 py-2 font-heading text-body font-semibold text-app-text transition-colors hover:bg-app-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent-text"
          >
            Discard
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="cursor-pointer rounded-lg bg-app-accent px-4 py-2 font-heading text-body font-semibold text-app-accent-on transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent-text focus-visible:ring-offset-2 focus-visible:ring-offset-app-surface"
          >
            Deploy Automation Rule
          </button>
        </div>

      </div>
    </div>
  );
}
