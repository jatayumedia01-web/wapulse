"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Megaphone,
  FileText,
  Bot,
  Code2,
  Settings,
  Zap,
  GitBranch,
  ShoppingBag,
  UserCog,
  Globe,
  Layers,
  ClipboardList,
  Columns,
  CreditCard,
  Shield,
} from "lucide-react";

const NAV = [
  { group: "Engage", items: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/inbox", label: "Team Inbox", icon: MessageSquare },
  ]},
  { group: "Contacts & Audience", items: [
    { href: "/contacts", label: "Contacts", icon: Users },
    { href: "/custom-fields", label: "Custom Fields", icon: Columns },
  ]},
  { group: "Messaging", items: [
    { href: "/campaigns", label: "Campaigns", icon: Megaphone },
    { href: "/drip", label: "Drip Sequences", icon: Layers },
    { href: "/templates", label: "Templates", icon: FileText },
  ]},
  { group: "Automation", items: [
    { href: "/automation", label: "Automation Rules", icon: Bot },
    { href: "/flows", label: "Chatbot Flows", icon: GitBranch },
    { href: "/forms", label: "WA Forms", icon: ClipboardList },
  ]},
  { group: "Business", items: [
    { href: "/commerce", label: "Commerce", icon: ShoppingBag },
    { href: "/team", label: "Team", icon: UserCog },
    { href: "/widget", label: "Web Widget", icon: Globe },
  ]},
  { group: "Developer", items: [
    { href: "/developers", label: "Developer API", icon: Code2 },
    { href: "/settings", label: "Settings", icon: Settings },
  ]},
  { group: "Account", items: [
    { href: "/billing", label: "Billing & Plans", icon: CreditCard },
    { href: "/admin", label: "Super Admin", icon: Shield },
  ]},
];

type Me = { name: string; email: string; role: string; org: { name: string; plan: string } };

export default function Sidebar() {
  const pathname = usePathname();
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.ok ? r.json() : null).then(setMe).catch(() => {});
  }, []);

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col bg-[#0c1b1e] text-slate-300">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white">
          <Zap size={18} strokeWidth={2.5} />
        </span>
        <div>
          <p className="text-[15px] font-bold leading-tight text-white">WAPulse</p>
          <p className="text-[11px] text-slate-400">WhatsApp Business Suite</p>
        </div>
      </div>

      <nav className="mt-2 flex-1 space-y-0.5 overflow-y-auto px-3 pb-2">
        {NAV.map(({ group, items }) => (
          <div key={group} className="mb-1">
            <p className="mb-0.5 mt-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-600">{group}</p>
            {items.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                    active
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="mx-3 mb-4 space-y-2">
        {me && (
          <div className="rounded-xl bg-white/5 p-3.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-bold text-white">
                {me.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[12px] font-semibold text-white">{me.name}</p>
                <p className="truncate text-[10.5px] text-slate-400">{me.org?.name} · <span className="font-semibold text-emerald-400">{me.org?.plan}</span></p>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); window.location.href = "/auth/login"; }}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/10 py-2 text-[12.5px] font-semibold text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
          Sign out
        </button>
      </div>
    </aside>
  );
}
