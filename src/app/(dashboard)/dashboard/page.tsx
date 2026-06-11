"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, MessageSquare, CheckCheck, Eye, Bot, AlertTriangle, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { PageHeader, Badge, statusTone } from "@/components/ui";

type Analytics = {
  totals: {
    contacts: number;
    openConversations: number;
    messages: number;
    deliveryRate: number;
    readRate: number;
    aiHandled: number;
    negativeAlerts: number;
  };
  timeline: Array<{ date: string; inbound: number; outbound: number }>;
  recentCampaigns: Array<{
    id: string;
    name: string;
    status: string;
    total: number;
    sent: number;
    delivered: number;
    read: number;
    replied: number;
  }>;
};

const CARDS = [
  { key: "contacts", label: "Total Contacts", icon: Users, color: "text-sky-600 bg-sky-50" },
  { key: "openConversations", label: "Open Conversations", icon: MessageSquare, color: "text-emerald-600 bg-emerald-50" },
  { key: "deliveryRate", label: "Delivery Rate", icon: CheckCheck, color: "text-violet-600 bg-violet-50", suffix: "%" },
  { key: "readRate", label: "Read Rate", icon: Eye, color: "text-amber-600 bg-amber-50", suffix: "%" },
  { key: "aiHandled", label: "AI-handled Replies", icon: Bot, color: "text-fuchsia-600 bg-fuchsia-50" },
  { key: "negativeAlerts", label: "Negative Sentiment", icon: AlertTriangle, color: "text-rose-600 bg-rose-50" },
] as const;

export default function DashboardPage() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch("/api/analytics").then((r) => r.json()).then(setData);
  }, []);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Live overview of your WhatsApp Business performance"
      />
      <div className="space-y-6 p-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {CARDS.map(({ key, label, icon: Icon, color, ...rest }) => (
            <div key={key} className="fade-up rounded-2xl border border-slate-200 bg-white p-4">
              <span className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
                <Icon size={17} />
              </span>
              <p className="text-2xl font-bold text-slate-900">
                {data ? data.totals[key as keyof Analytics["totals"]] : "–"}
                {"suffix" in rest ? rest.suffix : ""}
              </p>
              <p className="mt-0.5 text-[12px] font-medium text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-slate-900">Message Volume — last 7 days</h2>
              <div className="flex gap-4 text-[12px] font-medium">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Outbound
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-400" /> Inbound
                </span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.timeline ?? []}>
                  <defs>
                    <linearGradient id="out" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="in" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef2f4" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                  <Area type="monotone" dataKey="outbound" stroke="#10b981" strokeWidth={2} fill="url(#out)" />
                  <Area type="monotone" dataKey="inbound" stroke="#38bdf8" strokeWidth={2} fill="url(#in)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-slate-900">Recent Campaigns</h2>
              <Link href="/campaigns" className="flex items-center gap-0.5 text-[12px] font-semibold text-emerald-600 hover:text-emerald-700">
                View all <ArrowUpRight size={13} />
              </Link>
            </div>
            <div className="space-y-3">
              {data?.recentCampaigns.map((c) => {
                const readPct = c.sent ? Math.round((c.read / c.sent) * 100) : 0;
                return (
                  <div key={c.id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-semibold text-slate-800">{c.name}</p>
                      <Badge tone={statusTone(c.status)}>{c.status}</Badge>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${readPct}%` }} />
                    </div>
                    <p className="mt-1.5 text-[11.5px] text-slate-500">
                      {c.sent.toLocaleString()} sent · {c.read.toLocaleString()} read ({readPct}%) · {c.replied} replies
                    </p>
                  </div>
                );
              })}
              {data && data.recentCampaigns.length === 0 && (
                <p className="py-8 text-center text-[13px] text-slate-400">No campaigns yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
