import React from "react";
import AgentShell from "@/components/layout/agent-shell";

interface AgentLayoutProps {
  children: React.ReactNode;
}

export default function AgentLayout({ children }: AgentLayoutProps) {
  return <AgentShell>{children}</AgentShell>;
}
