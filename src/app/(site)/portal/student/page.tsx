import type { Metadata } from "next";
import Link from "next/link";
import CTABanner from "@/components/school/CTABanner";
import PageHero from "@/components/school/PageHero";
import PortalFeatures from "@/components/school/PortalFeatures";
import ScrollReveal from "@/components/school/ScrollReveal";
import SectionHeading from "@/components/school/SectionHeading";
import { studentPortalFeatures } from "@/lib/data";

export const metadata: Metadata = {
  title: "Student Login | Bright Future International School",
  description: "Access assignments, grades, timetable, library resources, and school announcements.",
};

export default function StudentPortalPage() {
  return (
    <>
      <PageHero
        label="Student Portal"
        title="Student Login"
        subtitle="Access assignments, grades, timetable, library resources, and school announcements — your digital campus hub."
        image="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&h=500&fit=crop"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Student Login" }]}
      />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <ScrollReveal>
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-navy">Sign In</h2>
                <p className="mt-2 text-sm text-gray-text">
                  Use your student ID and password provided by the school IT department.
                </p>
                <form className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-navy">Student ID</label>
                    <input
                      type="text"
                      placeholder="e.g. BF2026042"
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-navy">Password</label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                    />
                  </div>
                  <div className="text-right text-sm">
                    <Link href="/contact" className="font-medium text-gold hover:underline">
                      Forgot password? Contact IT Support
                    </Link>
                  </div>
                  <button type="button" className="btn-navy w-full rounded-lg py-3 text-sm">
                    LOGIN TO PORTAL
                  </button>
                </form>
                <p className="mt-6 rounded-lg bg-cream p-4 text-xs text-gray-text">
                  First time logging in? Default password is your date of birth (DDMMYYYY). Change it after your first login.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <SectionHeading label="Portal Features" title="Your Digital Campus" />
              <div className="mt-6">
                <PortalFeatures features={studentPortalFeatures} />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <CTABanner
        title="Explore Campus Life"
        description="Discover clubs, sports, and activities beyond the classroom."
        primaryLabel="CAMPUS LIFE"
        primaryHref="/campus-life"
        secondaryLabel="VIEW CALENDAR"
        secondaryHref="/calendar"
      />
    </>
  );
}
