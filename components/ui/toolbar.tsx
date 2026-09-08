import React from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/cn";

/** Filter / search bar that sits above a table or grid. */
export function Toolbar({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>{children}</div>
  );
}

/** Text input matching the navbar search treatment. */
export function SearchInput({
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted pointer-events-none" />
      <input
        type="text"
        className={cn(
          "w-full pl-9 pr-3 py-1.5 rounded-lg text-body",
          "bg-app-surface-alt border border-app-border text-app-text placeholder-app-muted",
          "focus:outline-none focus:ring-2 focus:ring-app-accent-text transition-all duration-200"
        )}
        {...rest}
      />
    </div>
  );
}

export function Select({
  icon: Icon,
  className,
  children,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const select = (
    <select
      className={cn(
        "w-full py-1.5 rounded-lg text-body cursor-pointer appearance-none",
        Icon ? "pl-8 pr-8" : "px-3 pr-8",
        "bg-app-surface-alt border border-app-border text-app-text",
        "focus:outline-none focus:ring-2 focus:ring-app-accent-text transition-all duration-200",
        className
      )}
      {...rest}
    >
      {children}
    </select>
  );

  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-app-muted pointer-events-none" />
      )}
      {select}
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-app-muted pointer-events-none" />
    </div>
  );
}

/**
 * View-mode / segmented toggle. Same treatment as the navbar theme switcher so
 * every "pick one of these" control in the portal looks identical.
 */
export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; icon?: React.ComponentType<{ className?: string }> }[];
  className?: string;
}) {
  return (
    <div
      role="group"
      className={cn(
        "flex items-center gap-0.5 p-0.5 rounded-lg border border-app-border bg-app-surface-alt",
        className
      )}
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            title={opt.label}
            aria-pressed={active}
            className={cn(
              "p-1.5 rounded-md transition-colors duration-200 cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent-text",
              active ? "bg-app-surface text-app-text shadow-xs" : "text-app-muted hover:text-app-text"
            )}
          >
            {Icon ? <Icon className="w-4 h-4" /> : <span className="text-caption px-1">{opt.label}</span>}
            {Icon && <span className="sr-only">{opt.label}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** Form field label — 12px uppercase per the brand book's Caption/Label role. */
export function FieldLabel({
  className,
  children,
  ...rest
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "block text-caption font-semibold uppercase tracking-headline text-app-muted mb-1.5",
        className
      )}
      {...rest}
    >
      {children}
    </label>
  );
}

export function TextInput({
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full px-3 py-2 rounded-lg text-body",
        "bg-app-surface-alt border border-app-border text-app-text placeholder-app-muted",
        "focus:outline-none focus:ring-2 focus:ring-app-accent-text transition-all duration-200",
        "disabled:opacity-60",
        className
      )}
      {...rest}
    />
  );
}

/** Checkbox with brand focus ring and accent fill. */
export function Checkbox({
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className={cn(
        "w-4 h-4 rounded border-app-border-strong bg-app-surface-alt cursor-pointer",
        "accent-[var(--app-accent)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent-text",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-app-surface",
        className
      )}
      {...rest}
    />
  );
}

/**
 * Toggle switch. One implementation for the whole product — the settings panels
 * and the sensor-rules table previously hand-rolled two different ones.
 * Renders as a real `role="switch"` button so it is keyboard operable.
 */
export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Accessible name. Rendered visibly when `description` is also given. */
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}) {
  const control = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={description ? undefined : label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent-text",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-app-surface",
        "disabled:opacity-60 disabled:pointer-events-none",
        checked
          ? "border-app-accent-text bg-app-accent"
          : "border-app-border-strong bg-app-surface-alt"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none mt-0.5 inline-block h-4.5 w-4.5 transform rounded-full transition-transform duration-200",
          checked ? "translate-x-5 bg-app-accent-on" : "translate-x-0.5 bg-app-muted"
        )}
      />
    </button>
  );

  if (!description) return <span className={className}>{control}</span>;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border border-app-border bg-app-surface-alt p-3",
        className
      )}
    >
      <span className="min-w-0">
        <span className="block text-body font-semibold text-app-text">{label}</span>
        <span className="block text-caption text-app-muted mt-0.5">{description}</span>
      </span>
      {control}
    </div>
  );
}

export function Textarea({
  className,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full px-3 py-2 rounded-lg text-body resize-none",
        "bg-app-surface-alt border border-app-border text-app-text placeholder-app-muted",
        "focus:outline-none focus:ring-2 focus:ring-app-accent-text transition-all duration-200",
        "disabled:opacity-60",
        className
      )}
      {...rest}
    />
  );
}
