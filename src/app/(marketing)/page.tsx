import type { Metadata } from "next";
import Link from "next/link";
import {
  MessagesSquare, Bot, Megaphone, Store, Globe, GitBranch,
  ArrowRight, ShieldCheck, Clock, Sparkles, CheckCircle2,
} from "lucide-react";
import { Container, SectionHeading, PrimaryButton, SecondaryButton, FeatureCard, StatCard, TestimonialCard, CTABanner } from "@/components/marketing/ui";
import ChatMock from "@/components/marketing/ChatMock";

export const metadata: Metadata = {
  title: "WAPulse — WhatsApp Business Messaging Platform",
  description:
    "WAPulse is an AI-powered WhatsApp Business platform: shared team inbox, broadcast campaigns, chatbot automation, commerce and developer APIs — built on the official WhatsApp Cloud API.",
};

const INDUSTRIES = ["D2C & Fashion", "Retail", "Real Estate", "Education", "Healthcare", "SaaS & Services"];

const FEATURES = [
  { icon: MessagesSquare, title: "Team Inbox", description: "A shared, multi-agent inbox with delivery/read ticks, sentiment flags and one-click assignment.", color: "#6366f1" },
  { icon: Sparkles, title: "AI Copilot & Agent", description: "Smart reply suggestions for agents, plus a fully autonomous AI agent that resolves routine queries.", color: "#10b981" },
  { icon: Bot, title: "Chatbot Flows", description: "Visual, button-based conversation journeys with keyword triggers — no code required.", color: "#8b5cf6" },
  { icon: Megaphone, title: "Broadcast Campaigns", description: "Tag-based targeting, scheduling and a full sent → delivered → read → replied funnel.", color: "#f59e0b" },
  { icon: Store, title: "Commerce Suite", description: "Product catalog, WhatsApp orders and auto-generated payment links, right inside chat.", color: "#ec4899" },
  { icon: Globe, title: "Developer API", description: "A Gupshup-style REST API and outgoing webhooks so you can build on top of WAPulse.", color: "#0ea5e9" },
];

const STEPS = [
  { step: "01", title: "Connect WhatsApp in 2 minutes", description: "Link your WhatsApp Business number using the official Meta Cloud API — or start instantly in demo mode." },
  { step: "02", title: "Import contacts & templates", description: "Bring in your audience, set up message templates, and organize contacts with tags and custom fields." },
  { step: "03", title: "Automate, broadcast & grow", description: "Launch campaigns, turn on the AI agent, and let chatbot flows and drip sequences do the heavy lifting." },
];

