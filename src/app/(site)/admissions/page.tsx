import { Calendar, CheckCircle, FileText, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import ApplicationForm from "@/components/school/ApplicationForm";
import FAQAccordion from "@/components/school/FAQAccordion";
import PageHero from "@/components/school/PageHero";
import ScrollReveal from "@/components/school/ScrollReveal";
import SectionHeading from "@/components/school/SectionHeading";
import { admissionFAQs, admissionSteps, feeStructure } from "@/lib/data";

export const metadata: Metadata = {
  title: "Admissions | Bright Future International School",
  description: "Apply now for 2026–27. Learn about our admission process, fees, and scholarships.",
};

const highlights = [
  { icon: Calendar, title: "Feb 15", subtitle: "Application Deadline" },
  { icon: FileText, title: "Mar 1", subtitle: "Entrance Assessment" },
  { icon: Users, title: "Apr 10", subtitle: "Session Begins" },
  { icon: CheckCircle, title: "50%", subtitle: "Max Scholarship" },
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
                <p className="mt-2 font-serif text-2xl font-bold text-navy">{item.title}</p>
                <p className="text-xs text-gray-text">{item.subtitle}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              label="How to Apply"
              title="Simple 5-Step Admission Process"
              align="center"
            />
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

      <section id="fees" className="bg-cream py-16 sm:py-24">
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
            </div>
          </ScrollReveal>
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
                Prefer to visit in person?{" "}
                <Link href="/contact" className="font-semibold text-gold hover:underline">
                  Schedule a campus tour
                </Link>
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
    </>
  );
}
