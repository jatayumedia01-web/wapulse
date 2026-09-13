import type { Metadata } from "next";
import { Container } from "@/components/marketing/ui";

export const metadata: Metadata = {
  title: "Terms of Service — WAPulse",
  description: "The terms and conditions governing use of the WAPulse platform.",
};

const SECTIONS = [
  {
    title: "1. Acceptance of terms",
    body: "By creating an account or using WAPulse (the \"Service\"), you agree to be bound by these Terms of Service. If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these terms.",
  },
  {
    title: "2. The Service",
    body: "WAPulse provides a WhatsApp Business messaging platform including a team inbox, broadcast campaigns, chatbot automation, commerce tools and developer APIs, built on the official WhatsApp Cloud API. Features available to your account depend on your subscription plan.",
  },
  {
    title: "3. Accounts & eligibility",
    body: "You must provide accurate information when creating an account and are responsible for maintaining the confidentiality of your credentials. You must be authorized to represent the business connecting its WhatsApp number to WAPulse.",
  },
  {
    title: "4. Acceptable use",
    body: "You agree not to use the Service to send unsolicited spam, violate WhatsApp's Business Messaging Policy, transmit unlawful content, or attempt to reverse-engineer or disrupt the Service. We reserve the right to suspend accounts that violate these terms or Meta's platform policies.",
  },
  {
    title: "5. Billing & subscriptions",
    body: "Paid plans are billed in advance on a recurring basis via Razorpay. You may upgrade, downgrade or cancel your subscription at any time from Settings → Billing. Fees are non-refundable except where required by law.",
  },
  {
    title: "6. Data ownership",
    body: "You retain ownership of your business data, contacts and message content. We process this data solely to provide the Service to you, as described in our Privacy Policy.",
  },
  {
    title: "7. Service availability",
    body: "We aim for high availability but do not guarantee uninterrupted access. Scheduled maintenance and third-party outages (including Meta's WhatsApp Cloud API) may occasionally affect the Service.",
  },
  {
    title: "8. Limitation of liability",
    body: "The Service is provided \"as is\" without warranties of any kind. To the maximum extent permitted by law, WAPulse shall not be liable for indirect, incidental or consequential damages arising from use of the Service.",
  },
  {
    title: "9. Termination",
    body: "You may stop using the Service and close your account at any time. We may suspend or terminate accounts that violate these terms, with notice where reasonably possible.",
  },
  {
    title: "10. Changes to these terms",
    body: "We may update these Terms from time to time. Continued use of the Service after changes take effect constitutes acceptance of the revised terms.",
  },
  {
    title: "11. Contact",
    body: "Questions about these terms? Reach out at legal@wapulse.io or through our Contact page.",
  },
];

export default function TermsPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-emerald-600">Legal</p>
          <h1 className="mt-2 text-[32px] font-bold tracking-tight text-slate-900 sm:text-[38px]">Terms of Service</h1>
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
