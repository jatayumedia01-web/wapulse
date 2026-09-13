import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Clock, MessageCircle, ArrowRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/marketing/ui";
import ContactForm from "@/components/marketing/ContactForm";

export const metadata: Metadata = {
  title: "Contact — WAPulse",
  description: "Talk to the WAPulse team about sales, support or partnerships. We usually respond within one business day.",
};

const INFO_CARDS = [
  { icon: Mail, title: "Email us", value: "hello@wapulse.io", sub: "For general enquiries", color: "#10b981" },
  { icon: MessageCircle, title: "Chat on WhatsApp", value: "+91 98765 43210", sub: "Fastest way to reach us", color: "#3b82f6" },
  { icon: MapPin, title: "Head office", value: "HITEC City, Hyderabad, India", sub: "Remote-first team", color: "#8b5cf6" },
  { icon: Clock, title: "Response time", value: "< 1 business day", sub: "Mon–Fri, 9am–7pm IST", color: "#f59e0b" },
];

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-16 sm:pt-20">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "linear-gradient(135deg,#f0f4ff 0%,#e8eeff 40%,#f5f3ff 70%,#ecfdf5 100%)" }}
        />
        <Container>
          <SectionHeading
            eyebrow="Contact us"
            title="Let's talk about your WhatsApp channel"
            description="Whether you're evaluating WAPulse, need a hand with setup, or want to explore an enterprise plan — our team is here to help."
          />
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.15fr]">
            {/* Info column */}
            <div className="space-y-4">
              {INFO_CARDS.map((c) => (
                <div key={c.title} className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <span
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-white"
                    style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}cc)`, boxShadow: `0 6px 16px ${c.color}40` }}
                  >
                    <c.icon size={18} />
                  </span>
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">{c.title}</p>
                    <p className="mt-0.5 text-[15px] font-bold text-slate-900">{c.value}</p>
                    <p className="text-[12.5px] text-slate-400">{c.sub}</p>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg,#eef2ff,#f5f3ff)" }}>
                <p className="text-[13.5px] font-semibold text-slate-700">Already a WAPulse customer?</p>
                <p className="mt-1 text-[12.5px] text-slate-500">Get faster support by logging into your workspace.</p>
                <Link href="/auth/login" className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-emerald-600 hover:text-emerald-700">
                  Log in to your workspace <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Form column */}
            <ContactForm />
          </div>
        </Container>
      </section>
    </>
  );
}
