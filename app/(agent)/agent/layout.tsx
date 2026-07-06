import React from "react";
import AgentSidebar from "@/components/layout/agent-sidebar";
import AgentNavbar from "@/components/layout/agent-navbar";

interface AgentLayoutProps {
  children: React.ReactNode;
}

export default function AgentLayout({ children }: AgentLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F7F9] dark:bg-[#090D14]">
      <AgentSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AgentNavbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
