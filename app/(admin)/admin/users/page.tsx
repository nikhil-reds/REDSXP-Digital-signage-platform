import React from "react";
import { Users, Plus, Search, Shield, MoreVertical } from "lucide-react";

export default function UsersPage() {
  const users = [
    { id: "1", name: "Priya Sharma", email: "priya.sharma@rubenias.com", role: "Super Admin", status: "Active", lastLogin: "Just now" },
    { id: "2", name: "Alexander Vance", email: "alex.vance@rubenias.com", role: "Developer Admin", status: "Active", lastLogin: "3 hours ago" },
    { id: "3", name: "Sarah Connor", email: "sarah.connor@rubenias.com", role: "Billing Admin", status: "Active", lastLogin: "Yesterday" },
    { id: "4", name: "Marcus Wright", email: "marcus.wright@rubenias.com", role: "Support Staff", status: "Inactive", lastLogin: "3 weeks ago" },
  ];

  return (
    <div className="py-6 px-2 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Admin Users</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Control platform administrators, security roles, and user access permissions.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-xs cursor-pointer self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          <span>Invite Admin</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-4 rounded-xl shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-1.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-50"
          />
        </div>
        <select className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-sm text-zinc-700 dark:text-zinc-300 w-full md:w-auto font-medium">
          <option>All Security Roles</option>
          <option>Super Admin</option>
          <option>Developer Admin</option>
          <option>Billing Admin</option>
          <option>Support Staff</option>
        </select>
      </div>

      {/* Users List Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-500 font-semibold border-b border-zinc-100 dark:border-zinc-800">
                <th className="p-4">Administrator Name</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Security Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Last Login Session</th>
                <th className="p-4 text-center">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-850 dark:text-zinc-300 font-bold flex items-center justify-center text-xs select-none">
                        {user.name.split(" ").map(w => w[0]).join("")}
                      </div>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-zinc-500 dark:text-zinc-400">
                    {user.email}
                  </td>
                  <td className="p-4">
                    <span className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-zinc-450" />
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium inline-flex items-center ${
                        user.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                          : "bg-zinc-100 text-zinc-650 dark:bg-zinc-850 dark:text-zinc-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          user.status === "Active" ? "bg-emerald-500" : "bg-zinc-400"
                        }`}
                      />
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-right text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                    {user.lastLogin}
                  </td>
                  <td className="p-4 text-center">
                    <button className="p-1 text-zinc-450 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer inline-flex items-center justify-center">
                      <MoreVertical className="w-4 h-4" />
                    </button>
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
