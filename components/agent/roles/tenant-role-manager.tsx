"use client";

import { useEffect, useState } from "react";
import { Users, Plus, Edit2, Trash2, Lock, ShieldCheck } from "lucide-react";
import { RoleFormModal, type RoleFormRole } from "@/components/admin/roles/role-form-modal";

interface Role extends RoleFormRole {
  _count?: { users: number };
}

export function TenantRoleManager() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const rolesRes = await fetch("/api/agent/roles");
      if (rolesRes.ok) {
        const rolesData = await rolesRes.json();
        if (rolesData.success) setRoles(rolesData.data || []);
      }
    } catch (err) {
      console.error("Failed to load workspace custom roles", err);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreateModal() {
    setEditingRole(null);
    setIsModalOpen(true);
  }

  function handleOpenEditModal(role: Role) {
    setEditingRole(role);
    setIsModalOpen(true);
  }

  function handleSaved() {
    setIsModalOpen(false);
    fetchData();
  }

  async function handleDeleteRole(role: Role) {
    if (!confirm(`Are you sure you want to delete custom role "${role.name}"?`)) return;

    try {
      const res = await fetch(`/api/agent/roles/${role.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        alert(json.message || "Failed to delete role.");
      } else {
        fetchData();
      }
    } catch (err) {
      alert("Error deleting role.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mr-3" />
        Loading workspace custom roles...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Workspace Custom Roles & Permissions
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Define custom roles for team members in your workspace (e.g. Content Manager, Display Operator, Store Manager).
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-xs transition-colors text-sm"
        >
          <Plus className="h-4 w-4" /> Create Custom Role
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="flex flex-col justify-between bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-500/50 transition-all"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                      {role.name}
                    </h3>
                    {role.isSystem && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-md border border-blue-200/50 dark:border-blue-800/50">
                        <Lock className="h-3 w-3" /> Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {role.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md font-medium">
                  {role.permissions.length} Permissions
                </span>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md font-medium flex items-center gap-1">
                  <Users className="h-3 w-3" /> {role._count?.users || 0} Members
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEditModal(role)}
                disabled={role.isSystem}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
              >
                <Edit2 className="h-3.5 w-3.5" /> Edit
              </button>
              {!role.isSystem && (
                <button
                  onClick={() => handleDeleteRole(role)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Role Creation / Editing Modal */}
      {isModalOpen && (
        <RoleFormModal
          role={editingRole}
          rolesEndpoint="/api/agent/roles"
          permissionsScope="TENANT"
          title={editingRole ? `Edit Role: ${editingRole.name}` : "Create Custom Workspace Role"}
          onClose={() => setIsModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
