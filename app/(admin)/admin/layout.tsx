import React from "react";
import AdminSidebar from "@/components/layout/admin-sidebar";
import AdminNavbar from "@/components/layout/admin-navbar";
import FloatingChatbotWidget from "@/components/chatbot/floating-chatbot-widget";
import { SessionProvider } from "@/components/providers/session-provider";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    // One session fetch for every permission check and feature gate below.
    <SessionProvider>
      <div className="admin-portal relative flex h-screen overflow-hidden bg-app-canvas font-sans text-app-text">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminNavbar />
          {/* Reserve a persistent safe area for the floating assistant so table
              pagination and bottom actions can always scroll above it. */}
          <main className="flex-1 overflow-y-auto pb-24">
            {children}
          </main>
        </div>
        <FloatingChatbotWidget />
      </div>
    </SessionProvider>
  );
}

