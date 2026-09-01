"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AlertCircle, Check, Loader2, Pencil, PhoneCall, Star } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  FieldLabel,
  Modal,
  Skeleton,
  SkeletonRegion,
  Switch,
  TextInput,
} from "@/components/ui";

export interface PlanFeatureRef {
  id: string;
  key: string;
  name: string;
}

export interface AdminPlan {
  id: string;
  name: string;
  description: string | null;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  maxDevices: number | null;
  maxStorageGb: number | null;
  maxUsers: number | null;
  maxRules: number | null;
  analyticsRetentionDays: number | null;
  isDefault: boolean;
  sortOrder: number;
  features: PlanFeatureRef[];
  subscriberCount: number;
}

const money = (paise: number, currency: string) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(
    paise,
  );

/** Null is unlimited everywhere in this system — never a -1 sentinel. */
const quota = (value: number | null, suffix = "") =>
  value === null ? "Unlimited" : `${value}${suffix}`;

const retention = (days: number | null) => {
  if (days === null) return "Unlimited";
  if (days % 365 === 0) return `${days / 365}yr`;
  return `${days}d`;
};

function PlanSkeletons() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} size="widget" padded>
          <Skeleton className="h-3 w-16" />
          <Skeleton className="mt-3 h-7 w-28" />
          <Skeleton className="mt-4 h-7 w-full rounded-lg" />
          <div className="mt-5 space-y-2">
            {Array.from({ length: 5 }).map((_, row) => (
              <Skeleton key={row} className="h-3 w-full" />
            ))}
          </div>
          <div className="mt-5 space-y-3">
            {Array.from({ length: 5 }).map((_, row) => (
              <Skeleton key={row} className="h-4 w-full" />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function PlanCards({ onNotice }: { onNotice?: (message: string) => void }) {
  const [plans, setPlans] = useState<AdminPlan[]>([]);
  const [entitlements, setEntitlements] = useState<PlanFeatureRef[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cycle, setCycle] = useState<Record<string, "monthly" | "annual">>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminPlan | null>(null);

  const load = useCallback(async () => {
    try {
      const [plansRes, featuresRes] = await Promise.all([
        fetch("/api/admin/plans", { cache: "no-store" }),
        fetch("/api/admin/features?kind=ENTITLEMENT", { cache: "no-store" }),
      ]);
      const plansJson = await plansRes.json();
      const featuresJson = await featuresRes.json();
      if (!plansRes.ok || !plansJson.success) {
        throw new Error(plansJson.message || "Unable to load plans.");
      }
      setPlans(plansJson.data || []);
      if (featuresRes.ok && featuresJson.success) setEntitlements(featuresJson.data || []);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load plans.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // The state updates happen after the asynchronous API request resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  /**
   * Autosave per toggle rather than a staged diff behind a publish button
   * (decision D3): staging needs a draft store, and this page has two admin
   * writers. The card shows a spinner on the row being written.
   */
  const toggleEntitlement = async (plan: AdminPlan, feature: PlanFeatureRef) => {
    const has = plan.features.some((f) => f.id === feature.id);
    const featureIds = has
      ? plan.features.filter((f) => f.id !== feature.id).map((f) => f.id)
      : [...plan.features.map((f) => f.id), feature.id];

    setSavingKey(`${plan.id}:${feature.id}`);
    // Optimistic: the toggle is the only thing that moves, and a failure
    // reloads the truth below.
    setPlans((current) =>
      current.map((p) =>
        p.id === plan.id
          ? { ...p, features: entitlements.filter((f) => featureIds.includes(f.id)) }
          : p,
      ),
    );

    try {
      const response = await fetch(`/api/admin/plans/${plan.id}/features`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featureIds }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Save failed.");
      onNotice?.(`${feature.name} ${has ? "removed from" : "added to"} ${plan.name}.`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Save failed.");
      await load();
    } finally {
      setSavingKey(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-body font-bold text-app-text">Plan Comparison</h2>
        <SkeletonRegion label="Loading plans…">
          <PlanSkeletons />
        </SkeletonRegion>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-body font-bold text-app-text">Plan Comparison</h2>
        <span className="text-caption text-app-muted">Prices in INR · GST exclusive</span>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-app-danger-border bg-app-danger-surface p-3 text-body text-app-danger-text">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
          const isCustom = plan.maxDevices === null;
          const shown = (cycle[plan.id] ?? "monthly") === "annual" ? plan.priceYearly : plan.priceMonthly;

          return (
            <Card key={plan.id} size="widget" padded className="relative flex flex-col">
              {plan.isDefault && (
                <span className="absolute -top-2.5 right-4">
                  <Badge tone="accent">
                    <Star className="h-3 w-3" /> Default
                  </Badge>
                </span>
              )}

              <div className="flex items-start justify-between gap-2">
                <h3 className="text-caption font-bold uppercase tracking-headline text-app-muted">
                  {plan.name}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditing(plan)}
                  aria-label={`Edit ${plan.name}`}
                  className="cursor-pointer rounded p-0.5 text-app-muted transition-colors hover:text-app-text"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="mt-2.5 flex items-baseline gap-1">
                <span className="font-heading text-h4 font-semibold tracking-headline text-app-text">
                  {isCustom && plan.priceMonthly === 0 ? "Custom" : money(shown, plan.currency)}
                </span>
                {!(isCustom && plan.priceMonthly === 0) && (
                  <span className="text-caption text-app-muted">
                    /{(cycle[plan.id] ?? "monthly") === "annual" ? "yr" : "mo"}
                  </span>
                )}
              </div>

              {isCustom && plan.priceMonthly === 0 ? (
                <Button variant="secondary" size="sm" icon={PhoneCall} className="mt-3.5 w-full">
                  Contact Sales
                </Button>
              ) : (
                <div className="mt-3.5 flex select-none rounded-lg bg-app-surface-alt p-0.5 text-caption font-semibold">
                  {(["monthly", "annual"] as const).map((option) => (
                    <button
                      key={option}
                      onClick={() => setCycle((c) => ({ ...c, [plan.id]: option }))}
                      className={`flex-1 cursor-pointer rounded-md py-1 capitalize transition-all ${
                        (cycle[plan.id] ?? "monthly") === option
                          ? "bg-app-surface text-app-text shadow-xs"
                          : "text-app-muted hover:text-app-text"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              <dl className="mt-5 space-y-2 text-caption">
                {[
                  ["Screens", quota(plan.maxDevices)],
                  ["Storage", quota(plan.maxStorageGb, " GB")],
                  ["Seats", quota(plan.maxUsers)],
                  ["Sensor rules", quota(plan.maxRules)],
                  ["Analytics retention", retention(plan.analyticsRetentionDays)],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-2">
                    <dt className="text-app-muted">{label}</dt>
                    <dd className="font-semibold text-app-text">{value}</dd>
                  </div>
                ))}
              </dl>

              <hr className="my-4 border-app-border" />

              <div className="flex-1 space-y-3">
                {entitlements.map((feature) => {
                  const key = `${plan.id}:${feature.id}`;
                  return (
                    <div key={feature.id} className="flex items-center justify-between gap-2">
                      <span className="text-caption text-app-muted">{feature.name}</span>
                      {savingKey === key ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-app-muted" />
                      ) : (
                        <Switch
                          checked={plan.features.some((f) => f.id === feature.id)}
                          onChange={() => void toggleEntitlement(plan, feature)}
                          label={`${feature.name} on ${plan.name}`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {plan.subscriberCount > 0 && (
                <p className="mt-4 text-caption text-app-muted">
                  {plan.subscriberCount} subscriber{plan.subscriberCount === 1 ? "" : "s"}
                </p>
              )}
            </Card>
          );
        })}
      </div>

      {editing && (
        <PlanEditModal
          plan={editing}
          onClose={() => setEditing(null)}
          onSaved={(message) => {
            setEditing(null);
            onNotice?.(message);
            void load();
          }}
        />
      )}
    </div>
  );
}

const QUOTA_FIELDS = [
  ["maxDevices", "Screens"],
  ["maxStorageGb", "Storage (GB)"],
  ["maxUsers", "Seats"],
  ["maxRules", "Sensor rules"],
  ["analyticsRetentionDays", "Analytics retention (days)"],
] as const;

function PlanEditModal({
  plan,
  onClose,
  onSaved,
}: {
  plan: AdminPlan;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [form, setForm] = useState({
    name: plan.name,
    description: plan.description ?? "",
    priceMonthly: String(plan.priceMonthly),
    priceYearly: String(plan.priceYearly),
    maxDevices: plan.maxDevices === null ? "" : String(plan.maxDevices),
    maxStorageGb: plan.maxStorageGb === null ? "" : String(plan.maxStorageGb),
    maxUsers: plan.maxUsers === null ? "" : String(plan.maxUsers),
    maxRules: plan.maxRules === null ? "" : String(plan.maxRules),
    analyticsRetentionDays:
      plan.analyticsRetentionDays === null ? "" : String(plan.analyticsRetentionDays),
    isDefault: plan.isDefault,
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const update = (key: keyof typeof form, value: string | boolean) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setErrors([]);
    try {
      const response = await fetch(`/api/admin/plans/${plan.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sortOrder: plan.sortOrder }),
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
      size="lg"
      title={`Edit ${plan.name}`}
      description="Leave a quota empty for unlimited."
      className="border-t-4 border-t-app-accent"
      footer={
        <>
          <Button type="button" variant="secondary" disabled={saving} onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="plan-form" variant="primary" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {saving ? "Saving…" : "Save plan"}
          </Button>
        </>
      }
    >
      <form id="plan-form" onSubmit={submit} className="space-y-4">
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="plan-name">Name</FieldLabel>
            <TextInput
              id="plan-name"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel htmlFor="plan-description">Description</FieldLabel>
            <TextInput
              id="plan-description"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel htmlFor="plan-monthly">Monthly price</FieldLabel>
            <TextInput
              id="plan-monthly"
              inputMode="numeric"
              value={form.priceMonthly}
              onChange={(e) => update("priceMonthly", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel htmlFor="plan-yearly">Yearly price</FieldLabel>
            <TextInput
              id="plan-yearly"
              inputMode="numeric"
              value={form.priceYearly}
              onChange={(e) => update("priceYearly", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {QUOTA_FIELDS.map(([key, label]) => (
            <div key={key}>
              <FieldLabel htmlFor={`plan-${key}`}>{label}</FieldLabel>
              <TextInput
                id={`plan-${key}`}
                inputMode="numeric"
                placeholder="Unlimited"
                value={form[key]}
                onChange={(e) => update(key, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-app-border bg-app-surface-alt p-3">
          <Switch
            checked={form.isDefault}
            onChange={(next) => update("isDefault", next)}
            label="Default plan"
            description="Workspaces with no subscription resolve to this plan. Exactly one plan carries it."
          />
        </div>
      </form>
    </Modal>
  );
}
