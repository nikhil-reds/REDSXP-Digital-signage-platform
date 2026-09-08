import React from "react";
import { PageSkeleton } from "@/components/ui";

/**
 * Route-level fallback (plan tier 1). Also overrides the dashboard-shaped
 * skeleton in `admin/loading.tsx`, which would otherwise cascade down here.
 */
export default function Loading() {
  return <PageSkeleton variant="table" label="Loading devices…" />;
}
