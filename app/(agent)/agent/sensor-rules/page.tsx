"use client";

import React, { useState } from "react";
import { Plus, Filter, Zap, Activity, ShieldCheck } from "lucide-react";
import RulesList, { AutomationRule } from "@/components/agent/sensor-rules/rules-list";
import RuleFormModal from "@/components/agent/sensor-rules/rule-form-modal";
import RuleLogsTrends from "@/components/agent/sensor-rules/rule-logs-trends";
import { Button, PageShell, SearchInput, Select, StatGrid, StatTile, Toolbar } from "@/components/ui";

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
    <PageShell>
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-app-border pb-5 shrink-0">
        <div>
          <h1 className="font-heading text-h5 font-semibold tracking-headline text-app-text">
            Local Automation & Sensor Rules
          </h1>
          <p className="text-body text-app-muted mt-1">
            Build edge triggers (motion, camera, lux, temp) to override scheduled menus dynamically.
          </p>
        </div>

        <Button variant="primary" size="sm" icon={Plus}
          onClick={() => {
            setEditingRule(null);
            setShowFormModal(true);
          }}
          className="self-start sm:self-auto"
        >
          Add Sensor Rule
        </Button>
      </div>

      {/* Stats counter panel */}
      <StatGrid columns={3}>
        <StatTile label="Total Rules" value={`${rules.length}`} icon={Zap} />
        <StatTile label="Active Rules" value={`${rules.filter((r) => r.active).length}`} icon={ShieldCheck} />
        <StatTile label="Triggers Today" value={`${rules.reduce((acc, curr) => acc + curr.triggersCount, 0)}`} icon={Activity} />
      </StatGrid>

      {/* Query Filters */}
      <Toolbar className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Search */}
          <SearchInput
            placeholder="Search rules, targets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        {/* Sensor selector */}
        <div className="relative">
          <Select
            icon={Filter}
            value={sensorFilter}
            onChange={(e) => setSensorFilter(e.target.value)}
            className="w-full"
          >
            <option value="All">All Sensor Types</option>
            <option value="Motion">Motion Sensors</option>
            <option value="Light">Light Lux Sensors</option>
            <option value="Temperature">Temperature Probes</option>
            <option value="Camera">Camera Analytics</option>
          </Select>
        </div>
      </Toolbar>

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

    </PageShell>
  );
}
