"use client";

import React, { useState } from "react";
import { CheckCircle2, Shield, Users, X } from "lucide-react";
import Link from "next/link";
import PlanCards from "@/components/admin/plans/plan-cards";
import FeatureFlags from "@/components/admin/plans/feature-flags";
import { Button, PageShell } from "@/components/ui";

export default function PlansFeatureFlagsPage() {
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <PageShell className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Shield className="h-5 w-5 text-app-accent-text" />
            <h1 className="text-page-title font-bold text-app-text">Plans &amp; Feature Flags</h1>
          </div>
          <p className="text-body text-app-muted">
            Configure pricing, limits, and feature rollout across all tenant plans. Changes save as
            you make them.
          </p>
        </div>
        {/* The old "Review Changes" / "Publish Changes" pair had no handlers and
            implied a staging step this page does not have — every write here is
            immediate (decision D3). Replaced with a link to the page that really
            does manage administrators. */}
        <Button as={Link} href="/admin/users" variant="secondary" icon={Users} className="self-start sm:self-auto">
          Admin users
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

      <PlanCards onNotice={setNotice} />
      <FeatureFlags onNotice={setNotice} />
    </PageShell>
  );
}
