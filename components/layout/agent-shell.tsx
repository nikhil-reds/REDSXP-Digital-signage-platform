"use client";

import React, { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AgentNavbar from "@/components/layout/agent-navbar";
import AgentSidebar from "@/components/layout/agent-sidebar";
import FloatingChatbotWidget from "@/components/chatbot/floating-chatbot-widget";
import "./agent-navigation.css";

interface AgentShellProps {
  children: React.ReactNode;
}

export default function AgentShell({ children }: AgentShellProps) {
  const pathname = usePathname();
  const ownsPageScroll = pathname === "/agent/screens" || pathname === "/agent/media" || pathname === "/agent/playlists" || pathname === "/agent/playlists/create-playlist" || pathname === "/agent/schedules";
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);
  const closeMobileNavigation = useCallback(
    () => setIsMobileNavigationOpen(false),
    []
  );

  useEffect(() => {
    // Back/forward navigation must dismiss the drawer as well as link clicks.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileNavigationOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileNavigationOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const sidebar = document.getElementById("agent-navigation");
    const getControls = () => Array.from(sidebar?.querySelectorAll<HTMLElement>('a[href],button:not([disabled])') ?? []).filter(element => element.getClientRects().length > 0);
    getControls()[0]?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (document.querySelector("dialog[open]")) return;
      if (event.key === "Escape") setIsMobileNavigationOpen(false);
      if (event.key === "Tab") {
        const controls = getControls();
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    const desktop = window.matchMedia("(min-width: 1200px)");
    const onResize = () => { if (desktop.matches) setIsMobileNavigationOpen(false); };
    desktop.addEventListener("change", onResize);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      desktop.removeEventListener("change", onResize);
      document.removeEventListener("keydown", handleKeyDown);
      if (previousFocus?.getClientRects().length) previousFocus.focus();
    };
  }, [isMobileNavigationOpen]);

  return (
    <div className="agent-portal relative flex h-dvh overflow-hidden bg-app-canvas font-sans text-app-text">
      <AgentSidebar
        isMobileOpen={isMobileNavigationOpen}
        onMobileClose={closeMobileNavigation}
        onExpand={() => setIsMobileNavigationOpen(true)}
      />
      <div className="flex min-w-0 flex-1 flex-col" inert={isMobileNavigationOpen}>
        <AgentNavbar
          isMenuOpen={isMobileNavigationOpen}
          onMenuClick={() => setIsMobileNavigationOpen(true)}
        />
        {/* Bottom safe area keeps persistent controls clear of the floating assistant. */}
        <main className={ownsPageScroll ? "min-h-0 flex-1 overflow-hidden" : "min-h-0 flex-1 overflow-y-auto pb-24"}>{children}</main>
      </div>
      <div className="agent-assistant-layer" inert={isMobileNavigationOpen}><FloatingChatbotWidget /></div>
    </div>
  );
}
