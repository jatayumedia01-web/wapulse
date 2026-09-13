import type { Metadata } from "next";
import { Container } from "@/components/marketing/ui";

export const metadata: Metadata = {
  title: "Privacy Policy — WAPulse",
  description: "How WAPulse collects, uses and protects your data.",
};

const SECTIONS = [
  {
    title: "1. Overview",
    body: "This Privacy Policy explains how WAPulse (\"we\", \"us\") collects, uses, and safeguards information when you use our website and WhatsApp Business platform (the \"Service\"). By using WAPulse, you agree to the practices described here.",
  },
  {
    title: "2. Information we collect",
    body: "We collect account information you provide (name, email, business name), usage data (messages sent, feature usage, log data), and information from connected WhatsApp Business numbers necessary to operate the Service. We do not sell your data or your customers' data to third parties.",
  },
  {
    title: "3. How we use information",
    body: "We use collected information to provide and improve the Service, deliver customer support, send important account and billing notifications, and — with your consent — send product updates. Message content sent through the Team Inbox is used solely to power the platform's features (delivery tracking, AI replies, analytics) for your organization.",
  },
  {
    title: "4. Data storage & security",
    body: "Data is stored using industry-standard encryption in transit (TLS) and access is restricted to authorized personnel. WAPulse can be self-hosted, in which case your organization is responsible for the security of your own infrastructure and database.",
  },
  {
    title: "5. Third-party services",
    body: "We integrate with the official Meta WhatsApp Cloud API, Razorpay for payments, and Resend for transactional email. Each of these providers has its own privacy practices governing data they process on our behalf.",
  },
  {
    title: "6. Data retention",
    body: "We retain account and conversation data for as long as your account is active, or as needed to provide the Service. You may request deletion of your organization's data by contacting privacy@wapulse.io.",
  },
  {
    title: "7. Your rights",
    body: "Depending on your location, you may have rights to access, correct, export or delete your personal data. Contact us at privacy@wapulse.io to exercise these rights.",
  },
  {
    title: "8. Changes to this policy",
    body: "We may update this Privacy Policy from time to time. Material changes will be communicated via email or an in-app notice before they take effect.",
  },
  {
    title: "9. Contact us",
    body: "Questions about this policy? Reach out at privacy@wapulse.io or through our Contact page.",
  },
];

export default function PrivacyPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-emerald-600">Legal</p>
          <h1 className="mt-2 text-[32px] font-bold tracking-tight text-slate-900 sm:text-[38px]">Privacy Policy</h1>
          <p className="mt-3 text-[13.5px] text-slate-400">Last updated: January 2026</p>

          <div className="mt-10 space-y-8">
            {SECTIONS.map((s) => (
              <div key={s.title}>
                <h2 className="text-[17px] font-bold text-slate-900">{s.title}</h2>
                <p className="mt-2 text-[14.5px] leading-relaxed text-slate-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
