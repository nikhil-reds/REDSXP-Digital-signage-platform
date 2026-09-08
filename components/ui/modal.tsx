"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * One modal shell. Replaces 13 hand-rolled dialogs that used 5 different
 * backdrop strings and all referenced `animate-fadeIn`, which was never
 * defined — so none of them animated. The keyframes now exist in globals.css.
 *
 * Adds what the hand-rolled versions were missing: Escape to close, body scroll
 * lock, focus trap, restore focus on close, and dialog semantics.
 */
export type ModalSize = "sm" | "md" | "lg" | "xl";

const SIZE: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({
  open,
  onClose,
  title,
  description,
  size = "md",
  footer,
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  size?: ModalSize;
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  // Callers pass inline arrows, so `onClose` changes identity every render.
  // Depending on it directly re-runs this effect constantly, and the cleanup
  // yanks focus back out of the dialog each time. Hold it in a ref instead and
  // key the effect on `open` alone.
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
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((n) => n.offsetParent !== null);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    const raf = requestAnimationFrame(() => {
      const target = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      (target ?? panelRef.current)?.focus();
    });

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = prevOverflow;
      cancelAnimationFrame(raf);
      restoreRef.current?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/55 dark:bg-black/75 animate-fadeIn"
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
          "w-full bg-app-surface border border-app-border rounded-xl shadow-2xl",
          "flex flex-col max-h-[85vh] overflow-hidden animate-scaleIn font-sans",
          SIZE[size],
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
            aria-label="Close dialog"
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
