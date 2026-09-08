import React from "react";
import { cn } from "@/lib/cn";

/**
 * The single status vocabulary for the agent portal.
 *
 * Replaces the 562 ad-hoc Tailwind hue usages (emerald/rose/orange/purple/blue)
 * found in the audit. Green carries "healthy"; red and amber are reserved for
 * genuine error and warning states and are never decorative; everything else is
 * neutral. See docs/reds-brand-book.md §6.
 */
export type Tone = "neutral" | "accent" | "warning" | "danger";

export type Status = "online" | "warning" | "error" | "unknown";

export const STATUS_TONE: Record<Status, Tone> = {
  online: "accent",
  warning: "warning",
  error: "danger",
  unknown: "neutral",
};

const TONE_SOLID: Record<Tone, string> = {
  neutral: "bg-app-muted",
  accent: "bg-app-accent-text",
  warning: "bg-app-warning",
  danger: "bg-app-danger",
};

const TONE_SUBTLE: Record<Tone, string> = {
  neutral: "bg-app-surface-alt text-app-muted",
  accent: "bg-app-accent-surface text-app-accent-text",
  warning: "bg-app-warning-surface text-app-warning-text",
  danger: "bg-app-danger-surface text-app-danger-text",
};

const TONE_FILLED: Record<Tone, string> = {
  neutral: "bg-app-muted text-app-surface",
  accent: "bg-app-accent text-app-accent-on",
  warning: "bg-app-warning text-app-warning-on",
  danger: "bg-app-danger text-app-danger-on",
};

const TONE_TEXT: Record<Tone, string> = {
  neutral: "text-app-muted",
  accent: "text-app-accent-text",
  warning: "text-app-warning-text",
  danger: "text-app-danger-text",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  /** `subtle` for informational chips, `filled` for counts that must be seen. */
  variant?: "subtle" | "filled" | "outline";
  uppercase?: boolean;
}

export function Badge({
  tone = "neutral",
  variant = "subtle",
  uppercase = false,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full",
        "text-caption font-semibold leading-none whitespace-nowrap",
        variant === "subtle" && TONE_SUBTLE[tone],
        variant === "filled" && TONE_FILLED[tone],
        variant === "outline" &&
          cn("border border-app-border bg-app-surface", TONE_TEXT[tone]),
        uppercase && "uppercase tracking-headline",
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}

export function StatusDot({
  status = "unknown",
  pulse = false,
  label,
  className,
}: {
  status?: Status;
  pulse?: boolean;
  /** Visible text. Status is never conveyed by colour alone. */
  label?: React.ReactNode;
  className?: string;
}) {
  const tone = STATUS_TONE[status];
  const dot = (
    <span className={cn("relative flex h-2 w-2 shrink-0")}>
      {pulse && (
        <span
          className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            TONE_SOLID[tone]
          )}
        />
      )}
      <span
        className={cn("relative inline-flex rounded-full h-2 w-2", TONE_SOLID[tone])}
      />
    </span>
  );

  if (!label) {
    return (
      <span className={className}>
        {dot}
        <span className="sr-only">{status}</span>
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      {dot}
      <span className={cn("text-caption font-semibold", TONE_TEXT[tone])}>{label}</span>
    </span>
  );
}

export function ProgressBar({
  value,
  max = 100,
  tone = "accent",
  label,
  className,
}: {
  value: number;
  max?: number;
  tone?: Tone;
  label?: React.ReactNode;
  className?: string;
}) {
  const safeMax = max > 0 ? max : 1;
  const pct = Math.max(0, Math.min(100, (value / safeMax) * 100));
  return (
    <div className={cn("w-full", className)}>
      <div
        className="w-full h-1.5 bg-app-surface-alt rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={safeMax}
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-300", TONE_SOLID[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {label && <span className="text-caption text-app-muted mt-1 block">{label}</span>}
    </div>
  );
}
