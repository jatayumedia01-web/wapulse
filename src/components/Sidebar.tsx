"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, MessageSquare, Users, Megaphone, FileText, Bot,
  Code2, Settings, Zap, GitBranch, ShoppingBag, UserCog, Globe,
  Layers, ClipboardList, Columns, CreditCard, Shield, LogOut,
  ChevronRight, Sparkles,
} from "lucide-react";

const NAV = [
  { group: "Overview", items: [
    { href: "/dashboard",    label: "Dashboard",       icon: LayoutDashboard },
    { href: "/inbox",        label: "Team Inbox",      icon: MessageSquare },
  ]},
  { group: "Audience", items: [
    { href: "/contacts",     label: "Contacts",        icon: Users },
    { href: "/custom-fields",label: "Custom Fields",   icon: Columns },
  ]},
  { group: "Messaging", items: [
    { href: "/campaigns",    label: "Campaigns",       icon: Megaphone },
    { href: "/drip",         label: "Drip Sequences",  icon: Layers },
    { href: "/templates",    label: "Templates",       icon: FileText },
  ]},
  { group: "Automation", items: [
    { href: "/automation",   label: "Rules",           icon: Bot },
    { href: "/flows",        label: "Chatbot Flows",   icon: GitBranch },
    { href: "/forms",        label: "WA Forms",        icon: ClipboardList },
  ]},
  { group: "Business", items: [
    { href: "/commerce",     label: "Commerce",        icon: ShoppingBag },
    { href: "/team",         label: "Team",            icon: UserCog },
    { href: "/widget",       label: "Web Widget",      icon: Globe },
  ]},
  { group: "Platform", items: [
    { href: "/developers",   label: "Developer API",   icon: Code2 },
    { href: "/billing",      label: "Billing & Plans", icon: CreditCard },
    { href: "/settings",     label: "Settings",        icon: Settings },
    { href: "/superadmin",   label: "Super Admin",     icon: Shield },
  ]},
];

const PLAN_PILL: Record<string, string> = {
  FREE:       "bg-slate-100 text-slate-500",
  STARTER:    "bg-blue-50 text-blue-600",
  GROWTH:     "bg-emerald-50 text-emerald-600",
  BUSINESS:   "bg-violet-50 text-violet-600",
  ENTERPRISE: "bg-amber-50 text-amber-600",
};

type Me = { name: string; email: string; role: string; org: { name: string; plan: string } };

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.ok ? r.json() : null).then(setMe).catch(() => {});
  }, []);

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  }

  return (
    <aside
      className={`glass-sidebar flex h-screen shrink-0 flex-col transition-all duration-300 ${collapsed ? "w-[68px]" : "w-[230px]"}`}
      style={{ zIndex: 40 }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 ${collapsed ? "justify-center" : ""}`}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl gradient-emerald shadow-lg shadow-emerald-200">
          <Zap size={18} strokeWidth={2.5} className="text-white" />
        </div>
        {!collapsed && (
          <div className="fade-in">
            <p className="text-[15px] font-bold leading-tight text-slate-900">WAPulse</p>
            <p className="text-[10px] font-medium text-slate-400">WhatsApp Platform</p>
          </div>
        )}
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`ml-auto flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-slate-100 ${collapsed ? "hidden" : ""}`}
        >
          <ChevronRight size={13} className="text-slate-400" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-3">
        {NAV.map(({ group, items }) => (
          <div key={group} className="mb-1">
            {!collapsed && (
              <p className="mb-1 mt-3 px-2 text-[9.5px] font-bold uppercase tracking-widest text-slate-400">
                {group}
              </p>
            )}
            {collapsed && <div className="my-2 mx-2 h-px bg-slate-100" />}
            {items.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  data-tooltip={collapsed ? label : undefined}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                    active
                      ? "nav-active font-semibold"
                      : "text-slate-500 hover:bg-white/70 hover:text-slate-900"
                  } ${collapsed ? "justify-center px-2" : ""}`}
                >
                  <Icon
                    size={16}
                    className={`shrink-0 transition-colors ${active ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"}`}
                  />
                  {!collapsed && <span>{label}</span>}
                  {active && !collapsed && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User card */}
      <div className="px-3 pb-4">
        {me && !collapsed && (
          <div className="mb-2 glass-sm rounded-2xl p-3">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl gradient-emerald text-[12px] font-bold text-white shadow-md shadow-emerald-200">
                  {me.name.charAt(0).toUpperCase()}
                </div>
                <span className="dot-online absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-semibold text-slate-800">{me.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`rounded-full px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide ${PLAN_PILL[me.org?.plan] ?? PLAN_PILL.FREE}`}>
                    {me.org?.plan}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI badge */}
        {!collapsed && (
          <div className="mb-2 flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-50 to-blue-50 px-3 py-2 border border-violet-100/60">
            <Sparkles size={13} className="text-violet-500 shrink-0" />
            <p className="text-[11px] font-semibold text-violet-700">AI Replies Active</p>
          </div>
        )}

        <button
          onClick={signOut}
          className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[12.5px] font-semibold text-slate-500 transition-all hover:bg-rose-50 hover:text-rose-600 ${collapsed ? "justify-center" : ""}`}
          data-tooltip={collapsed ? "Sign out" : undefined}
        >
          <LogOut size={15} className="shrink-0" />
          {!collapsed && "Sign out"}
        </button>
      </div>
    </aside>
  );
}
