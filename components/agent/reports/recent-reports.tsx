"use client";

import React from "react";
import { Download, FileText, Trash } from "lucide-react";
import { Badge, IconButton, TableCard, Td, Th, Tr } from "@/components/ui";

export interface GeneratedReport { id: string; title: string; range: string; format: "PDF" | "CSV"; date: string; size: string }

export default function RecentReports({ reports, onDownload, onDelete }: { reports: GeneratedReport[]; onDownload: (report: GeneratedReport) => void; onDelete: (id: string) => void }) {
  return (
    <TableCard title="Recent reports" description={`${reports.length} generated report${reports.length === 1 ? "" : "s"}`} icon={FileText} className="min-h-0 flex-1">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <thead className="bg-app-surface-alt"><tr><Th>Report title</Th><Th>Date range</Th><Th>Format</Th><Th>Generated</Th><Th>Size</Th><Th className="text-right">Actions</Th></tr></thead>
        <tbody>
          {reports.map((report) => <Tr key={report.id}>
            <Td className="font-semibold"><span className="flex items-center gap-2"><FileText className="h-4 w-4 text-app-muted" />{report.title}</span></Td>
            <Td className="text-app-muted">{report.range}</Td><Td><Badge tone={report.format === "PDF" ? "danger" : "accent"}>{report.format}</Badge></Td>
            <Td className="text-app-muted">{report.date}</Td><Td className="text-app-muted">{report.size}</Td>
            <Td className="text-right"><div className="inline-flex gap-1"><IconButton size="sm" icon={Download} aria-label={`Download ${report.title}`} title="Download report" onClick={() => onDownload(report)} /><IconButton size="sm" variant="danger" icon={Trash} aria-label={`Delete ${report.title}`} title="Delete report" onClick={() => onDelete(report.id)} /></div></Td>
          </Tr>)}
          {reports.length === 0 && <Tr><Td colSpan={6} className="py-12 text-center text-app-muted">No generated reports yet.</Td></Tr>}
        </tbody>
      </table>
    </TableCard>
  );
}
