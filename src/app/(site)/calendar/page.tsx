import { Calendar, GraduationCap, PartyPopper, Trophy } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import CTABanner from "@/components/school/CTABanner";
import PageHero from "@/components/school/PageHero";
import ScrollReveal from "@/components/school/ScrollReveal";
import SectionHeading from "@/components/school/SectionHeading";
import { calendarEvents } from "@/lib/data";

export const metadata: Metadata = {
  title: "School Calendar | Bright Future International School",
  description: "Academic calendar, events, holidays, and examination dates for 2026–27.",
};

const typeIcons = {
  Academic: GraduationCap,
  Event: PartyPopper,
  Holiday: Calendar,
  Exam: Trophy,
};

const typeColors = {
  Academic: "bg-blue-100 text-blue-800",
  Event: "bg-gold/20 text-gold-dark",
  Holiday: "bg-green-100 text-green-800",
  Exam: "bg-red-100 text-red-800",
};

export default function CalendarPage() {
  return (
    <>
      <PageHero
        label="School Calendar"
        title="Academic Year 2026–27"
        subtitle="Important dates, events, holidays, and examination schedules for the upcoming academic year."
        image="https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=1600&h=500&fit=crop"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "School Calendar" }]}
      />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              label="Upcoming Dates"
              title="Key Dates & Events"
              description="Mark your calendar with these important school dates. For event details, visit our News section."
              align="center"
            />
          </ScrollReveal>

          <div className="mt-12 space-y-4">
            {calendarEvents.map((event, i) => {
              const Icon = typeIcons[event.type];
              return (
                <ScrollReveal key={event.title + event.date} delay={i * 50}>
                  <div className="flex gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-navy/5">
                      <Icon className="h-5 w-5 text-gold" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${typeColors[event.type]}`}>
                          {event.type}
                        </span>
                        <span className="text-sm font-semibold text-gold">{event.date}</span>
                      </div>
                      <h3 className="mt-1 font-semibold text-navy">{event.title}</h3>
                      <p className="mt-1 text-sm text-gray-text">{event.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal delay={200}>
            <p className="mt-10 text-center text-sm text-gray-text">
              For detailed event coverage, visit our{" "}
              <Link href="/news" className="font-semibold text-gold hover:underline">
                News & Events
              </Link>{" "}
              page.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <CTABanner
        title="Plan Your Visit"
        description="Schedule a campus tour to experience Bright Future firsthand."
        primaryLabel="SCHEDULE A TOUR"
        primaryHref="/contact"
        secondaryLabel="VIEW ADMISSIONS"
        secondaryHref="/admissions"
      />
    </>
  );
}
