import React from "react";
import { FileText, Download, Search, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";

export default function AuditLogsPage() {
  const logs = [
    { id: "1", timestamp: "July 03, 10:55:12", actor: "Priya Sharma (Super Admin)", action: "CREATE_TENANT", target: "Starlight Interactive", ip: "192.168.1.15", status: "Success" },
    { id: "2", timestamp: "July 03, 10:48:02", actor: "Priya Sharma (Super Admin)", action: "UPDATE_PLAN", target: "Nebula Media Corp", ip: "192.168.1.15", status: "Success" },
    { id: "3", timestamp: "July 03, 09:12:44", actor: "System Agent (Auto)", action: "ROTATE_API_KEYS", target: "Acme Digital Solutions", ip: "10.0.0.1", status: "Success" },
    { id: "4", timestamp: "July 02, 17:33:01", actor: "Priya Sharma (Super Admin)", action: "DELETE_DEVICE", target: "DEV-1002 (Kiosk Panel)", ip: "192.168.1.22", status: "Success" },
    { id: "5", timestamp: "July 02, 14:02:19", actor: "Developer Admin (Staff)", action: "UPDATE_SETTINGS", target: "Global Routing Config", ip: "172.16.85.3", status: "Failed" },
  ];

  return (
    <div className="py-6 px-2 space-y-6 mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Audit Security Logs</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Real-time tracking of platform configuration modifications, key rotation, and user sessions.
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 bg-white hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-750 dark:text-zinc-300 transition-colors shadow-sm cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Logs</span>
          </button>
          <button className="flex items-center gap-2 bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 px-3 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-4 rounded-xl shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by action or actor..."
            className="w-full pl-9 pr-4 py-1.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-50"
          />
        </div>
        <select className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-sm text-zinc-705 dark:text-zinc-300 w-full md:w-auto font-medium">
          <option>All Actions</option>
          <option>CREATE_TENANT</option>
          <option>DELETE_TENANT</option>
          <option>ROTATE_API_KEYS</option>
          <option>UPDATE_PLAN</option>
        </select>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-500 font-semibold border-b border-zinc-100 dark:border-zinc-800">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Action</th>
                <th className="p-4">Target Resource</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors"
                >
                  <td className="p-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {log.timestamp}
                  </td>
                  <td className="p-4 font-semibold text-zinc-900 dark:text-zinc-100">
                    {log.actor}
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded-md font-medium">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-zinc-850 dark:text-zinc-200">
                    {log.target}
                  </td>
                  <td className="p-4 font-mono text-xs text-zinc-400">
                    {log.ip}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1 ${
                        log.status === "Success"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
                      }`}
                    >
                      {log.status === "Success" ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-550" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-550" />
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
    </div>
  );
}
