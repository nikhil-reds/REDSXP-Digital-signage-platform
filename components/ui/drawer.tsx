"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Side panel. Same shell contract as Modal — shadow-2xl, brand surface, Sora
 * heading — so a drawer and a dialog read as the same family.
 */
export function Drawer({
  open,
  onClose,
  title,
  description,
  width = "md",
  footer,
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  width?: "sm" | "md" | "lg";
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  // See Modal: inline `onClose` arrows would re-run this effect every render
  // and the cleanup would pull focus back out of the panel each time.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    const raf = requestAnimationFrame(() => {
      const target = panelRef.current?.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      (target ?? panelRef.current)?.focus();
    });
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = prevOverflow;
      restoreRef.current?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  const widths = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-xl" };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/55 dark:bg-black/75 animate-fadeIn"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
        tabIndex={-1}
        className={cn(
          "h-full w-full bg-app-surface border-l border-app-border shadow-2xl",
          "flex flex-col animate-slideInRight font-sans",
          widths[width],
          className
        )}
      >
        <div className="flex items-start justify-between gap-3 p-5 border-b border-app-border shrink-0">
          <div className="min-w-0">
            <h2 className="font-heading text-h5 font-semibold tracking-headline text-app-text truncate">
              {title}
            </h2>
            {description && <p className="text-body text-app-muted mt-1">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="p-1.5 rounded-md text-app-muted hover:text-app-text hover:bg-app-surface-alt transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-2 p-5 border-t border-app-border shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
