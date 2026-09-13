import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, X, Sparkles, ArrowRight } from "lucide-react";
import { Container, SectionHeading, CTABanner } from "@/components/marketing/ui";
import { FAQItem } from "@/components/marketing/FAQItem";

export const metadata: Metadata = {
  title: "Pricing — WAPulse",
  description: "Simple, transparent WAPulse pricing. Start free, then pay as your WhatsApp conversations scale. Plans for startups to enterprise.",
};

const PLANS = [
  {
    id: "FREE", name: "Free", price: "₹0", per: "forever",
    color: "#94a3b8", gradient: "linear-gradient(135deg,#94a3b8,#64748b)",
    tag: null,
    description: "Try every module with demo mode — perfect for testing WAPulse.",
    features: ["250 contacts", "1,000 messages / mo", "1 agent seat", "Basic automation rules", "Community support"],
    cta: "Start free", href: "/auth/register",
  },
  {
    id: "STARTER", name: "Starter", price: "₹1,499", per: "/mo",
    color: "#3b82f6", gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)",
    tag: null,
    description: "For small teams getting serious about WhatsApp support & marketing.",
    features: ["2,000 contacts", "10,000 messages / mo", "3 agent seats", "Drip sequences", "Broadcast campaigns", "Email support"],
    cta: "Start free trial", href: "/auth/register",
  },
  {
    id: "GROWTH", name: "Growth", price: "₹3,999", per: "/mo",
    color: "#10b981", gradient: "linear-gradient(135deg,#10b981,#059669)",
    tag: "Most popular",
    description: "For growing teams that need AI automation and API access.",
    features: ["15,000 contacts", "50,000 messages / mo", "10 agent seats", "AI Copilot & AI Agent", "Developer API access", "Priority support"],
    cta: "Start free trial", href: "/auth/register",
  },
  {
    id: "BUSINESS", name: "Business", price: "₹8,999", per: "/mo",
    color: "#8b5cf6", gradient: "linear-gradient(135deg,#8b5cf6,#6366f1)",
    tag: null,
    description: "For high-volume teams that need scale, roles and audit logs.",
    features: ["Unlimited contacts", "500,000 messages / mo", "50 agent seats", "RBAC & audit logs", "Dedicated onboarding", "SLA-backed support"],
    cta: "Start free trial", href: "/auth/register",
  },
];

const COMPARISON: { label: string; values: (string | boolean)[] }[] = [
  { label: "Contacts", values: ["250", "2,000", "15,000", "Unlimited"] },
  { label: "Messages / month", values: ["1,000", "10,000", "50,000", "500,000"] },
  { label: "Agent seats", values: ["1", "3", "10", "50"] },
  { label: "Broadcast campaigns", values: [true, true, true, true] },
  { label: "Chatbot flows & automation", values: [true, true, true, true] },
  { label: "Drip sequences", values: [false, true, true, true] },
  { label: "AI Copilot & AI Agent", values: [false, false, true, true] },
  { label: "Developer API & webhooks", values: [false, false, true, true] },
  { label: "Commerce catalog & orders", values: [true, true, true, true] },
  { label: "RBAC & audit logs", values: [false, false, false, true] },
  { label: "Support", values: ["Community", "Email", "Priority", "SLA-backed"] },
];

const FAQS = [
  { q: "Is there really a free plan?", a: "Yes — the Free plan is free forever, no credit card required. It includes 250 contacts, 1,000 messages a month and full access to demo mode so you can try every feature before connecting a real WhatsApp Business number." },
  { q: "Can I change plans later?", a: "Absolutely. Upgrade or downgrade at any time from Settings → Billing. Upgrades apply immediately and unlock new limits right away; downgrades take effect at the end of your current billing cycle." },
  { q: "Do I need a Meta Business account?", a: "Only when you're ready to send real messages. WAPulse works fully in demo mode without any Meta account — sends are simulated with realistic delivery and read receipts, so your team can build campaigns and flows first." },
  { q: "How does billing work?", a: "Payments are processed securely through Razorpay. You can pay by card, UPI, net banking or wallet, and cancel or change plans at any time with no long-term lock-in." },
  { q: "What happens if I hit a plan limit?", a: "We'll notify you by email as you approach a limit (contacts, messages or campaigns). You can keep using WAPulse and upgrade whenever you're ready — nothing is cut off without warning." },
  { q: "Do you offer an Enterprise plan?", a: "Yes. For teams that need custom limits, dedicated infrastructure, SSO or a custom SLA, contact our sales team and we'll put together a tailored plan." },
];

