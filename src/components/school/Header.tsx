"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/data";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-gray-200/80 bg-white/95 shadow-md backdrop-blur-md"
          : "border-transparent bg-white"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="#home" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy shadow-md">
            <span className="font-serif text-xl font-bold text-gold">B</span>
          </div>
          <div className="hidden sm:block">
            <p className="font-serif text-base font-bold leading-tight text-navy lg:text-lg">
              Bright Future
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gold lg:text-xs">
              International School
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-navy/80 transition-colors hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#admissions"
            className="btn-gold hidden rounded px-5 py-2.5 text-xs sm:inline-block sm:text-sm"
          >
            APPLY NOW
          </a>
          <button
            type="button"
            aria-label="Toggle menu"
            className="rounded-lg p-2 text-navy transition-colors hover:bg-cream xl:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-100 bg-white xl:hidden">
          <nav className="flex flex-col px-4 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="border-b border-gray-50 py-3 text-sm font-medium text-navy/80 transition-colors hover:text-gold"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#admissions"
              className="btn-gold mt-4 rounded py-3 text-center text-sm"
              onClick={() => setOpen(false)}
            >
              APPLY NOW
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
