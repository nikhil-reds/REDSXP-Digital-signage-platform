"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Edit2, KeyRound, Lock, Plus, ShieldCheck, Trash2, Users, X } from "lucide-react";
import { Badge, Button, Card, CardBody, CardFooter, EmptyState, PageShell, Skeleton, SkeletonRegion } from "@/components/ui";
import { RoleFormModal, type RoleFormRole } from "@/components/admin/roles/role-form-modal";

interface Role extends RoleFormRole { _count?: { users: number }; }

function RoleSkeletons() {
  return <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 3 }).map((_, index) => <Card key={index} size="widget"><CardBody size="widget"><Skeleton className="h-5 w-36" /><Skeleton className="mt-2 h-3 w-3/4" /><div className="mt-5 flex gap-2"><Skeleton className="h-5 w-28 rounded-full" /><Skeleton className="h-5 w-20 rounded-full" /></div></CardBody><CardFooter size="widget" className="justify-end"><Skeleton className="h-7 w-16 rounded-lg" /></CardFooter></Card>)}</div>;
}

export function TenantRoleManager() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadRoles = useCallback(async () => {
    try {
      const response = await fetch("/api/agent/roles", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to load workspace roles.");
      setRoles(result.data || []); setError(null);
    } catch (loadError) { setError(loadError instanceof Error ? loadError.message : "Unable to load workspace roles."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    // The fetch resolves asynchronously; this is initial data hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadRoles();
  }, [loadRoles]);
  const openCreate = () => { setEditingRole(null); setIsModalOpen(true); };
  const openEdit = (role: Role) => { setEditingRole(role); setIsModalOpen(true); };
  const deleteRole = async (role: Role) => {
    if (!window.confirm(`Delete the custom role “${role.name}”? This cannot be undone.`)) return;
    setDeletingId(role.id); setNotice(null);
    try {
      const response = await fetch(`/api/agent/roles/${role.id}`, { method: "DELETE" }); const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to delete role.");
      setNotice(`Role “${role.name}” was deleted.`); await loadRoles();
    } catch (deleteError) { setError(deleteError instanceof Error ? deleteError.message : "Unable to delete role."); }
    finally { setDeletingId(null); }
  };

  return <PageShell className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><div className="mb-1 flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-app-accent-text" /><h1 className="text-page-title font-bold text-app-text">Workspace Roles</h1></div><p className="text-body text-app-muted">Define the access each team role grants inside this workspace.</p></div>
      <Button variant="primary" icon={Plus} onClick={openCreate} className="self-start sm:self-auto">Create role</Button>
    </div>
    {notice && <div className="flex items-center justify-between rounded-xl border border-app-accent-text/30 bg-app-accent-surface px-4 py-3 text-body text-app-accent-text"><span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />{notice}</span><button type="button" onClick={() => setNotice(null)} aria-label="Dismiss message" className="rounded p-1 hover:bg-app-surface"><X className="h-4 w-4" /></button></div>}
    {error ? <Card size="panel"><CardBody className="flex min-h-56 flex-col items-center justify-center gap-3 text-center"><AlertCircle className="h-8 w-8 text-app-danger-text" /><div><p className="font-semibold text-app-text">Workspace roles could not be loaded</p><p className="mt-1 text-body text-app-muted">{error}</p></div><Button variant="primary" onClick={() => { setLoading(true); void loadRoles(); }}>Try again</Button></CardBody></Card> : loading ? <SkeletonRegion label="Loading workspace roles"><RoleSkeletons /></SkeletonRegion> : roles.length === 0 ? <Card size="panel"><EmptyState icon={ShieldCheck} title="No workspace roles yet" description="Create a role to give team members the right level of access." action={<Button variant="primary" icon={Plus} onClick={openCreate}>Create role</Button>} /></Card> : <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{roles.map((role) => <Card key={role.id} size="widget" className="flex min-h-52 flex-col transition-[border-color,box-shadow] hover:border-app-border-strong hover:shadow-sm"><CardBody size="widget" className="flex-1"><h3 className="font-heading text-h6 font-semibold tracking-headline text-app-text">{role.name}</h3><p className="mt-1 min-h-9 text-body text-app-muted">{role.description || "No description provided."}</p><div className="mt-5 flex flex-wrap gap-2">{role.isSystem && <Badge tone="warning"><Lock className="h-3 w-3" />Default</Badge>}<Badge><KeyRound className="h-3 w-3" />{role.permissions.length} permission{role.permissions.length === 1 ? "" : "s"}</Badge><Badge><Users className="h-3 w-3" />{role._count?.users || 0} member{(role._count?.users || 0) === 1 ? "" : "s"}</Badge></div></CardBody><CardFooter size="widget" className="justify-end"><Button size="sm" variant="ghost" icon={Edit2} disabled={role.isSystem} title={role.isSystem ? "Default roles cannot be edited" : `Edit ${role.name}`} onClick={() => openEdit(role)}>Edit</Button>{!role.isSystem && <Button size="sm" variant="ghost" icon={Trash2} disabled={deletingId === role.id} onClick={() => void deleteRole(role)} className="text-app-danger-text hover:bg-app-danger-surface">{deletingId === role.id ? "Deleting…" : "Delete"}</Button>}</CardFooter></Card>)}</div>}
    {isModalOpen && <RoleFormModal role={editingRole} rolesEndpoint="/api/agent/roles" permissionsScope="TENANT" title={editingRole ? `Edit role: ${editingRole.name}` : "Create workspace role"} onClose={() => setIsModalOpen(false)} onSaved={() => { setIsModalOpen(false); setNotice(editingRole ? "Role updated." : "Role created."); void loadRoles(); }} />}
  </PageShell>;
}
