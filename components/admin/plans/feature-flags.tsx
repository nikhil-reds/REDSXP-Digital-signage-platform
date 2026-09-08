"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AlertCircle, Check, Loader2, Pencil, Plus } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Drawer,
  EmptyState,
  FieldLabel,
  Modal,
  Select,
  Skeleton,
  SkeletonRegion,
  Switch,
  TextInput,
} from "@/components/ui";

interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string | null;
  kind: "ENTITLEMENT" | "FLAG";
  enabled: boolean | null;
  rolloutPct: number | null;
  overrideCount: number;
}

interface Override {
  enabled: boolean;
  note: string | null;
  updatedAt: string;
  tenant: { id: string; name: string; slug: string };
}

const COLUMNS = ["Flag Name", "Description", "Status", "Rollout %", "Tenant Overrides", "Actions"];

export default function FeatureFlags({ onNotice }: { onNotice?: (message: string) => void }) {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<FeatureFlag | null>(null);
  const [creating, setCreating] = useState(false);
  const [overridesFor, setOverridesFor] = useState<FeatureFlag | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/features?kind=FLAG", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load feature flags.");
      }
      setFlags(result.data || []);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load feature flags.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // The state updates happen after the asynchronous API request resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const save = async (flag: FeatureFlag, patch: Partial<FeatureFlag>, message: string) => {
    setBusyId(flag.id);
    try {
      const response = await fetch(`/api/admin/features/${flag.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...flag, ...patch }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Save failed.");
      setFlags((current) => current.map((f) => (f.id === flag.id ? { ...f, ...patch } : f)));
      onNotice?.(message);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Save failed.");
      await load();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-body font-bold text-app-text">Global Feature Flags</h2>
        <Button size="sm" variant="secondary" icon={Plus} onClick={() => setCreating(true)}>
          New flag
        </Button>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-app-danger-border bg-app-danger-surface p-3 text-body text-app-danger-text">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Card size="panel" className="overflow-hidden">
        {isLoading ? (
          <SkeletonRegion label="Loading feature flags…">
            <div className="space-y-3 p-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-9 w-full" />
              ))}
            </div>
          </SkeletonRegion>
        ) : flags.length === 0 ? (
          <EmptyState
            title="No feature flags"
            description="Flags are temporary switches for work in progress. Entitlements live on plans above."
            action={
              <Button variant="primary" icon={Plus} onClick={() => setCreating(true)}>
                New flag
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left text-caption">
              <thead>
                <tr className="select-none border-b border-app-border bg-app-surface-alt font-bold text-app-muted">
                  {COLUMNS.map((column) => (
                    <th
                      key={column}
                      className={`p-3.5 ${column === "Actions" || column === "Tenant Overrides" ? "text-center" : ""}`}
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border">
                {flags.map((flag) => (
                  <tr key={flag.id} className="transition-colors hover:bg-app-surface-alt">
                    <td className="p-3.5 font-mono text-caption font-semibold text-app-text">
                      {flag.key}
                    </td>
                    <td className="p-3.5 text-app-muted">{flag.description || "—"}</td>
                    <td className="p-3.5">
                      {busyId === flag.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-app-muted" />
                      ) : (
                        <Switch
                          checked={flag.enabled === true}
                          onChange={(next) =>
                            void save(
                              flag,
                              { enabled: next },
                              `${flag.name} turned ${next ? "on" : "off"} globally.`,
                            )
                          }
                          label={`${flag.name} global switch`}
                        />
                      )}
                    </td>
                    <td className="w-44 p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-app-surface-alt">
                          <div
                            className="h-full rounded-full bg-app-accent"
                            style={{ width: `${flag.rolloutPct ?? 0}%` }}
                          />
                        </div>
                        <span className="shrink-0 font-mono text-caption font-bold text-app-text">
                          {flag.rolloutPct ?? 0}%
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => setOverridesFor(flag)}
                        className="cursor-pointer"
                      >
                        {flag.overrideCount > 0 ? (
                          <Badge tone="accent">{flag.overrideCount} overrides</Badge>
                        ) : (
                          <span className="text-app-muted underline decoration-dotted underline-offset-2">
                            none
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center justify-center">
                        <Button size="sm" variant="secondary" icon={Pencil} onClick={() => setEditing(flag)}>
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {(editing || creating) && (
        <FlagModal
          flag={editing}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSaved={(message) => {
            setEditing(null);
            setCreating(false);
            onNotice?.(message);
            void load();
          }}
        />
      )}

      {overridesFor && (
        <OverridesDrawer
          flag={overridesFor}
          onClose={() => setOverridesFor(null)}
          onChanged={(message) => {
            onNotice?.(message);
            void load();
          }}
        />
      )}
    </div>
  );
}

function FlagModal({
  flag,
  onClose,
  onSaved,
}: {
  flag: FeatureFlag | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [form, setForm] = useState({
    key: flag?.key ?? "",
    name: flag?.name ?? "",
    description: flag?.description ?? "",
    kind: flag?.kind ?? "FLAG",
    enabled: flag?.enabled ?? true,
    rolloutPct: String(flag?.rolloutPct ?? 100),
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setErrors([]);
    try {
      const response = await fetch(flag ? `/api/admin/features/${flag.id}` : "/api/admin/features", {
        method: flag ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setErrors(result.errors?.length ? result.errors : [result.message || "Save failed."]);
        return;
      }
      onSaved(result.message);
    } catch {
      setErrors(["Save failed. Please try again."]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      onClose={() => {
        if (!saving) onClose();
      }}
      title={flag ? `Edit ${flag.name}` : "New feature"}
      description="Entitlements are sold on plans. Flags are temporary and carry a rollout."
      className="border-t-4 border-t-app-accent"
      footer={
        <>
          <Button type="button" variant="secondary" disabled={saving} onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="flag-form" variant="primary" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {saving ? "Saving…" : "Save"}
          </Button>
        </>
      }
    >
      <form id="flag-form" onSubmit={submit} className="space-y-4">
        {errors.length > 0 && (
          <div className="rounded-lg border border-app-danger-border bg-app-danger-surface p-3 text-body text-app-danger-text">
            {errors.map((message) => (
              <p key={message} className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {message}
              </p>
            ))}
          </div>
        )}

        <div>
          <FieldLabel htmlFor="flag-key">Key</FieldLabel>
          <TextInput
            id="flag-key"
            required
            value={form.key}
            placeholder="proof_of_play_export"
            onChange={(e) => setForm((f) => ({ ...f, key: e.target.value }))}
            className="font-mono"
          />
          <p className="mt-1.5 text-caption text-app-muted">
            snake_case. This is the string code checks, so it does not change lightly.
          </p>
        </div>

        <div>
          <FieldLabel htmlFor="flag-name">Name</FieldLabel>
          <TextInput
            id="flag-name"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>

        <div>
          <FieldLabel htmlFor="flag-description">Description</FieldLabel>
          <TextInput
            id="flag-description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="flag-kind">Kind</FieldLabel>
            <Select
              id="flag-kind"
              value={form.kind}
              onChange={(e) =>
                setForm((f) => ({ ...f, kind: e.target.value as "ENTITLEMENT" | "FLAG" }))
              }
            >
              <option value="FLAG">Flag — rollout, deleted when shipped</option>
              <option value="ENTITLEMENT">Entitlement — sold on plans</option>
            </Select>
          </div>
          {form.kind === "FLAG" && (
            <div>
              <FieldLabel htmlFor="flag-rollout">Rollout %</FieldLabel>
              <TextInput
                id="flag-rollout"
                inputMode="numeric"
                value={form.rolloutPct}
                onChange={(e) => setForm((f) => ({ ...f, rolloutPct: e.target.value }))}
              />
            </div>
          )}
        </div>

        {form.kind === "FLAG" && (
          <div className="rounded-lg border border-app-border bg-app-surface-alt p-3">
            <Switch
              checked={form.enabled}
              onChange={(next) => setForm((f) => ({ ...f, enabled: next }))}
              label="Globally enabled"
              description="The kill switch. Off beats every plan and every tenant override."
            />
          </div>
        )}
      </form>
    </Modal>
  );
}

function OverridesDrawer({
  flag,
  onClose,
  onChanged,
}: {
  flag: FeatureFlag;
  onClose: () => void;
  onChanged: (message: string) => void;
}) {
  const [overrides, setOverrides] = useState<Override[]>([]);
  const [tenants, setTenants] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [tenantId, setTenantId] = useState("");
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    const response = await fetch(`/api/admin/features/${flag.id}/overrides`, { cache: "no-store" });
    const result = await response.json();
    if (response.ok && result.success) {
      setOverrides(result.data.overrides || []);
      setTenants(result.data.tenants || []);
    }
    setIsLoading(false);
  }, [flag.id]);

  useEffect(() => {
    // The state updates happen after the asynchronous API request resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const write = async (targetId: string, enabled: boolean | null, message: string) => {
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/features/${flag.id}/overrides`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId: targetId, enabled, note: note || null }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        onChanged(result.message || message);
        setNote("");
        setTenantId("");
        await load();
      }
    } finally {
      setBusy(false);
    }
  };

  const withoutOverride = tenants.filter(
    (tenant) => !overrides.some((o) => o.tenant.id === tenant.id),
  );

  return (
    <Drawer open onClose={onClose} title={`${flag.name} — tenant overrides`}>
      <div className="space-y-5">
        <p className="text-body text-app-muted">
          An override wins over the rollout and the plan, but never over the global kill switch.
          Clearing one returns the workspace to following its plan.
        </p>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : overrides.length === 0 ? (
          <p className="rounded-lg border border-app-border bg-app-surface-alt p-3 text-body text-app-muted">
            No overrides. Every workspace follows the rollout.
          </p>
        ) : (
          <ul className="space-y-2">
            {overrides.map((override) => (
              <li
                key={override.tenant.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-app-border p-3"
              >
                <div className="min-w-0">
                  <p className="text-body font-semibold text-app-text">{override.tenant.name}</p>
                  <p className="text-caption text-app-muted">{override.tenant.slug}</p>
                  {override.note && (
                    <p className="mt-1 text-caption italic text-app-muted">“{override.note}”</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge tone={override.enabled ? "accent" : "danger"}>
                    forced {override.enabled ? "on" : "off"}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={busy}
                    onClick={() =>
                      void write(override.tenant.id, null, "Override cleared.")
                    }
                  >
                    Clear
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {withoutOverride.length > 0 && (
          <div className="space-y-3 rounded-lg border border-app-border bg-app-surface-alt p-3">
            <FieldLabel htmlFor="override-tenant">Add an override</FieldLabel>
            <Select
              id="override-tenant"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
            >
              <option value="">Choose a workspace…</option>
              {withoutOverride.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </option>
              ))}
            </Select>
            <TextInput
              placeholder="Why — the next person reading this will want to know"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="primary"
                disabled={!tenantId || busy}
                onClick={() => void write(tenantId, true, "Override added.")}
              >
                Force on
              </Button>
              <Button
                size="sm"
                variant="secondary"
                disabled={!tenantId || busy}
                onClick={() => void write(tenantId, false, "Override added.")}
              >
                Force off
              </Button>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
