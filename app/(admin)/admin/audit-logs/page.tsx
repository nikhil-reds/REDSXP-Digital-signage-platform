import React from "react";
import { Download, Search, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { Button, PageShell } from "@/components/ui";

export default function AuditLogsPage() {
  const logs = [
    { id: "1", timestamp: "July 03, 10:55:12", actor: "Priya Sharma (Super Admin)", action: "CREATE_TENANT", target: "Starlight Interactive", ip: "192.168.1.15", status: "Success" },
    { id: "2", timestamp: "July 03, 10:48:02", actor: "Priya Sharma (Super Admin)", action: "UPDATE_PLAN", target: "Nebula Media Corp", ip: "192.168.1.15", status: "Success" },
    { id: "3", timestamp: "July 03, 09:12:44", actor: "System Agent (Auto)", action: "ROTATE_API_KEYS", target: "Acme Digital Solutions", ip: "10.0.0.1", status: "Success" },
    { id: "4", timestamp: "July 02, 17:33:01", actor: "Priya Sharma (Super Admin)", action: "DELETE_DEVICE", target: "DEV-1002 (Kiosk Panel)", ip: "192.168.1.22", status: "Success" },
    { id: "5", timestamp: "July 02, 14:02:19", actor: "Developer Admin (Staff)", action: "UPDATE_SETTINGS", target: "Global Routing Config", ip: "172.16.85.3", status: "Failed" },
  ];

  return (
    <PageShell className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-page-title font-bold text-app-text">Audit Security Logs</h1>
          <p className="text-body text-app-muted">
            Real-time tracking of platform configuration modifications, key rotation, and user sessions.
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button variant="secondary">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Logs</span>
          </Button>
          <Button>
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-app-border bg-app-surface p-4 shadow-xs md:flex-row">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-muted" />
          <input
            type="text"
            placeholder="Search by action or actor..."
            className="w-full rounded-lg border border-app-border bg-app-surface-alt py-1.5 pl-9 pr-4 text-body text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-accent-text"
          />
        </div>
        <select className="w-full rounded-lg border border-app-border bg-app-surface px-3 py-1.5 text-body font-medium text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text md:w-auto">
          <option>All Actions</option>
          <option>CREATE_TENANT</option>
          <option>DELETE_TENANT</option>
          <option>ROTATE_API_KEYS</option>
          <option>UPDATE_PLAN</option>
        </select>
      </div>

      {/* Audit Logs Table */}
      <div className="overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-app-border bg-app-surface-alt font-semibold text-app-muted">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Action</th>
                <th className="p-4">Target Resource</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border">
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="transition-colors hover:bg-app-surface-alt"
                >
                  <td className="p-4 text-caption font-medium text-app-muted">
                    {log.timestamp}
                  </td>
                  <td className="p-4 font-semibold text-app-text">
                    {log.actor}
                  </td>
                  <td className="p-4">
                    <span className="rounded-md bg-app-surface-alt px-2 py-0.5 font-mono text-caption font-medium text-app-text">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-app-text">
                    {log.target}
                  </td>
                  <td className="p-4 font-mono text-caption text-app-muted">
                    {log.ip}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1 ${
                        log.status === "Success"
                          ? "bg-app-accent-surface text-app-accent-text"
                          : "bg-app-danger-surface text-app-danger-text"
                      }`}
                    >
                      {log.status === "Success" ? (
                        <CheckCircle className="h-3.5 w-3.5 text-app-accent-text" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5 text-app-danger-text" />
                      )}
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
