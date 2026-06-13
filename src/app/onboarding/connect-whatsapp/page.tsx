"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, ExternalLink, CheckCircle, Loader2 } from "lucide-react";

const STEPS = ["Connect WhatsApp", "Choose Plan", "Done!"];

export default function ConnectWhatsAppPage() {
  const router = useRouter();
  const [form, setForm] = useState({ phoneNumberId: "", wabaId: "", accessToken: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  async function save(skipConnect = false) {
    setSaving(true);
    setError("");
    const payload = skipConnect
      ? { demoMode: true }
      : { ...form, demoMode: false };
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) { setError((await res.json()).error ?? "Failed to save"); setSaving(false); return; }
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ onboarded: false }), // still need plan step
    });
    setSaving(false);
    router.push("/onboarding/choose-plan");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Steps */}
        <div className="mb-8 flex items-center justify-center gap-3">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold ${i === 0 ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"}`}>{i + 1}</div>
              <span className={`text-[13px] font-medium ${i === 0 ? "text-slate-900" : "text-slate-400"}`}>{s}</span>
              {i < STEPS.length - 1 && <div className="h-px w-8 bg-slate-200" />}
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500"><Zap size={20} className="text-white" /></span>
            <div>
              <h1 className="text-[18px] font-bold text-slate-900">Connect WhatsApp Business</h1>
              <p className="text-[13px] text-slate-500">Add your Meta credentials to go live</p>
            </div>
          </div>

          <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-[12.5px] font-semibold text-blue-800">Where to find these?</p>
            <p className="mt-1 text-[12px] text-blue-700">Go to Meta for Developers → Your App → WhatsApp → API Setup</p>
            <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-blue-600 hover:text-blue-700">
              Open Meta for Developers <ExternalLink size={11} />
            </a>
          </div>

          {!demoMode && (
            <div className="space-y-4">
              {[
                { label: "Phone Number ID", key: "phoneNumberId", placeholder: "Enter from Meta dashboard" },
                { label: "WhatsApp Business Account ID (WABA ID)", key: "wabaId", placeholder: "Enter from Meta dashboard" },
                { label: "Access Token", key: "accessToken", placeholder: "System user access token", type: "password" },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">{label}</label>
                  <input
                    type={type ?? "text"}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-[14px] font-mono outline-none focus:border-emerald-400 focus:bg-white"
                  />
                </div>
              ))}
              {error && <p className="text-[12.5px] font-medium text-rose-600">{error}</p>}
              <button onClick={() => save(false)} disabled={saving || !form.phoneNumberId || !form.accessToken}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-[14px] font-semibold text-white hover:bg-emerald-600 disabled:opacity-50">
                {saving && <Loader2 size={15} className="animate-spin" />}
                {saving ? "Saving…" : "Connect & Continue"}
              </button>
            </div>
          )}

          <div className={`${!demoMode ? "mt-4 border-t border-slate-100 pt-4" : ""}`}>
            <button onClick={() => save(true)} disabled={saving}
              className="w-full rounded-xl border border-slate-200 py-2.5 text-[13px] font-semibold text-slate-600 hover:bg-slate-50">
              {saving ? "Please wait…" : "Skip for now — use Demo Mode"}
            </button>
            <p className="mt-2 text-center text-[11.5px] text-slate-400">
              Demo mode simulates messages locally. You can connect WhatsApp anytime from Settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
