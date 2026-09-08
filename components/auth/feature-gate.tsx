"use client";

import { ReactNode } from "react";
import { Lock } from "lucide-react";
import { useFeatures } from "@/hooks/use-features";

/**
 * Hides a control the workspace's plan does not include.
 *
 * This is not security. It hides UI; requireFeature() in lib/features.ts is
 * what actually refuses the request. Every gated control needs a guarded
 * endpoint behind it — see docs/plans-and-features-plan.md §5.1.
 */
export function FeatureGate({
  feature,
  requireAll = false,
  fallback = null,
  children,
}: {
  feature: string | string[];
  requireAll?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}) {
  const { hasAnyFeature, hasAllFeatures, loading } = useFeatures();

  // Render nothing rather than flashing the fallback and then the content.
  if (loading) return null;

  const keys = Array.isArray(feature) ? feature : [feature];
  const allowed = requireAll ? hasAllFeatures(keys) : hasAnyFeature(keys);

  return <>{allowed ? children : fallback}</>;
}

/**
 * The fallback for an *entitlement* — a missing entitlement is a sales
 * conversation, so it says what the feature is and which plan has it.
 *
 * Never use this for a flag. A dark feature must leave no trace, and "upgrade
 * to get advanced_analytics_v2" tells the world what is coming.
 */
export function UpgradePrompt({
  feature,
  plan,
  className,
}: {
  feature: string;
  plan?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-start gap-2.5 rounded-lg border border-app-border bg-app-surface-alt p-3 ${className ?? ""}`}
    >
      <Lock className="mt-0.5 h-4 w-4 shrink-0 text-app-muted" />
      <p className="text-body text-app-muted">
        <span className="font-semibold text-app-text">{feature}</span> is not included in your
        current plan{plan ? <> — it is available on {plan} and above</> : null}.
      </p>
    </div>
  );
}
