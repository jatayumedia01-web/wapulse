import { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold"
      style={{ background: "rgba(16,185,129,0.1)", color: "#059669" }}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  center = true,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={`mx-auto max-w-2xl ${center ? "text-center" : ""}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-4 text-[28px] font-bold tracking-tight text-slate-900 sm:text-[36px]">{title}</h2>
      {description && <p className="mt-4 text-[15.5px] leading-relaxed text-slate-500">{description}</p>}
    </div>
  );
}

export function PrimaryButton({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-300 ${className}`}
    >
      {children}
    </Link>
  );
}

export function SecondaryButton({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-[15px] font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md ${className}`}
    >
      {children}
    </Link>
  );
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  color = "#6366f1",
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color?: string;
}) {
  return (
    <div
      className="group rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1"
      style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(99,102,241,0.08)", boxShadow: "0 4px 20px rgba(99,102,241,0.06)" }}
    >
      <div
        className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-white transition-transform duration-200 group-hover:scale-110"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, boxShadow: `0 6px 16px ${color}40` }}
      >
        <Icon size={20} strokeWidth={2} />
      </div>
      <h3 className="text-[16px] font-bold text-slate-900">{title}</h3>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-500">{description}</p>
    </div>
  );
}

export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-[32px] font-black tracking-tight text-slate-900 sm:text-[38px]">{value}</p>
      <p className="mt-1 text-[13px] font-medium text-slate-500">{label}</p>
    </div>
  );
}

export function TestimonialCard({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(99,102,241,0.08)", boxShadow: "0 4px 20px rgba(99,102,241,0.06)" }}
    >
      <div className="mb-3 flex gap-0.5 text-amber-400">
        {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
      </div>
      <p className="text-[14px] leading-relaxed text-slate-600">&ldquo;{quote}&rdquo;</p>
      <div className="mt-5 flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-bold text-white"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
        >
          {name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
        </div>
        <div>
          <p className="text-[13px] font-bold text-slate-800">{name}</p>
          <p className="text-[12px] text-slate-400">{role}</p>
        </div>
      </div>
    </div>
  );
}

export function CTABanner({
  title,
  description,
  primaryLabel = "Start free — no credit card",
  primaryHref = "/auth/register",
  secondaryLabel = "Talk to sales",
  secondaryHref = "/contact",
}: {
  title: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-14"
      style={{ background: "linear-gradient(135deg,#065f46 0%,#047857 45%,#0f766e 100%)" }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{
        backgroundImage: "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.15) 0%, transparent 40%), radial-gradient(circle at 85% 80%, rgba(255,255,255,0.12) 0%, transparent 40%)",
      }} />
      <div className="relative">
        <h2 className="text-[26px] font-bold text-white sm:text-[34px]">{title}</h2>
        {description && <p className="mx-auto mt-3 max-w-xl text-[15px] text-emerald-50/90">{description}</p>}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={primaryHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-[15px] font-bold text-emerald-700 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            {primaryLabel} <ArrowRight size={16} />
          </Link>
          <Link
            href={secondaryHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-[15px] font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/20"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}

