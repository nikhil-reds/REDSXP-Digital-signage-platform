"use client";

import React, { useState } from "react";
import { Mail, Search } from "lucide-react";

interface TemplateItem {
  id: string;
  name: string;
  category: "Transactional" | "Marketing";
  date: string;
}

interface TemplatesListProps {
  templates: TemplateItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function TemplatesList({
  templates,
  selectedId,
  onSelect
}: TemplatesListProps) {
  const [search, setSearch] = useState("");

  const filtered = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-80 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl overflow-hidden shadow-xs flex flex-col h-full shrink-0">
      {/* Search Input */}
      <div className="p-4 border-b border-zinc-150 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/10">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8.5 pr-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Templates List */}
      <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-850">
        {filtered.map((t) => {
          const isSelected = t.id === selectedId;
          const isMarketing = t.category === "Marketing";

          return (
            <div
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={`p-3.5 flex items-start gap-3 cursor-pointer transition-all ${
                isSelected
                  ? "bg-blue-50/65 dark:bg-blue-950/15 border-l-2 border-blue-600 dark:border-blue-500"
                  : "hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20"
              }`}
            >
              <Mail className={`w-4 h-4 mt-0.5 shrink-0 ${
                isSelected ? "text-blue-600 dark:text-blue-400" : "text-zinc-400"
              }`} />
              <div className="flex-1 min-w-0">
                <h4 className={`text-xs font-semibold leading-snug truncate ${
                  isSelected ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-800 dark:text-zinc-200"
                }`}>
                  {t.name}
                </h4>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-zinc-450 dark:text-zinc-550 select-none">
                  <span
                    className={`px-1.5 py-0.5 rounded-full font-bold border shrink-0 ${
                      isMarketing
                        ? "bg-purple-55/10 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400 border-purple-100/50"
                        : "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border-blue-100/50"
                    }`}
                  >
                    {t.category}
                  </span>
                  <span className="truncate">{t.date}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
