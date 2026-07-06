"use client";

import React, { useState } from "react";
import { FileText, Archive, Sparkles, Filter } from "lucide-react";
import ReportConfigurator from "@/components/agent/reports/report-configurator";
import RecentReports, { GeneratedReport } from "@/components/agent/reports/recent-reports";
import GenerationProgress from "@/components/agent/reports/generation-progress";

const initialReports: GeneratedReport[] = [
  {
    id: "rep-1",
    title: "July 2026 Monthly SLA",
    range: "1 Jul – 31 Jul",
    format: "PDF",
    date: "4 Jul, 10:15 AM",
    size: "4.8 MB"
  },
  {
    id: "rep-2",
    title: "Weekly Play Counts (Q3 W2)",
    range: "23 Jun – 30 Jun",
    format: "CSV",
    date: "1 Jul, 9:00 AM",
    size: "1.2 MB"
  },
  {
    id: "rep-3",
    title: "Automation Triggers Flagships",
    range: "15 Jun – 30 Jun",
    format: "PDF",
    date: "30 Jun, 5:30 PM",
    size: "2.4 MB"
  },
  {
    id: "rep-4",
    title: "Incident Log June",
    range: "1 Jun – 30 Jun",
    format: "PDF",
    date: "30 Jun, 5:00 PM",
    size: "3.5 MB"
  }
];

export default function AgentReportsPage() {
  const [reports, setReports] = useState<GeneratedReport[]>(initialReports);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pendingConfig, setPendingConfig] = useState<any>(null);

  const handleTriggerGenerate = (config: any) => {
    setPendingConfig(config);
    setIsGenerating(true);
  };

  const handleGenerationComplete = () => {
    setIsGenerating(false);

    // Format new report item
    const typeTag = pendingConfig.category.split(" ")[0]; // e.g. "SLA", "Proof", etc.
    const newReport: GeneratedReport = {
      id: `rep-${Date.now()}`,
      title: `${typeTag} Report (${pendingConfig.target})`,
      range: pendingConfig.dateRange,
      format: pendingConfig.format,
      date: "Just Now",
      size: pendingConfig.format === "PDF" ? "2.1 MB" : "640 KB"
    };

    setReports([newReport, ...reports]);
    setPendingConfig(null);
    alert(`Report generated successfully! Added to recent history archive.`);
  };

  const handleDownloadReport = (rep: GeneratedReport) => {
    alert(`Downloading generated report asset file: ${rep.title}.${rep.format.toLowerCase()}`);
  };

  const handleDeleteReport = (id: string) => {
    setReports(reports.filter((r) => r.id !== id));
  };

  return (
    <div className="py-6 px-8 h-full flex flex-col min-h-0 overflow-hidden font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E6EC] dark:border-[#283243] pb-5 shrink-0">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-55 tracking-tight flex items-center gap-2">
            Custom Report Center
          </h1>
          <p className="text-xs text-[#657080] dark:text-[#9AA7B7]">
            Compile audit feeds, SLA connection logs, and proof-of-play loop metrics into downloadable PDF and CSV documents.
          </p>
        </div>
      </div>

      {/* Main split dashboard panel */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 min-h-0">
        
        {/* Left Side: Report Generator Configurations */}
        <div className="lg:col-span-1 flex flex-col justify-start">
          <ReportConfigurator onGenerate={handleTriggerGenerate} />
        </div>

        {/* Right Side: Generated history list */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <RecentReports
            reports={reports}
            onDownload={handleDownloadReport}
            onDelete={handleDeleteReport}
          />
        </div>

      </div>

      {/* Generation progress modal overlay */}
      {isGenerating && (
        <GenerationProgress
          onCancel={() => {
            setIsGenerating(false);
            setPendingConfig(null);
          }}
          onComplete={handleGenerationComplete}
        />
      )}

    </div>
  );
}
