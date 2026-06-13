"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users, MessageSquare, CheckCheck, Eye, Bot, AlertTriangle,
  ArrowUpRight, TrendingUp, Activity,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Badge } from "@/components/ui";

type Analytics = {
  agents: Array<{ name: string; role: string; open: number; resolved: number; avgResponseMins: number }>;
  totals: {
    contacts: number; openConversations: number; messages: number;
    deliveryRate: number; readRate: number; aiHandled: number; negativeAlerts: number;
  };
  timeline: Array<{ date: string; inbound: number; outbound: number }>;
  recentCampaigns: Array<{ id: string; name: string; status: string; total: number; sent: number; delivered: number; read: number; replied: number }>;
};

function statusTone(s: string) {
  const m: Record<string, string> = { COMPLETED: "green", RUNNING: "blue", SCHEDULED: "amber", DRAFT: "slate", FAILED: "red" };
  return m[s] ?? "slate";
}

const STAT_CARDS = [
  { key: "contacts",          label: "Total Contacts",        icon: Users,         tone: "sky",     suffix: "" },
  { key: "openConversations", label: "Open Conversations",    icon: MessageSquare, tone: "emerald", suffix: "" },
  { key: "deliveryRate",      label: "Delivery Rate",         icon: CheckCheck,    tone: "violet",  suffix: "%" },
  { key: "readRate",          label: "Read Rate",             icon: Eye,           tone: "amber",   suffix: "%" },
  { key: "aiHandled",         label: "AI Replies",            icon: Bot,           tone: "blue",    suffix: "" },
  { key: "negativeAlerts",    label: "Negative Alerts",       icon: AlertTriangle, tone: "rose",    suffix: "" },
] as const;

const TONE_MAP = {
  sky:     { grad: "gradient-sky",     glow: "shadow-sky-200" },
  emerald: { grad: "gradient-emerald", glow: "shadow-emerald-200" },
  violet:  { grad: "gradient-violet",  glow: "shadow-violet-200" },
  amber:   { grad: "gradient-amber",   glow: "shadow-amber-200" },
  blue:    { grad: "gradient-blue",    glow: "shadow-blue-200" },
  rose:    { grad: "gradient-rose",    glow: "shadow-rose-200" },
};

