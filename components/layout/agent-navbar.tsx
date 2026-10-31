"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Bell, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { useSession } from "@/components/providers/session-provider";
import { navItems } from "./agent-navigation";
export default function AgentNavbar({ isMenuOpen = false, onMenuClick }: { isMenuOpen?: boolean; onMenuClick?: () => void }) {
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const { user } = useSession();
  const search = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const active = navItems.find(item => item.href === "/agent" ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`));
  const title = pathname.startsWith("/agent/playlists/create-playlist") ? "Playlist Builder" : active?.name ?? "Agent workspace";
  const Icon = active?.icon;
  return <>
    <header className="agent-navbar border-b border-app-border bg-app-surface">
      <div className="agent-navbar-left">
      <button className="agent-nav-button agent-menu-trigger" type="button" aria-label="Open navigation" aria-controls="agent-navigation" aria-expanded={isMenuOpen} onClick={onMenuClick}><Menu size={20}/></button>
      <div className="agent-page-title">{Icon && <Icon className="h-5 w-5 shrink-0"/>}<h1 title={title}>{title}</h1></div>
      </div>
      <span className="agent-workspace-context" title={user?.tenant?.name}>{user?.tenant?.name ?? "Workspace"}</span>
      <div className="agent-navbar-right">
      <button className="agent-search-trigger agent-nav-button" type="button" aria-label="Find a page" onClick={() => { setQuery(""); search.current?.showModal(); }}><Search size={18}/><span>Find a page…</span></button>
      <Link className="agent-nav-button" href="/agent/alerts" aria-label="Alerts and incidents" title="Alerts and incidents"><Bell size={18}/></Link>
      <button className="agent-nav-button agent-theme-toggle" type="button" aria-label="Toggle light and dark mode" title="Toggle light and dark mode" onClick={() => setTheme(document.documentElement.classList.contains("dark") ? "light" : "dark")}><Sun className="hidden dark:block" size={20}/><Moon className="dark:hidden" size={20}/></button>
      </div>
    </header>
    <dialog ref={search} className="agent-nav-dialog" aria-labelledby="agent-search-title" onClick={event => { if (event.target === event.currentTarget) search.current?.close(); }}>
      <div className="agent-dialog-heading"><h2 id="agent-search-title">Find a page</h2><button className="agent-nav-button" aria-label="Close page finder" onClick={() => search.current?.close()}><X size={20}/></button></div>
      <input autoFocus aria-label="Search agent pages" placeholder="Search pages…" value={query} onChange={event => setQuery(event.target.value)} className="agent-page-search"/>
      <nav aria-label="Page search results" className="agent-search-results">{navItems.filter(item => item.name.toLowerCase().includes(query.trim().toLowerCase())).map(item => <Link key={item.href} href={item.href} onClick={() => search.current?.close()}><item.icon className="h-5 w-5 shrink-0"/>{item.name}</Link>)}{!navItems.some(item => item.name.toLowerCase().includes(query.trim().toLowerCase())) && <p>No matching pages.</p>}</nav>
    </dialog>
  </>;
}
