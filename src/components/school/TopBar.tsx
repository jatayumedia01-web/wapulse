import { Mail, MapPin, Phone } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-navy-dark text-white/90 text-xs sm:text-sm">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-2.5 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-gold" />
            123 Education Lane, New Delhi, India
          </span>
          <span className="hidden items-center gap-1.5 sm:flex">
            <Phone className="h-3.5 w-3.5 shrink-0 text-gold" />
            +91 98765 43210
          </span>
          <span className="hidden items-center gap-1.5 md:flex">
            <Mail className="h-3.5 w-3.5 shrink-0 text-gold" />
            info@brightfuture.edu.in
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="transition-colors hover:text-gold">
            Parent Portal
          </a>
          <span className="text-white/30">|</span>
          <a href="#" className="transition-colors hover:text-gold">
            Student Login
          </a>
        </div>
      </div>
    </div>
  );
}
