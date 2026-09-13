"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 py-5">
      <button
        className="flex w-full items-center justify-between gap-4 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="text-[15px] font-semibold text-slate-800">{question}</span>
        <ChevronDown
          size={18}
          className="flex-shrink-0 text-slate-400 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {open && <p className="mt-3 text-[14px] leading-relaxed text-slate-500 anim-fade-in">{answer}</p>}
    </div>
  );
}
