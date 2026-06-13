"use client";

import { useCallback, useEffect, useState } from "react";
import { CreditCard, Users, MessageSquare, Megaphone, Zap, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui";

type PlanLimits = { contacts: number; messages: number; agents: number; campaigns: number; drip: number; api: boolean; ai: boolean };
type Usage = { contacts: number; messages: number; campaigns: number; apiCalls: number };
type Subscription = { plan: string; status: string; currentPeriodEnd: string | null; razorpaySubId: string };
type BillingEvent = { id: string; type: string; amount: number; createdAt: string };
type BillingStatus = { plan: string; subscription: Subscription | null; limits: PlanLimits; usage: Usage; events: BillingEvent[] };

const PLANS = [
  { id: "FREE",     name: "Free",     price: "₹0",        per: "",      color: "#94a3b8", gradient: "linear-gradient(135deg,#94a3b8,#64748b)", highlights: ["250 contacts","1,000 msg/mo","1 agent","Basic automation"] },
  { id: "STARTER",  name: "Starter",  price: "₹1,499",    per: "/mo",   color: "#3b82f6", gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)", highlights: ["2,000 contacts","10,000 msg/mo","3 agents","Drip sequences"] },
  { id: "GROWTH",   name: "Growth",   price: "₹3,999",    per: "/mo",   color: "#10b981", gradient: "linear-gradient(135deg,#10b981,#059669)", highlights: ["15,000 contacts","50,000 msg/mo","AI Replies","API access"] },
  { id: "BUSINESS", name: "Business", price: "₹8,999",    per: "/mo",   color: "#8b5cf6", gradient: "linear-gradient(135deg,#8b5cf6,#6366f1)", highlights: ["Unlimited contacts","500k msg/mo","50 agents","RBAC & audit logs"] },
];

const PLAN_ORDER = ["FREE","STARTER","GROWTH","BUSINESS"];

function UsageMeter({ label, used, limit, icon: Icon, color }: { label: string; used: number; limit: number; icon: React.ElementType; color: string }) {
  const pct = limit <= 0 ? 0 : Math.min((used / limit) * 100, 100);
  const isUnlimited = limit === -1;
  const isOver = pct >= 100;
  const barColor = isOver ? "#ef4444" : pct > 80 ? "#f59e0b" : color;
  return (
    <div className="rounded-2xl p-5 transition-all hover:-translate-y-0.5"
      style={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 4px 20px rgba(99,102,241,0.07)" }}>
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-white"
          style={{ background: color, boxShadow: `0 4px 12px ${color}50` }}>
          <Icon size={16} strokeWidth={2} />
        </div>
        <p className="text-[13px] font-semibold text-slate-700">{label}</p>
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-2xl font-bold text-slate-800">{used.toLocaleString()}</span>
        {!isUnlimited && <span className="text-[12px] text-slate-400">/ {limit.toLocaleString()}</span>}
        {isUnlimited && <span className="text-[12px] font-semibold text-emerald-600 ml-1">Unlimited</span>}
      </div>
      {!isUnlimited && (
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${barColor}90, ${barColor})` }} />
        </div>
      )}
      {isOver && <p className="mt-1.5 text-[11px] font-semibold text-rose-600">Limit reached — upgrade!</p>}
    </div>
  );
}

export default function BillingPage() {
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  const load = useCallback(async () => {
    const data = await fetch("/api/billing/status").then((r) => r.json());
    setStatus(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function upgrade(plan: string) {
    setUpgrading(plan);
    const res = await fetch("/api/billing/create-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (data.demo) { await load(); setUpgrading(null); return; }
    if (data.razorpaySubId) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);
      script.onload = () => {
        // @ts-expect-error Razorpay global
        const rzp = new window.Razorpay({
          key: data.razorpayKeyId,
          subscription_id: data.razorpaySubId,
          name: "WAPulse",
          description: `${plan} Plan`,
          handler: async () => {
            await fetch("/api/billing/activate-free", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan }) });
            await load();
          },
        });
        rzp.open();
      };
    }
    setUpgrading(null);
  }

  if (!status) return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
    </div>
  );

  const currentIdx = PLAN_ORDER.indexOf(status.plan);
  const currentPlan = PLANS.find((p) => p.id === status.plan);

  return (
    <div className="min-h-screen">
      <PageHeader title="Billing & Plan" subtitle="Manage your subscription, view usage, and upgrade your plan" />
      <div className="space-y-6 px-8 pb-8">

        {/* Current plan hero */}
        <div className="overflow-hidden rounded-2xl shadow-lg"
          style={{ background: currentPlan?.gradient || "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-widest text-white/70">Current plan</p>
              <h2 className="mt-1 text-3xl font-bold text-white">{status.plan}</h2>
              {status.subscription?.currentPeriodEnd && (
                <p className="mt-1 text-[13px] text-white/75">
                  Renews {new Date(status.subscription.currentPeriodEnd).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              )}
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-[12px] font-bold text-white backdrop-blur-sm">
                <div className="h-2 w-2 rounded-full bg-emerald-300 shadow-sm" />
                {status.subscription?.status ?? "ACTIVE"}
              </div>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-sm">
              <CreditCard size={28} />
            </div>
          </div>
        </div>

        {/* Usage */}
        <div>
          <h3 className="mb-4 text-[15px] font-bold text-slate-800">Usage this month</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <UsageMeter label="Contacts" used={status.usage.contacts} limit={status.limits.contacts} icon={Users} color="#6366f1" />
            <UsageMeter label="Messages sent" used={status.usage.messages} limit={status.limits.messages} icon={MessageSquare} color="#3b82f6" />
            <UsageMeter label="Campaigns" used={status.usage.campaigns} limit={status.limits.campaigns} icon={Megaphone} color="#10b981" />
            <UsageMeter label="API calls" used={status.usage.apiCalls} limit={status.limits.api ? -1 : 0} icon={Zap} color="#f59e0b" />
          </div>
        </div>

        {/* Plans */}
        <div>
          <h3 className="mb-4 text-[15px] font-bold text-slate-800">Choose your plan</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {PLANS.map((plan, idx) => {
              const isCurrent = plan.id === status.plan;
              const isUpgrade = idx > currentIdx;
              return (
                <div key={plan.id} className="overflow-hidden rounded-2xl transition-all hover:-translate-y-1 hover:shadow-xl"
                  style={{
                    border: isCurrent ? `2px solid ${plan.color}` : "1px solid rgba(99,102,241,0.1)",
                    boxShadow: isCurrent ? `0 8px 30px ${plan.color}30` : "0 4px 16px rgba(99,102,241,0.06)",
                  }}>
                  {/* Gradient header */}
                  <div className="p-5" style={{ background: plan.gradient }}>
                    <p className="text-[14px] font-bold text-white">{plan.name}</p>
                    <div className="mt-1 flex items-baseline gap-0.5">
                      <span className="text-2xl font-black text-white">{plan.price}</span>
                      <span className="text-[12px] text-white/70">{plan.per}</span>
                    </div>
                  </div>
                  {/* Features */}
                  <div className="p-5" style={{ background: "rgba(255,255,255,0.97)" }}>
                    <ul className="space-y-2">
                      {plan.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-2 text-[12.5px] text-slate-600">
                          <CheckCircle2 size={13} style={{ color: plan.color, flexShrink: 0 }} />
                          {h}
                        </li>
                      ))}
                    </ul>
                    {isUpgrade && (
                      <button
                        onClick={() => upgrade(plan.id)}
                        disabled={upgrading === plan.id}
                        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[12.5px] font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-60"
                        style={{ background: plan.gradient, boxShadow: `0 4px 14px ${plan.color}40` }}
                      >
                        {upgrading === plan.id ? "…" : <><ArrowRight size={13} /> Upgrade</>}
                      </button>
                    )}
                    {isCurrent && (
                      <div className="mt-4 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[12.5px] font-bold"
                        style={{ background: `${plan.color}15`, color: plan.color }}>
                        <Sparkles size={13} /> Current plan
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Billing history */}
        {status.events.length > 0 && (
          <div>
            <h3 className="mb-3 text-[15px] font-bold text-slate-800">Billing history</h3>
            <div className="overflow-hidden rounded-2xl" style={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 4px 20px rgba(99,102,241,0.07)" }}>
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    <th className="px-5 py-3">Event</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {status.events.map((e) => (
                    <tr key={e.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3 font-semibold text-slate-700">{e.type.replace(".", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</td>
                      <td className="px-5 py-3 font-semibold text-slate-800">₹{e.amount.toLocaleString()}</td>
                      <td className="px-5 py-3 text-slate-400">{new Date(e.createdAt).toLocaleDateString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
