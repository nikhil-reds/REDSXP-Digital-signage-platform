"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, X, UserRound, LogOut } from "lucide-react";
import { useSession } from "@/components/providers/session-provider";
import { getSidebarProfile } from "@/lib/sidebar-profile";
import { navItems } from "./agent-navigation";
export default function AgentSidebar({ isMobileOpen = false, onMobileClose, onExpand }: { isMobileOpen?: boolean; onMobileClose?: () => void; onExpand?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useSession();
  const profile = user ? getSidebarProfile(user) : null;
  const [collapsed, setCollapsed] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const account = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    // Read the preference after hydration, when browser storage is available.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    try { setCollapsed(localStorage.getItem("agent-sidebar-collapsed") === "true"); } catch { /* Storage may be disabled. */ }
  }, []);
  const toggle = () => {
    if (window.matchMedia("(max-width: 1199px)").matches) { onExpand?.(); return; }
    setCollapsed(value => { try { localStorage.setItem("agent-sidebar-collapsed", String(!value)); } catch { /* Storage may be disabled. */ } return !value; });
  };
  const logout = async () => {
    setLoggingOut(true); setLogoutError("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Sign out failed");
      router.replace("/login"); router.refresh();
    } catch { setLogoutError("Unable to sign out. Please try again."); setLoggingOut(false); }
  };
  return <>
    {isMobileOpen && <div className="agent-nav-backdrop" onClick={onMobileClose} aria-hidden="true"/>}
    <div className="agent-sidebar-space" data-collapsed={collapsed}>
      <aside id="agent-navigation" className="agent-sidebar border-r border-app-border bg-app-surface" data-collapsed={collapsed} data-open={isMobileOpen} aria-label="Agent navigation" role={isMobileOpen ? "dialog" : undefined} aria-modal={isMobileOpen || undefined}>
        <div className="agent-brand-row">
          <Image className="agent-full-brand" src="/reds-xos-logo.png" alt="REDS XOS" width={158} height={34} priority/>
          <Image className="agent-small-brand" src="/logo-squueze.png" alt="REDS" width={28} height={28} priority/>
          <button type="button" className="agent-nav-button agent-collapse-trigger" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={toggle}>{collapsed ? <ChevronRight size={18}/> : <ChevronLeft size={18}/>}</button>
          <button type="button" className="agent-nav-button agent-drawer-close" aria-label="Close navigation" onClick={onMobileClose}><X size={20}/></button>
        </div>
        <nav className="agent-nav-links" aria-label="Main navigation">
          {navItems.map(item => {
            const active = item.href === "/agent" ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return <Link href={item.href} key={item.href} aria-label={item.name} aria-current={active ? "page" : undefined} onClick={onMobileClose} className={active ? "is-active" : ""} title={item.name}><item.icon className="h-5 w-5 shrink-0"/><span className="agent-nav-label">{item.name}</span><span className="agent-rail-tooltip" aria-hidden="true">{item.name}</span></Link>;
          })}
        </nav>
        <footer className="agent-account-footer border-t border-app-border bg-app-surface-alt">
          <button className="agent-account-button" aria-label="Account details" title="Account details" onClick={() => account.current?.showModal()}><span className="agent-avatar">{profile?.initials ?? "…"}</span><span className="agent-account-copy"><strong>{profile?.displayName ?? (loading ? "Loading account" : "Account unavailable")}</strong><span>{profile?.roleName}</span></span><UserRound className="agent-account-icon h-4 w-4 shrink-0"/></button>
          <button className="agent-signout" aria-label="Sign out" title="Sign out" disabled={loggingOut} onClick={logout}><LogOut size={18}/><span className="agent-nav-label">{loggingOut ? "Signing out…" : "Sign out"}</span></button>
          {logoutError && <p role="alert" className="text-xs text-app-danger-text break-words">{logoutError}</p>}
        </footer>
      </aside>
    </div>
    <dialog ref={account} className="agent-nav-dialog" aria-labelledby="agent-account-title">
      <div className="agent-dialog-heading"><h2 id="agent-account-title">Account details</h2><button className="agent-nav-button" aria-label="Close account details" onClick={() => account.current?.close()}><X size={20}/></button></div>
      <dl className="agent-account-details"><dt>Name</dt><dd>{profile?.displayName ?? "Unavailable"}</dd><dt>Email</dt><dd>{user?.email ?? "Unavailable"}</dd><dt>Role</dt><dd>{profile?.roleName ?? "Unavailable"}</dd><dt>Workspace</dt><dd>{profile?.tenantName ?? "Unavailable"}</dd></dl>
    </dialog>
  </>;
}
