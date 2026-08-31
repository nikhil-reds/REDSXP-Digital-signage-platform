import React from "react";
import { cn } from "@/lib/cn";

/**
 * Button labels are Sora Semibold per the brand book's type-scale mapping
 * (16px = "Body Lead / Button — button labels (Sora, Semibold)").
 *
 * `md` is that 16px default. `sm` drops to the 14px Body step for dense
 * toolbars and card headers, which is still on-scale — the book's floor is
 * 12px, not 16px.
 */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const VARIANT: Record<ButtonVariant, string> = {
  // Green fill with a dark label: 7.73:1. Green as text on light would be 1.74:1.
  primary: "bg-app-accent text-app-accent-on hover:opacity-90",
  secondary:
    "bg-app-surface text-app-text border border-app-border hover:bg-app-surface-alt",
  ghost: "text-app-muted hover:text-app-text hover:bg-app-surface-alt",
  danger: "bg-app-danger text-app-danger-on hover:opacity-90",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md";
  icon?: React.ComponentType<{ className?: string }>;
}

export function Button({
  variant = "secondary",
  size = "md",
  icon: Icon,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-heading font-semibold",
        "transition-colors duration-200 cursor-pointer whitespace-nowrap",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent-text",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-app-canvas",
        "disabled:opacity-40 disabled:pointer-events-none",
        size === "md" ? "text-lead px-4 py-2" : "text-body px-3 py-1.5",
        VARIANT[variant],
        className
      )}
      {...rest}
    >
      {Icon && <Icon className={size === "md" ? "w-4 h-4" : "w-3.5 h-3.5"} />}
      {children}
    </button>
  );
}

/** Square icon-only button. Always needs an aria-label. */
export function IconButton({
  variant = "ghost",
  size = "md",
  icon: Icon,
  className,
  ...rest
}: Omit<ButtonProps, "children"> & { icon: React.ComponentType<{ className?: string }> }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg transition-colors duration-200 cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent-text",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-app-canvas",
        "disabled:opacity-40 disabled:pointer-events-none",
        size === "md" ? "p-2" : "p-1.5",
        VARIANT[variant],
        className
      )}
      {...rest}
    >
      <Icon className={size === "md" ? "w-4 h-4" : "w-3.5 h-3.5"} />
    </button>
  );
}
