"use client";

import { useSession } from "@/components/providers/session-provider";

/**
 * "Does this workspace have X?" — the counterpart to usePermissions(), which
 * answers "may this user do X?". A gated control needs both.
 *
 * Reads the provider rather than fetching, so a page full of gates is still one
 * request. See components/providers/session-provider.tsx.
 */
export function useFeatures() {
  const { features, plan, loading } = useSession();

  const hasFeature = (key: string) => features.includes(key);

  return {
    features,
    plan,
    loading,
    hasFeature,
    hasAnyFeature: (keys: string[]) => keys.some(hasFeature),
    hasAllFeatures: (keys: string[]) => keys.every(hasFeature),
  };
}
