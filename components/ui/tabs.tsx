"use client";

import React from "react";
import { cn } from "@/lib/cn";

/**
 * Horizontal tab bar for drawers, inspectors and detail panels.
 * Same active treatment as SegmentedControl so "pick one" always looks alike.
 */
export function Tabs<T extends string>({
  value,
  onChange,
  tabs,
  className,
}: {
  value: T;
  onChange: (value: T) => void;
  tabs: { id: T; label: string; icon?: React.ComponentType<{ className?: string }> }[];
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex gap-1 px-2 py-1.5 border-b border-app-border bg-app-surface-alt overflow-x-auto select-none",
        className
      )}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              "px-3 py-1.5 rounded-md flex items-center gap-1.5 whitespace-nowrap cursor-pointer",
              "text-caption font-semibold transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent-text",
              active
                ? "bg-app-surface text-app-text border border-app-border"
                : "text-app-muted hover:text-app-text border border-transparent"
            )}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Key/value block used all over detail panels.
 * Label is the 12px uppercase Caption role; value is Body.
 */
export function DataField({
  label,
  value,
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <span className="block text-caption font-semibold uppercase tracking-headline text-app-muted">
        {label}
      </span>
      <span className="block text-body font-semibold text-app-text mt-0.5 truncate">{value}</span>
    </div>
  );
}
