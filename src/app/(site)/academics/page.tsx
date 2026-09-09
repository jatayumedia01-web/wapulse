import { ArrowRight, BookOpen, GraduationCap, Lightbulb, Target } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import CTABanner from "@/components/school/CTABanner";
import PageHero from "@/components/school/PageHero";
import Programs from "@/components/school/Programs";
import ScrollReveal from "@/components/school/ScrollReveal";
import SectionHeading from "@/components/school/SectionHeading";

export const metadata: Metadata = {
  title: "Academics | Bright Future International School",
  description: "International curriculum, assessment philosophy, and programs from Early Years to High School.",
};

const approach = [
  { icon: BookOpen, title: "Inquiry-Based Learning", description: "Students learn by asking questions, investigating, and discovering answers collaboratively." },
  { icon: Lightbulb, title: "STEM Integration", description: "Science, technology, engineering, and math woven into every grade level with dedicated labs." },
  { icon: GraduationCap, title: "University Pathways", description: "Dedicated counseling, AP/IB courses, and partnerships with top global universities." },
  { icon: Target, title: "Personalized Learning", description: "15:1 student-teacher ratio ensures individualized attention and mentoring." },
];

const frameworks = [
  { name: "Cambridge Primary & IGCSE", grades: "Grades 1–10", description: "Internationally recognized curriculum with rigorous assessments." },
  { name: "International Baccalaureate (IB)", grades: "Grades 11–12", description: "IB Diploma Programme preparing students for global universities." },
  { name: "Advanced Placement (AP)", grades: "Grades 9–12", description: "College-level courses with credit opportunities at US universities." },
];

export default function AcademicsPage() {
  return (
    <>
      <PageHero
        label="Academics"
        title="Discover Our Programs"
        subtitle="A comprehensive international curriculum designed to inspire curiosity, build critical thinking, and prepare students for a global future."
        image="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&h=500&fit=crop"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Academics" }]}
      />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <ScrollReveal>
              <SectionHeading
                label="Our Approach"
                title="Learning That Transforms"
                description="We combine international curriculum standards with innovative teaching methods, ensuring every student receives personalized attention and opportunities to excel."
              />
              <div className="mt-8 space-y-6">
                {approach.map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                      <item.icon className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy">{item.title}</h3>
                      <p className="mt-1 text-sm text-gray-text">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
                <Image src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900&h=700&fit=crop" alt="Students in classroom" fill className="object-cover" sizes="50vw" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading label="Curriculum Frameworks" title="Internationally Recognized Programmes" align="center" />
          </ScrollReveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {frameworks.map((fw, i) => (
              <ScrollReveal key={fw.name} delay={i * 80}>
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                  <span className="rounded bg-navy/5 px-2.5 py-1 text-[10px] font-bold uppercase text-gold">{fw.grades}</span>
                  <h3 className="mt-3 font-serif text-lg font-bold text-navy">{fw.name}</h3>
                  <p className="mt-2 text-sm text-gray-text">{fw.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              label="Assessment & Support"
              title="Continuous Growth & University Readiness"
              description="Our assessment philosophy focuses on growth over grades. Regular formative assessments, project-based evaluations, and comprehensive report cards keep parents informed. From Grade 9, dedicated career counselors guide students through university applications, SAT prep, and scholarship opportunities."
            />
          </ScrollReveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { stat: "98%", label: "University Acceptance Rate" },
              { stat: "₹2.5Cr+", label: "Scholarships (Class of 2025)" },
              { stat: "40+", label: "University Partners Worldwide" },
            ].map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 80}>
                <div className="rounded-xl bg-navy p-6 text-center text-white">
                  <p className="font-serif text-3xl font-bold text-gold">{item.stat}</p>
                  <p className="mt-1 text-sm text-white/70">{item.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Programs />

      <CTABanner
        title="Ready to Find the Right Program?"
        description="Speak with our admissions team for personalized guidance on the best fit for your child."
        primaryLabel="APPLY NOW"
        primaryHref="/admissions"
        secondaryLabel="MEET OUR FACULTY"
        secondaryHref="/about"
      />
    </>
  );
}
