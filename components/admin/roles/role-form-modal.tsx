"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Check, CheckCircle2, Loader2, Search, ShieldCheck, UserMinus, UserPlus, Users } from "lucide-react";
import {
  Badge,
  Button,
  Checkbox,
  FieldLabel,
  Modal,
  Skeleton,
  SkeletonRegion,
  TextInput,
} from "@/components/ui";

export interface Permission {
  id: string;
  key: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
}

export interface RoleFormRole {
  id: string;
  name: string;
  description?: string;
  isSystem: boolean;
  scope: string;
  permissions: Permission[];
}

interface RoleFormModalProps {
  /** Role being edited, or null/undefined to create a new one. */
  role?: RoleFormRole | null;
  /** REST base used for create (POST) / update (PUT), e.g. "/api/admin/roles" or "/api/agent/roles". */
  rolesEndpoint: string;
  /** Which permission catalogue to load, matches Permission.scope on the backend. */
  permissionsScope: "SYSTEM" | "TENANT";
  /** Enables the platform-only member management column in the edit experience. */
  manageMembers?: boolean;
  title?: string;
  onClose: () => void;
  onSaved: (role: RoleFormRole) => void;
}

/** Mirrors a resource group so the matrix does not jump when the catalogue lands. */
function PermissionSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, group) => (
        <div key={group} className="rounded-xl border border-app-border bg-app-surface-alt p-4">
          <div className="mb-3 flex items-center justify-between">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, item) => (
              <Skeleton key={item} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Shared create/edit form for a Role: name, description, and a permission checkbox
 * matrix grouped by resource with a per-group "select all" toggle. Used both from the
 * dedicated role management pages (/admin/roles, /agent/roles) and inline from the
 * "Add Admin" flow on /admin/users, so there is exactly one implementation of the
 * permission picker rather than a copy embedded in each caller.
 */
export function RoleFormModal({
  role,
  rolesEndpoint,
  permissionsScope,
  manageMembers = false,
  title,
  onClose,
  onSaved,
}: RoleFormModalProps) {
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [loadingPerms, setLoadingPerms] = useState(true);
  const [roleName, setRoleName] = useState(role?.name || "");
  const [roleDesc, setRoleDesc] = useState(role?.description || "");
  const [selectedPermIds, setSelectedPermIds] = useState<string[]>(
    role?.permissions.map((p) => p.id) || [],
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [membersLoading, setMembersLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [availableUsers, setAvailableUsers] = useState<Member[]>([]);
  const [systemRoles, setSystemRoles] = useState<MemberRole[]>([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [addedUserIds, setAddedUserIds] = useState<string[]>([]);
  const [reassignments, setReassignments] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingPerms(true);
      try {
        const res = await fetch(`/api/permissions?scope=${permissionsScope}`);
        const json = await res.json();
        if (!cancelled && json.success) setAllPermissions(json.data || []);
      } catch {
        if (!cancelled) setErrorMsg("Unable to load the permission catalogue.");
      } finally {
        if (!cancelled) setLoadingPerms(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [permissionsScope]);

  useEffect(() => {
    if (!manageMembers || !role) return;
    let cancelled = false;
    (async () => {
      setMembersLoading(true);
      try {
        const res = await fetch(`/api/admin/roles/${role.id}/members`);
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message || "Unable to load role members.");
        if (!cancelled) {
          setMembers(json.data.members || []);
          setAvailableUsers(json.data.availableUsers || []);
          setSystemRoles(json.data.roles || []);
        }
      } catch (error) {
        if (!cancelled) setErrorMsg(error instanceof Error ? error.message : "Unable to load role members.");
      } finally {
        if (!cancelled) setMembersLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [manageMembers, role]);

  function togglePermission(permId: string) {
    setSelectedPermIds((prev) =>
      prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId],
    );
  }

  function toggleResourceGroup(resource: string) {
    const resourcePerms = allPermissions.filter((p) => p.resource === resource).map((p) => p.id);
    const allSelected = resourcePerms.every((id) => selectedPermIds.includes(id));
    if (allSelected) {
      setSelectedPermIds((prev) => prev.filter((id) => !resourcePerms.includes(id)));
    } else {
      setSelectedPermIds((prev) => Array.from(new Set([...prev, ...resourcePerms])));
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!roleName.trim()) {
      setErrorMsg("Role name is required.");
      return;
    }

    setSaving(true);
    setErrorMsg("");
    try {
      const url = role ? `${rolesEndpoint}/${role.id}` : rolesEndpoint;
      const method = role ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: roleName.trim(),
          description: roleDesc.trim(),
          permissionIds: selectedPermIds,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setErrorMsg(json.message || "Failed to save role.");
      } else {
        if (manageMembers && role && (addedUserIds.length || Object.keys(reassignments).length)) {
          const membersRes = await fetch(`/api/admin/roles/${role.id}/members`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              addUserIds: addedUserIds,
              reassignments: Object.entries(reassignments).map(([userId, roleId]) => ({ userId, roleId })),
            }),
          });
          const membersJson = await membersRes.json();
          if (!membersRes.ok || !membersJson.success) {
            setErrorMsg(membersJson.message || "Role details were saved, but member changes could not be applied.");
            return;
          }
        }
        onSaved(json.data);
      }
    } catch {
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  }

  const groupedPermissions = allPermissions.reduce<Record<string, Permission[]>>((acc, p) => {
    if (!acc[p.resource]) acc[p.resource] = [];
    acc[p.resource].push(p);
    return acc;
  }, {});
  const visibleAvailableUsers = availableUsers.filter((user) => `${user.firstName || ""} ${user.lastName || ""} ${user.email}`.toLowerCase().includes(memberSearch.toLowerCase()));
  const visibleMembers = members.filter((user) => !reassignments[user.id] && `${user.firstName || ""} ${user.lastName || ""} ${user.email}`.toLowerCase().includes(memberSearch.toLowerCase()));

  return (
    <Modal
      open
      onClose={() => {
        if (!saving) onClose();
      }}
      size="xl"
      title={title || (role ? `Edit role: ${role.name}` : "Create role")}
      description="Pick the capabilities this role grants. Members inherit every permission you select."
      className="border-t-4 border-t-app-accent shadow-[0_24px_80px_rgba(0,0,0,0.32)]"
      footer={
        <>
          <Button type="button" variant="secondary" disabled={saving} onClick={onClose}>
            Cancel
          </Button>
          {/* The footer sits outside the <form>, so submit by id instead. */}
          <Button
            type="submit"
            form="role-form"
            variant="primary"
            disabled={saving || loadingPerms}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {saving ? "Saving…" : "Save role"}
          </Button>
        </>
      }
    >
      <form id="role-form" onSubmit={handleSave} className="space-y-6">
        {errorMsg && (
          <div className="flex items-start gap-2 rounded-lg border border-app-danger-border bg-app-danger-surface p-3 text-body text-app-danger-text">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="role-name">Role name</FieldLabel>
            <TextInput
              id="role-name"
              required
              autoFocus
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Billing Support Admin"
              className="h-11 transition-[border-color,box-shadow,background-color] hover:border-app-border-strong focus:bg-app-surface"
            />
          </div>
          <div>
            <FieldLabel htmlFor="role-description">Description</FieldLabel>
            <TextInput
              id="role-description"
              value={roleDesc}
              onChange={(e) => setRoleDesc(e.target.value)}
              placeholder="What this role is for"
              className="h-11 transition-[border-color,box-shadow,background-color] hover:border-app-border-strong focus:bg-app-surface"
            />
          </div>
        </div>

        <div className={manageMembers && role ? "grid gap-5 xl:grid-cols-[minmax(260px,0.78fr)_minmax(0,1.22fr)]" : ""}>
        {manageMembers && role && (
          <section className="rounded-xl border border-app-border bg-app-surface-alt/50 p-3 sm:p-4">
            <div className="mb-4 flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-app-surface text-app-muted"><Users className="h-4 w-4" /></span>
              <div><FieldLabel className="mb-0">Users</FieldLabel><p className="mt-0.5 text-caption text-app-muted">Assign or move platform administrators.</p></div>
            </div>
            <div className="relative mb-3"><Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-app-muted" /><TextInput value={memberSearch} onChange={(event) => setMemberSearch(event.target.value)} placeholder="Search users" className="h-9 pl-8" /></div>
            {membersLoading ? <SkeletonRegion label="Loading role users"><Skeleton className="h-36 w-full" /></SkeletonRegion> : <div className="space-y-4">
              <div><div className="mb-2 flex items-center justify-between"><span className="text-caption font-semibold uppercase tracking-headline text-app-muted">Assigned</span><Badge>{visibleMembers.length} active</Badge></div>
                <div className="space-y-2">{visibleMembers.length ? visibleMembers.map((user) => <MemberRow key={user.id} user={user} action={<button type="button" onClick={() => setReassignments((current) => ({ ...current, [user.id]: systemRoles.find((candidate) => candidate.id !== role.id)?.id || "" }))} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-caption font-semibold text-app-danger-text transition-colors hover:bg-app-danger-surface"><UserMinus className="h-3.5 w-3.5" />Remove</button>} />) : <p className="rounded-lg border border-dashed border-app-border p-3 text-caption text-app-muted">No users assigned.</p>}</div>
              </div>
              {Object.entries(reassignments).length > 0 && <div className="rounded-lg border border-app-warning-text/30 bg-app-warning-surface p-3"><p className="text-caption font-semibold text-app-warning-text">Move removed users to</p><div className="mt-2 space-y-2">{Object.entries(reassignments).map(([userId, targetRoleId]) => { const user = members.find((item) => item.id === userId); return user ? <div key={userId} className="flex items-center gap-2"><span className="min-w-0 flex-1 truncate text-caption text-app-text">{memberName(user)}</span><select aria-label={`Replacement role for ${memberName(user)}`} value={targetRoleId} onChange={(event) => setReassignments((current) => ({ ...current, [userId]: event.target.value }))} className="max-w-32 rounded-md border border-app-border bg-app-surface px-2 py-1 text-caption text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text">{systemRoles.filter((candidate) => candidate.id !== role.id).map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.name}</option>)}</select><button type="button" onClick={() => setReassignments((current) => { const next = { ...current }; delete next[userId]; return next; })} className="text-caption text-app-muted hover:text-app-text">Undo</button></div> : null; })}</div></div>}
              <div><span className="mb-2 block text-caption font-semibold uppercase tracking-headline text-app-muted">Add users</span><div className="space-y-2">{visibleAvailableUsers.slice(0, 8).map((user) => <MemberRow key={user.id} user={user} action={<button type="button" onClick={() => { setAddedUserIds((current) => [...current, user.id]); setAvailableUsers((current) => current.filter((item) => item.id !== user.id)); setMembers((current) => [...current, user]); }} className="inline-flex items-center gap-1 rounded-md bg-app-accent-surface px-2 py-1 text-caption font-semibold text-app-accent-text transition-colors hover:brightness-95"><UserPlus className="h-3.5 w-3.5" />Add</button>} />)}</div></div>
            </div>}
          </section>
        )}
        <div className="rounded-xl border border-app-border bg-app-surface-alt/50 p-3 sm:p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-app-accent-surface text-app-accent-text">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <FieldLabel className="mb-0">Capabilities</FieldLabel>
                <p className="mt-0.5 text-caption text-app-muted">Choose the access this role can grant.</p>
              </div>
            </div>
            <Badge tone={selectedPermIds.length > 0 ? "accent" : "neutral"} variant={selectedPermIds.length > 0 ? "filled" : "subtle"}>
              {selectedPermIds.length} selected
            </Badge>
          </div>

          {loadingPerms ? (
            <SkeletonRegion label="Loading permission catalogue…">
              <PermissionSkeleton />
            </SkeletonRegion>
          ) : (
            <div className="space-y-3">
              {Object.entries(groupedPermissions).sort(([left], [right]) => (RESOURCE_META[left]?.order ?? 99) - (RESOURCE_META[right]?.order ?? 99)).map(([resource, perms]) => {
                const allSelected = perms.every((p) => selectedPermIds.includes(p.id));
                const selectedInGroup = perms.filter((p) => selectedPermIds.includes(p.id)).length;
                return (
                  <div
                    key={resource}
                    className={`rounded-xl border p-3.5 transition-[border-color,box-shadow,background-color] duration-200 sm:p-4 ${
                      selectedInGroup > 0
                        ? "border-app-accent-text/50 bg-app-surface shadow-sm"
                        : "border-app-border bg-app-surface hover:border-app-border-strong"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <h4 className="font-heading text-body font-semibold tracking-headline text-app-text">
                          {RESOURCE_META[resource]?.label ?? resource.replaceAll("_", " ")}
                        </h4>
                        <span className="text-caption text-app-muted">
                          {selectedInGroup}/{perms.length}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleResourceGroup(resource)}
                        className={`shrink-0 ${
                          allSelected
                            ? "bg-app-accent-surface text-app-accent-text hover:bg-app-accent-surface"
                            : "hover:bg-app-surface-alt"
                        }`}
                      >
                        {allSelected && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                        {allSelected ? "All selected" : "Select all"}
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {perms.map((perm) => {
                        const isChecked = selectedPermIds.includes(perm.id);
                        return (
                          <label
                            key={perm.id}
                            className={`group flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-[border-color,background-color,box-shadow,transform] duration-200 ${
                              isChecked
                                ? "border-app-accent-text bg-app-accent-surface shadow-sm"
                                : "border-app-border bg-app-surface hover:-translate-y-px hover:border-app-border-strong hover:bg-app-surface-alt hover:shadow-sm"
                            }`}
                          >
                            <Checkbox
                              checked={isChecked}
                              onChange={() => togglePermission(perm.id)}
                              className="mt-0.5 shrink-0 transition-transform group-hover:scale-105"
                            />
                            <span className="min-w-0">
                              <span className="flex items-center gap-1.5 text-body font-semibold text-app-text">
                                {perm.name}
                                {isChecked && <CheckCircle2 className="h-3.5 w-3.5 text-app-accent-text" aria-label="Selected" />}
                              </span>
                              {perm.description && (
                                <span className="mt-0.5 block text-caption leading-relaxed text-app-muted">
                                  {perm.description}
                                </span>
                              )}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        </div>
      </form>
    </Modal>
  );
}

const RESOURCE_META: Record<string, { label: string; order: number }> = {
  overview: { label: "Overview", order: 1 }, tenants: { label: "Tenants", order: 2 }, billing: { label: "Billing & Revenue", order: 3 }, analytics: { label: "Platform Analytics", order: 4 }, devices: { label: "Devices", order: 5 }, plans: { label: "Plans", order: 6 }, features: { label: "Features", order: 7 }, announcements: { label: "Announcements", order: 8 }, email_templates: { label: "Email Templates", order: 9 }, audit: { label: "Audit Logs", order: 10 }, health: { label: "System Health", order: 11 }, settings: { label: "Platform Settings", order: 12 }, users: { label: "Admin Users", order: 13 }, roles: { label: "Platform Roles", order: 14 },
};

interface Member { id: string; firstName?: string | null; lastName?: string | null; email: string; status: string; }
interface MemberRole { id: string; name: string; isSystem: boolean; }
function memberName(user: Member) { return `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email; }
function MemberRow({ user, action }: { user: Member; action: React.ReactNode }) { return <div className="flex items-center gap-2 rounded-lg border border-app-border bg-app-surface p-2.5"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-app-surface-alt text-caption font-semibold text-app-muted">{memberName(user).slice(0, 1).toUpperCase()}</span><span className="min-w-0 flex-1"><span className="block truncate text-caption font-semibold text-app-text">{memberName(user)}</span><span className="block truncate text-caption text-app-muted">{user.email}</span></span>{action}</div>; }
