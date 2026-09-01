"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Check, Layers } from "lucide-react";

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

/**
 * Shared create/edit form for a Role: name, description, and a permission checkbox
 * matrix grouped by resource with a per-group "select all" toggle. Used both from the
 * dedicated role management pages (/admin/roles, /agent/roles) and inline from the
 * "Add Admin" flow on /admin/users, so there is exactly one implementation of the
 * permission picker rather than a copy embedded in each caller.
 */
export function RoleFormModal({ role, rolesEndpoint, permissionsScope, title, onClose, onSaved }: RoleFormModalProps) {
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [loadingPerms, setLoadingPerms] = useState(true);
  const [roleName, setRoleName] = useState(role?.name || "");
  const [roleDesc, setRoleDesc] = useState(role?.description || "");
  const [selectedPermIds, setSelectedPermIds] = useState<string[]>(role?.permissions.map((p) => p.id) || []);
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
    setSelectedPermIds((prev) => (prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]));
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
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-600" />
            {title || (role ? `Edit Role: ${role.name}` : "Create Custom Role")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-semibold"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Role Name *
              </label>
              <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="e.g. Billing Support Admin"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Description
              </label>
              <input
                type="text"
                value={roleDesc}
                onChange={(e) => setRoleDesc(e.target.value)}
                placeholder="Brief summary of duties and permissions"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              Assign Capabilities ({selectedPermIds.length} Selected)
            </label>

            {loadingPerms ? (
              <div className="flex items-center justify-center p-8 text-slate-500 text-sm">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mr-3" />
                Loading permission catalogue...
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedPermissions).map(([resource, perms]) => {
                  const allSelected = perms.every((p) => selectedPermIds.includes(p.id));
                  return (
                    <div
                      key={resource}
                      className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm capitalize text-slate-900 dark:text-white">
                          {resource} Management
                        </h4>
                        <button
                          type="button"
                          onClick={() => toggleResourceGroup(resource)}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          {allSelected ? "Deselect All" : "Select All"}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {perms.map((perm) => {
                          const isChecked = selectedPermIds.includes(perm.id);
                          return (
                            <label
                              key={perm.id}
                              className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                                isChecked
                                  ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-100"
                                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => togglePermission(perm.id)}
                                className="mt-0.5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
                              />
                              <div>
                                <div className="font-medium">{perm.name}</div>
                                {perm.description && (
                                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                    {perm.description}
                                  </div>
                                )}
                              </div>
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

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || loadingPerms}
              className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? "Saving..." : (
                <>
                  <Check className="h-4 w-4" /> Save Role
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
