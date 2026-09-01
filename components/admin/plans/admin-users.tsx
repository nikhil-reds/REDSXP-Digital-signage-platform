"use client";

import React, { useState } from "react";
import {
  UserPlus,
  ShieldAlert,
  ShieldCheck,
  MoreHorizontal,
  UserCheck,
  LogOut,
  Ban,
  Trash2
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  mfa: "Enabled" | "Disabled";
  lastLogin: string;
}

const initialUsers: AdminUser[] = [
  { id: "1", name: "Priya Sharma", email: "priya.sharma@rubenius.com", role: "Super Admin", status: "Active", mfa: "Enabled", lastLogin: "2 Jul, 4:30 PM" },
  { id: "2", name: "Arjun Mehta", email: "arjun.mehta@rubenius.com", role: "Finance Admin", status: "Active", mfa: "Enabled", lastLogin: "2 Jul, 3:48 PM" },
  { id: "3", name: "Neha Rao", email: "neha.rao@rubenius.com", role: "Operations Admin", status: "Active", mfa: "Disabled", lastLogin: "2 Jul, 2:36 PM" },
  { id: "4", name: "Vikram Singh", email: "vikram.singh@rubenius.com", role: "Support Admin", status: "Active", mfa: "Enabled", lastLogin: "2 Jul, 11:22 AM" },
  { id: "5", name: "Riya Kapoor", email: "riya.kapoor@rubenius.com", role: "Read-only Analyst", status: "Active", mfa: "Enabled", lastLogin: "1 Jul, 9:14 AM" }
];

export default function AdminUsers() {
  const users = initialUsers;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === users.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map((u) => u.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-4">
      {/* Header section with Invite Admin button */}
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-body font-bold text-app-text">Admin Users</h2>
        <button className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-app-accent px-3.5 py-1.5 text-caption font-semibold text-app-accent-on shadow-xs transition-colors hover:bg-app-accent-hover">
          <UserPlus className="w-3.5 h-3.5" />
          <span>Invite Admin</span>
        </button>
      </div>

      {/* Users table wrapper */}
      <div className="overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="select-none border-b border-app-border bg-app-surface-alt font-bold text-app-muted">
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={users.length > 0 && selectedIds.length === users.length}
                    onChange={toggleSelectAll}
                    className="h-3.5 w-3.5 cursor-pointer rounded border-app-border accent-app-accent-text"
                  />
                </th>
                <th className="p-3.5 font-bold">Name</th>
                <th className="p-3.5 font-bold">Email</th>
                <th className="p-3.5 font-bold">Role</th>
                <th className="p-3.5 font-bold">Status</th>
                <th className="p-3.5 font-bold">MFA</th>
                <th className="p-3.5 font-bold">Last Login</th>
                <th className="p-3.5 text-center font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border">
              {users.map((user) => {
                const isSelected = selectedIds.includes(user.id);
                const initials = getInitials(user.name);

                return (
                  <tr
                    key={user.id}
                    className={`transition-colors hover:bg-app-surface-alt ${
                      isSelected ? "bg-app-accent-surface" : ""
                    }`}
                  >
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(user.id)}
                        className="h-3.5 w-3.5 cursor-pointer rounded border-app-border accent-app-accent-text"
                      />
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 shrink-0 select-none items-center justify-center rounded-full bg-app-accent-surface text-[10px] font-bold text-app-accent-text shadow-xs">
                          {initials}
                        </div>
                        <span className="font-semibold text-app-text">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 text-app-muted">
                      {user.email}
                    </td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-semibold text-zinc-650 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/40 px-2 py-0.5 rounded-md">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {user.status}
                      </span>
                    </td>
                    <td className="p-3.5">
                      {user.mfa === "Enabled" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-500">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Enabled</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-500 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100/50 dark:border-amber-900/10 px-2 py-0.5 rounded-full">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Disabled</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-zinc-500 dark:text-zinc-400 font-medium">
                      {user.lastLogin}
                    </td>
                    <td className="p-3.5 text-center">
                      <button className="p-1 rounded-md text-zinc-450 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk action toolbar footer */}
      {selectedIds.length > 0 && (
        <div className="flex select-none items-center justify-between rounded-xl border border-app-border bg-app-surface-alt p-3 shadow-xs">
          <span className="text-[10px] text-zinc-450 font-bold">
            {selectedIds.length} users selected
          </span>
          <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-650 dark:text-zinc-400">
            <button className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer transition-colors">
              <UserCheck className="w-3.5 h-3.5 text-zinc-400" />
              <span>Change Role</span>
            </button>
            <button className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer transition-colors">
              <LogOut className="w-3.5 h-3.5 text-zinc-400" />
              <span>Revoke Sessions</span>
            </button>
            <button className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer transition-colors">
              <Ban className="w-3.5 h-3.5 text-zinc-400" />
              <span>Disable</span>
            </button>
            <button className="flex items-center gap-1 text-red-650 hover:opacity-90 cursor-pointer transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
