import React from "react";
import { cn } from "@/lib/cn";
import { Card, CardActions, CardBody, CardHeader, CardHeading } from "./card";

/**
 * Chart series palette. Ordered Green → Teal → Blue, then Cool Gray steps —
 * the brand book's approved 3-colour combination extended with neutrals.
 * Values are CSS vars so each series flips with the theme (Green 60 is 1.74:1
 * on white and vanishes as a line, so light mode uses Green 80).
 *
 * Red and amber are deliberately absent: they mark threshold breaches, not
 * ordinary series (brand book §6).
 */
export const CHART_SERIES = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
] as const;

export const CHART_GRID = "var(--chart-grid)";
export const CHART_AXIS = "var(--chart-axis)";
export const CHART_DANGER = "var(--app-danger)";
export const CHART_WARNING = "var(--app-warning)";

/** Shared Recharts axis/tick styling so every chart reads the same. */
export const chartAxisProps = {
  stroke: CHART_AXIS,
  tick: { fill: CHART_AXIS, fontSize: 12 },
  tickLine: false,
  axisLine: { stroke: CHART_GRID },
} as const;

export function ChartCard({
  title,
  description,
  icon,
  actions,
  legend,
  height = 260,
  className,
  children,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  actions?: React.ReactNode;
  legend?: React.ReactNode;
  height?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Card size="panel" className={className}>
      <CardHeader divided>
        <CardHeading size="panel" title={title} description={description} icon={icon} />
        {actions && <CardActions>{actions}</CardActions>}
      </CardHeader>
      <CardBody>
        <div style={{ height }}>{children}</div>
        {legend && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4">{legend}</div>
        )}
      </CardBody>
    </Card>
  );
}

/** Legend swatch — pairs a series colour with its label. */
export function ChartLegendItem({
  color,
  label,
  className,
}: {
  color: string;
  label: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        aria-hidden
        className="w-2.5 h-2.5 rounded-sm shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-caption text-app-muted">{label}</span>
    </span>
  );
}
