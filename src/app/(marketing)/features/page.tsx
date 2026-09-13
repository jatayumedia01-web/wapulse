import type { Metadata } from "next";
import {
  MessagesSquare, MessageSquareText, StickyNote, Users2, Clock,
  Sparkles, Bot, GitBranch, Megaphone, BookTemplate, Zap,
  Store, Users, Globe, Webhook, BarChart3, ShieldCheck,
} from "lucide-react";
import { Container, SectionHeading, CTABanner } from "@/components/marketing/ui";

export const metadata: Metadata = {
  title: "Features — WAPulse",
  description: "Explore every WAPulse module: team inbox, AI automation, broadcast marketing, commerce and developer tools — all on the official WhatsApp Cloud API.",
};

type Feature = { icon: React.ElementType; title: string; description: string };
type Group = { id: string; title: string; description: string; color: string; features: Feature[] };

const GROUPS: Group[] = [
  {
    id: "inbox",
    title: "Team Inbox & Collaboration",
    description: "One shared inbox so your whole team can support customers without stepping on each other.",
    color: "#6366f1",
    features: [
      { icon: MessagesSquare, title: "Shared Team Inbox", description: "Delivery/read ticks, sentiment flags, labels, conversation search, resolve & reopen." },
      { icon: MessageSquareText, title: "Quick Replies", description: "Canned responses — type /shortcut in the composer for instant insertion." },
      { icon: StickyNote, title: "Private Notes", description: "Internal team notes inside conversations, never sent to the customer." },
      { icon: Users2, title: "Auto-assignment", description: "Round-robin assignment to the least-loaded agent, with per-agent performance metrics." },
      { icon: Clock, title: "Working Hours", description: "Business hours per weekday with automatic away messages outside hours." },
    ],
  },
  {
    id: "ai",
    title: "AI & Automation",
    description: "Let AI and rules handle the repetitive work so your team can focus on what matters.",
    color: "#10b981",
    features: [
      { icon: Bot, title: "AI Agent", description: "Auto-replies using OpenAI (optional) or the built-in intent engine, with a per-conversation on/off toggle." },
      { icon: Sparkles, title: "AI Copilot", description: "One-click smart reply suggestions for agents, and sentiment detection on every inbound message." },
      { icon: GitBranch, title: "Chatbot Flows", description: "Visual multi-step button-based journeys with keyword triggers and branch navigation." },
      { icon: Zap, title: "Automation Rules", description: "Keyword auto-replies, welcome messages and AI fallback with priority ordering and hit analytics." },
    ],
  },
  {
    id: "marketing",
    title: "Marketing & Engagement",
    description: "Reach the right audience, at the right time, with messages that convert.",
    color: "#f59e0b",
    features: [
      { icon: Megaphone, title: "Broadcast Campaigns", description: "Tag-based audience targeting, scheduling, retargeting (read-not-replied) and a full funnel view." },
      { icon: BookTemplate, title: "Template Manager", description: "Templates with media headers, variables ({{1}}) and URL/phone/quick-reply buttons — with a live preview." },
      { icon: GitBranch, title: "Drip Sequences", description: "Multi-step, time-delayed message journeys that nurture leads automatically." },
    ],
  },
  {
    id: "commerce",
    title: "Commerce & CRM",
    description: "Sell and manage your customer relationships without leaving the chat window.",
    color: "#ec4899",
    features: [
      { icon: Store, title: "Commerce", description: "Product catalog, WhatsApp orders with auto-generated payment links, and a full order lifecycle." },
      { icon: Users, title: "Contacts CRM", description: "Tags, opt-in management, CSV import/export, and fast search across your audience." },
      { icon: Globe, title: "Web Widget", description: "Website chat button generator, wa.me click-to-chat links and QR codes." },
    ],
  },
  {
    id: "developers",
    title: "Developer & Ops",
    description: "Build on top of WAPulse, integrate with your stack, and keep an eye on performance.",
    color: "#0ea5e9",
    features: [
      { icon: Globe, title: "Developer API", description: "A Gupshup-style public REST API (POST /api/v1/messages) with API key management." },
      { icon: Webhook, title: "Outgoing Webhooks", description: "Push events — message.received, order.paid, campaign.completed — to Zapier, n8n or your backend." },
      { icon: BarChart3, title: "Analytics", description: "Message volume timeline, delivery/read rates, AI-handled count and agent performance." },
      { icon: ShieldCheck, title: "WhatsApp Cloud API", description: "Native Meta Graph API integration: text, template & interactive messages, and webhook status updates." },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-16 sm:pt-20">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "linear-gradient(135deg,#f0f4ff 0%,#e8eeff 40%,#f5f3ff 70%,#ecfdf5 100%)" }}
        />
        <Container>
          <SectionHeading
            eyebrow="Product"
            title="Everything you need to run WhatsApp at scale"
            description="From the first hello to repeat purchases, WAPulse covers the full customer journey in one workspace — inbox, automation, marketing, commerce and developer tools."
          />
        </Container>
      </section>

      {GROUPS.map((group, idx) => (
        <section key={group.id} id={group.id} className={`py-16 ${idx % 2 === 1 ? "bg-white" : ""}`}>
          <Container>
            <div className="mb-10 flex items-start gap-4">
              <span
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl text-white text-[15px] font-bold"
                style={{ background: `linear-gradient(135deg, ${group.color}, ${group.color}cc)`, boxShadow: `0 8px 20px ${group.color}40` }}
              >
                {idx + 1}
              </span>
              <div>
                <h2 className="text-[22px] font-bold text-slate-900 sm:text-[26px]">{group.title}</h2>
                <p className="mt-1.5 max-w-2xl text-[14.5px] text-slate-500">{group.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {group.features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl p-6"
                  style={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(99,102,241,0.08)", boxShadow: "0 4px 16px rgba(99,102,241,0.05)" }}
                >
                  <div
                    className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-xl text-white"
                    style={{ background: `linear-gradient(135deg, ${group.color}, ${group.color}cc)` }}
                  >
                    <f.icon size={18} strokeWidth={2} />
                  </div>
                  <h3 className="text-[15px] font-bold text-slate-900">{f.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">{f.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      ))}

      {/* Demo mode callout */}
      <section className="py-16">
        <Container>
          <div className="flex flex-col items-center gap-6 rounded-3xl p-8 sm:flex-row sm:p-10" style={{ background: "linear-gradient(135deg,#eef2ff,#f5f3ff)" }}>
            <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-white" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow: "0 10px 24px rgba(99,102,241,0.35)" }}>
              <Sparkles size={24} />
            </span>
            <div>
              <h3 className="text-[18px] font-bold text-slate-900">Try everything in Demo Mode — no Meta account needed</h3>
              <p className="mt-1.5 text-[14px] text-slate-600">
                The entire product works out of the box. Sends are simulated with realistic delivery and read receipts, so you can explore every feature before connecting a real WhatsApp Business number.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container>
          <CTABanner
            title="See it all in action"
            description="Create a free workspace and explore every module in demo mode — or book a walkthrough with our team."
            secondaryLabel="Book a walkthrough"
          />
        </Container>
      </section>
    </>
  );
}
