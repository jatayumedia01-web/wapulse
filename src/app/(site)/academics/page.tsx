import { ArrowRight, BookOpen, GraduationCap, Lightbulb } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/school/PageHero";
import Programs from "@/components/school/Programs";
import ScrollReveal from "@/components/school/ScrollReveal";
import SectionHeading from "@/components/school/SectionHeading";

export const metadata: Metadata = {
  title: "Academics | Bright Future International School",
  description: "Explore our academic programs from Early Years to High School with international curriculum.",
};

const approach = [
  {
    icon: BookOpen,
    title: "Inquiry-Based Learning",
    description: "Students learn by asking questions, investigating, and discovering answers collaboratively.",
  },
  {
    icon: Lightbulb,
    title: "STEM Integration",
    description: "Science, technology, engineering, and math woven into every grade level.",
  },
  {
    icon: GraduationCap,
    title: "University Pathways",
    description: "Dedicated counseling and AP/IB courses for global university admissions.",
  },
];

export default function AcademicsPage() {
  return (
    <>
      <PageHero
        label="Academics"
        title="Discover Our Programs"
        subtitle="A comprehensive curriculum designed to inspire curiosity, build critical thinking, and prepare students for a global future."
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
                <Image
                  src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900&h=700&fit=crop"
                  alt="Students in classroom"
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Programs />

      <section className="bg-navy py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
              Ready to find the right program?
            </h2>
            <p className="mt-3 text-white/70">Speak with our admissions team for personalized guidance.</p>
            <Link
              href="/admissions"
              className="btn-gold mt-6 inline-flex items-center gap-2 rounded px-8 py-3.5 text-sm"
            >
              APPLY NOW
              <ArrowRight className="h-4 w-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
