import React from "react";
import AuthThemeToggle from "@/components/auth/auth-theme-toggle";
import "@/components/auth/auth-responsive.css";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    // `auth-portal` opts this area into the REDS typeface, same as the agent and
    // admin shells. The form side is theme-aware; the brand panel stays dark
    // because the logo lockup on black is one of the three approved variants.
    <div className="auth-portal auth-layout flex min-h-dvh w-full flex-col overflow-x-hidden bg-app-canvas text-app-text font-sans antialiased lg:h-dvh lg:overflow-hidden">
      <div className="min-h-0 flex-1 lg:grid lg:grid-cols-12">
      {/* Brand panel (large screens) — committed dark brand moment */}
      <div className="relative hidden min-h-0 flex-col justify-between bg-reds-black p-8 lg:col-span-5 lg:flex lg:p-10 xl:col-span-4">
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

        </div>
      </div>

      {/* Main Form container — follows the viewer's theme */}
      <main className="auth-main min-h-0 overflow-y-auto bg-app-canvas p-4 sm:p-8 lg:col-span-7 lg:p-10 xl:col-span-8">
        <div className="flex min-h-full w-full items-center justify-center">
        <div className="auth-card w-full max-w-[420px] rounded-xl border border-app-border bg-app-surface p-5 sm:p-8 lg:p-10">
          {/* Logo header for small screens, where the brand panel is hidden */}
          <div className="mb-6 flex items-center justify-center sm:mb-8 lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/reds-xos-logo.png"
              alt="REDS XOS"
              className="h-11 w-auto object-contain sm:h-14"
            />
          </div>

          {children}
        </div>
        </div>
      </main>
      </div>
      <footer className="flex min-h-11 shrink-0 items-center justify-between gap-4 border-t border-app-border bg-app-canvas px-4 py-3 text-caption text-app-muted sm:px-6 lg:px-8">
        <span className="font-heading tracking-headline text-app-accent-text">REDS XOS</span>
        <AuthThemeToggle />
        <span>© {new Date().getFullYear()} Rubenious</span>
      </footer>
    </div>
  );
}