const TESTIMONIALS = [
  { quote: "WAPulse helped us automate 80% of our customer queries and tripled our campaign open rates.", name: "Sneha R.", role: "D2C Fashion Brand, Hyderabad" },
  { quote: "We moved off three separate tools onto WAPulse. The team inbox and chatbot flows alone paid for themselves in a month.", name: "Arjun Mehta", role: "Head of Support, Bloom Retail" },
  { quote: "Setting up broadcast campaigns and the commerce catalog took an afternoon. Our WhatsApp channel is now our top revenue driver.", name: "Priya Nair", role: "Founder, Nair & Co. Home Decor" },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-14 pb-20 sm:pt-20 sm:pb-28">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "linear-gradient(135deg,#f0f4ff 0%,#e8eeff 35%,#f5f3ff 65%,#ecfdf5 100%)" }}
        />
        <div className="pointer-events-none absolute -top-40 right-0 -z-10 h-96 w-96 rounded-full opacity-50" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)" }} />
        <div className="pointer-events-none absolute top-40 -left-24 -z-10 h-80 w-80 rounded-full opacity-50" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)" }} />

        <Container>
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
            <div className="anim-fade-up">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-1.5 text-[12.5px] font-semibold text-emerald-700 shadow-sm ring-1 ring-emerald-100">
                <Sparkles size={13} /> AI-powered WhatsApp Business Platform
              </span>
              <h1 className="mt-5 text-[38px] font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-[48px] lg:text-[52px]">
                Turn WhatsApp into your{" "}
                <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                  #1 sales & support
                </span>{" "}
                channel
              </h1>
              <p className="mt-5 max-w-lg text-[16.5px] leading-relaxed text-slate-600">
                WAPulse gives your team a shared inbox, AI copilot, broadcast campaigns, chatbot flows and a full commerce suite — all built on the official WhatsApp Cloud API.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <PrimaryButton href="/auth/register">
                  Start free — no credit card <ArrowRight size={16} />
                </PrimaryButton>
                <SecondaryButton href="/contact">Book a demo</SecondaryButton>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-medium text-slate-500">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> Free forever plan</span>
                <span className="flex items-center gap-1.5"><Clock size={14} className="text-emerald-500" /> 2-minute setup</span>
                <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> Official Cloud API</span>
              </div>
            </div>

            <div className="anim-scale-in">
              <ChatMock />
            </div>
          </div>
        </Container>
      </section>

      {/* ── Industries strip ─────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-white py-8">
        <Container>
          <p className="text-center text-[12px] font-semibold uppercase tracking-widest text-slate-400">
            Built for growing businesses across
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {INDUSTRIES.map((ind) => (
              <span
                key={ind}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-[13px] font-medium text-slate-600"
              >
                {ind}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Stats ────────────────────────────────────────────────── */}
      <section className="py-16">
        <Container>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <StatCard value="80%" label="Queries auto-resolved by AI" />
            <StatCard value="3x" label="Higher campaign open rate" />
            <StatCard value="<2 min" label="To connect WhatsApp" />
            <StatCard value="50k+" label="Messages handled per month*" />
          </div>
          <p className="mt-6 text-center text-[11.5px] text-slate-400">*On the Growth plan and above. Demo mode available on every plan.</p>
        </Container>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Everything in one platform"
            title="One workspace for inbox, marketing & commerce"
            description="Stop juggling five different tools. WAPulse brings your team, your customers and your revenue into a single WhatsApp workspace."
          />
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} icon={f.icon} title={f.title} description={f.description} color={f.color} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/features" className="inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-emerald-600 hover:text-emerald-700">
              Explore all features <ArrowRight size={15} />
            </Link>
          </div>
        </Container>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-20" style={{ background: "linear-gradient(180deg,#f8faff 0%,#eef2ff 100%)" }}>
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="Live on WhatsApp in three steps"
            description="No developers required. Most teams are sending their first campaign within the hour."
          />
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.step} className="relative rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-100">
                <span className="text-[13px] font-black text-emerald-500">{s.step}</span>
                <h3 className="mt-3 text-[17px] font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-slate-500">{s.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Loved by teams"
            title="Businesses run their WhatsApp channel on WAPulse"
          />
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </Container>
      </section>

      {/* ── Pricing preview ──────────────────────────────────────── */}
      <section className="py-16 sm:py-20" style={{ background: "linear-gradient(180deg,#ffffff 0%,#f8faff 100%)" }}>
        <Container>
          <SectionHeading
            eyebrow="Simple pricing"
            title="Plans that grow with your business"
            description="Start on the free plan, upgrade as your conversations scale. No hidden fees, cancel anytime."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { name: "Free", price: "₹0", tag: "Forever free", features: ["250 contacts", "1,000 msgs/mo", "1 agent"] },
              { name: "Growth", price: "₹3,999", tag: "Most popular", features: ["15,000 contacts", "50,000 msgs/mo", "AI replies + API"] },
              { name: "Business", price: "₹8,999", tag: "Scale without limits", features: ["Unlimited contacts", "500k msgs/mo", "RBAC & audit logs"] },
            ].map((p) => (
              <div key={p.name} className={`rounded-2xl p-7 ${p.tag === "Most popular" ? "ring-2 ring-emerald-400 shadow-xl" : "ring-1 ring-slate-100 shadow-sm"} bg-white`}>
                <p className="text-[12px] font-bold uppercase tracking-wide text-emerald-600">{p.tag}</p>
                <p className="mt-2 text-[22px] font-bold text-slate-900">{p.name}</p>
                <p className="mt-1 text-[30px] font-black text-slate-900">{p.price}<span className="text-[13px] font-medium text-slate-400">{p.name !== "Free" ? "/mo" : ""}</span></p>
                <ul className="mt-4 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-[13.5px] text-slate-600">
                      <CheckCircle2 size={14} className="text-emerald-500" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/pricing" className="inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-emerald-600 hover:text-emerald-700">
              See full pricing & comparison <ArrowRight size={15} />
            </Link>
          </div>
        </Container>
      </section>

      {/* ── Modules strip ────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="rounded-3xl p-8 sm:p-12" style={{ background: "#0c1b1e" }}>
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-[12px] font-semibold text-emerald-400">
                  <GitBranch size={13} /> Drip sequences & automation
                </span>
                <h3 className="mt-4 text-[24px] font-bold text-white sm:text-[28px]">
                  Automations that run while you sleep
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-slate-400">
                  Keyword auto-replies, welcome messages, working-hours away notes and multi-step drip sequences keep every conversation moving — even off the clock.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {["Keyword automation", "Welcome messages", "Drip sequences", "Working hours"].map((label) => (
                  <div key={label} className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                    <p className="text-[13px] font-semibold text-white">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────── */}
      <section className="pb-20 sm:pb-28">
        <Container>
          <CTABanner
            title="Ready to grow with WhatsApp?"
            description="Join businesses using WAPulse to turn conversations into customers. Free forever plan, no credit card needed."
          />
        </Container>
      </section>
    </>
  );
}
