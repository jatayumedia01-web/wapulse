import Link from "next/link";
import { Zap, MessageCircle, Globe2, Mail } from "lucide-react";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/auth/register", label: "Get started" },
      { href: "/auth/login", label: "Log in" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/contact", label: "Contact" },
      { href: "/contact", label: "Book a demo" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-200">
                <Zap size={18} strokeWidth={2.5} />
              </span>
              <span className="text-[17px] font-bold tracking-tight text-slate-900">WAPulse</span>
            </Link>
            <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-slate-500">
              The complete WhatsApp Business platform — shared inbox, AI copilot, broadcast campaigns, chatbot flows and commerce, built on the official WhatsApp Cloud API.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[MessageCircle, Globe2, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-emerald-600"
                  aria-label="social link"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className="col-span-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{col.title}</p>
              <ul className="mt-3.5 space-y-2.5">
                {col.links.map((link, i) => (
                  <li key={`${link.href}-${i}`}>
                    <Link href={link.href} className="text-[13.5px] text-slate-600 transition-colors hover:text-emerald-600">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row">
          <p className="text-[12.5px] text-slate-400">© {new Date().getFullYear()} WAPulse. All rights reserved.</p>
          <p className="text-[12.5px] text-slate-400">Built on the official WhatsApp Cloud API. Not affiliated with Meta or WhatsApp Inc.</p>
        </div>
      </div>
    </footer>
  );
}
