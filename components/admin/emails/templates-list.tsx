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
    <div className="flex h-full w-80 shrink-0 flex-col overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-xs">
      {/* Search Input */}
      <div className="border-b border-app-border bg-app-surface-alt p-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-app-muted" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-app-border bg-app-surface py-1.5 pl-8.5 pr-3 text-caption text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent-text"
          />
        </div>
      </div>

      {/* Templates List */}
      <div className="flex-1 divide-y divide-app-border overflow-y-auto">
        {filtered.map((t) => {
          const isSelected = t.id === selectedId;
          const isMarketing = t.category === "Marketing";

          return (
            <div
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={`p-3.5 flex items-start gap-3 cursor-pointer transition-all ${
                isSelected
                  ? "border-l-2 border-app-accent bg-app-accent-surface"
                  : "hover:bg-app-surface-alt"
              }`}
            >
              <Mail className={`w-4 h-4 mt-0.5 shrink-0 ${
                isSelected ? "text-app-accent-text" : "text-app-muted"
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
                        ? "border-app-border bg-app-warning-surface text-app-warning-text"
                        : "border-app-accent-border bg-app-accent-surface text-app-accent-text"
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
