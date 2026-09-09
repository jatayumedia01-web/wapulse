import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/data";

export default function TopBar() {
  return (
    <div className="bg-navy-dark text-white/90 text-xs sm:text-sm">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-2.5 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-gold" />
            {siteConfig.address.split(",")[0]}, {siteConfig.address.split(",")[1]}
          </span>
          <span className="hidden items-center gap-1.5 sm:flex">
            <Phone className="h-3.5 w-3.5 shrink-0 text-gold" />
            {siteConfig.phone}
          </span>
          <span className="hidden items-center gap-1.5 md:flex">
            <Mail className="h-3.5 w-3.5 shrink-0 text-gold" />
            {siteConfig.email}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/portal/parent" className="transition-colors hover:text-gold">
            Parent Portal
          </Link>
          <span className="text-white/30">|</span>
          <Link href="/portal/student" className="transition-colors hover:text-gold">
            Student Login
          </Link>
        </div>
      </div>
    </div>
  );
}
