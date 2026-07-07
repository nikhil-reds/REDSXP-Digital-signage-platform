"use client";

import React, { FormEvent, useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Shield,
  UserCheck,
  UserX,
  Users,
  X,
} from "lucide-react";

type AdminUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  createdAt: string;
  lastLoginAt: string | null;
  isCurrentUser: boolean;
  role: { name: string };
};

type UsersResponse = {
  users: AdminUser[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
  summary: { total: number; active: number; inactive: number };
};

const emptyData: UsersResponse = {
  users: [],
  pagination: { page: 1, pageSize: 10, total: 0, totalPages: 1 },
  summary: { total: 0, active: 0, inactive: 0 },
};

function initials(user: AdminUser) {
  return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || user.email[0].toUpperCase();
}

function displayName(user: AdminUser) {
  return [user.firstName, user.lastName].filter(Boolean).join(" ") || "Unnamed administrator";
}

function formatDate(value: string | null) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function generatePassword() {
  const bytes = new Uint8Array(14);
  crypto.getRandomValues(bytes);
  const chars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return `${Array.from(bytes, (byte) => chars[byte % chars.length]).join("")}!9aA`;
}

export default function UsersPage() {
  const [data, setData] = useState<UsersResponse>(emptyData);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: String(page), status });
      if (search) params.set("search", search);
      const response = await fetch(`/api/admin/users?${params}`, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to load administrators.");
      setData(result.data);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load administrators.");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    // The state updates happen after the asynchronous API request resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadUsers();
  }, [loadUsers]);

  const applySearch = (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setPage(1);
    setSearch(searchInput.trim());
  };

  const changeStatus = (value: string) => {
    setIsLoading(true);
    setPage(1);
    setStatus(value);
  };

  const updateStatus = async (user: AdminUser) => {
    const action = user.status === "ACTIVE" ? "deactivate" : "activate";
    setUpdatingId(user.id);
    setNotice(null);
    try {
      const response = await fetch(`/api/admin/users/${user.id}/${action}`, { method: "POST" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to update administrator.");
      setNotice(result.message);
      await loadUsers();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update administrator.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="py-6 px-2 space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Shield className="h-5 w-5 text-zinc-500" />
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Admin Users</h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage the people who can access the Rubenius administration panel.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="inline-flex cursor-pointer items-center justify-center gap-2 self-start rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-opacity hover:opacity-90 dark:bg-zinc-50 dark:text-zinc-950 sm:self-auto">
          <Plus className="h-4 w-4" /> Add Admin
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Total administrators", value: data.summary.total, icon: Users },
          { label: "Active access", value: data.summary.active, icon: UserCheck },
          { label: "Inactive access", value: data.summary.inactive, icon: UserX },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{item.label}</span>
              <item.icon className="h-4 w-4 text-zinc-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{isLoading ? "—" : item.value}</p>
          </div>
        ))}
      </div>

      {notice && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
          <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />{notice}</span>
          <button onClick={() => setNotice(null)} aria-label="Dismiss"><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 md:flex-row md:items-center md:justify-between">
        <form onSubmit={applySearch} className="flex w-full gap-2 md:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search by name or email" className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-3 text-sm text-zinc-900 outline-none focus:ring-1 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-zinc-50" />
          </div>
          <button className="rounded-lg border border-zinc-200 px-3 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800">Search</button>
        </form>
        <div className="flex gap-2">
          <select value={status} onChange={(event) => changeStatus(event.target.value)} className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 md:flex-none">
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
          <button onClick={() => { setIsLoading(true); void loadUsers(); }} title="Refresh" className="rounded-lg border border-zinc-200 p-2 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"><RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} /></button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        {error ? (
          <div className="flex min-h-72 flex-col items-center justify-center gap-3 p-8 text-center"><AlertCircle className="h-8 w-8 text-red-500" /><div><p className="font-semibold text-zinc-900 dark:text-zinc-100">Administrators could not be loaded</p><p className="mt-1 text-sm text-zinc-500">{error}</p></div><button onClick={() => { setIsLoading(true); void loadUsers(); }} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-zinc-900">Try again</button></div>
        ) : isLoading ? (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="flex animate-pulse items-center gap-4 p-4"><div className="h-9 w-9 rounded-full bg-zinc-100 dark:bg-zinc-800" /><div className="flex-1 space-y-2"><div className="h-3 w-40 rounded bg-zinc-100 dark:bg-zinc-800" /><div className="h-3 w-56 rounded bg-zinc-100 dark:bg-zinc-800" /></div></div>)}</div>
        ) : data.users.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center"><div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-800"><Users className="h-7 w-7 text-zinc-500" /></div><p className="font-semibold text-zinc-900 dark:text-zinc-100">{search || status !== "ALL" ? "No administrators match these filters" : "No administrators yet"}</p><p className="mt-1 max-w-sm text-sm text-zinc-500">{search || status !== "ALL" ? "Try a different search or status." : "Add the first administrator to grant secure platform access."}</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead><tr className="border-b border-zinc-100 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50"><th className="p-4">Administrator</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4">Last login</th><th className="p-4">Created</th><th className="p-4 text-right">Action</th></tr></thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {data.users.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30">
                    <td className="p-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">{initials(user)}</div><div><div className="font-semibold text-zinc-900 dark:text-zinc-100">{displayName(user)} {user.isCurrentUser && <span className="ml-1 text-[10px] font-medium text-zinc-400">(You)</span>}</div><div className="text-xs text-zinc-500">{user.email}</div></div></div></td>
                    <td className="p-4"><span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"><Shield className="h-3 w-3" />Administrator</span></td>
                    <td className="p-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${user.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}><span className={`h-1.5 w-1.5 rounded-full ${user.status === "ACTIVE" ? "bg-emerald-500" : "bg-zinc-400"}`} />{user.status[0] + user.status.slice(1).toLowerCase()}</span></td>
                    <td className="p-4 text-xs text-zinc-500">{formatDate(user.lastLoginAt)}</td>
                    <td className="p-4 text-xs text-zinc-500">{formatDate(user.createdAt)}</td>
                    <td className="p-4 text-right"><button disabled={user.isCurrentUser || updatingId === user.id} onClick={() => void updateStatus(user)} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">{updatingId === user.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : user.status === "ACTIVE" ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}{user.status === "ACTIVE" ? "Deactivate" : "Activate"}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!error && !isLoading && data.users.length > 0 && <div className="flex items-center justify-between border-t border-zinc-100 px-4 py-3 text-xs text-zinc-500 dark:border-zinc-800"><span>Showing {(data.pagination.page - 1) * data.pagination.pageSize + 1}–{Math.min(data.pagination.page * data.pagination.pageSize, data.pagination.total)} of {data.pagination.total}</span><div className="flex items-center gap-2"><button disabled={page <= 1} onClick={() => { setIsLoading(true); setPage((current) => current - 1); }} className="rounded-md border border-zinc-200 p-1.5 disabled:opacity-40 dark:border-zinc-700"><ChevronLeft className="h-4 w-4" /></button><span>Page {page} of {data.pagination.totalPages}</span><button disabled={page >= data.pagination.totalPages} onClick={() => { setIsLoading(true); setPage((current) => current + 1); }} className="rounded-md border border-zinc-200 p-1.5 disabled:opacity-40 dark:border-zinc-700"><ChevronRight className="h-4 w-4" /></button></div></div>}
      </div>

      {isModalOpen && <AddAdminModal onClose={() => setIsModalOpen(false)} onCreated={async (message) => { setIsModalOpen(false); setNotice(message); setIsLoading(true); setPage(1); if (page === 1) await loadUsers(); }} />}
    </div>
  );
}

