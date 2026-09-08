import React from "react";
import { PageSkeleton } from "@/components/ui";

/**
 * Route-level fallback (plan tier 1). Renders inside the admin shell, so the
 * sidebar and navbar stay put while this segment's server work resolves.
 */
export default function Loading() {
  return <PageSkeleton variant="dashboard" label="Loading system health…" />;
}
