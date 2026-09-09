import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "@/lib/types";

export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link
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
        <h3 className="mt-3 font-serif text-lg font-bold leading-snug text-navy group-hover:text-gold">
          {item.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-text">{item.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy group-hover:text-gold">
          Read More <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
