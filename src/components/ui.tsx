"use client";

import { X } from "lucide-react";

// ── Page Header ──────────────────────────────────────────────────────────────

export function PageHeader({
  title, subtitle, action,
}: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between px-8 py-6">
      <div>
        <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="mt-0.5 text-[13px] text-slate-500">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-2.5">{action}</div>}
    </div>
  );
}

// ── Button ───────────────────────────────────────────────────────────────────

export function Button({
  children, onClick, variant = "primary", type = "button", disabled, className = "", size = "md",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "glass";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "px-3 py-1.5 text-[12px]",
    md: "px-4 py-2 text-[13px]",
    lg: "px-6 py-3 text-[14px]",
  };
  const styles = {
    primary:   "gradient-emerald text-white shadow-lg shadow-emerald-200/60 hover:shadow-emerald-300/60 hover:-translate-y-px active:translate-y-0",
    secondary: "bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300",
    danger:    "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100",
    ghost:     "text-slate-500 hover:bg-white/70 hover:text-slate-700",
    glass:     "btn-glass text-slate-700",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${sizes[size]} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────

export function Badge({
  children, tone = "slate",
}: { children: React.ReactNode; tone?: string }) {
  const tones: Record<string, string> = {
    slate:  "bg-slate-100 text-slate-600 border-slate-200",
    green:  "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber:  "bg-amber-50 text-amber-700 border-amber-200",
    red:    "bg-rose-50 text-rose-600 border-rose-200",
    blue:   "bg-sky-50 text-sky-700 border-sky-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${tones[tone] ?? tones.slate}`}>
      {children}
    </span>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────

export function Card({
  children, className = "", hover = true,
}: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={`glass-card ${hover ? "" : "!transform-none"} ${className}`}>
      {children}
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

export function StatCard({
  label, value, sub, icon: Icon, tone = "emerald", delta,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  tone?: "emerald" | "blue" | "violet" | "amber" | "rose" | "sky";
  delta?: { value: string; up: boolean };
}) {
  const tones = {
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", grad: "gradient-emerald" },
    blue:    { bg: "bg-blue-50",    text: "text-blue-600",    grad: "gradient-blue" },
    violet:  { bg: "bg-violet-50",  text: "text-violet-600",  grad: "gradient-violet" },
    amber:   { bg: "bg-amber-50",   text: "text-amber-600",   grad: "gradient-amber" },
    rose:    { bg: "bg-rose-50",    text: "text-rose-600",    grad: "gradient-rose" },
    sky:     { bg: "bg-sky-50",     text: "text-sky-600",     grad: "gradient-sky" },
  };
  const t = tones[tone];
  return (
    <div className="glass-card p-5 fade-up">
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${t.grad} shadow-lg`}>
          <Icon size={18} className="text-white" strokeWidth={2} />
        </div>
        {delta && (
          <span className={`text-[11px] font-semibold ${delta.up ? "text-emerald-600" : "text-rose-500"}`}>
            {delta.up ? "↑" : "↓"} {delta.value}
          </span>
        )}
      </div>
      <p className="mt-4 text-[26px] font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-0.5 text-[12.5px] font-medium text-slate-500">{label}</p>
      {sub && <p className="mt-1 text-[11.5px] text-slate-400">{sub}</p>}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────

export function Modal({
  open, onClose, title, children, wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 fade-in"
      style={{ background: "rgba(15,23,42,0.35)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className={`scale-in w-full ${wide ? "max-w-2xl" : "max-w-md"} max-h-[90vh] overflow-y-auto glass-card p-7`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Field ─────────────────────────────────────────────────────────────────────

export function Field({
  label, children, hint,
}: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-[11.5px] text-slate-400">{hint}</span>}
    </label>
  );
}

// ── Input class ───────────────────────────────────────────────────────────────

export const inputCls =
  "input-glass w-full px-4 py-2.5 text-[13.5px] text-slate-800 placeholder:text-slate-400";

// ── Empty State ───────────────────────────────────────────────────────────────

export function EmptyState({
  icon: Icon, title, description, action,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100">
        <Icon size={28} className="text-slate-400" />
      </div>
      <p className="text-[15px] font-semibold text-slate-700">{title}</p>
      {description && <p className="mt-1.5 max-w-xs text-[13px] text-slate-400">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ── Status tone helper ────────────────────────────────────────────────────────

export function statusTone(s: string): string {
  const m: Record<string, string> = {
    COMPLETED: "green", RUNNING: "blue", SCHEDULED: "amber",
    DRAFT: "slate", FAILED: "red", OPEN: "blue", PENDING: "amber",
    RESOLVED: "green", ACTIVE: "green", CANCELLED: "slate", PAST_DUE: "red",
  };
  return m[s] ?? "slate";
}

// ── Progress Bar ──────────────────────────────────────────────────────────────

export function ProgressBar({
  value, max, tone = "emerald",
}: { value: number; max: number; tone?: string }) {
  const pct = max === 0 ? 0 : Math.min((value / max) * 100, 100);
  const colors: Record<string, string> = {
    emerald: "gradient-emerald",
    blue:    "gradient-blue",
    amber:   "gradient-amber",
    rose:    "gradient-rose",
  };
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full transition-all duration-700 ${colors[tone] ?? colors.emerald}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-7 w-7 text-[11px]", md: "h-9 w-9 text-[13px]", lg: "h-11 w-11 text-[15px]" };
  return (
    <div className={`flex shrink-0 items-center justify-center rounded-xl gradient-emerald font-bold text-white shadow-md shadow-emerald-200 ${sizes[size]}`}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
