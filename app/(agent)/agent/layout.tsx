import React from "react";
import AgentShell from "@/components/layout/agent-shell";
import { SessionProvider } from "@/components/providers/session-provider";

interface AgentLayoutProps {
  children: React.ReactNode;
}

export default function AgentLayout({ children }: AgentLayoutProps) {
  return (
    // One session fetch for every permission check and feature gate below.
    <SessionProvider>
      <AgentShell>{children}</AgentShell>
    </SessionProvider>
  );
}
