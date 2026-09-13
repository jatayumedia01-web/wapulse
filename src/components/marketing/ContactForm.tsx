"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Send } from "lucide-react";

const SUBJECTS = ["Sales enquiry", "Product support", "Partnership", "Something else"];

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", company: "", subject: SUBJECTS[0], message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-emerald-50 px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-200">
          <CheckCircle2 size={28} />
        </span>
        <h3 className="mt-5 text-[18px] font-bold text-slate-900">Message sent!</h3>
        <p className="mt-2 max-w-sm text-[14px] text-slate-500">
          Thanks for reaching out, {form.name.split(" ")[0] || "there"}. Our team will get back to you within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-100 sm:p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">Full name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ravi Kumar"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-[14px] outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-400/15"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">Work email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@company.com"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-[14px] outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-400/15"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">Company</label>
          <input
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder="Acme Pvt Ltd"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-[14px] outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-400/15"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">What can we help with?</label>
          <select
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-[14px] outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-400/15"
          >
            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">Message</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Tell us a little about your business and what you're looking for…"
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-[14px] outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-400/15"
        />
      </div>

      {error && <div className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-[13px] font-medium text-rose-700">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-[14.5px] font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
        {loading ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
