import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { newsEvents } from "@/lib/data";
import NewsCard from "./NewsCard";

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
            <NewsCard key={item.slug} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
