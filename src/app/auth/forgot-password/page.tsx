"use client";
import { useState } from "react";
import Link from "next/link";
import { Zap, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white"><Zap size={24} strokeWidth={2.5} /></span>
          <h1 className="text-2xl font-bold text-slate-900">Forgot password?</h1>
          <p className="text-[13.5px] text-slate-500">Enter your email and we&apos;ll send a reset link</p>
        </div>
        {sent ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
            <p className="font-semibold text-emerald-800">Check your inbox!</p>
            <p className="mt-2 text-[13px] text-emerald-700">If an account with <strong>{email}</strong> exists, we sent a password reset link.</p>
            <Link href="/auth/login" className="mt-4 inline-block text-[13px] font-semibold text-emerald-600 hover:text-emerald-700">Back to login</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">Email address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-[14px] outline-none focus:border-emerald-400 focus:bg-white" />
            </div>
            <button type="submit" disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-[14px] font-semibold text-white hover:bg-emerald-600 disabled:opacity-60">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Sending…" : "Send reset link"}
            </button>
            <p className="mt-4 text-center text-[13px] text-slate-500">
              <Link href="/auth/login" className="font-semibold text-emerald-600 hover:text-emerald-700">Back to login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
