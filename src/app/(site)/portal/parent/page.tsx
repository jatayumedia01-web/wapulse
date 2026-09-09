import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/school/PageHero";

export const metadata: Metadata = {
  title: "Parent Portal | Bright Future International School",
};

export default function ParentPortalPage() {
  return (
    <>
      <PageHero
        label="Parent Portal"
        title="Welcome, Parents"
        subtitle="Access your child's academic progress, attendance, fee payments, and school communications."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Parent Portal" }]}
      />
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-md px-4 sm:px-6">
          <form className="space-y-5 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-navy">Sign In</h2>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gold"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gold"
            />
            <button type="button" className="btn-navy w-full rounded-lg py-3 text-sm">
              LOGIN
            </button>
            <p className="text-center text-xs text-gray-text">
              Need access?{" "}
              <Link href="/contact" className="font-semibold text-gold hover:underline">
                Contact the school office
              </Link>
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
