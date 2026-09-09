import { Award, Globe2, Shield, Sparkles, Users2 } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";
import CTABanner from "@/components/school/CTABanner";
import PageHero from "@/components/school/PageHero";
import ScrollReveal from "@/components/school/ScrollReveal";
import SectionHeading from "@/components/school/SectionHeading";
import {
  aboutCards,
  aboutStats,
  accreditations,
  coreValues,
  facultyMembers,
  leadership,
  timeline,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us | Bright Future International School",
  description: "Our mission, values, leadership, accreditations, and 25+ years of educational excellence.",
};

const valueIcons = [Sparkles, Shield, Award, Globe2];
const cardIcons = [Users2, Award, Globe2];

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="About Our School"
        title="Excellence in Education, Character for Life"
        subtitle="For over two decades, we have nurtured curious minds and built strong character in a diverse, inclusive community."
        image="https://images.unsplash.com/photo-1562774053-701939374585?w=1600&h=500&fit=crop"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <ScrollReveal>
              <SectionHeading
                label="Our Story"
                title="A Legacy of Excellence Since 1998"
                description="Bright Future International School was founded with a vision to provide world-class education that balances academic rigor with character development. Today, we serve 1,500+ students from 20+ countries on our 50-acre campus in New Delhi."
              />
              <div className="mt-8 flex flex-wrap gap-8">
                {aboutStats.map((stat) => (
                  <div key={stat.label}>
                    <p className="font-serif text-3xl font-bold text-navy">{stat.value}</p>
                    <p className="mt-1 text-xs font-medium text-gray-text">{stat.label}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
                <Image src="https://images.unsplash.com/photo-1562774053-701939374585?w=900&h=700&fit=crop" alt="School campus" fill className="object-cover" sizes="50vw" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading label="Mission & Vision" title="What Drives Us Forward" align="center" />
          </ScrollReveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <ScrollReveal delay={100}>
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                <h3 className="font-serif text-xl font-bold text-navy">Our Mission</h3>
                <p className="mt-4 text-sm leading-relaxed text-gray-text">
                  To inspire every student to achieve academic excellence, develop strong character,
                  and become compassionate global citizens who contribute meaningfully to society.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                <h3 className="font-serif text-xl font-bold text-navy">Our Vision</h3>
                <p className="mt-4 text-sm leading-relaxed text-gray-text">
                  To be recognized as India&apos;s leading international school, setting benchmarks
                  in holistic education, innovation, and student wellbeing for generations to come.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading label="Accreditations" title="Globally Recognized Standards" align="center" />
          </ScrollReveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {accreditations.map((acc, i) => (
              <ScrollReveal key={acc.name} delay={i * 80}>
                <div className="card-hover rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                  <p className="font-serif text-2xl font-bold text-gold">{acc.year}</p>
                  <h3 className="mt-2 text-sm font-bold text-navy">{acc.name}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-gray-text">{acc.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading label="Core Values" title="The Principles We Live By" align="center" />
          </ScrollReveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value, i) => {
              const Icon = valueIcons[i];
              return (
                <ScrollReveal key={value.title} delay={i * 80}>
                  <div className="card-hover rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
                      <Icon className="h-5 w-5 text-gold" />
                    </div>
                    <h3 className="mt-4 font-serif text-lg font-bold text-navy">{value.title}</h3>
                    <p className="mt-2 text-sm text-gray-text">{value.description}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-navy py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading label="Our Journey" title="Milestones Through the Years" light align="center" />
          </ScrollReveal>
          <div className="relative mt-12 space-y-6">
            {timeline.map((item, i) => (
              <ScrollReveal key={item.year} delay={i * 80}>
                <div className="flex gap-6 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <p className="font-serif text-2xl font-bold text-gold">{item.year}</p>
                  <p className="text-sm text-white/75">{item.event}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading label="Leadership" title="Meet Our Leadership Team" align="center" />
          </ScrollReveal>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {leadership.map((person, i) => (
              <ScrollReveal key={person.name} delay={i * 100}>
                <article className="card-hover overflow-hidden rounded-2xl bg-white shadow-sm">
                  <div className="relative aspect-[4/5]">
                    <Image src={person.image} alt={person.name} fill className="object-cover" sizes="33vw" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-bold text-navy">{person.name}</h3>
                    <p className="mt-1 text-sm font-semibold text-gold">{person.role}</p>
                    <p className="mt-3 text-sm leading-relaxed text-gray-text">{person.bio}</p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading label="Our Faculty" title="Expert Educators Across Disciplines" align="center" />
          </ScrollReveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {facultyMembers.map((member, i) => (
              <ScrollReveal key={member.name} delay={i * 60}>
                <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
                    <Image src={member.image} alt={member.name} fill className="object-cover" sizes="64px" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy">{member.name}</h3>
                    <p className="text-xs font-medium text-gold">{member.department}</p>
                    <p className="mt-0.5 text-xs text-gray-text">{member.qualification}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {aboutCards.map((card, i) => {
              const Icon = cardIcons[i];
              return (
                <ScrollReveal key={card.subtitle} delay={i * 80}>
                  <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy/5">
                      <Icon className="h-6 w-6 text-gold" />
                    </div>
                    <div>
                      <p className="font-serif text-2xl font-bold text-navy">{card.title}</p>
                      <p className="text-sm text-gray-text">{card.subtitle}</p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <CTABanner
        title="Join the Bright Future Family"
        description="Discover why 1,500+ families trust us with their children's education."
        primaryLabel="APPLY NOW"
        primaryHref="/admissions"
        secondaryLabel="CONTACT US"
        secondaryHref="/contact"
      />
    </>
  );
}
