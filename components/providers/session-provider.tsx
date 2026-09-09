"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { UserRoleInfo } from "@/lib/rbac";

/**
 * One bootstrap fetch of "who am I and what can this workspace do", shared by every
 * permission check and feature gate on the page.
 *
 * Both usePermissions() and useFeatures() used to be — or were about to be —
 * hooks that fetched on mount. That is fine for one consumer and becomes one
 * HTTP request per guard the moment guards are everywhere: a sidebar with 12
 * gated links plus a page of gated buttons would open dozens of connections to
 * say the same thing. Mounted once per portal layout instead.
 */

export interface SessionUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  status?: string;
  tenantId?: string;
  tenant?: { id: string; name: string; slug: string } | null;
  role: UserRoleInfo;
  permissions: string[];
}

export interface SessionPlan {
  name: string;
  subscribed: boolean;
  maxDevices: number | null;
  maxStorageGb: number | null;
  maxUsers: number | null;
  maxRules: number | null;
  analyticsRetentionDays: number | null;
}

interface SessionValue {
  user: SessionUser | null;
  permissions: string[];
  features: string[];
  plan: SessionPlan | null;
  loading: boolean;
  /** Re-read after something that changes entitlements, e.g. a plan change. */
  refresh: () => Promise<void>;
}

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [plan, setPlan] = useState<SessionPlan | null>(null);
  const [loading, setLoading] = useState(true);

  // StrictMode double-invokes effects in development; without this the two
  // in-flight responses race and the loser can clobber the winner.
  const generation = useRef(0);

  const refresh = useCallback(async () => {
    const mine = ++generation.current;
    try {
      const bootstrapRes = await fetch("/api/auth/bootstrap", { cache: "no-store" });
      if (mine !== generation.current) return;

      if (bootstrapRes.ok) {
        const json = await bootstrapRes.json();
        if (json.success) {
          setUser(json.data?.user ?? null);
          setPermissions(json.data?.user?.permissions || []);
          setFeatures(json.data?.features || []);
          setPlan(json.data?.plan ?? null);
        }
      }
    } catch (error) {
      // Not fatal: guards fail closed, so the UI renders as if nothing is
      // granted rather than throwing away the page.
      console.error("Failed to load session", error);
    } finally {
      if (mine === generation.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    // The state updates happen after the asynchronous API request resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  const value = useMemo<SessionValue>(
    () => ({ user, permissions, features, plan, loading, refresh }),
    [user, permissions, features, plan, loading, refresh],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

/**
 * Falls back to an empty, finished session when no provider is mounted, so a
 * gate rendered outside a portal hides its children instead of crashing. Guards
 * fail closed; that is the safe direction.
 */
export function useSession(): SessionValue {
  return (
    useContext(SessionContext) ?? {
      user: null,
      permissions: [],
      features: [],
      plan: null,
      loading: false,
      refresh: async () => {},
    }
  );
}
