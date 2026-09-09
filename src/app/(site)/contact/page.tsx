import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import ContactForm from "@/components/school/ContactForm";
import PageHero from "@/components/school/PageHero";
import ScrollReveal from "@/components/school/ScrollReveal";
import SectionHeading from "@/components/school/SectionHeading";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact Us | Bright Future International School",
  description: "Get in touch with our admissions and administration team.",
};

const contactInfo = [
  { icon: MapPin, title: "Address", value: siteConfig.address },
  { icon: Phone, title: "Phone", value: siteConfig.phone },
  { icon: Mail, title: "Email", value: siteConfig.email },
  { icon: Clock, title: "Office Hours", value: "Mon–Sat: 8:00 AM – 4:00 PM" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        label="Contact Us"
        title="We'd Love to Hear From You"
        subtitle="Reach out for admissions inquiries, campus tours, or general questions. Our team is here to help."
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
                        <p className="mt-0.5 text-sm text-gray-text">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={150}>
                <div className="mt-10 overflow-hidden rounded-2xl bg-cream">
                  <iframe
                    title="School location map"
                    src="https://maps.google.com/maps?q=New+Delhi+India&output=embed"
                    className="h-64 w-full border-0"
                    loading="lazy"
                  />
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={100} className="lg:col-span-3">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="font-serif text-2xl font-bold text-navy">Send Us a Message</h2>
                <p className="mt-2 text-sm text-gray-text">Fill out the form and we&apos;ll respond within 24 hours.</p>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section id="privacy" className="border-t border-gray-100 bg-cream py-12">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-xs leading-relaxed text-gray-text">
            Your privacy is important to us. Information submitted through this form is used solely
            for school communication purposes and is never shared with third parties.
          </p>
        </div>
      </section>
    </>
  );
}
