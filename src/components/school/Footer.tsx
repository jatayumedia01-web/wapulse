"use client";

import { Mail, MapPin, Phone, Send } from "lucide-react";
import Link from "next/link";
import { footerLinks, siteConfig } from "@/lib/data";

const socialLinks = [
  { label: "FB", href: "#" },
  { label: "IG", href: "#" },
  { label: "YT", href: "#" },
  { label: "IN", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy">
                <span className="font-serif text-xl font-bold text-gold">B</span>
              </div>
              <div>
                <p className="font-serif text-lg font-bold">Bright Future</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gold">
                  International School
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              Inspiring minds and shaping futures since 1998. A premier
              international school committed to academic excellence and holistic
              development.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-[10px] font-bold text-white/70 transition-all hover:border-gold hover:bg-gold hover:text-navy-dark"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gold">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.quick.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gold">
              Resources
            </h4>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gold">
              Contact Us
            </h4>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-3 text-sm text-white/60">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                {siteConfig.address}
              </li>
              <li className="flex gap-3 text-sm text-white/60">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                {siteConfig.phone}
              </li>
              <li className="flex gap-3 text-sm text-white/60">
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                {siteConfig.email}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-xl border border-white/10 bg-navy/50 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="font-serif text-xl font-bold">Stay Updated</h4>
              <p className="mt-1 text-sm text-white/60">
                Subscribe to our newsletter for news and events.
              </p>
            </div>
            <form
              className="flex w-full max-w-md gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-gold"
              />
              <button
                type="submit"
                className="btn-gold flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                aria-label="Subscribe"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center">
        <p className="text-xs text-white/40">
          &copy; {new Date().getFullYear()} Bright Future International School.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}
