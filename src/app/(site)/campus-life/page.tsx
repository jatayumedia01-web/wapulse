import Image from "next/image";
import type { Metadata } from "next";
import PageHero from "@/components/school/PageHero";
import ScrollReveal from "@/components/school/ScrollReveal";
import SectionHeading from "@/components/school/SectionHeading";
import { clubs, facilities, galleryImages } from "@/lib/data";

export const metadata: Metadata = {
  title: "Campus Life | Bright Future International School",
  description: "Explore our 50-acre campus with world-class facilities, 30+ clubs, and vibrant student life.",
};

export default function CampusLifePage() {
  return (
    <>
      <PageHero
        label="Campus Life"
        title="A Vibrant Community Beyond the Classroom"
        subtitle="Our 50-acre campus offers world-class facilities where students explore passions, build friendships, and create lasting memories."
        image="https://images.unsplash.com/photo-1461896836934-ffe607ba8121?w=1600&h=500&fit=crop"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Campus Life" }]}
      />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading label="Facilities" title="World-Class Campus Infrastructure" align="center" />
          </ScrollReveal>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {facilities.map((facility, i) => (
              <ScrollReveal key={facility.title} delay={i * 80}>
                <article className="card-hover overflow-hidden rounded-2xl bg-white shadow-sm">
                  <div className="relative aspect-[16/10]">
                    <Image src={facility.image} alt={facility.title} fill className="object-cover" sizes="33vw" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-bold text-navy">{facility.title}</h3>
                    <p className="mt-2 text-sm text-gray-text">{facility.description}</p>
                    <ul className="mt-4 space-y-1.5">
                      {facility.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-gray-text">
                          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                          {f}
                        </li>
                      ))}
                    </ul>
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
            <SectionHeading label="Clubs & Activities" title="30+ Clubs for Every Interest" align="center" />
          </ScrollReveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {clubs.map((club, i) => (
              <ScrollReveal key={club.name} delay={i * 60}>
                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <span className="rounded bg-navy/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
                    {club.category}
                  </span>
                  <h3 className="mt-3 font-semibold text-navy">{club.name}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-gray-text">{club.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading label="Gallery" title="Life at Bright Future" align="center" />
          </ScrollReveal>
          <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-4">
            {galleryImages.map((src, i) => (
              <ScrollReveal key={src} delay={i * 50}>
                <div className="relative mb-4 break-inside-avoid overflow-hidden rounded-xl">
                  <Image
                    src={src}
                    alt={`Campus gallery ${i + 1}`}
                    width={600}
                    height={i % 2 === 0 ? 450 : 350}
                    className="w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
