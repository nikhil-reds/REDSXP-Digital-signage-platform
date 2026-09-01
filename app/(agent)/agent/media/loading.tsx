import React from "react";
import { PageSkeleton } from "@/components/ui";

/**
 * Route-level fallback (plan tier 1). Also overrides the dashboard-shaped
 * skeleton in `agent/loading.tsx`, which would otherwise cascade down here.
 */
export default function Loading() {
  return <PageSkeleton variant="grid" label="Loading media library…" />;
}
