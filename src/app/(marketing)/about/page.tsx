import type { Metadata } from "next";
import { Heart, Rocket, ShieldCheck, Users, Target, Sparkles } from "lucide-react";
import { Container, SectionHeading, StatCard, CTABanner } from "@/components/marketing/ui";

export const metadata: Metadata = {
  title: "About — WAPulse",
  description: "WAPulse is on a mission to make the WhatsApp Business Cloud API accessible to every business — with a self-hosted, AI-powered alternative to Interakt, Gupshup and WATI.",
};

const VALUES = [
  { icon: Heart, title: "Customer obsession", description: "We build features by watching real support teams and marketers use WhatsApp every day, not by guessing.", color: "#ef4444" },
  { icon: Rocket, title: "Move fast, ship often", description: "Small, focused releases beat big-bang launches. We ship improvements weekly and listen closely to feedback.", color: "#f59e0b" },
  { icon: ShieldCheck, title: "Security & privacy first", description: "Customer data and conversations are handled with the same care we'd want for our own business.", color: "#3b82f6" },
  { icon: Users, title: "Built for every business", description: "From solo founders to enterprise support teams — WAPulse scales with you, not around you.", color: "#8b5cf6" },
];

const TEAM = [
  { name: "Ananya Rao", role: "Co-founder & CEO", color: "#6366f1" },
  { name: "Vikram Shah", role: "Co-founder & CTO", color: "#10b981" },
  { name: "Meera Iyer", role: "Head of Product", color: "#f59e0b" },
  { name: "Karan Desai", role: "Head of Customer Success", color: "#ec4899" },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-16 sm:pt-20">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "linear-gradient(135deg,#f0f4ff 0%,#e8eeff 40%,#f5f3ff 70%,#ecfdf5 100%)" }}
        />
        <Container>
          <SectionHeading
            eyebrow="Our story"
            title="Making WhatsApp Business tools accessible to every team"
            description="WAPulse started as a simple question: why does every WhatsApp Business tool feel expensive, closed, and built for enterprises only? We set out to build a self-hosted, AI-powered alternative — one that any business could run, extend and afford."
          />
        </Container>
      </section>

      {/* Stats */}
      <section className="pb-16">
        <Container>
          <div className="grid grid-cols-2 gap-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100 sm:grid-cols-4 sm:p-10">
            <StatCard value="2022" label="Founded" />
            <StatCard value="Self-hosted" label="Deployment model" />
            <StatCard value="14+" label="Product modules" />
            <StatCard value="100%" label="Official Cloud API" />
          </div>
        </Container>
      </section>

      {/* Mission */}
      <section className="py-16" style={{ background: "linear-gradient(180deg,#f8faff 0%,#eef2ff 100%)" }}>
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1.5 text-[12.5px] font-semibold text-emerald-700">
                <Target size={13} /> Our mission
              </span>
              <h2 className="mt-4 text-[26px] font-bold text-slate-900 sm:text-[30px]">
                Give every business the tools that only enterprises could afford
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
                Interakt, Gupshup and WATI proved that businesses want to sell and support customers on WhatsApp. But
                closed platforms, per-seat pricing and long contracts left smaller teams behind. WAPulse is our answer:
                a full-featured, self-hosted WhatsApp Business platform — team inbox, AI automation, campaigns and
                commerce — that any team can run on their own terms.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
                We build directly on top of the official Meta WhatsApp Cloud API, so every message you send is fully
                compliant, and every feature we ship works with your existing WhatsApp Business number.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "AI-first", icon: Sparkles, color: "#10b981" },
                { label: "Open & self-hosted", icon: ShieldCheck, color: "#3b82f6" },
                { label: "Built for teams", icon: Users, color: "#8b5cf6" },
                { label: "Ships fast", icon: Rocket, color: "#f59e0b" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-100">
                  <span
                    className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl text-white"
                    style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}cc)` }}
                  >
                    <item.icon size={19} />
                  </span>
                  <p className="mt-3 text-[13px] font-semibold text-slate-700">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="What we believe" title="The values behind every release" />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(99,102,241,0.08)", boxShadow: "0 4px 16px rgba(99,102,241,0.05)" }}>
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
                  style={{ background: `linear-gradient(135deg, ${v.color}, ${v.color}cc)`, boxShadow: `0 6px 16px ${v.color}40` }}
                >
                  <v.icon size={19} />
                </span>
                <h3 className="mt-4 text-[15px] font-bold text-slate-900">{v.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">{v.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="py-16 sm:py-20" style={{ background: "linear-gradient(180deg,#f8faff 0%,#ffffff 100%)" }}>
        <Container>
          <SectionHeading eyebrow="Leadership" title="The team building WAPulse" />
          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {TEAM.map((member) => (
              <div key={member.name} className="text-center">
                <div
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl text-[20px] font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}cc)`, boxShadow: `0 8px 20px ${member.color}40` }}
                >
                  {member.name.split(" ").map((w) => w[0]).join("")}
                </div>
                <p className="mt-3 text-[14px] font-bold text-slate-800">{member.name}</p>
                <p className="text-[12.5px] text-slate-400">{member.role}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 pb-20 sm:pb-28">
        <Container>
          <CTABanner
            title="Join businesses building on WAPulse"
            description="Start your free workspace today, or reach out — we'd love to hear what you're building."
            secondaryLabel="Get in touch"
          />
        </Container>
      </section>
    </>
  );
}
