import type { Metadata } from "next";
import PageHero from "@/components/school/PageHero";
import ScrollReveal from "@/components/school/ScrollReveal";
import { privacySections, siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Privacy Policy | Bright Future International School",
  description: "How Bright Future International School collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        label="Legal"
        title="Privacy Policy"
        subtitle="Your privacy matters to us. This policy explains how we handle your personal information."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
      />
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-sm text-gray-text">
              Last updated: January 2026. {siteConfig.name} is committed to protecting the privacy
              of students, parents, and visitors.
            </p>
          </ScrollReveal>
          <div className="mt-10 space-y-8">
            {privacySections.map((section, i) => (
              <ScrollReveal key={section.title} delay={i * 80}>
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h2 className="font-serif text-xl font-bold text-navy">{section.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-gray-text">{section.content}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
