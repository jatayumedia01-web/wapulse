import type { Metadata } from "next";
import Link from "next/link";
import CTABanner from "@/components/school/CTABanner";
import PageHero from "@/components/school/PageHero";
import PortalFeatures from "@/components/school/PortalFeatures";
import ScrollReveal from "@/components/school/ScrollReveal";
import SectionHeading from "@/components/school/SectionHeading";
import { parentPortalFeatures } from "@/lib/data";

export const metadata: Metadata = {
  title: "Parent Portal | Bright Future International School",
  description: "Access your child's academic progress, attendance, fees, and school communications.",
};

export default function ParentPortalPage() {
  return (
    <>
      <PageHero
        label="Parent Portal"
        title="Welcome, Parents"
        subtitle="Access your child's academic progress, attendance, fee payments, and school communications — all in one place."
        image="https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1600&h=500&fit=crop"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Parent Portal" }]}
      />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <ScrollReveal>
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-navy">Sign In</h2>
                <p className="mt-2 text-sm text-gray-text">
                  Use the email address registered with the school to access your account.
                </p>
                <form className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-navy">Email Address</label>
                    <input
                      type="email"
                      placeholder="parent@email.com"
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
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-gray-text">
                      <input type="checkbox" className="rounded border-gray-300" />
                      Remember me
                    </label>
                    <Link href="/contact" className="font-medium text-gold hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <button type="button" className="btn-navy w-full rounded-lg py-3 text-sm">
                    LOGIN TO PORTAL
                  </button>
                </form>
                <p className="mt-6 text-center text-xs text-gray-text">
                  Need access?{" "}
                  <Link href="/contact" className="font-semibold text-gold hover:underline">
                    Contact the school office
                  </Link>
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <SectionHeading label="Portal Features" title="What You Can Access" />
              <div className="mt-6">
                <PortalFeatures features={parentPortalFeatures} />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <CTABanner
        title="New Parent?"
        description="Learn about admissions and schedule a campus tour."
        primaryLabel="ADMISSIONS"
        primaryHref="/admissions"
        secondaryLabel="CONTACT US"
        secondaryHref="/contact"
      />
    </>
  );
}
