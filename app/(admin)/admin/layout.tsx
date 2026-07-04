import React from "react";
import AdminSidebar from "@/components/layout/admin-sidebar";
import AdminNavbar from "@/components/layout/admin-navbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
