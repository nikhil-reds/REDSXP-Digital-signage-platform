import React from "react";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col lg:grid lg:grid-cols-12 bg-black font-sans antialiased selection:bg-zinc-800">
      {/* Brand panel (visible on large screens) */}
      <div className="relative hidden h-full flex-col justify-between bg-black p-10 text-white lg:col-span-5 lg:flex xl:col-span-4 border-r border-zinc-900">
        {/* Dynamic dark background patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(120,120,120,0.12),transparent)]" />
        <div 
          className="absolute inset-0 opacity-15" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255,255,255) 1px, transparent 0)`,
            backgroundSize: "24px 24px"
          }}
        />

        <div className="relative z-20 flex items-center">
          <img
            src="/reds-xos-logo.png"
            alt="REDS XOS Logo"
            className="h-16 w-auto object-contain"
          />
        </div>

        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-3">
            <p className="text-lg font-light leading-relaxed text-zinc-300">
              "A headless multi-tenant CMS built for fast, secure, and intuitive content scheduling across global digital networks."
            </p>
            <footer className="text-sm font-medium text-zinc-500">
              Rubenious CMS Team
            </footer>
          </blockquote>
        </div>

        <div className="relative z-20 mt-8 flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-900 pt-6">
          <span>&copy; {new Date().getFullYear()} REDS XOS</span>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>

      {/* Main Form container */}
      <main className="flex flex-1 flex-col items-center justify-center p-6 sm:p-10 lg:col-span-7 xl:col-span-8 bg-zinc-950">
        <div className="relative w-full max-w-[420px] bg-black p-8 sm:p-10 rounded-2xl border border-zinc-900 shadow-2xl">
          {/* Decorative absolute subtle glow */}
          <div className="absolute -inset-[1px] -z-10 rounded-2xl bg-gradient-to-tr from-zinc-900 via-transparent to-zinc-900 opacity-50 blur-sm pointer-events-none" />

          {/* Simple logo header for small screens */}
          <div className="flex lg:hidden items-center justify-center mb-8">
            <img
              src="/reds-xos-logo.png"
              alt="REDS XOS Logo"
              className="h-14 w-auto object-contain"
            />
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
