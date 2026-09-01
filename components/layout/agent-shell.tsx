"use client";

import React, { useCallback, useEffect, useState } from "react";
import AgentNavbar from "@/components/layout/agent-navbar";
import AgentSidebar from "@/components/layout/agent-sidebar";
import FloatingChatbotWidget from "@/components/chatbot/floating-chatbot-widget";

interface AgentShellProps {
  children: React.ReactNode;
}

export default function AgentShell({ children }: AgentShellProps) {
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);
  const closeMobileNavigation = useCallback(
    () => setIsMobileNavigationOpen(false),
    []
  );

  useEffect(() => {
    if (!isMobileNavigationOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileNavigationOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileNavigationOpen]);

  return (
    <div className="agent-portal relative flex h-screen overflow-hidden bg-app-canvas font-sans text-app-text">
      <AgentSidebar
        isMobileOpen={isMobileNavigationOpen}
        onMobileClose={closeMobileNavigation}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AgentNavbar
          isMenuOpen={isMobileNavigationOpen}
          onMenuClick={() => setIsMobileNavigationOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <FloatingChatbotWidget />
    </div>
  );
}
