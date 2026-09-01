"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Edit2,
  KeyRound,
  Lock,
  Plus,
  Shield,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  EmptyState,
  PageShell,
  Skeleton,
  SkeletonRegion,
  SkeletonStatGrid,
  StatGrid,
  StatTile,
} from "@/components/ui";
import { RoleFormModal, type RoleFormRole } from "./role-form-modal";

interface Role extends RoleFormRole {
  _count?: { users: number };
}

/**
 * Mirrors the real card — name row, description, two chips, footer actions —
 * so nothing shifts when the data lands.
 */
function RoleSkeletonCards({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} size="widget">
          <CardBody size="widget">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-2 h-3 w-full" />
            <Skeleton className="mt-1.5 h-3 w-2/3" />
            <div className="mt-4 flex flex-wrap gap-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-28 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </CardBody>
          <CardFooter size="widget" className="justify-end">
            <Skeleton className="h-7 w-16 rounded-lg" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export function AdminRoleManager() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadRoles = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/roles", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load platform roles.");
      }
      setRoles(result.data || []);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load platform roles.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // The state updates happen after the asynchronous API request resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadRoles();
  }, [loadRoles]);

  const openCreate = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const openEdit = (role: Role) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const deleteRole = async (role: Role) => {
    if (!window.confirm(`Delete the custom role “${role.name}”? This cannot be undone.`)) return;

    setDeletingId(role.id);
    setNotice(null);
    try {
      const response = await fetch(`/api/admin/roles/${role.id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to delete this role.");
      }
      setNotice(`Role “${role.name}” was deleted.`);
      await loadRoles();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete this role.");
    } finally {
      setDeletingId(null);
    }
  };

  // A skeleton is for the first load only; a refetch leaves the cards in place.
  const isFirstLoad = isLoading && roles.length === 0;
  const systemRoles = roles.filter((role) => role.isSystem).length;
  const assignedUsers = roles.reduce((total, role) => total + (role._count?.users || 0), 0);

  return (
    <PageShell className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Shield className="h-5 w-5 text-app-accent-text" />
            <h1 className="text-page-title font-bold text-app-text">Platform Roles</h1>
          </div>
          <p className="text-body text-app-muted">
            Manage administrator roles and the platform capabilities each one grants in the admin
            portal.
          </p>
        </div>
        <Button onClick={openCreate} variant="primary" icon={Plus} className="self-start sm:self-auto">
          Create role
        </Button>
      </div>

      {notice && (
        <div className="flex items-center justify-between rounded-xl border border-app-accent-border bg-app-accent-surface px-4 py-3 text-body text-app-accent-text">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {notice}
          </span>
          <button onClick={() => setNotice(null)} aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {isFirstLoad ? (
        <SkeletonStatGrid columns={3} label="Loading role counts…" />
      ) : (
        <StatGrid columns={3}>
          <StatTile label="Total roles" value={roles.length} icon={Shield} />
          <StatTile label="System protected" value={systemRoles} icon={Lock} />
          <StatTile label="Users assigned" value={assignedUsers} icon={Users} />
        </StatGrid>
      )}

      {error ? (
        <Card size="panel">
          <CardBody className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
            <AlertCircle className="h-8 w-8 text-app-danger-text" />
            <div>
              <p className="font-semibold text-app-text">Platform roles could not be loaded</p>
              <p className="mt-1 text-body text-app-muted">{error}</p>
            </div>
            <Button
              variant="primary"
              onClick={() => {
                setIsLoading(true);
                void loadRoles();
              }}
            >
              Try again
            </Button>
          </CardBody>
        </Card>
      ) : isFirstLoad ? (
        <SkeletonRegion label="Loading platform administrator roles…">
          <RoleSkeletonCards />
        </SkeletonRegion>
      ) : roles.length === 0 ? (
        <Card size="panel">
          <EmptyState
            icon={ShieldCheck}
            title="No platform roles yet"
            description="Create a role to start granting fine-grained access to the admin portal."
            action={
              <Button variant="primary" icon={Plus} onClick={openCreate}>
                Create role
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <Card key={role.id} size="widget" className="flex flex-col">
              <CardBody size="widget" className="flex-1">
                {/* Role names are identifiers with no natural break point, so
                    they get the full card width — sharing a row with a badge
                    either clips SUPER_ADMIN to SUPER_… or splits it mid-word.
                    The System badge joins the chip row below instead. */}
                <h3 className="font-heading text-h6 font-semibold tracking-headline text-app-text">
                  {role.name}
                </h3>
                <p className="mt-1 text-body text-app-muted">
                  {role.description || "No description provided."}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {role.isSystem && (
                    <Badge tone="warning">
                      <Lock className="h-3 w-3" /> System
                    </Badge>
                  )}
                  <Badge>
                    <KeyRound className="h-3 w-3" />
                    {role.permissions.length} permission{role.permissions.length === 1 ? "" : "s"}
                  </Badge>
                  <Badge>
                    <Users className="h-3 w-3" />
                    {role._count?.users || 0} user{(role._count?.users || 0) === 1 ? "" : "s"}
                  </Badge>
                </div>
              </CardBody>

              <CardFooter size="widget" className="justify-end">
                <Button
                  size="sm"
                  variant="ghost"
                  icon={Edit2}
                  onClick={() => openEdit(role)}
                  disabled={role.isSystem}
                  title={
                    role.isSystem ? "System roles cannot be edited" : `Edit ${role.name}`
                  }
                >
                  Edit
                </Button>
                {!role.isSystem && (
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={Trash2}
                    onClick={() => void deleteRole(role)}
                    disabled={deletingId === role.id}
                    className="text-app-danger-text hover:bg-app-danger-surface"
                  >
                    {deletingId === role.id ? "Deleting…" : "Delete"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {isModalOpen && (
        <RoleFormModal
          role={editingRole}
          rolesEndpoint="/api/admin/roles"
          permissionsScope="SYSTEM"
          title={editingRole ? `Edit role: ${editingRole.name}` : "Create platform role"}
          onClose={() => setIsModalOpen(false)}
          onSaved={(saved: RoleFormRole) => {
            setIsModalOpen(false);
            setNotice(
              editingRole ? `Role “${saved.name}” was updated.` : `Role “${saved.name}” was created.`,
            );
            void loadRoles();
          }}
        />
      )}
    </PageShell>
  );
}
