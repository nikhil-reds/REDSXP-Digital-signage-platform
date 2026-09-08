import React from "react";
import { cn } from "@/lib/cn";

/**
 * Empty / no-results state. Flush-left copy per brand book §17 — centred
 * paragraphs make readers hunt for the start of each line — but the block
 * itself is centred in its container.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-12", className)}>
      <div className="max-w-sm">
        {Icon && (
          <span className="inline-flex p-2.5 rounded-lg bg-app-surface-alt text-app-muted mb-3">
            <Icon className="w-5 h-5" />
          </span>
        )}
        <h3 className="font-heading text-h6 font-semibold tracking-headline text-app-text">
          {title}
        </h3>
        {description && <p className="text-body text-app-muted mt-1">{description}</p>}
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
}
