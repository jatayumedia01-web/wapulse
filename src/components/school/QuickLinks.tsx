import { ArrowRight, BookOpen, Calendar, GraduationCap, Map, Newspaper, Users } from "lucide-react";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import SectionHeading from "./SectionHeading";

const links = [
  { href: "/about", icon: Users, title: "About Us", desc: "Our story, values & leadership" },
  { href: "/academics", icon: BookOpen, title: "Academics", desc: "Programs & curriculum" },
  { href: "/admissions", icon: GraduationCap, title: "Admissions", desc: "Apply for 2026–27" },
  { href: "/campus-life", icon: Map, title: "Campus Life", desc: "Facilities, clubs & gallery" },
  { href: "/news", icon: Newspaper, title: "News & Events", desc: "Latest updates" },
  { href: "/calendar", icon: Calendar, title: "School Calendar", desc: "Upcoming dates" },
];

export default function QuickLinks() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading label="Explore" title="Discover Our School" align="center" />
        </ScrollReveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link, i) => (
            <ScrollReveal key={link.href} delay={i * 60}>
              <Link
                href={link.href}
                className="card-hover group flex items-start gap-4 rounded-xl border border-gray-100 bg-cream/30 p-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy/5 transition-colors group-hover:bg-gold/10">
                  <link.icon className="h-5 w-5 text-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-navy group-hover:text-gold">{link.title}</h3>
                  <p className="mt-1 text-sm text-gray-text">{link.desc}</p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-gold" />
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
