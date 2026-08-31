"use client";

import React from "react";
import { Edit2, Zap } from "lucide-react";
import { Badge, IconButton, TableCard, Td, Th, Tr } from "@/components/ui";

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

export default function RulesList({
  rules,
  onToggleRule,
  onEditRule,
}: RulesListProps) {
  return (
    <TableCard
      title="Automation rules"
      description={`${rules.length} rule${rules.length === 1 ? "" : "s"} matching the current filters`}
      icon={Zap}
    >
      <table className="w-full min-w-[1120px] border-collapse text-left">
        <thead className="bg-app-surface-alt">
          <tr>
            <Th>Rule name</Th>
            <Th>Sensor trigger</Th>
            <Th>Action output</Th>
            <Th>Priority</Th>
            <Th>Target scope</Th>
            <Th>Active times</Th>
            <Th className="text-center">Triggers</Th>
            <Th className="text-center">State</Th>
            <Th className="w-16 text-center">Edit</Th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <Tr key={rule.id} className={!rule.active ? "opacity-60" : undefined}>
              <Td>
                <span className="flex items-center gap-2 font-semibold">
                  <Zap
                    className={`h-4 w-4 shrink-0 ${
                      rule.active ? "text-app-accent-text" : "text-app-muted"
                    }`}
                  />
                  {rule.name}
                </span>
              </Td>
              <Td>
                <Badge tone="neutral" className="rounded-md">
                  {rule.condition}
                </Badge>
              </Td>
              <Td className="font-semibold">{rule.action}</Td>
              <Td className="font-semibold text-app-muted">P-{rule.priority}</Td>
              <Td>{rule.target}</Td>
              <Td className="text-app-muted">{rule.schedule}</Td>
              <Td className="text-center font-semibold">{rule.triggersCount}</Td>
              <Td className="text-center">
                <button
                  type="button"
                  role="switch"
                  aria-checked={rule.active}
                  aria-label={`${rule.active ? "Disable" : "Enable"} ${rule.name}`}
                  onClick={() => onToggleRule(rule.id, !rule.active)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent-text focus-visible:ring-offset-2 focus-visible:ring-offset-app-surface ${
                    rule.active
                      ? "border-app-accent-text bg-app-accent"
                      : "border-app-border-strong bg-app-surface-alt"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`pointer-events-none mt-0.5 inline-block h-4.5 w-4.5 transform rounded-full shadow-sm transition-transform duration-200 ${
                      rule.active
                        ? "translate-x-5 bg-app-accent-on"
                        : "translate-x-0.5 bg-app-muted"
                    }`}
                  />
                </button>
              </Td>
              <Td className="text-center">
                <IconButton
                  size="sm"
                  icon={Edit2}
                  aria-label={`Edit ${rule.name}`}
                  title={`Edit ${rule.name}`}
                  onClick={() => onEditRule(rule)}
                />
              </Td>
            </Tr>
          ))}
          {rules.length === 0 && (
            <Tr>
              <Td colSpan={9} className="py-12 text-center text-app-muted">
                No sensor rules match the current filters.
              </Td>
            </Tr>
          )}
        </tbody>
      </table>
    </TableCard>
  );
}
