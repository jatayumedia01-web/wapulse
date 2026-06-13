"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Zap, ArrowRight } from "lucide-react";

const PLANS = [
  {
    id: "FREE",
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Perfect for getting started",
    color: "slate",
    highlights: ["250 contacts", "1,000 messages / month", "1 agent", "2 campaigns", "Chatbot flows", "Web widget"],
  },
  {
    id: "STARTER",
    name: "Starter",
    price: "₹1,499",
    period: "/month",
    description: "For growing small businesses",
    color: "blue",
    highlights: ["2,000 contacts", "10,000 messages / month", "3 agents", "10 campaigns", "3 drip sequences", "CSV import / export"],
  },
  {
    id: "GROWTH",
    name: "Growth",
    price: "₹3,999",
    period: "/month",
    description: "Most popular — for scaling teams",
    color: "emerald",
    popular: true,
    highlights: ["15,000 contacts", "50,000 messages / month", "10 agents", "AI Smart Replies", "A/B Testing", "CSAT Rating", "Shopify integration", "REST API + Webhooks"],
  },
  {
    id: "BUSINESS",
    name: "Business",
    price: "₹8,999",
    period: "/month",
    description: "For large operations",
    color: "violet",
    highlights: ["Unlimited contacts", "500k messages / month", "50 agents", "RBAC permissions", "SLA management", "Audit log", "Priority support"],
  },
];

export default function ChoosePlanPage() {
  const router = useRouter();
  const [selected, setSelected] = useState("FREE");
  const [loading, setLoading] = useState(false);

  async function activate() {
    setLoading(true);
    if (selected === "FREE") {
      await fetch("/api/billing/activate-free", { method: "POST" });
      router.push("/dashboard");
    } else {
      const res = await fetch("/api/billing/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selected }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (data.razorpayOrderId) {
        // Open Razorpay modal — in demo mode just activate
        await fetch("/api/billing/activate-free", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan: selected }) });
        router.push("/dashboard");
      } else {
        router.push("/dashboard");
      }
      setLoading(false);
    }
  }

  const STEPS = ["Connect WhatsApp", "Choose Plan", "Done!"];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      {/* Steps */}
      <div className="mb-8 flex items-center justify-center gap-3">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold ${i === 1 ? "bg-emerald-500 text-white" : i === 0 ? "bg-emerald-200 text-emerald-700" : "bg-slate-200 text-slate-500"}`}>
              {i === 0 ? <Check size={13} strokeWidth={3} /> : i + 1}
            </div>
            <span className={`text-[13px] font-medium ${i === 1 ? "text-slate-900" : "text-slate-400"}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="h-px w-8 bg-slate-200" />}
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Choose your plan</h1>
          <p className="mt-2 text-[14px] text-slate-500">Start free, upgrade anytime. Cancel anytime. No hidden fees.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              className={`relative rounded-2xl border-2 p-5 text-left transition-all ${selected === plan.id ? "border-emerald-500 bg-white" : "border-slate-200 bg-white hover:border-slate-300"}`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3 py-0.5 text-[11px] font-bold text-white">Most Popular</span>
              )}
              <p className="text-[15px] font-bold text-slate-900">{plan.name}</p>
              <p className="mt-1 text-[12px] text-slate-500">{plan.description}</p>
              <p className="mt-3 text-[22px] font-bold text-slate-900">{plan.price}<span className="text-[12px] font-normal text-slate-400">{plan.period}</span></p>
              <ul className="mt-4 space-y-2">
                {plan.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-[12px] text-slate-600">
                    <Check size={12} strokeWidth={3} className="mt-0.5 shrink-0 text-emerald-500" />
                    {h}
                  </li>
                ))}
              </ul>
              {selected === plan.id && (
                <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                  <Check size={11} strokeWidth={3} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <button onClick={activate} disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-10 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-60">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
            {loading ? "Setting up…" : selected === "FREE" ? "Start Free" : `Start ${PLANS.find(p => p.id === selected)?.name} Plan`}
          </button>
          <p className="text-[12px] text-slate-400">
            {selected === "FREE" ? "No credit card required" : "14-day free trial · Cancel anytime"}
          </p>
        </div>
      </div>
    </div>
  );
}
