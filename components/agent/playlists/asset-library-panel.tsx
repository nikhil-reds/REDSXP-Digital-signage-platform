"use client";

import React from "react";
import { Code, Film, Grid2x2, Image as ImageIcon, List, Plus } from "lucide-react";
import { ViewMode } from "./types";
import { Badge, Card, EmptyState, SearchInput, SegmentedControl } from "@/components/ui";

interface LibraryCardData {
  asset: { id: string };
  name: string;
  size: string;
  dims: string;
  thumb: string;
  isVideo: boolean;
  isImage: boolean;
  isHtml: boolean;
  compatShort: string;
  compatOk: boolean;
  compatTip: string;
  processing: boolean;
  onAdd: () => void | Promise<void>;
}

interface FilterTab {
  label: string;
  active: boolean;
  onClick: () => void;
}

interface AssetLibraryPanelProps {
  search: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filterTabs: FilterTab[];
  viewMode: ViewMode;
  onGridMode: () => void;
  onListMode: () => void;
  items: LibraryCardData[];
  empty: boolean;
}

export default function AssetLibraryPanel({
  search,
  onSearchChange,
  filterTabs,
  viewMode,
  onGridMode,
  onListMode,
  items,
  empty,
}: AssetLibraryPanelProps) {
  const grid = viewMode === "grid";

  return (
    <aside className="w-[300px] bg-app-surface border-r border-app-border flex flex-col h-full font-sans shrink-0 overflow-hidden">
      <div className="p-3 pb-0 shrink-0">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-caption font-semibold uppercase tracking-headline text-app-muted">
            Media Library
          </span>
          <SegmentedControl
            value={viewMode}
            onChange={(v) => (v === "grid" ? onGridMode() : onListMode())}
            options={[
              { value: "grid" as ViewMode, label: "Grid view", icon: Grid2x2 },
              { value: "list" as ViewMode, label: "List view", icon: List },
            ]}
          />
        </div>

        <SearchInput
          placeholder="Search assets…"
          value={search}
          onChange={onSearchChange}
          className="mb-2.5"
        />

        <div className="flex gap-1 border-b border-app-border">
          {filterTabs.map((tab) => (
            <button
              key={tab.label}
              onClick={tab.onClick}
              aria-pressed={tab.active}
              className={`px-2 py-1.5 -mb-px border-b-2 text-caption cursor-pointer transition-colors ${
                tab.active
                  ? "border-app-accent-text text-app-accent-text font-semibold"
                  : "border-transparent text-app-muted font-medium hover:text-app-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`flex-1 overflow-y-auto p-3 gap-2 ${
          grid ? "grid grid-cols-2 content-start" : "flex flex-col"
        }`}
      >
        {items.map((item) => {
          const Icon = item.isVideo ? Film : item.isHtml ? Code : ImageIcon;
          return (
            <Card
              key={item.asset.id}
              size="row"
              interactive
              title={item.compatTip}
              className={`cursor-grab flex gap-2 p-2 ${grid ? "flex-col" : "flex-row items-center"}`}
            >
              {/* thumb colour is per-asset data, not chrome — kept as-is */}
              <span
                className={`shrink-0 rounded-md flex items-center justify-center text-reds-offwhite ${
                  grid ? "w-full h-14" : "w-9 h-9"
                }`}
                style={{ background: item.thumb }}
              >
                <Icon className="w-3.5 h-3.5" />
              </span>

              <span className="flex-1 min-w-0 w-full block">
                <span className="block text-body font-semibold text-app-text truncate">
                  {item.name}
                </span>
                <span className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <span className="text-caption text-app-muted">
                    {item.size} · {item.dims}
                  </span>
                  <Badge tone={item.compatOk ? "accent" : "warning"}>{item.compatShort}</Badge>
                  {item.processing && <Badge tone="neutral">Processing</Badge>}
                </span>
              </span>

              <button
                onClick={item.onAdd}
                disabled={item.processing}
                title={
                  item.processing ? "Still processing — not ready to add yet" : "Add to timeline"
                }
                className={`shrink-0 h-7 px-2 rounded-md border border-app-border bg-app-surface text-app-muted text-caption font-semibold hover:bg-app-accent hover:border-app-accent hover:text-app-accent-on cursor-pointer transition-colors flex items-center gap-1 disabled:opacity-40 disabled:pointer-events-none ${
                  grid ? "self-stretch justify-center" : ""
                }`}
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </Card>
          );
        })}

        {empty && (
          <div className="col-span-2">
            <EmptyState title="No assets" description="No assets match your search." />
          </div>
        )}
      </div>
    </aside>
  );
}
