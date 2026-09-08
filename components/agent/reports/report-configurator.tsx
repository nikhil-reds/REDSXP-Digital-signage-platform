"use client";

import React, { useState } from "react";
import { Settings, Sparkles } from "lucide-react";
import { Button, Card, CardHeading, FieldLabel, SegmentedControl, Select } from "@/components/ui";

export interface ReportConfig {
  category: string; dateRange: string; granularity: string; target: string; format: "PDF" | "CSV";
}

export default function ReportConfigurator({ onGenerate }: { onGenerate: (config: ReportConfig) => void }) {
  const [category, setCategory] = useState("SLA Reports");
  const [dateRange, setDateRange] = useState("Last 7 Days");
  const [granularity, setGranularity] = useState("Daily");
  const [target, setTarget] = useState("Bengaluru Flagship Stores");
  const [format, setFormat] = useState<"PDF" | "CSV">("PDF");

  return (
    <Card as="form" size="panel" padded onSubmit={(event: React.FormEvent) => { event.preventDefault(); onGenerate({ category, dateRange, granularity, target, format }); }} className="space-y-5">
      <CardHeading size="panel" title="Report settings" description="Configure the data scope and output format." icon={Settings} />
      <div><FieldLabel>Report category</FieldLabel><Select value={category} onChange={(event) => setCategory(event.target.value)}><option value="SLA Reports">SLA compliance and uptime</option><option value="Proof of Play Reports">Proof-of-play and counts</option><option value="Sensor Automation Reports">Sensor automation triggers</option><option value="Incident Logs Reports">Incident logs and reboots</option></Select></div>
      <div><FieldLabel>Date range</FieldLabel><Select value={dateRange} onChange={(event) => setDateRange(event.target.value)}><option>Today</option><option>Yesterday</option><option>Last 7 Days</option><option>Last 30 Days</option></Select></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div><FieldLabel>Granularity</FieldLabel><Select value={granularity} onChange={(event) => setGranularity(event.target.value)}><option>Summary</option><option>Daily</option><option>Hourly</option></Select></div>
        <div><FieldLabel>Output format</FieldLabel><SegmentedControl value={format} onChange={setFormat} options={[{ value: "PDF", label: "PDF" }, { value: "CSV", label: "CSV" }]} className="w-fit" /></div>
      </div>
      <div><FieldLabel>Target display scope</FieldLabel><Select value={target} onChange={(event) => setTarget(event.target.value)}><option>Bengaluru Flagship Stores</option><option>All Groups</option><option>Menu Boards</option><option>Mall Stores</option><option>Airport Outlets</option></Select></div>
      <Button type="submit" variant="primary" icon={Sparkles} className="w-full">Generate custom report</Button>
    </Card>
  );
}
