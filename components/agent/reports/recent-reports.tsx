"use client";

import React from "react";
import { Download, FileText, Trash } from "lucide-react";

export interface GeneratedReport {
  id: string;
  title: string;
  range: string;
  format: "PDF" | "CSV";
  date: string;
  size: string;
}

interface RecentReportsProps {
  reports: GeneratedReport[];
  onDownload: (report: GeneratedReport) => void;
  onDelete: (id: string) => void;
}

export default function RecentReports({ reports, onDownload, onDelete }: RecentReportsProps) {
  return (
    <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl overflow-hidden shadow-xs flex-1 flex flex-col min-h-0">
      
      <div className="p-4 border-b border-[#E2E6EC] dark:border-[#283243] bg-zinc-50/20 dark:bg-zinc-900/10 flex justify-between items-center text-xs shrink-0">
        <span className="font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
          Recent Reports Archive
        </span>
      </div>

      <div className="overflow-y-auto flex-1">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F6F7F9] dark:bg-[#171F2C]/50 text-[#657080] dark:text-[#9AA7B7] font-bold border-b border-[#E2E6EC] dark:border-[#283243] select-none">
              <th className="p-3.5">Report Title</th>
              <th className="p-3.5">Date Range preset</th>
              <th className="p-3.5">Format</th>
              <th className="p-3.5">Generated Timestamp</th>
              <th className="p-3.5">Size</th>
              <th className="p-3.5 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E6EC] dark:divide-[#283243]">
            {reports.map((rep) => {
              const isPdf = rep.format === "PDF";
              return (
                <tr key={rep.id} className="hover:bg-[#F6F7F9]/30 dark:hover:bg-[#171F2C]/10 transition-all">
                  <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                    <FileText className={`w-3.5 h-3.5 ${isPdf ? "text-red-500" : "text-emerald-500"}`} />
                    <span>{rep.title}</span>
                  </td>
                  <td className="p-3.5 text-zinc-550 dark:text-zinc-400">
                    {rep.range}
                  </td>
                  
                  {/* Format Badge */}
                  <td className="p-3.5">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-bold border ${
                      isPdf
                        ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border-red-100/50"
                        : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450 border-emerald-100/50"
                    }`}>
                      {rep.format}
                    </span>
                  </td>

                  <td className="p-3.5 text-zinc-400 font-mono text-[10px]">
                    {rep.date}
                  </td>
                  <td className="p-3.5 text-zinc-500 font-mono text-[10px]">
                    {rep.size}
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => onDownload(rep)}
                        className="p-1 rounded-md text-zinc-400 hover:bg-[#F6F7F9] dark:hover:bg-zinc-800 hover:text-[#2859D9] dark:hover:text-[#6F96FF] cursor-pointer"
                        title="Download Report file"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(rep.id)}
                        className="p-1 rounded-md text-zinc-400 hover:bg-red-50 hover:text-red-650 dark:hover:bg-red-950/20 cursor-pointer"
                        title="Delete from list"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