export default function DashboardPage() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch("/api/analytics").then((r) => r.json()).then((d) => {
      if (d && typeof d === "object" && !d.error) setData(d);
    }).catch(() => {});
  }, []);

  const now = new Date().toLocaleString("en-IN", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-full px-8 py-7">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between stagger">
        <div className="fade-up">
          <h1 className="text-[24px] font-bold tracking-tight text-slate-900">Good morning 👋</h1>
          <p className="mt-1 text-[13px] text-slate-500">{now}</p>
        </div>
        <Link href="/inbox"
          className="fade-up flex items-center gap-2 rounded-2xl gradient-emerald px-5 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-emerald-200/70 transition-all hover:-translate-y-px hover:shadow-emerald-300/70">
          <Activity size={15} /> Open Inbox
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6 stagger">
        {STAT_CARDS.map(({ key, label, icon: Icon, tone, suffix }) => {
          const t = TONE_MAP[tone];
          const val = data ? data.totals[key as keyof Analytics["totals"]] : null;
          return (
            <div key={key} className="glass-card p-5 fade-up group cursor-default">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-2xl ${t.grad} shadow-lg ${t.glow}`}>
                <Icon size={18} className="text-white" strokeWidth={2} />
              </div>
              <p className="text-[26px] font-bold tracking-tight text-slate-900">
                {val !== null ? `${val}${suffix}` : <span className="skeleton inline-block h-7 w-16 rounded-lg" />}
              </p>
              <p className="mt-1 text-[12px] font-medium text-slate-500">{label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="mb-7 grid gap-5 xl:grid-cols-5">
        {/* Area chart */}
        <div className="glass-card p-6 xl:col-span-3 fade-up">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-bold text-slate-900">Message Volume</h2>
              <p className="text-[12px] text-slate-400">Last 7 days</p>
            </div>
            <div className="flex gap-4">
              {[{ label: "Outbound", color: "#10b981" }, { label: "Inbound", color: "#6366f1" }].map((l) => (
                <span key={l.label} className="flex items-center gap-1.5 text-[11.5px] font-medium text-slate-500">
                  <span className="h-2 w-2 rounded-full" style={{ background: l.color }} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.timeline ?? []} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
                <defs>
                  <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,120,200,0.08)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 14, border: "1px solid rgba(200,210,255,0.5)", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", fontSize: 12, boxShadow: "0 8px 24px rgba(80,100,180,0.12)" }}
                  cursor={{ stroke: "rgba(100,120,200,0.15)", strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="outbound" stroke="#10b981" strokeWidth={2.5} fill="url(#gOut)" dot={false} />
                <Area type="monotone" dataKey="inbound"  stroke="#6366f1" strokeWidth={2.5} fill="url(#gIn)"  dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent campaigns */}
        <div className="glass-card p-6 xl:col-span-2 fade-up">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-bold text-slate-900">Campaigns</h2>
              <p className="text-[12px] text-slate-400">Recent activity</p>
            </div>
            <Link href="/campaigns" className="flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-[12px] font-semibold text-emerald-600 transition-colors hover:bg-emerald-100">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {data?.recentCampaigns.length === 0 && (
              <div className="py-10 text-center text-[13px] text-slate-400">No campaigns yet</div>
            )}
            {data?.recentCampaigns.map((c) => {
              const readPct = c.sent ? Math.round((c.read / c.sent) * 100) : 0;
              return (
                <div key={c.id} className="glass-sm rounded-2xl p-3.5 transition-all hover:shadow-md">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-semibold text-slate-800 leading-tight">{c.name}</p>
                    <Badge tone={statusTone(c.status)}>{c.status}</Badge>
                  </div>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full gradient-emerald transition-all duration-700" style={{ width: `${readPct}%` }} />
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-400">
                    {c.sent.toLocaleString()} sent · <span className="font-semibold text-emerald-600">{readPct}% read</span> · {c.replied} replies
                  </p>
                </div>
              );
            })}
            {!data && [1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-16 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>

      {/* Agent performance */}
      {data && data.agents.length > 0 && (
        <div className="glass-card p-6 fade-up">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-bold text-slate-900">Agent Performance</h2>
              <p className="text-[12px] text-slate-400">Conversation handling metrics</p>
            </div>
            <Link href="/team" className="flex items-center gap-1 text-[12px] font-semibold text-emerald-600 hover:text-emerald-700">
              <TrendingUp size={13} /> Full report
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  <th className="pb-3">Agent</th>
                  <th className="pb-3">Open</th>
                  <th className="pb-3">Resolved</th>
                  <th className="pb-3">Avg Response</th>
                  <th className="pb-3">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.agents.map((a, i) => {
                  const score = Math.max(0, 100 - a.avgResponseMins * 2 + a.resolved);
                  return (
                    <tr key={a.name} className="group" style={{ animationDelay: `${i * 60}ms` }}>
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-violet text-[11px] font-bold text-white shadow-md shadow-violet-200">
                            {a.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-slate-800">{a.name}</p>
                            <p className="text-[11px] text-slate-400">{a.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-[12px] font-bold text-amber-700">{a.open}</span>
                      </td>
                      <td className="py-3.5">
                        <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[12px] font-bold text-emerald-700">{a.resolved}</span>
                      </td>
                      <td className="py-3.5">
                        <Badge tone={a.avgResponseMins <= 10 ? "green" : a.avgResponseMins <= 30 ? "amber" : "red"}>
                          {a.avgResponseMins} min
                        </Badge>
                      </td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full rounded-full gradient-emerald" style={{ width: `${Math.min(score, 100)}%` }} />
                          </div>
                          <span className="text-[12px] font-semibold text-slate-600">{Math.min(score, 100)}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
