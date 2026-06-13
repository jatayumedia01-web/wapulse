"use client";

import { useState, useEffect } from "react";
import { Building2, Users, DollarSign, Activity, Loader2, Search, ArrowUpRight, Shield } from "lucide-react";

interface OrgRow {
  id: string;
  name: string;
  slug: string;
  plan: string;
  createdAt: string;
  _count: { users: number; contacts: number; campaigns: number };
}

export default function SuperAdminPage() {
  const [orgs, setOrgs] = useState<OrgRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/api/admin/orgs").then((r) => r.json()).then((d) => { setOrgs(d.orgs ?? []); setLoading(false); });
  }, []);

  const filtered = orgs.filter((o) => o.name.toLowerCase().includes(q.toLowerCase()) || o.slug.includes(q));

  const totalRevenue = orgs.filter((o) => o.plan !== "FREE").length * 2999; // rough estimate

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Shield size={22} className="text-violet-600" />
        <div>
          <h1 className="text-[20px] font-bold text-slate-900">Super Admin</h1>
          <p className="text-[12px] text-slate-400">Platform-wide management console</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: Building2, label: "Total orgs", value: orgs.length, color: "text-blue-600 bg-blue-50" },
          { icon: Users, label: "Paid orgs", value: orgs.filter((o) => o.plan !== "FREE").length, color: "text-emerald-600 bg-emerald-50" },
          { icon: DollarSign, label: "Est. MRR", value: `₹${totalRevenue.toLocaleString()}`, color: "text-violet-600 bg-violet-50" },
          { icon: Activity, label: "Contacts (total)", value: orgs.reduce((a, o) => a + o._count.contacts, 0).toLocaleString(), color: "text-amber-600 bg-amber-50" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${color}`}><Icon size={16} /></span>
            <p className="mt-3 text-[22px] font-bold text-slate-900">{value}</p>
            <p className="text-[12px] text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Orgs table */}
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center gap-3 border-b border-slate-100 p-4">
          <Search size={15} className="text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search organizations…"
            className="flex-1 text-[13.5px] text-slate-900 outline-none placeholder:text-slate-400" />
        </div>
        {loading ? (
          <div className="flex h-40 items-center justify-center"><Loader2 className="animate-spin text-emerald-500" size={20} /></div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-slate-100 text-left text-[11.5px] font-bold uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Users</th>
                <th className="px-4 py-3">Contacts</th>
                <th className="px-4 py-3">Campaigns</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((org) => (
                <tr key={org.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{org.name}</p>
                    <p className="text-[11px] text-slate-400">{org.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${org.plan === "FREE" ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-700"}`}>
                      {org.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{org._count.users}</td>
                  <td className="px-4 py-3 text-slate-600">{org._count.contacts.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-600">{org._count.campaigns}</td>
                  <td className="px-4 py-3 text-slate-400">{new Date(org.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="px-4 py-3">
                    <button className="flex items-center gap-1 text-[11.5px] font-semibold text-blue-600 hover:text-blue-700">
                      View <ArrowUpRight size={11} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-10 text-center text-[13px] text-slate-400">No organizations found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
