"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Eye, EyeOff, Loader2, Check } from "lucide-react";

const PERKS = [
  "Free forever plan — no credit card needed",
  "Connect WhatsApp in 2 minutes",
  "AI-powered inbox, chatbot flows, campaigns",
  "14-day free trial of Growth plan",
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", businessName: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    if (data.emailVerified) {
      router.push("/onboarding/connect-whatsapp");
    } else {
      router.push("/auth/check-email");
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white">
              <Zap size={24} strokeWidth={2.5} />
            </span>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-900">Create your workspace</h1>
              <p className="mt-1 text-[13.5px] text-slate-500">Set up WAPulse for your business — free forever</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">Your name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ravi Kumar"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-[14px] outline-none focus:border-emerald-400 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">Business name</label>
                  <input
                    required
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    placeholder="Acme Pvt Ltd"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-[14px] outline-none focus:border-emerald-400 focus:bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">Work email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-[14px] outline-none focus:border-emerald-400 focus:bg-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    minLength={8}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 8 characters"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-10 text-[14px] outline-none focus:border-emerald-400 focus:bg-white"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {error && <div className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-[13px] font-medium text-rose-700">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? "Creating workspace…" : "Create free workspace"}
            </button>

            <p className="mt-4 text-center text-[11.5px] text-slate-400">
              By registering you agree to our Terms & Privacy Policy.
            </p>
            <p className="mt-3 text-center text-[13px] text-slate-500">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-semibold text-emerald-600 hover:text-emerald-700">Sign in</Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right — perks panel */}
      <div className="hidden flex-col justify-center bg-[#0c1b1e] px-12 lg:flex lg:w-[420px]">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500">
            <Zap size={18} strokeWidth={2.5} className="text-white" />
          </span>
          <p className="text-[17px] font-bold text-white">WAPulse</p>
        </div>
        <p className="mb-8 text-[13.5px] leading-relaxed text-slate-400">
          The complete WhatsApp Business platform — inbox, campaigns, chatbots, drip sequences, AI replies, and commerce. Built for every business.
        </p>
        <div className="space-y-4">
          {PERKS.map((perk) => (
            <div key={perk} className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <Check size={11} strokeWidth={3} />
              </span>
              <p className="text-[13.5px] text-slate-300">{perk}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-white/5 p-5">
          <p className="text-[13px] italic text-slate-400">
            &ldquo;WAPulse helped us automate 80% of our customer queries and tripled our campaign open rates.&rdquo;
          </p>
          <p className="mt-3 text-[12px] font-semibold text-slate-500">— Sneha R., D2C Fashion Brand, Hyderabad</p>
        </div>
      </div>
    </div>
  );
}