export default function PricingPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-16 sm:pt-20">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "linear-gradient(135deg,#f0f4ff 0%,#e8eeff 40%,#f5f3ff 70%,#ecfdf5 100%)" }}
        />
        <Container>
          <SectionHeading
            eyebrow="Pricing"
            title="Simple, transparent pricing that grows with you"
            description="Start on the free plan. Upgrade only when your team and conversation volume are ready. No hidden fees, cancel anytime."
          />
        </Container>
      </section>

      <section className="pb-16">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`overflow-hidden rounded-2xl bg-white transition-all hover:-translate-y-1 ${plan.tag ? "shadow-xl" : "shadow-sm"}`}
                style={{ border: plan.tag ? `2px solid ${plan.color}` : "1px solid rgba(99,102,241,0.1)" }}
              >
                <div className="p-6" style={{ background: plan.gradient }}>
                  {plan.tag && (
                    <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[10.5px] font-bold text-white backdrop-blur-sm">
                      <Sparkles size={11} /> {plan.tag}
                    </span>
                  )}
                  <p className="text-[15px] font-bold text-white">{plan.name}</p>
                  <div className="mt-1.5 flex items-baseline gap-1">
                    <span className="text-[28px] font-black text-white">{plan.price}</span>
                    <span className="text-[12px] text-white/75">{plan.per}</span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-[13px] text-slate-500">{plan.description}</p>
                  <ul className="mt-4 space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[13px] text-slate-600">
                        <CheckCircle2 size={14} style={{ color: plan.color, flexShrink: 0, marginTop: 1 }} /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.href}
                    className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13px] font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                    style={{ background: plan.gradient, boxShadow: `0 4px 14px ${plan.color}40` }}
                  >
                    {plan.cta} <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Enterprise strip */}
          <div className="mt-8 flex flex-col items-center justify-between gap-5 rounded-2xl p-7 sm:flex-row" style={{ background: "#0c1b1e" }}>
            <div>
              <p className="text-[15px] font-bold text-white">Enterprise</p>
              <p className="mt-1 text-[13.5px] text-slate-400">Custom limits, dedicated infrastructure, SSO and a tailored SLA for large teams.</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-white px-5 py-2.5 text-[13.5px] font-bold text-slate-900 transition-all hover:-translate-y-0.5"
            >
              Contact sales <ArrowRight size={14} />
            </Link>
          </div>
        </Container>
      </section>

      {/* Comparison table */}
      <section className="py-16" style={{ background: "linear-gradient(180deg,#f8faff 0%,#eef2ff 100%)" }}>
        <Container>
          <SectionHeading eyebrow="Compare plans" title="Every plan, side by side" />
          <div className="mt-12 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
            <table className="w-full min-w-[640px] text-[13.5px]">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  <th className="px-5 py-4 font-semibold text-slate-500">Feature</th>
                  {PLANS.map((p) => (
                    <th key={p.id} className="px-5 py-4 text-center font-bold" style={{ color: p.color }}>{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.label} className="border-b border-slate-50 last:border-0">
                    <td className="px-5 py-3.5 font-medium text-slate-700">{row.label}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className="px-5 py-3.5 text-center">
                        {typeof v === "boolean" ? (
                          v ? <CheckCircle2 size={16} className="mx-auto text-emerald-500" /> : <X size={16} className="mx-auto text-slate-300" />
                        ) : (
                          <span className="font-semibold text-slate-700">{v}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <SectionHeading eyebrow="FAQ" title="Pricing questions, answered" />
            <div className="mt-10">
              {FAQS.map((f) => (
                <FAQItem key={f.q} question={f.q} answer={f.a} />
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container>
          <CTABanner title="Start free — upgrade only when you're ready" description="No credit card required. Cancel or change plans anytime." />
        </Container>
      </section>
    </>
  );
}
