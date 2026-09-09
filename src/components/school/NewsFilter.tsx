"use client";

import { useState } from "react";
import { newsEvents } from "@/lib/data";
import NewsCard from "./NewsCard";

const categories = ["All", "Event", "News", "Achievement"] as const;

export default function NewsFilter() {
  const [active, setActive] = useState<string>("All");

  const filtered =
    active === "All" ? newsEvents : newsEvents.filter((n) => n.category === active);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
              active === cat
                ? "bg-navy text-white shadow-md"
                : "bg-white text-navy/70 hover:bg-cream"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <NewsCard key={item.slug} item={item} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="mt-12 text-center text-gray-text">No articles in this category yet.</p>
      )}
    </>
  );
}
