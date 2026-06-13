"use client";
import { ReactNode } from "react";

// ── Button ────────────────────────────────────────────────────────────────────
type BtnVariant = "primary" | "secondary" | "danger" | "ghost";

const BTN: Record<BtnVariant, string> = {
  primary:
    "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-150 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
  secondary:
    "inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-150 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed",
  danger:
    "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-150 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed",
  ghost:
    "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-150 hover:bg-slate-100 disabled:opacity-50",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  onClick,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  variant?: BtnVariant;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}) {
  const bg =
    variant === "primary"
      ? "bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-200"
      : variant === "danger"
      ? "bg-gradient-to-br from-rose-500 to-pink-600 shadow-rose-200"
      : "";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${BTN[variant]} ${bg} ${className}`}
    >
      {children}
    </button>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
type BadgeTone = "green" | "blue" | "amber" | "red" | "violet" | "slate" | "emerald" | "indigo";

const BADGE_STYLES: Record<BadgeTone, { bg: string; text: string }> = {
  green:   { bg: "rgba(16,185,129,0.1)",  text: "#059669" },
  emerald: { bg: "rgba(16,185,129,0.1)",  text: "#059669" },
  blue:    { bg: "rgba(59,130,246,0.1)",  text: "#2563eb" },
  indigo:  { bg: "rgba(99,102,241,0.1)",  text: "#4f46e5" },
  amber:   { bg: "rgba(245,158,11,0.12)", text: "#d97706" },
  red:     { bg: "rgba(239,68,68,0.1)",   text: "#dc2626" },
  violet:  { bg: "rgba(139,92,246,0.1)",  text: "#7c3aed" },
  slate:   { bg: "rgba(100,116,139,0.1)", text: "#475569" },
};

export function Badge({ children, tone = "slate" }: { children: ReactNode; tone?: BadgeTone }) {
  const s = BADGE_STYLES[tone] || BADGE_STYLES.slate;
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
      style={{ background: s.bg, color: s.text }}
    >
      {children}
    </span>
  );
}

export function statusTone(status: string): BadgeTone {
  const s = status?.toUpperCase();
  if (s === "OPEN" || s === "ACTIVE" || s === "RUNNING") return "green";
  if (s === "PENDING" || s === "SCHEDULED") return "blue";
  if (s === "RESOLVED" || s === "COMPLETED") return "slate";
  if (s === "FAILED" || s === "BLOCKED") return "red";
  if (s === "PAUSED") return "amber";
  return "slate";
}

// ── Input class ───────────────────────────────────────────────────────────────
export const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 shadow-sm";

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-white/80 shadow-lg ${className}`}
      style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
    >
      {children}
    </div>
  );
}

// ── PageHeader ────────────────────────────────────────────────────────────────
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative w-full rounded-2xl p-6 shadow-2xl anim-scale-in ${wide ? "max-w-2xl" : "max-w-lg"}`}
        style={{ background: "rgba(255,255,255,0.97)", border: "1px solid rgba(255,255,255,0.9)" }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────────────
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-white"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow: "0 8px 24px rgba(99,102,241,0.3)" }}
        >
          <Icon size={28} />
        </div>
      )}
      <p className="text-base font-bold text-slate-700">{title}</p>
      {description && <p className="mt-1.5 max-w-xs text-sm text-slate-400">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ── Field ─────────────────────────────────────────────────────────────────────
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-[12.5px] font-semibold text-slate-600">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11.5px] text-slate-400">{hint}</p>}
    </div>
  );
}

// ── ProgressBar ───────────────────────────────────────────────────────────────
export function ProgressBar({ value, max = 100, color = "#6366f1" }: { value: number; max?: number; color?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}cc, ${color})` }}
      />
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────
export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className="flex flex-shrink-0 items-center justify-center rounded-xl text-white font-semibold"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.33,
        background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
        boxShadow: "0 3px 10px rgba(99,102,241,0.35)",
      }}
    >
      {initials}
    </div>
  );
}
