import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { campusHighlights } from "@/lib/data";

export default function CampusLife() {
  return (
    <section id="campus" className="bg-cream py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="section-label">Campus Life</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-navy sm:text-4xl">
              A Vibrant Community Beyond the Classroom
            </h2>
            <p className="mt-4 text-base text-gray-text">
              Our 50-acre campus offers world-class facilities where students
              explore passions, build friendships, and create lasting memories.
            </p>
          </div>
          <a
            href="#contact"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-navy transition-colors hover:text-gold"
          >
            Explore Campus
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {campusHighlights.map((item) => (
            <article
              key={item.title}
              className="card-hover group overflow-hidden rounded-2xl bg-white shadow-sm"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-bold text-navy">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-text">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
