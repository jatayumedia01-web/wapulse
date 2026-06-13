"use client";

import { useEffect, useState } from "react";
import { Building2, Users, CreditCard, TrendingUp, Search, ChevronRight } from "lucide-react";

type Org = {
  id: string; name: string; slug: string; plan: string; createdAt: string;
  users: { id: string; name: string; email: string; role: string }[];
  subscriptions: { plan: string; status: string }[];
  _count: { contacts: number; campaigns: number };
};

const PLAN_COLORS: Record<string, string> = { FREE: "bg-slate-100 text-slate-600", STARTER: "bg-blue-100 text-blue-700", GROWTH: "bg-emerald-100 text-emerald-700", BUSINESS: "bg-violet-100 text-violet-700", ENTERPRISE: "bg-amber-100 text-amber-700" };

export default function AdminPage() {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/orgs").then((r) => r.json()).then((d) => { setOrgs(d); setLoading(false); });
  }, []);

  const filtered = orgs.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()) || o.slug.includes(search.toLowerCase()));

  const totalMRR = orgs.reduce((acc, o) => {
    const mrr: Record<string, number> = { FREE: 0, STARTER: 1499, GROWTH: 3999, BUSINESS: 8999 };
    return acc + (mrr[o.plan] ?? 0);
  }, 0);

  function impersonate(userId: string) {
    fetch("/api/admin/impersonate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId }) })
      .then(() => (window.location.href = "/dashboard"));
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-bold text-slate-900">Super Admin — WAPulse</h1>
            <p className="text-[13px] text-slate-500">Platform overview and org management</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* KPI cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Total orgs", value: orgs.length, icon: Building2 },
            { label: "Total users", value: orgs.reduce((a, o) => a + o.users.length, 0), icon: Users },
            { label: "Paying orgs", value: orgs.filter((o) => o.plan !== "FREE").length, icon: CreditCard },
            { label: "Est. MRR", value: `₹${totalMRR.toLocaleString()}`, icon: TrendingUp },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2.5">
                <Icon size={15} className="text-slate-400" />
                <p className="text-[12.5px] font-semibold text-slate-500">{label}</p>
              </div>
              <p className="mt-1.5 text-[22px] font-bold text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orgs…"
            className="w-full max-w-xs rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-[13px] outline-none focus:border-emerald-400" />
        </div>

        {/* Orgs table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-slate-100 text-left text-[11.5px] font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3">Organisation</th>
                <th className="px-5 py-3">Plan</th>
                <th className="px-5 py-3">Users</th>
                <th className="px-5 py-3">Contacts</th>
                <th className="px-5 py-3">Campaigns</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} className="py-8 text-center text-slate-400">Loading…</td></tr>
              )}
              {filtered.map((org) => (
                <>
                  <tr key={org.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-slate-900">{org.name}</p>
                      <p className="text-[11px] text-slate-400">/{org.slug}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${PLAN_COLORS[org.plan] ?? "bg-slate-100 text-slate-600"}`}>{org.plan}</span>
                    </td>
                    <td className="px-5 py-3">{org.users.length}</td>
                    <td className="px-5 py-3">{org._count.contacts}</td>
                    <td className="px-5 py-3">{org._count.campaigns}</td>
                    <td className="px-5 py-3 text-slate-400">{new Date(org.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="px-5 py-3">
                      <button onClick={() => setExpanded(expanded === org.id ? null : org.id)} className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700">
                        Details <ChevronRight size={12} className={`transition-transform ${expanded === org.id ? "rotate-90" : ""}`} />
                      </button>
                    </td>
                  </tr>
                  {expanded === org.id && (
                    <tr key={`${org.id}_detail`}>
                      <td colSpan={7} className="bg-slate-50 px-5 py-4">
                        <div className="space-y-2">
                          <p className="text-[12px] font-semibold text-slate-600">Users</p>
                          <div className="flex flex-wrap gap-2">
                            {org.users.map((u) => (
                              <div key={u.id} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5">
                                <div>
                                  <p className="text-[12px] font-semibold text-slate-800">{u.name}</p>
                                  <p className="text-[11px] text-slate-400">{u.email} · {u.role}</p>
                                </div>
                                <button onClick={() => impersonate(u.id)} className="ml-2 rounded-lg bg-violet-100 px-2 py-1 text-[11px] font-semibold text-violet-700 hover:bg-violet-200">
                                  Impersonate
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
