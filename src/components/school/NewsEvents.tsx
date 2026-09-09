import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { newsEvents } from "@/lib/data";

export default function NewsEvents({ preview = false }: { preview?: boolean }) {
  const items = preview ? newsEvents.slice(0, 3) : newsEvents;

  return (
    <section className="bg-cream py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="section-label">News & Events</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-navy sm:text-4xl">
              Latest from Our School
            </h2>
            <p className="mt-4 text-base text-gray-text">
              Stay updated with campus news, upcoming events, and student achievements.
            </p>
          </div>
          {preview && (
            <Link
              href="/news"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-navy transition-colors hover:text-gold"
            >
              View All News
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/news/${item.slug}`}
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
                <span className="absolute left-4 top-4 rounded bg-navy px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold">
                  {item.category}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-gray-text">
                  <Calendar className="h-3.5 w-3.5 text-gold" />
                  {item.date}
                </div>
                <h3 className="mt-3 font-serif text-lg font-bold leading-snug text-navy transition-colors group-hover:text-gold">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-text">{item.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy group-hover:text-gold">
                  Read More
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
