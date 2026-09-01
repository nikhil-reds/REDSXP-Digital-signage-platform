import React from "react";
import { Sliders, CloudUpload } from "lucide-react";
import PlanCards from "@/components/admin/plans/plan-cards";
import FeatureFlags from "@/components/admin/plans/feature-flags";
import AdminUsers from "@/components/admin/plans/admin-users";
import { Button, PageShell } from "@/components/ui";

export default function PlansFeatureFlagsPage() {
  return (
    <PageShell className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-page-title font-bold tracking-tight text-app-text">
            Plans & Feature Flags
          </h1>
          <p className="text-caption text-app-muted">
            Configure pricing, limits, and feature rollout across all tenant plans.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <Button variant="secondary">
            <Sliders className="w-3.5 h-3.5 text-zinc-450" />
            <span>Review Changes</span>
          </Button>
          <Button>
            <CloudUpload className="w-3.5 h-3.5" />
            <span>Publish Changes</span>
          </Button>
        </div>
      </div>

      {/* 1. Plan comparison cards */}
      <PlanCards />

      {/* 2. Global feature flags table */}
      <FeatureFlags />

      {/* 3. Admin Users table list */}
      <AdminUsers />
    </PageShell>
  );
}
