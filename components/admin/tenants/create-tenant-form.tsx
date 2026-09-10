"use client";

import { useState } from "react";
import { AlertCircle, Check, Copy, KeyRound, Loader2, RefreshCw, UserPlus } from "lucide-react";
import { Button, FieldLabel, Modal, Select, TextInput } from "@/components/ui";
import type { PlanOption } from "./tenants-table";

export interface CreateTenantPayload { name: string; planId: string; adminEmail: string; adminPassword: string; }
interface Props { planOptions: PlanOption[]; isSaving: boolean; error: string | null; onClose: () => void; onSave: (payload: CreateTenantPayload) => void; }

function randomPassword() {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const symbols = "!@#$%&*";
  const values = crypto.getRandomValues(new Uint32Array(14));
  return `${Array.from(values, (value) => letters[value % letters.length]).join("")}${symbols[values[0] % symbols.length]}7`;
}

export default function CreateTenantForm({ planOptions, isSaving, error, onClose, onSave }: Props) {
  const [name, setName] = useState(""); const [planId, setPlanId] = useState(""); const [adminEmail, setAdminEmail] = useState(""); const [adminPassword, setAdminPassword] = useState(""); const [copied, setCopied] = useState(false);
  const copy = async () => { if (!adminPassword) return; await navigator.clipboard.writeText(adminPassword); setCopied(true); window.setTimeout(() => setCopied(false), 1600); };
  return <Modal open onClose={() => !isSaving && onClose()} size="md" title="Create workspace admin" description="Provision a workspace and its first administrator." footer={<><Button type="button" variant="secondary" disabled={isSaving} onClick={onClose}>Cancel</Button><Button type="submit" form="create-workspace" variant="primary" disabled={isSaving}>{isSaving && <Loader2 className="h-4 w-4 animate-spin" />}{isSaving ? "Creating…" : "Create workspace"}</Button></>}>
    <form id="create-workspace" onSubmit={(event) => { event.preventDefault(); onSave({ name: name.trim(), planId, adminEmail: adminEmail.trim(), adminPassword }); }} className="space-y-6">
      {error && <div className="flex items-start gap-2 rounded-lg border border-app-danger-border bg-app-danger-surface p-3 text-body text-app-danger-text"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{error}</span></div>}
      <section className="space-y-4"><div className="flex items-center gap-2 text-body font-semibold text-app-text"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-app-accent-surface text-app-accent-text"><UserPlus className="h-4 w-4" /></span>Workspace</div><div><FieldLabel htmlFor="workspace-name">Workspace name</FieldLabel><TextInput id="workspace-name" autoFocus required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Acme Retail" className="h-11" /></div><div><FieldLabel htmlFor="workspace-plan">Plan</FieldLabel><Select id="workspace-plan" required value={planId} onChange={(event) => setPlanId(event.target.value)} className="h-11"><option value="" disabled>Select a plan</option>{planOptions.map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}</Select>{planOptions.length === 0 && <p className="mt-1.5 text-caption text-app-danger-text">Create a plan before provisioning a workspace.</p>}</div></section>
      <section className="space-y-4 border-t border-app-border pt-5"><div className="flex items-center gap-2 text-body font-semibold text-app-text"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-app-surface-alt text-app-muted"><KeyRound className="h-4 w-4" /></span>Primary admin</div><div><FieldLabel htmlFor="agent-email">Email</FieldLabel><TextInput id="agent-email" type="email" required value={adminEmail} onChange={(event) => setAdminEmail(event.target.value)} placeholder="admin@acme.com" className="h-11" /></div><div><FieldLabel htmlFor="agent-password">Temporary password</FieldLabel><div className="flex gap-2"><TextInput id="agent-password" required minLength={8} value={adminPassword} onChange={(event) => setAdminPassword(event.target.value)} placeholder="Generate a secure password" className="h-11 flex-1 font-mono" /><Button type="button" variant="secondary" onClick={() => { setAdminPassword(randomPassword()); setCopied(false); }}><RefreshCw className="h-4 w-4" />Generate</Button><Button type="button" variant="secondary" disabled={!adminPassword} onClick={() => void copy()} aria-label="Copy password">{copied ? <Check className="h-4 w-4 text-app-accent-text" /> : <Copy className="h-4 w-4" />}</Button></div><p className="mt-1.5 text-caption text-app-muted">Share it securely. The administrator should change it after signing in.</p></div></section>
    </form>
  </Modal>;
}
