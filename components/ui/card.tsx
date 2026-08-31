import React from "react";
import { cn } from "@/lib/cn";

/**
 * The one card shell for the agent portal.
 * See docs/agent-card-system-plan.md §2 for the contract these values encode.
 *
 *   panel  — page-level sections (table cards, chart cards, form sections)
 *   widget — grid items (stat tiles, group cards, config blocks)
 *   row    — list rows, media tiles, inspector items
 *
 * Resting cards carry no shadow; the border does the separating. Shadow is
 * reserved for things that genuinely float (overlays, modals, drawers).
 */
export type CardSize = "panel" | "widget" | "row";

const SIZE_SHELL: Record<CardSize, string> = {
  panel: "rounded-xl",
  widget: "rounded-xl",
  row: "rounded-lg",
};

const SIZE_PAD: Record<CardSize, string> = {
  panel: "p-5",
  widget: "p-4",
  row: "p-3",
};

/** Title type ramp per size — Sora for panel/widget, Source Sans for row. */
const SIZE_TITLE: Record<CardSize, string> = {
  panel: "font-heading text-h5 font-semibold tracking-headline",
  widget: "font-heading text-h6 font-semibold tracking-headline",
  row: "text-body font-semibold",
};

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  size?: CardSize;
  /** Adds hover affordance + focus ring. Use only when the card is clickable. */
  interactive?: boolean;
  selected?: boolean;
  disabled?: boolean;
  /** Renders the whole card padded. Omit when using CardHeader/CardBody. */
  padded?: boolean;
  as?: React.ElementType;
}

export function Card({
  size = "panel",
  interactive = false,
  selected = false,
  disabled = false,
  padded = false,
  as,
  className,
  children,
  ...rest
}: CardProps) {
  const Component = as ?? "div";
  return (
    <Component
      data-card={size}
      data-selected={selected || undefined}
      className={cn(
        "relative bg-app-surface border border-app-border",
        SIZE_SHELL[size],
        padded && SIZE_PAD[size],
        interactive &&
          !disabled && [
            "transition-colors duration-200 cursor-pointer",
            "hover:border-app-accent-text hover:bg-app-surface-alt",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent-text",
            "focus-visible:ring-offset-2 focus-visible:ring-offset-app-canvas",
          ],
        selected && "border-app-accent-text bg-app-accent-surface",
        disabled && "opacity-60 pointer-events-none",
        className
      )}
      {...rest}
    >
      {/* Selected marker is a bar, never thin vivid green on a light surface */}
      {selected && (
        <span
          aria-hidden
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-app-accent-text",
            size === "row" ? "rounded-r-sm" : "rounded-r-md"
          )}
        />
      )}
      {children}
    </Component>
  );
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: CardSize;
  /** Draws the divider between header and body. */
  divided?: boolean;
}

export function CardHeader({
  size = "panel",
  divided = false,
  className,
  children,
  ...rest
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3",
        SIZE_PAD[size],
        divided && "border-b border-app-border",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/** Title + description stack. Keeps the two-line header consistent everywhere. */
export function CardHeading({
  size = "panel",
  title,
  description,
  icon: Icon,
  className,
}: {
  size?: CardSize;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0 flex items-start gap-2.5", className)}>
      {Icon && <Icon className="w-4 h-4 mt-0.5 shrink-0 text-app-muted" />}
      <div className="min-w-0">
        <h3 className={cn(SIZE_TITLE[size], "text-app-text truncate")}>{title}</h3>
        {description && (
          <p className="text-body text-app-muted mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}

export function CardActions({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-2 shrink-0", className)} {...rest}>
      {children}
    </div>
  );
}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: CardSize;
  /** Set false for flush content such as a table. */
  padded?: boolean;
}

export function CardBody({
  size = "panel",
  padded = true,
  className,
  children,
  ...rest
}: CardBodyProps) {
  return (
    <div className={cn(padded && SIZE_PAD[size], className)} {...rest}>
      {children}
    </div>
  );
}

export function CardFooter({
  size = "panel",
  className,
  children,
  ...rest
}: CardBodyProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-t border-app-border",
        SIZE_PAD[size],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
