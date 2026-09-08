import React from "react";
import { cn } from "@/lib/cn";

/**
 * Page-level heading above a group of cards. The navbar already renders the
 * route title as H6, so a page section sits one step below it visually while
 * still using the brand's heading font.
 */
export function SectionHeader({
  title,
  description,
  actions,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        <h2 className="font-heading text-h6 font-semibold tracking-headline text-app-text">
          {title}
        </h2>
        {description && <p className="text-body text-app-muted mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

/** Standard page wrapper: settles the py-6 px-8 / p-2 / p-4 disagreement. */
export function PageShell({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("py-6 px-8 space-y-6", className)}>{children}</div>;
}
