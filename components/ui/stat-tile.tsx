import React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { Card } from "./card";
import { type Tone } from "./status";

/**
 * KPI tile. Replaces the 9 hand-rolled stat grids.
 *
 * The icon chip is neutral by default. Previously each tile picked its own
 * pastel hue (blue-50 / red-50 / emerald-50 / purple-50), so a 5-up row showed
 * five competing colours — precisely what the brand book forbids. A tile only
 * takes a functional tone when its subject genuinely is a warning or an error.
 */
const CHIP_TONE: Record<Tone, string> = {
  neutral: "bg-app-surface-alt text-app-muted",
  accent: "bg-app-accent-surface text-app-accent-text",
  warning: "bg-app-warning-surface text-app-warning-text",
  danger: "bg-app-danger-surface text-app-danger-text",
};

export interface StatTileProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  /** Only set for tiles whose subject is genuinely an error/warning. */
  tone?: Tone;
  trend?: { direction: "up" | "down"; value: string; /** is up good? */ positive?: boolean };
  /** Breakdown line, progress bar, StatusDot row, etc. */
  children?: React.ReactNode;
  className?: string;
}

export function StatTile({
  label,
  value,
  icon: Icon,
  tone = "neutral",
  trend,
  children,
  className,
}: StatTileProps) {
  const trendGood = trend ? (trend.positive ?? trend.direction === "up") : false;
  const TrendIcon = trend?.direction === "up" ? ArrowUpRight : ArrowDownRight;

  return (
    <Card size="widget" padded className={cn("flex flex-col justify-between", className)}>
      <div className="flex justify-between items-start gap-2">
        <span className="text-caption font-semibold uppercase tracking-headline text-app-muted truncate">
          {label}
        </span>
        {Icon && (
          <span className={cn("p-1.5 rounded-lg shrink-0", CHIP_TONE[tone])}>
            <Icon className="w-4 h-4 shrink-0" />
          </span>
        )}
      </div>

      <div className="mt-3">
        {/* Sora takes positive tracking, never tracking-tight (brand book §15) */}
        <span className="font-heading text-h4 font-semibold tracking-headline text-app-text block">
          {value}
        </span>

        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-caption font-semibold mt-1",
              trendGood ? "text-app-accent-text" : "text-app-danger-text"
            )}
          >
            <TrendIcon className="w-3 h-3" aria-hidden />
            {trend.value}
          </span>
        )}

        {children && <div className="mt-1.5">{children}</div>}
      </div>
    </Card>
  );
}

export function StatGrid({
  columns = 4,
  className,
  children,
}: {
  columns?: 2 | 3 | 4 | 5;
  className?: string;
  children: React.ReactNode;
}) {
  const cols: Record<number, string> = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
    5: "sm:grid-cols-2 lg:grid-cols-5",
  };
  return (
    <div className={cn("grid grid-cols-1 gap-4", cols[columns], className)}>{children}</div>
  );
}