function AddAdminModal({ onClose, onCreated }: { onClose: () => void; onCreated: (message: string) => Promise<void> }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.errors?.[0] || result.message || "Unable to create administrator.");
      await onCreated(result.message);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to create administrator.");
    } finally {
      setIsSaving(false);
    }
  };

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="add-admin-title" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSaving) onClose(); }}><div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"><div className="flex items-start justify-between border-b border-zinc-100 p-5 dark:border-zinc-800"><div><h2 id="add-admin-title" className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Add administrator</h2><p className="mt-1 text-sm text-zinc-500">Create secure access to the platform administration panel.</p></div><button disabled={isSaving} onClick={onClose} aria-label="Close dialog" className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800"><X className="h-5 w-5" /></button></div><form onSubmit={submit} className="space-y-4 p-5">{error && <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}<div className="grid grid-cols-2 gap-3">{(["firstName", "lastName"] as const).map((key) => <label key={key} className="space-y-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300"><span>{key === "firstName" ? "First name" : "Last name"}</span><input required autoFocus={key === "firstName"} value={form[key]} onChange={(event) => update(key, event.target.value)} className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-normal text-zinc-900 outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:ring-zinc-100" /></label>)}</div><label className="block space-y-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300"><span>Email address</span><input required type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="admin@company.com" className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-normal text-zinc-900 outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:ring-zinc-100" /></label><label className="block space-y-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300"><span>Initial password</span><div className="flex gap-2"><div className="relative flex-1"><input required minLength={12} type={showPassword ? "text" : "password"} value={form.password} onChange={(event) => update("password", event.target.value)} className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 pr-10 text-sm font-normal text-zinc-900 outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:ring-zinc-100" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div><button type="button" onClick={() => { update("password", generatePassword()); setShowPassword(true); }} className="rounded-lg border border-zinc-200 px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">Generate</button></div><span className="block text-[11px] font-normal leading-relaxed text-zinc-500">At least 12 characters with uppercase, lowercase, number, and symbol.</span></label><div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs leading-relaxed text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"><strong className="text-zinc-800 dark:text-zinc-200">Administrator access</strong> grants full access to platform settings and user management.</div><div className="flex justify-end gap-2 pt-2"><button type="button" disabled={isSaving} onClick={onClose} className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900">Cancel</button><button disabled={isSaving} className="inline-flex min-w-32 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950">{isSaving && <Loader2 className="h-4 w-4 animate-spin" />}{isSaving ? "Creating…" : "Create admin"}</button></div></form></div></div>;
}
