"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, MessageSquare, Users, Megaphone, Zap, BookTemplate,
  Settings, BarChart3, ChevronRight, Store, Users2, Globe,
  Layers, ListFilter, LogOut, Bot, MessagesSquare, Hash,
  GitBranch, ChevronLeft, Bell, Sparkles,
} from "lucide-react";

const NAV = [
  { section: "OVERVIEW", items: [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/inbox", icon: MessagesSquare, label: "Team Inbox" },
  ]},
  { section: "AUDIENCE", items: [
    { href: "/contacts", icon: Users, label: "Contacts" },
    { href: "/custom-fields", icon: Hash, label: "Custom Fields" },
  ]},
  { section: "MESSAGING", items: [
    { href: "/campaigns", icon: Megaphone, label: "Campaigns" },
    { href: "/drip", icon: GitBranch, label: "Drip Sequences" },
    { href: "/templates", icon: BookTemplate, label: "Templates" },
  ]},
  { section: "AUTOMATION", items: [
    { href: "/automation", icon: Zap, label: "Rules" },
    { href: "/chatbot", icon: Bot, label: "Chatbot Flows" },
    { href: "/forms", icon: ListFilter, label: "WA Forms" },
  ]},
  { section: "BUSINESS", items: [
    { href: "/commerce", icon: Store, label: "Commerce" },
    { href: "/team", icon: Users2, label: "Team" },
    { href: "/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/developers", icon: Globe, label: "Developers" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ]},
];

export default function Sidebar() {
  const path = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<{ name?: string; orgName?: string; orgPlan?: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setUser({ name: d.user?.name || "User", orgName: d.org?.name || "My Org", orgPlan: d.org?.plan || "FREE" }); })
      .catch(() => {});
  }, []);

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  }

  const planColor: Record<string, string> = {
    FREE: "#6366f1", STARTER: "#3b82f6", GROWTH: "#10b981", PRO: "#8b5cf6", ENTERPRISE: "#f59e0b",
  };
  const pc = planColor[(user?.orgPlan || "FREE").toUpperCase()] || "#6366f1";

  return (
    <aside
      className="flex h-full flex-col transition-all duration-300"
      style={{
        width: collapsed ? 64 : 230,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(99,102,241,0.12)",
        boxShadow: "2px 0 20px rgba(99,102,241,0.08)",
        position: "relative",
        zIndex: 50,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5"
        style={{ borderBottom: "1px solid rgba(99,102,241,0.08)" }}
      >
        <div
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-white font-bold text-base"
          style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", boxShadow: "0 4px 14px rgba(99,102,241,0.4)" }}
        >
          W
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-[15px] font-bold text-slate-800">WAPulse</p>
            <p className="truncate text-[11px] text-slate-400 font-medium">WhatsApp Platform</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5">
        {NAV.map(({ section, items }) => (
          <div key={section} className="mb-1">
            {!collapsed && (
              <p className="mb-1 mt-3 px-2 text-[9.5px] font-semibold uppercase tracking-widest text-slate-400">
                {section}
              </p>
            )}
            {items.map(({ href, icon: Icon, label }) => {
              const active = path === href || path.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  title={collapsed ? label : undefined}
                  className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 mb-0.5 text-sm font-medium transition-all duration-150"
                  style={{
                    background: active
                      ? "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)"
                      : "transparent",
                    color: active ? "#6366f1" : "#64748b",
                    borderLeft: active ? "3px solid #6366f1" : "3px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.background = "rgba(99,102,241,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <Icon size={16} strokeWidth={active ? 2.2 : 1.8} style={{ flexShrink: 0, color: active ? "#6366f1" : "#94a3b8" }} />
                  {!collapsed && <span className="truncate">{label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* AI badge */}
      {!collapsed && (
        <div className="mx-3 mb-3 flex items-center gap-2 rounded-xl px-3 py-2.5"
          style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(5,150,105,0.07) 100%)", border: "1px solid rgba(16,185,129,0.2)" }}>
          <Sparkles size={14} style={{ color: "#10b981", flexShrink: 0 }} />
          <span className="text-[11px] font-semibold text-emerald-700 truncate">AI Replies Active</span>
        </div>
      )}

      {/* User footer */}
      <div style={{ borderTop: "1px solid rgba(99,102,241,0.08)" }} className="p-3">
        {!collapsed ? (
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-white text-xs font-bold"
              style={{ background: `linear-gradient(135deg, ${pc}cc 0%, ${pc} 100%)`, boxShadow: `0 3px 10px ${pc}40` }}
            >
              {(user?.name || "U")[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-semibold text-slate-700">{user?.name || "User"}</p>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-semibold rounded-md px-1.5 py-0.5 text-white"
                  style={{ background: pc }}>{user?.orgPlan || "FREE"}</span>
              </div>
            </div>
            <button onClick={signOut} className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <button onClick={signOut} className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={14} />
          </button>
        )}
      </div>
    </aside>
  );
}
