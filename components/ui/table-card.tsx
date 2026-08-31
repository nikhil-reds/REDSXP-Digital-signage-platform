import React from "react";
import { cn } from "@/lib/cn";
import { Card, CardActions, CardHeader, CardHeading } from "./card";

/**
 * Panel wrapping a data table. Body is flush (padded={false}) so rows meet the
 * card edge; the header and footer carry the padding.
 */
export function TableCard({
  title,
  description,
  icon,
  actions,
  footer,
  className,
  children,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Card size="panel" className={cn("overflow-hidden", className)}>
      <CardHeader divided>
        <CardHeading size="panel" title={title} description={description} icon={icon} />
        {actions && <CardActions>{actions}</CardActions>}
      </CardHeader>
      {/* Wide tables scroll inside the card; the page never scrolls sideways */}
      <div className="overflow-x-auto">{children}</div>
      {footer && (
        <div className="flex items-center justify-between gap-3 p-5 border-t border-app-border">
          {footer}
        </div>
      )}
    </Card>
  );
}

export function Th({
  className,
  children,
  ...rest
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "text-left px-5 py-3 text-caption font-semibold uppercase tracking-headline",
        "text-app-muted border-b border-app-border whitespace-nowrap",
        className
      )}
      {...rest}
    >
      {children}
    </th>
  );
}

export function Td({
  className,
  children,
  ...rest
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn("px-5 py-3 text-body text-app-text align-middle", className)} {...rest}>
      {children}
    </td>
  );
}

export function Tr({
  interactive = false,
  selected = false,
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLTableRowElement> & {
  interactive?: boolean;
  selected?: boolean;
}) {
  return (
    <tr
      className={cn(
        "border-b border-app-border last:border-b-0",
        interactive && "transition-colors hover:bg-app-surface-alt cursor-pointer",
        selected && "bg-app-accent-surface",
        className
      )}
      {...rest}
    >
      {children}
    </tr>
  );
}
