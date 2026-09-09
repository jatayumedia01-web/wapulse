"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { FAQ } from "@/lib/types";

export default function FAQAccordion({ items }: { items: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={item.question}
            className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-navy">{item.question}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-gold transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-4 text-sm leading-relaxed text-gray-text">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
