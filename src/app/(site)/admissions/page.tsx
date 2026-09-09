import { Calendar, CheckCircle, Download, FileText, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import ApplicationForm from "@/components/school/ApplicationForm";
import CTABanner from "@/components/school/CTABanner";
import FAQAccordion from "@/components/school/FAQAccordion";
import PageHero from "@/components/school/PageHero";
import ScrollReveal from "@/components/school/ScrollReveal";
import SectionHeading from "@/components/school/SectionHeading";
import {
  admissionFAQs,
  admissionSteps,
  feeStructure,
  requiredDocuments,
  scholarships,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Admissions | Bright Future International School",
  description: "Apply for 2026–27. Admission process, fees, scholarships, and online application.",
};

const highlights = [
  { icon: Calendar, title: "Feb 15, 2026", subtitle: "Application Deadline" },
  { icon: FileText, title: "Mar 1, 2026", subtitle: "Entrance Assessment" },
  { icon: Users, title: "Apr 10, 2026", subtitle: "Session Begins" },
  { icon: CheckCircle, title: "Up to 50%", subtitle: "Scholarship Available" },
];

export default function AdmissionsPage() {
  return (
    <>
      <PageHero
        label="Admissions Open 2026–27"
        title="Begin Your Journey Toward a Bright Future"
        subtitle="Applications are now open for all grade levels. Join a community where every student is empowered to reach their full potential."
        image="https://images.unsplash.com/photo-1427504494784-3a9ca7044f45?w=1600&h=500&fit=crop"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Admissions" }]}
      />

      <section className="border-b border-gray-100 bg-white py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
          {highlights.map((item, i) => (
            <ScrollReveal key={item.subtitle} delay={i * 80}>
              <div className="text-center">
                <item.icon className="mx-auto h-6 w-6 text-gold" />
                <p className="mt-2 font-serif text-xl font-bold text-navy sm:text-2xl">{item.title}</p>
                <p className="text-xs text-gray-text">{item.subtitle}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading label="How to Apply" title="Simple 5-Step Admission Process" align="center" />
          </ScrollReveal>
          <div className="mt-12 grid gap-6 md:grid-cols-5">
            {admissionSteps.map((step, i) => (
              <ScrollReveal key={step.step} delay={i * 80}>
                <div className="relative rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                    {step.step}
                  </div>
                  <h3 className="mt-4 font-semibold text-navy">{step.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-gray-text">{step.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading label="Required Documents" title="What You'll Need to Apply" align="center" />
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <ul className="grid gap-3 sm:grid-cols-2">
                {requiredDocuments.map((doc) => (
                  <li key={doc} className="flex items-start gap-2 text-sm text-gray-text">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    {doc}
                  </li>
                ))}
              </ul>
              <button type="button" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-gold">
                <Download className="h-4 w-4" />
                Download Application Checklist (PDF)
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="fees" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading label="Fee Structure" title="Transparent & Competitive Fees" align="center" />
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="mt-10 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-navy text-white">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Grade Level</th>
                    <th className="px-6 py-4 font-semibold">Annual Tuition</th>
                    <th className="px-6 py-4 font-semibold">Registration Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {feeStructure.map((row, i) => (
                    <tr key={row.grade} className={i % 2 === 0 ? "bg-white" : "bg-cream/50"}>
                      <td className="px-6 py-4 font-medium text-navy">{row.grade}</td>
                      <td className="px-6 py-4 text-gray-text">{row.tuition}</td>
                      <td className="px-6 py-4 text-gray-text">{row.registration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="border-t border-gray-100 px-6 py-4 text-xs text-gray-text">
                * Boarding, transport, and meal plans are additional. Contact accounts office for details.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading label="Scholarships" title="Financial Aid & Merit Awards" align="center" />
          </ScrollReveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {scholarships.map((s, i) => (
              <ScrollReveal key={s.name} delay={i * 80}>
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-navy">{s.name}</h3>
                    <span className="shrink-0 rounded bg-gold/10 px-3 py-1 text-xs font-bold text-gold-dark">
                      {s.coverage}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-text">{s.criteria}</p>
                  <p className="mt-3 text-xs font-medium text-navy">Deadline: {s.deadline}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <ScrollReveal>
              <SectionHeading
                label="Apply Online"
                title="Start Your Application Today"
                description="Complete the form below and our admissions team will guide you through the next steps."
              />
              <p className="mt-6 text-sm text-gray-text">
                Want to visit first?{" "}
                <Link href="/contact" className="font-semibold text-gold hover:underline">
                  Schedule a campus tour
                </Link>{" "}
                or call our admissions office at +91 98765 43211.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <ApplicationForm />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading label="FAQ" title="Frequently Asked Questions" align="center" />
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="mt-10">
              <FAQAccordion items={admissionFAQs} />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <CTABanner
        title="Questions About Admissions?"
        description="Our admissions team is ready to help you every step of the way."
        primaryLabel="CONTACT ADMISSIONS"
        primaryHref="/contact"
        secondaryLabel="VIEW CALENDAR"
        secondaryHref="/calendar"
      />
    </>
  );
}
