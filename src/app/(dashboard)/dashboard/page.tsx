"use client";
import { useEffect, useState } from "react";
import {
  Users, MessageSquare, CheckCircle2, Eye, Bot, AlertTriangle,
  TrendingUp, TrendingDown, ArrowUpRight, Megaphone, Zap,
  ChevronRight, Send, Clock, RefreshCw,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface Stats {
  contacts?: number; openConversations?: number;
  deliveryRate?: number; readRate?: number; aiHandled?: number; negativeAlerts?: number;
}
interface Campaign {
  id: string; name: string; status: string; sent?: number; readRate?: number; replies?: number; sentCount?: number;
}
interface ChartPoint { date: string; outbound: number; inbound: number; }

const CARD_THEMES = [
  { bg: "linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)", glow: "rgba(99,102,241,0.35)", icon: Users, label: "Total Contacts", key: "contacts", fmt: (v:number) => v.toString() },
  { bg: "linear-gradient(135deg,#3b82f6 0%,#06b6d4 100%)", glow: "rgba(59,130,246,0.35)", icon: MessageSquare, label: "Open Conversations", key: "openConversations", fmt: (v:number) => v.toString() },
  { bg: "linear-gradient(135deg,#10b981 0%,#059669 100%)", glow: "rgba(16,185,129,0.35)", icon: CheckCircle2, label: "Delivery Rate", key: "deliveryRate", fmt: (v:number) => v + "%" },
  { bg: "linear-gradient(135deg,#f59e0b 0%,#ef4444 100%)", glow: "rgba(245,158,11,0.35)", icon: Eye, label: "Read Rate", key: "readRate", fmt: (v:number) => v + "%" },
  { bg: "linear-gradient(135deg,#8b5cf6 0%,#d946ef 100%)", glow: "rgba(139,92,246,0.35)", icon: Bot, label: "AI Replies", key: "aiHandled", fmt: (v:number) => v.toString() },
  { bg: "linear-gradient(135deg,#f97316 0%,#ef4444 100%)", glow: "rgba(249,115,22,0.35)", icon: AlertTriangle, label: "Negative Alerts", key: "negativeAlerts", fmt: (v:number) => v.toString() },
];

const STATUS_STYLES: Record<string, { bg: string; color: string; dot: string }> = {
  RUNNING:   { bg: "rgba(16,185,129,0.1)",  color: "#059669", dot: "#10b981" },
  SCHEDULED: { bg: "rgba(59,130,246,0.1)",  color: "#2563eb", dot: "#3b82f6" },
  COMPLETED: { bg: "rgba(100,116,139,0.1)", color: "#475569", dot: "#94a3b8" },
  FAILED:    { bg: "rgba(239,68,68,0.1)",   color: "#dc2626", dot: "#ef4444" },
  PAUSED:    { bg: "rgba(245,158,11,0.1)",  color: "#d97706", dot: "#f59e0b" },
};

function glass(opacity = 0.85) {
  return {
    background: `rgba(255,255,255,${opacity})`,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.8)",
    boxShadow: "0 4px 24px rgba(99,102,241,0.07), 0 1px 4px rgba(0,0,0,0.05)",
    borderRadius: 20,
  };
}

