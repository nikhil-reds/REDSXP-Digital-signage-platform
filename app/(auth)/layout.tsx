import React from "react";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    // `auth-portal` opts this area into the REDS typeface, same as the agent and
    // admin shells. The form side is theme-aware; the brand panel stays dark
    // because the logo lockup on black is one of the three approved variants.
    <div className="auth-portal flex min-h-screen w-full flex-col lg:grid lg:grid-cols-12 bg-app-canvas text-app-text font-sans antialiased">
      {/* Brand panel (large screens) — committed dark brand moment */}
      <div className="relative hidden h-full flex-col justify-between bg-reds-black p-10 lg:col-span-5 lg:flex xl:col-span-4">
        {/* Subtle green glow — stays inside the Green–Teal–Blue family */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at top right, color-mix(in srgb, var(--reds-green-60) 12%, transparent), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--reds-offwhite) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-20 flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/reds-xos-logo.png"
            alt="REDS XOS"
            className="h-16 w-auto object-contain"
          />
        </div>

        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-3">
            {/* Curly quotes per the brand book's punctuation rules */}
            <p className="text-h6 leading-relaxed text-reds-offwhite">
              “A headless multi-tenant CMS built for fast, secure, and intuitive content
              scheduling across global digital networks.”
            </p>
            <footer className="text-body font-semibold text-reds-cool-40">
              Rubenious CMS Team
            </footer>
          </blockquote>
        </div>

        <div className="relative z-20 mt-8 flex items-center justify-between text-caption text-reds-cool-40 border-t border-reds-cool-80 pt-6">
          <span>&copy; {new Date().getFullYear()} REDS XOS</span>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-reds-offwhite transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-reds-offwhite transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>

      {/* Main Form container — follows the viewer's theme */}
      <main className="flex flex-1 flex-col items-center justify-center p-6 sm:p-10 lg:col-span-7 xl:col-span-8 bg-app-canvas">
        <div className="w-full max-w-[420px] rounded-xl border border-app-border bg-app-surface p-8 sm:p-10">
          {/* Logo header for small screens, where the brand panel is hidden */}
          <div className="flex lg:hidden items-center justify-center mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/reds-xos-logo.png"
              alt="REDS XOS"
              className="h-14 w-auto object-contain"
            />
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
