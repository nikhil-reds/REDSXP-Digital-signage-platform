"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Check, Loader2 } from "lucide-react";
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

  return (
    <Modal
      open
      onClose={() => {
        if (!saving) onClose();
      }}
      size="xl"
      title={title || (role ? `Edit role: ${role.name}` : "Create role")}
      description="Pick the capabilities this role grants. Members inherit every permission you select."
      className="border-t-4 border-t-app-accent"
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
      <form id="role-form" onSubmit={handleSave} className="space-y-5">
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
            />
          </div>
          <div>
            <FieldLabel htmlFor="role-description">Description</FieldLabel>
            <TextInput
              id="role-description"
              value={roleDesc}
              onChange={(e) => setRoleDesc(e.target.value)}
              placeholder="What this role is for"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <FieldLabel className="mb-0">Capabilities</FieldLabel>
            <Badge tone={selectedPermIds.length > 0 ? "accent" : "neutral"}>
              {selectedPermIds.length} selected
            </Badge>
          </div>

          {loadingPerms ? (
            <SkeletonRegion label="Loading permission catalogue…">
              <PermissionSkeleton />
            </SkeletonRegion>
          ) : (
            <div className="space-y-3">
              {Object.entries(groupedPermissions).map(([resource, perms]) => {
                const allSelected = perms.every((p) => selectedPermIds.includes(p.id));
                return (
                  <div
                    key={resource}
                    className="rounded-xl border border-app-border bg-app-surface-alt p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <h4 className="font-heading text-body font-semibold capitalize tracking-headline text-app-text">
                        {resource}
                      </h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleResourceGroup(resource)}
                      >
                        {allSelected ? "Clear all" : "Select all"}
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {perms.map((perm) => {
                        const isChecked = selectedPermIds.includes(perm.id);
                        return (
                          <label
                            key={perm.id}
                            className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 transition-colors ${
                              isChecked
                                ? "border-app-accent-text bg-app-accent-surface"
                                : "border-app-border bg-app-surface hover:bg-app-surface-alt"
                            }`}
                          >
                            <Checkbox
                              checked={isChecked}
                              onChange={() => togglePermission(perm.id)}
                              className="mt-0.5 shrink-0"
                            />
                            <span className="min-w-0">
                              <span className="block text-body font-semibold text-app-text">
                                {perm.name}
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
      </form>
    </Modal>
  );
}
