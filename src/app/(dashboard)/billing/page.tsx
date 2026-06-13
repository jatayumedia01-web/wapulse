"use client";

import { useCallback, useEffect, useState } from "react";
import { CreditCard, TrendingUp, Users, MessageSquare, Megaphone, Zap, ArrowRight, CheckCircle } from "lucide-react";
import { PageHeader, Badge } from "@/components/ui";

type PlanLimits = { contacts: number; messages: number; agents: number; campaigns: number; drip: number; api: boolean; ai: boolean };
type Usage = { contacts: number; messages: number; campaigns: number; apiCalls: number };
type Subscription = { plan: string; status: string; currentPeriodEnd: string | null; razorpaySubId: string };
type BillingEvent = { id: string; type: string; amount: number; createdAt: string };
type BillingStatus = { plan: string; subscription: Subscription | null; limits: PlanLimits; usage: Usage; events: BillingEvent[] };

const PLANS = [
  { id: "FREE", name: "Free", price: "₹0", highlights: ["250 contacts", "1,000 msg/mo", "1 agent"] },
  { id: "STARTER", name: "Starter", price: "₹1,499/mo", highlights: ["2,000 contacts", "10,000 msg/mo", "3 agents"] },
  { id: "GROWTH", name: "Growth", price: "₹3,999/mo", highlights: ["15,000 contacts", "50,000 msg/mo", "AI Replies", "API"] },
  { id: "BUSINESS", name: "Business", price: "₹8,999/mo", highlights: ["Unlimited contacts", "500k msg/mo", "50 agents", "RBAC"] },
];

const PLAN_ORDER = ["FREE", "STARTER", "GROWTH", "BUSINESS"];

function UsageMeter({ label, used, limit, icon: Icon }: { label: string; used: number; limit: number; icon: React.ElementType }) {
  const pct = limit === -1 ? 0 : Math.min((used / limit) * 100, 100);
  const isUnlimited = limit === -1;
  const isOver = pct >= 100;
  return (
    <div className="rounded-xl bg-white/90 backdrop-blur border border-white/80 shadow-lg shadow-indigo-50 rounded-2xl p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-slate-500" />
          <p className="text-[13px] font-semibold text-slate-700">{label}</p>
        </div>
        <p className="text-[12px] font-semibold text-slate-600">
          {used.toLocaleString()} {isUnlimited ? "" : `/ ${limit.toLocaleString()}`}
          {isUnlimited && <span className="ml-1 text-emerald-600">Unlimited</span>}
        </p>
      </div>
      {!isUnlimited && (
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div className={`h-full rounded-full transition-all ${isOver ? "bg-rose-500" : pct > 80 ? "bg-amber-400" : "bg-emerald-500"}`} style={{ width: `${pct}%` }} />
        </div>
      )}
      {isOver && <p className="mt-1 text-[11px] font-semibold text-rose-600">Limit reached — upgrade to continue</p>}
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
      // Open Razorpay checkout
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

  if (!status) return <div className="flex h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" /></div>;

  const currentIdx = PLAN_ORDER.indexOf(status.plan);

  return (
    <div>
      <PageHeader
        title="Billing & Plan"
        subtitle="Manage your subscription, view usage, and upgrade your plan"
        action={null}
      />
      <div className="space-y-6 p-8">
        {/* Current plan */}
        <div className="bg-white/90 backdrop-blur border border-white/80 shadow-lg shadow-indigo-50 rounded-2xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[13px] font-semibold text-slate-500">Current plan</p>
              <div className="mt-1 flex items-center gap-2.5">
                <h2 className="text-[22px] font-bold text-slate-900">{status.plan}</h2>
                <Badge tone={status.subscription?.status === "ACTIVE" ? "green" : "amber"}>
                  {status.subscription?.status ?? "FREE"}
                </Badge>
              </div>
              {status.subscription?.currentPeriodEnd && (
                <p className="mt-1 text-[12.5px] text-slate-500">
                  Renews {new Date(status.subscription.currentPeriodEnd).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              )}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CreditCard size={22} />
            </div>
          </div>
          {status.subscription?.razorpaySubId && (
            <p className="mt-2 font-mono text-[11px] text-slate-400">Subscription ID: {status.subscription.razorpaySubId}</p>
          )}
        </div>

        {/* Usage meters */}
        <div>
          <h3 className="mb-3 text-[14px] font-bold text-slate-900">Usage this month</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <UsageMeter label="Contacts" used={status.usage.contacts} limit={status.limits.contacts} icon={Users} />
            <UsageMeter label="Messages sent" used={status.usage.messages} limit={status.limits.messages} icon={MessageSquare} />
            <UsageMeter label="Campaigns" used={status.usage.campaigns} limit={status.limits.campaigns} icon={Megaphone} />
            <UsageMeter label="API calls" used={status.usage.apiCalls} limit={status.limits.api ? -1 : 0} icon={Zap} />
          </div>
        </div>

        {/* Plans */}
        <div>
          <h3 className="mb-4 text-[14px] font-bold text-slate-900">Upgrade your plan</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {PLANS.map((plan, idx) => {
              const isCurrent = plan.id === status.plan;
              const isUpgrade = idx > currentIdx;
              return (
                <div key={plan.id} className={`rounded-2xl border p-5 ${isCurrent ? "border-emerald-400 bg-emerald-50/50" : "border-slate-200 bg-white"}`}>
                  <div className="flex items-start justify-between">
                    <p className="text-[15px] font-bold text-slate-900">{plan.name}</p>
                    {isCurrent && <CheckCircle size={16} className="text-emerald-500" />}
                  </div>
                  <p className="mt-1 text-[14px] font-semibold text-slate-700">{plan.price}</p>
                  <ul className="mt-3 space-y-1.5">
                    {plan.highlights.map((h) => (
                      <li key={h} className="text-[12px] text-slate-600">— {h}</li>
                    ))}
                  </ul>
                  {isUpgrade && (
                    <button
                      onClick={() => upgrade(plan.id)}
                      disabled={upgrading === plan.id}
                      className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-500 py-2 text-[12.5px] font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
                    >
                      {upgrading === plan.id ? "…" : <><ArrowRight size={12} /> Upgrade</>}
                    </button>
                  )}
                  {isCurrent && <p className="mt-4 text-center text-[12px] font-semibold text-emerald-600">Current plan</p>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Billing history */}
        {status.events.length > 0 && (
          <div>
            <h3 className="mb-3 text-[14px] font-bold text-slate-900">Billing history</h3>
            <div className="overflow-hidden glass-card">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-[11.5px] font-semibold uppercase tracking-wide text-slate-400">
                    <th className="px-5 py-3">Event</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {status.events.map((e) => (
                    <tr key={e.id} className="border-b border-slate-50 last:border-0">
                      <td className="px-5 py-3 font-semibold text-slate-700">{e.type.replace(".", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</td>
                      <td className="px-5 py-3">₹{e.amount.toLocaleString()}</td>
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
