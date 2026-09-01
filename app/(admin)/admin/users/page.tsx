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
  Lock,
  Plus,
  RefreshCw,
  Search,
  Shield,
  UserCheck,
  UserX,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  Button,
  FieldLabel,
  Modal,
  PageShell,
  Select,
  Skeleton,
  SkeletonRegion,
  SkeletonStatGrid,
  StatGrid,
  StatTile,
  TextInput,
} from "@/components/ui";
import { RoleFormModal, type RoleFormRole } from "@/components/admin/roles/role-form-modal";

type AdminUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  createdAt: string;
  lastLoginAt: string | null;
  isCurrentUser: boolean;
  role: { name: string; isSystem?: boolean };
};

type AdminRoleOption = {
  id: string;
  name: string;
  description?: string;
  isSystem: boolean;
  permissions: { id: string }[];
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

const TABLE_COLUMNS = ["Administrator", "Role", "Status", "Last login", "Created", "Action"];

function UsersTableHead() {
  return (
    <thead>
      <tr className="border-b border-app-border bg-app-surface-alt text-caption font-semibold uppercase tracking-wide text-app-muted">
        {TABLE_COLUMNS.map((column) => (
          <th key={column} className={`p-4 ${column === "Action" ? "text-right" : ""}`}>
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
}

/**
 * Mirrors the real row cell-for-cell — avatar, two-line identity, both pills,
 * two dates, the action button — so nothing shifts when the data lands.
 */
function UsersSkeletonRows({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index}>
          <td className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
          </td>
          <td className="p-4">
            <Skeleton className="h-6 w-32 rounded-full" />
          </td>
          <td className="p-4">
            <Skeleton className="h-6 w-20 rounded-full" />
          </td>
          <td className="p-4">
            <Skeleton className="h-3 w-36" />
          </td>
          <td className="p-4">
            <Skeleton className="h-3 w-36" />
          </td>
          <td className="p-4">
            <Skeleton className="ml-auto h-7 w-28 rounded-lg" />
          </td>
        </tr>
      ))}
    </>
  );
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

  // Plan §2: a skeleton is for a first load only. On refetch (filter, search,
  // paginate, refresh) the rows stay put and the refresh icon spins instead.
  const isFirstLoad = isLoading && data.users.length === 0;

  return (
    <PageShell className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Shield className="h-5 w-5 text-app-accent-text" />
            <h1 className="text-page-title font-bold text-app-text">Admin Users</h1>
          </div>
          <p className="text-body text-app-muted">Manage the people who can access the Rubenius administration panel.</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button as={Link} href="/admin/roles" variant="secondary" icon={Shield}>
            Manage roles
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" /> Add Admin
          </Button>
        </div>
      </div>

      {isFirstLoad ? (
        <SkeletonStatGrid columns={3} label="Loading administrator counts…" />
      ) : (
        <StatGrid columns={3}>
          {[
            { label: "Total administrators", value: data.summary.total, icon: Users },
            { label: "Active access", value: data.summary.active, icon: UserCheck },
            { label: "Inactive access", value: data.summary.inactive, icon: UserX },
          ].map((item) => (
            <StatTile key={item.label} label={item.label} value={item.value} icon={item.icon} tone={item.label === "Active access" ? "accent" : "neutral"} />
          ))}
        </StatGrid>
      )}

      {notice && (
        <div className="flex items-center justify-between rounded-xl border border-app-accent-border bg-app-accent-surface px-4 py-3 text-body text-app-accent-text">
          <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />{notice}</span>
          <button onClick={() => setNotice(null)} aria-label="Dismiss"><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-xl border border-app-border bg-app-surface p-4 shadow-xs md:flex-row md:items-center md:justify-between">
        <form onSubmit={applySearch} className="flex w-full gap-2 md:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-muted" />
            <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search by name or email" className="w-full rounded-lg border border-app-border bg-app-surface-alt py-2 pl-9 pr-3 text-body text-app-text outline-none placeholder:text-app-muted focus:ring-2 focus:ring-app-accent-text" />
          </div>
          <button className="rounded-lg border border-app-border bg-app-surface px-3 text-body font-medium text-app-text hover:bg-app-surface-alt">Search</button>
        </form>
        <div className="flex gap-2">
          <select value={status} onChange={(event) => changeStatus(event.target.value)} className="flex-1 rounded-lg border border-app-border bg-app-surface px-3 py-2 text-body font-medium text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text md:flex-none">
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
          <button onClick={() => { setIsLoading(true); void loadUsers(); }} title="Refresh" className="rounded-lg border border-app-border p-2 text-app-muted hover:bg-app-surface-alt hover:text-app-text"><RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} /></button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-xs">
        {error ? (
          <div className="flex min-h-72 flex-col items-center justify-center gap-3 p-8 text-center"><AlertCircle className="h-8 w-8 text-app-danger-text" /><div><p className="font-semibold text-app-text">Administrators could not be loaded</p><p className="mt-1 text-body text-app-muted">{error}</p></div><button onClick={() => { setIsLoading(true); void loadUsers(); }} className="rounded-lg bg-app-accent px-4 py-2 text-body font-semibold text-app-accent-on hover:bg-app-accent-hover">Try again</button></div>
        ) : isFirstLoad ? (
          <SkeletonRegion label="Loading administrators…">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <UsersTableHead />
                <tbody className="divide-y divide-app-border">
                  <UsersSkeletonRows />
                </tbody>
              </table>
            </div>
          </SkeletonRegion>
        ) : data.users.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center"><div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-800"><Users className="h-7 w-7 text-zinc-500" /></div><p className="font-semibold text-zinc-900 dark:text-zinc-100">{search || status !== "ALL" ? "No administrators match these filters" : "No administrators yet"}</p><p className="mt-1 max-w-sm text-sm text-zinc-500">{search || status !== "ALL" ? "Try a different search or status." : "Add the first administrator to grant secure platform access."}</p></div>
        ) : (
          // Tier 3: rows stay on screen during a refetch, dimmed rather than replaced.
          <div
            aria-busy={isLoading}
            className={`overflow-x-auto transition-opacity duration-200 ${isLoading ? "opacity-60" : ""}`}
          >
            <table className="w-full min-w-[850px] text-left text-sm">
              <UsersTableHead />
              <tbody className="divide-y divide-app-border">
                {data.users.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-app-surface-alt">
                    <td className="p-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-app-accent-surface text-caption font-bold text-app-accent-text">{initials(user)}</div><div><div className="font-semibold text-app-text">{displayName(user)} {user.isCurrentUser && <span className="ml-1 text-[10px] font-medium text-app-muted">(You)</span>}</div><div className="text-caption text-app-muted">{user.email}</div></div></div></td>
                    <td className="p-4"><span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">{user.role.isSystem ? <Lock className="h-3 w-3" /> : <Shield className="h-3 w-3" />}{user.role.name}</span></td>
                    <td className="p-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-medium ${user.status === "ACTIVE" ? "bg-app-accent-surface text-app-accent-text" : "bg-app-surface-alt text-app-muted"}`}><span className={`h-1.5 w-1.5 rounded-full ${user.status === "ACTIVE" ? "bg-app-accent-text" : "bg-app-muted"}`} />{user.status[0] + user.status.slice(1).toLowerCase()}</span></td>
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
    </PageShell>
  );
}

function AddAdminModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (message: string) => Promise<void>;
}) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", roleId: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [roles, setRoles] = useState<AdminRoleOption[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const loadRoles = useCallback(async (selectId?: string) => {
    setIsLoadingRoles(true);
    try {
      const response = await fetch("/api/admin/roles", { cache: "no-store" });
      const result = await response.json();
      if (response.ok && result.success) {
        const list: AdminRoleOption[] = result.data || [];
        setRoles(list);
        setForm((current) => ({
          ...current,
          roleId:
            selectId ||
            current.roleId ||
            list.find((role) => role.name === "SUPER_ADMIN")?.id ||
            list[0]?.id ||
            "",
        }));
      }
    } catch {
      // Non-fatal: the select renders empty and the form blocks submit until a role is chosen.
    } finally {
      setIsLoadingRoles(false);
    }
  }, []);

  useEffect(() => {
    // The state updates happen after the asynchronous API request resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadRoles();
  }, [loadRoles]);

  const selectedRole = roles.find((role) => role.id === form.roleId);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.roleId) {
      setError("Choose a role for this administrator.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.errors?.[0] || result.message || "Unable to create administrator.");
      }
      await onCreated(result.message);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to create administrator.");
    } finally {
      setIsSaving(false);
    }
  };

  const update = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  return (
    <Modal
      open
      onClose={() => {
        if (!isSaving) onClose();
      }}
      title="Add administrator"
      description="Create secure access to the platform administration panel."
      className="border-t-4 border-t-app-accent"
      footer={
        <>
          <Button type="button" variant="secondary" disabled={isSaving} onClick={onClose}>
            Cancel
          </Button>
          {/* The footer sits outside the <form>, so submit by id instead. */}
          <Button
            type="submit"
            form="add-admin-form"
            variant="primary"
            disabled={isSaving || isLoadingRoles || !form.roleId}
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSaving ? "Creating…" : "Create admin"}
          </Button>
        </>
      }
    >
      <form id="add-admin-form" onSubmit={submit} className="space-y-4">
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-app-danger-border bg-app-danger-surface p-3 text-body text-app-danger-text">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(["firstName", "lastName"] as const).map((key) => (
            <div key={key}>
              <FieldLabel htmlFor={key}>
                {key === "firstName" ? "First name" : "Last name"}
              </FieldLabel>
              <TextInput
                id={key}
                required
                value={form[key]}
                onChange={(event) => update(key, event.target.value)}
                placeholder={key === "firstName" ? "Priya" : "Sharma"}
              />
            </div>
          ))}
        </div>

        <div>
          <FieldLabel htmlFor="email">Email address</FieldLabel>
          <TextInput
            id="email"
            required
            type="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            placeholder="admin@company.com"
          />
        </div>

        <div>
          <FieldLabel htmlFor="roleId">Role</FieldLabel>
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <Select
                id="roleId"
                required
                value={form.roleId}
                onChange={(event) => update("roleId", event.target.value)}
                disabled={isLoadingRoles || roles.length === 0}
              >
                {isLoadingRoles && <option value="">Loading roles…</option>}
                {!isLoadingRoles && roles.length === 0 && (
                  <option value="">No platform roles found</option>
                )}
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                    {role.isSystem ? " (system)" : ""} — {role.permissions.length} permission
                    {role.permissions.length === 1 ? "" : "s"}
                  </option>
                ))}
              </Select>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsRoleModalOpen(true)}
            >
              + New role
            </Button>
          </div>
          {selectedRole?.description && (
            <p className="mt-1.5 text-caption leading-relaxed text-app-muted">
              {selectedRole.description}
            </p>
          )}
        </div>

        <div>
          <FieldLabel htmlFor="password">Initial password</FieldLabel>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <TextInput
                id="password"
                required
                minLength={12}
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(event) => update("password", event.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-app-muted transition-colors hover:text-app-text"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                update("password", generatePassword());
                setShowPassword(true);
              }}
            >
              Generate
            </Button>
          </div>
          <p className="mt-1.5 text-caption leading-relaxed text-app-muted">
            At least 12 characters with uppercase, lowercase, number, and symbol.
          </p>
        </div>

        <div className="rounded-lg border border-app-border bg-app-surface-alt p-3 text-caption leading-relaxed text-app-muted">
          <strong className="font-semibold text-app-text">
            {selectedRole ? selectedRole.name : "This role"}
          </strong>{" "}
          grants{" "}
          {selectedRole
            ? `${selectedRole.permissions.length} platform permission${selectedRole.permissions.length === 1 ? "" : "s"}`
            : "platform"}{" "}
          access. Manage what each role can do from the{" "}
          <strong className="font-semibold text-app-text">Manage roles</strong> page.
        </div>
      </form>

      {isRoleModalOpen && (
        <RoleFormModal
          role={null}
          rolesEndpoint="/api/admin/roles"
          permissionsScope="SYSTEM"
          title="Create Custom Admin Role"
          onClose={() => setIsRoleModalOpen(false)}
          onSaved={(role: RoleFormRole) => {
            setIsRoleModalOpen(false);
            void loadRoles(role.id);
          }}
        />
      )}
    </Modal>
  );
}
