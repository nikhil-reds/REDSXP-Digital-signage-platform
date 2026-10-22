"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

interface HomeNavbarProps {
  /** Dashboard URL when the visitor already has a valid session. */
  dashboardHref: string | null;
}

export default function HomeNavbar({ dashboardHref }: HomeNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const primary = dashboardHref
    ? { href: dashboardHref, label: "Go to dashboard" }
    : { href: "/login", label: "Sign in" };

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="relative z-50 shrink-0 border-b border-white/10 bg-[#070d1e]/90 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 w-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <Link href="/" aria-label="REDS XOS home" className="flex shrink-0 items-center sm:hidden">
          <Image
            src="/reds-xos-logo.png"
            alt="REDS XOS"
            width={160}
            height={40}
            className="h-7 w-auto"
            priority
          />
        </Link>

        <Link href={primary.href} className="hidden min-h-10 items-center justify-center rounded-full bg-reds-green-60 px-4 font-heading text-body font-medium text-reds-black transition-colors hover:bg-reds-green-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reds-green-40 sm:ml-auto sm:inline-flex">
          {primary.label}
        </Link>
        <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-reds-offwhite transition-colors hover:border-reds-green-60 hover:text-reds-green-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reds-green-40 sm:hidden" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {menuOpen && (
        <div className="fixed inset-0 z-[60] sm:hidden" aria-label="Mobile navigation">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 h-full w-full bg-black/55"
            onClick={() => setMenuOpen(false)}
          />
          <div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            className="absolute inset-y-0 right-0 flex h-full w-full translate-x-0 flex-col bg-[#091127] shadow-2xl shadow-black/50 animate-[slideInRight_180ms_ease-out]"
          >
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4">
              <span className="font-heading text-body font-medium text-reds-offwhite">Menu</span>
              <button
                type="button"
                aria-label="Close navigation menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-reds-offwhite transition-colors hover:border-reds-green-60 hover:text-reds-green-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reds-green-40"
                onClick={() => setMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 flex-col p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <div className="mt-auto border-t border-white/10 pt-8">
                <Link
                  href={primary.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-12 w-full items-center justify-center rounded-xl bg-reds-green-60 px-5 py-3 font-heading text-body font-medium text-reds-black transition-colors hover:bg-reds-green-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reds-green-40"
                >
                  {primary.label}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
