import React from "react";
import { Sliders, CloudUpload } from "lucide-react";
import PlanCards from "@/components/admin/plans/plan-cards";
import FeatureFlags from "@/components/admin/plans/feature-flags";
import AdminUsers from "@/components/admin/plans/admin-users";

export default function PlansFeatureFlagsPage() {
  return (
    <div className="py-6 px-15 space-y-6 mx-auto font-sans ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Plans & Feature Flags
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Configure pricing, limits, and feature rollout across all tenant plans.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <button className="flex items-center gap-1.5 border border-zinc-200 dark:border-zinc-800 bg-white hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 px-3.5 py-1.5 rounded-lg font-semibold text-zinc-705 dark:text-zinc-300 transition-colors shadow-sm cursor-pointer">
            <Sliders className="w-3.5 h-3.5 text-zinc-450" />
            <span>Review Changes</span>
          </button>
          <button className="flex items-center gap-1.5 bg-zinc-950 dark:bg-zinc-800 text-white dark:text-zinc-300 hover:opacity-90 px-3.5 py-1.5 rounded-lg font-semibold transition-opacity shadow-sm cursor-pointer">
            <CloudUpload className="w-3.5 h-3.5" />
            <span>Publish Changes</span>
          </button>
        </div>
      </div>

      {/* 1. Plan comparison cards */}
      <PlanCards />

      {/* 2. Global feature flags table */}
      <FeatureFlags />

      {/* 3. Admin Users table list */}
      <AdminUsers />
    </div>
  );
}
