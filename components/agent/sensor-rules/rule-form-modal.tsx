"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { AutomationRule } from "./rules-list";
import { Button, FieldLabel, Modal, Select, TextInput } from "@/components/ui";

interface RuleFormModalProps {
  rule?: AutomationRule | null;
  onClose: () => void;
  onSave: (rule: AutomationRule) => void;
}

export default function RuleFormModal({ rule, onClose, onSave }: RuleFormModalProps) {
  const [name, setName] = useState(rule?.name || "New Automation Rule");
  const [sensorType, setSensorType] = useState<AutomationRule["sensorType"]>(
    rule?.sensorType || "Motion",
  );
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
      priority: parseInt(priority, 10) || 50,
      target,
      schedule,
      triggersCount: rule?.triggersCount || 0,
      active: rule?.active !== undefined ? rule.active : true,
    });
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={rule ? "Edit Automation Rule" : "Create Sensor Rule"}
      description="Define conditional actions that override standard schedules upon sensor triggers."
      size="lg"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Discard
          </Button>
          <Button type="submit" form="rule-form" variant="primary">
            Deploy Automation Rule
          </Button>
        </>
      }
    >
      <form id="rule-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <FieldLabel htmlFor="rf-name">Rule Name</FieldLabel>
          <TextInput
            id="rf-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="rf-sensor">Trigger Sensor</FieldLabel>
            <Select
              id="rf-sensor"
              value={sensorType}
              onChange={(e) => setSensorType(e.target.value as AutomationRule["sensorType"])}
            >
              <option value="Motion">Motion Detector</option>
              <option value="Light">Light Lux Sensor</option>
              <option value="Temperature">Temperature Probe</option>
              <option value="Camera">Camera Analytics</option>
            </Select>
          </div>

          <div>
            <FieldLabel htmlFor="rf-condition">Condition Parameter</FieldLabel>
            <TextInput
              id="rf-condition"
              placeholder="e.g. Motion > 1"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="rf-action">Action Output Campaign</FieldLabel>
            <TextInput
              id="rf-action"
              placeholder="e.g. Play Walk-in Offer for 30s"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              required
            />
          </div>

          <div>
            <FieldLabel htmlFor="rf-target">Target Display Scope</FieldLabel>
            <Select id="rf-target" value={target} onChange={(e) => setTarget(e.target.value)}>
              <option value="Bengaluru Flagship Stores">Bengaluru Flagships</option>
              <option value="All screens">All Screens</option>
              <option value="Indiranagar">Indiranagar Screen 03</option>
              <option value="Phoenix Mall">Phoenix Mall Display</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="rf-priority">Rule Priority Override</FieldLabel>
            <TextInput
              id="rf-priority"
              type="number"
              min="1"
              max="100"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            />
          </div>

          <div>
            <FieldLabel htmlFor="rf-schedule">Active Operational Hours</FieldLabel>
            <TextInput
              id="rf-schedule"
              placeholder="e.g. Mon–Sun, 8 AM–10 PM"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
            />
          </div>
        </div>

        {/* Deployment note */}
        <div className="space-y-1.5 rounded-lg border border-app-border bg-app-accent-surface p-3.5">
          <h4 className="flex items-center gap-1.5 text-caption font-semibold uppercase tracking-headline text-app-accent-text">
            <Sparkles className="w-3.5 h-3.5" />
            Manifest Deployment Check
          </h4>
          <p className="text-body text-app-muted">
            Applying this local automation rule will deploy sensor configurations and timeout
            behaviours to the selected players. Manifest execution is automated at the hardware edge.
          </p>
        </div>
      </form>
    </Modal>
  );
}