function StatCard({ theme, value, loading, index }: { theme: typeof CARD_THEMES[0]; value: number; loading: boolean; index: number }) {
  const Icon = theme.icon;
  return (
    <div
      className="relative overflow-hidden p-5 anim-fade-up transition-transform duration-200 hover:-translate-y-1"
      style={{ ...glass(), animationDelay: `${index * 60}ms` }}
    >
      {/* bg accent */}
      <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: theme.bg, opacity: 0.08, pointerEvents: "none" }} />
      <div className="flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg"
          style={{ background: theme.bg, boxShadow: `0 6px 20px ${theme.glow}` }}
        >
          <Icon size={20} strokeWidth={2} />
        </div>
        <ArrowUpRight size={14} className="text-slate-300" />
      </div>
      <div className="mt-4">
        {loading ? (
          <div className="skeleton h-8 w-20 mb-1" />
        ) : (
          <p className="text-3xl font-bold text-slate-800">{theme.fmt(value)}</p>
        )}
        <p className="mt-1 text-[12px] font-medium text-slate-400">{theme.label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({});
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [chart, setChart] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/analytics").then(r => r.ok ? r.json() : {}),
    ]).then(([data]) => {
      if (data?.totals) setStats(data.totals);
      if (data?.recentCampaigns) setCampaigns(data.recentCampaigns.slice(0, 4));
      if (data?.timeline) setChart(data.timeline.map((t: {date:string;inbound:number;outbound:number}) => ({ date: t.date, outbound: t.outbound, inbound: t.inbound })));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const emoji = hour < 12 ? "☀️" : hour < 17 ? "👋" : "🌙";

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between anim-fade-up">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{greeting} {emoji}</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {new Date().toLocaleDateString("en", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)", boxShadow: "0 4px 14px rgba(99,102,241,0.4)" }}
          >
            <Send size={14} /> New Campaign
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {CARD_THEMES.map((t, i) => (
          <StatCard
            key={t.key}
            theme={t}
            value={(stats as Record<string, number>)[t.key] ?? 0}
            loading={loading}
            index={i}
          />
        ))}
      </div>

      {/* Chart + Campaigns row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Chart */}
        <div className="lg:col-span-3 anim-fade-up stagger-3" style={{ ...glass(), padding: "24px" }}>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">Message Volume</h2>
              <p className="text-[12px] text-slate-400 mt-0.5">Last 7 days activity</p>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-semibold">
              <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "#6366f1" }} />Outbound</span>
              <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "#10b981" }} />Inbound</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chart} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.20}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 12, fontSize: 12, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
              />
              <Area type="monotone" dataKey="outbound" stroke="#6366f1" strokeWidth={2.5} fill="url(#colorOut)" dot={false} />
              <Area type="monotone" dataKey="inbound" stroke="#10b981" strokeWidth={2.5} fill="url(#colorIn)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Campaigns */}
        <div className="lg:col-span-2 anim-fade-up stagger-4" style={{ ...glass(), padding: "24px" }}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">Campaigns</h2>
            <a href="/campaigns" className="flex items-center gap-0.5 text-[12px] font-semibold text-indigo-500 hover:text-indigo-700 transition-colors">
              View all <ChevronRight size={13} />
            </a>
          </div>
          <div className="space-y-3">
            {loading ? Array.from({length:4}).map((_,i) => (
              <div key={i} className="skeleton h-14 w-full" />
            )) : campaigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Megaphone size={32} className="text-slate-300 mb-2" />
                <p className="text-sm text-slate-400">No campaigns yet</p>
              </div>
            ) : campaigns.map((c) => {
              const st = STATUS_STYLES[c.status] || STATUS_STYLES.PAUSED;
              return (
                <div key={c.id} className="flex items-center gap-3 rounded-xl p-3 transition-all duration-150 hover:bg-indigo-50/50 cursor-pointer"
                  style={{ border: "1px solid rgba(99,102,241,0.06)" }}>
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{ background: "linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)", boxShadow: "0 4px 12px rgba(99,102,241,0.3)" }}>
                    <Megaphone size={15} className="text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-slate-700">{c.name}</p>
                    <p className="text-[11px] text-slate-400">{c.sent ?? c.sentCount ?? 0} sent · {c.readRate ?? 0}% read</p>
                  </div>
                  <span className="flex-shrink-0 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold"
                    style={{ background: st.bg, color: st.color }}>
                    <span className="h-1.5 w-1.5 rounded-full inline-block" style={{ background: st.dot }} />
                    {c.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 anim-fade-up stagger-5">
        {[
          { label: "Send Campaign", icon: Megaphone, href: "/campaigns", bg: "linear-gradient(135deg,#6366f1,#8b5cf6)", glow: "rgba(99,102,241,0.3)" },
          { label: "New Contact", icon: Users, href: "/contacts", bg: "linear-gradient(135deg,#10b981,#059669)", glow: "rgba(16,185,129,0.3)" },
          { label: "Automation", icon: Zap, href: "/automation", bg: "linear-gradient(135deg,#f59e0b,#ef4444)", glow: "rgba(245,158,11,0.3)" },
          { label: "View Inbox", icon: MessageSquare, href: "/inbox", bg: "linear-gradient(135deg,#3b82f6,#06b6d4)", glow: "rgba(59,130,246,0.3)" },
        ].map((q) => (
          <a key={q.href} href={q.href} className="flex items-center gap-3 rounded-2xl p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            style={{ ...glass(0.9) }}>
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-white"
              style={{ background: q.bg, boxShadow: `0 4px 14px ${q.glow}` }}>
              <q.icon size={18} />
            </div>
            <span className="text-[13px] font-semibold text-slate-700">{q.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
