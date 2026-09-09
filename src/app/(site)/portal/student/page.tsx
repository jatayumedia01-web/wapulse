import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/school/PageHero";

export const metadata: Metadata = {
  title: "Student Login | Bright Future International School",
};

export default function StudentPortalPage() {
  return (
    <>
      <PageHero
        label="Student Portal"
        title="Student Login"
        subtitle="Access assignments, grades, timetable, library resources, and school announcements."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Student Login" }]}
      />
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-md px-4 sm:px-6">
          <form className="space-y-5 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-navy">Sign In</h2>
            <input
              type="text"
              placeholder="Student ID"
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
              Forgot password?{" "}
              <Link href="/contact" className="font-semibold text-gold hover:underline">
                Contact IT support
              </Link>
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
