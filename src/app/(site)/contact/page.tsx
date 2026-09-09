import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/school/ContactForm";
import CTABanner from "@/components/school/CTABanner";
import PageHero from "@/components/school/PageHero";
import ScrollReveal from "@/components/school/ScrollReveal";
import SectionHeading from "@/components/school/SectionHeading";
import { departments, siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact Us | Bright Future International School",
  description: "Get in touch with admissions, administration, accounts, and IT support.",
};

const contactInfo = [
  { icon: MapPin, title: "Address", value: siteConfig.address, href: undefined },
  { icon: Phone, title: "Phone", value: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/\s/g, "")}` },
  { icon: Mail, title: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { icon: Clock, title: "Office Hours", value: "Mon–Sat: 8:00 AM – 4:00 PM", href: undefined },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        label="Contact Us"
        title="We'd Love to Hear From You"
        subtitle="Reach out for admissions inquiries, campus tours, fee questions, or general information. Our team responds within 24 hours."
        image="https://images.unsplash.com/photo-1427504494784-3a9ca7044f45?w=1600&h=500&fit=crop"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <ScrollReveal>
                <SectionHeading label="Get in Touch" title="Contact Information" />
                <div className="mt-8 space-y-6">
                  {contactInfo.map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                        <item.icon className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy">{item.title}</p>
                        {item.href ? (
                          <a href={item.href} className="mt-0.5 text-sm text-gray-text transition-colors hover:text-gold">
                            {item.value}
                          </a>
                        ) : (
                          <p className="mt-0.5 text-sm text-gray-text">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={150}>
                <div className="mt-10 overflow-hidden rounded-2xl bg-cream shadow-sm">
                  <iframe
                    title="School location map"
                    src="https://maps.google.com/maps?q=123+Education+Lane+New+Delhi+India&output=embed"
                    className="h-64 w-full border-0"
                    loading="lazy"
                  />
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={100} className="lg:col-span-3">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="font-serif text-2xl font-bold text-navy">Send Us a Message</h2>
                <p className="mt-2 text-sm text-gray-text">
                  Select &ldquo;Schedule a Campus Tour&rdquo; to book your visit date.
                </p>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading label="Departments" title="Contact the Right Team" align="center" />
          </ScrollReveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {departments.map((dept, i) => (
              <ScrollReveal key={dept.name} delay={i * 60}>
                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <h3 className="font-semibold text-navy">{dept.name}</h3>
                  <a href={`mailto:${dept.email}`} className="mt-2 block text-sm text-gold hover:underline">
                    {dept.email}
                  </a>
                  <a href={`tel:${dept.phone.replace(/\s/g, "")}`} className="mt-1 block text-sm text-gray-text hover:text-navy">
                    {dept.phone}
                  </a>
                  <p className="mt-2 text-xs text-gray-text">{dept.hours}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title="Ready to Apply?"
        description="Start your application or download our prospectus."
        primaryLabel="APPLY NOW"
        primaryHref="/admissions"
        secondaryLabel="VIEW CALENDAR"
        secondaryHref="/calendar"
      />
    </>
  );
}
