"use client";

import { useEffect, useState } from "react";
import { Save, Plug, Bot, Building2, Check } from "lucide-react";
import { PageHeader, Button, Field, inputCls } from "@/components/ui";

type Settings = {
  businessName: string;
  phoneNumberId: string;
  wabaId: string;
  accessToken: string;
  verifyToken: string;
  openaiApiKey: string;
  aiPersona: string;
  awayMessage: string;
  demoMode: boolean;
};

export default function SettingsPage() {
  const [form, setForm] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setForm);
  }, []);

  async function save() {
    if (!form) return;
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!form) return <div className="p-8 text-[13px] text-slate-400">Loading…</div>;

  const set = (key: keyof Settings, value: string | boolean) => setForm({ ...form, [key]: value });

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Workspace, WhatsApp Cloud API connection and AI configuration"
        action={
          <Button onClick={save}>
            {saved ? <Check size={15} /> : <Save size={15} />} {saved ? "Saved!" : "Save Changes"}
          </Button>
        }
      />
      <div className="max-w-3xl space-y-6 p-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-[15px] font-bold text-slate-900">
            <Building2 size={17} className="text-emerald-600" /> Business Profile
          </h2>
          <Field label="Business name">
            <input className={inputCls} value={form.businessName} onChange={(e) => set("businessName", e.target.value)} />
          </Field>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[15px] font-bold text-slate-900">
              <Plug size={17} className="text-emerald-600" /> WhatsApp Cloud API
            </h2>
            <label className="flex cursor-pointer items-center gap-2 text-[12.5px] font-semibold text-slate-600">
              Demo mode
              <button
                onClick={() => set("demoMode", !form.demoMode)}
                className={`relative h-5 w-9 rounded-full transition-colors ${form.demoMode ? "bg-amber-400" : "bg-emerald-500"}`}
              >
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${form.demoMode ? "left-[18px]" : "left-0.5"}`} />
              </button>
            </label>
          </div>
          <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-[12.5px] leading-relaxed text-amber-800">
            {form.demoMode
              ? "Demo mode is ON — all sends are simulated locally. Turn it off after entering your Meta credentials to send real WhatsApp messages."
              : "Live mode — messages are sent through Meta's Graph API using the credentials below."}
          </p>
          <div className="grid grid-cols-2 gap-x-4">
            <Field label="Phone Number ID">
              <input className={inputCls} value={form.phoneNumberId} onChange={(e) => set("phoneNumberId", e.target.value)} placeholder="1065xxxxxxxxxxx" />
            </Field>
            <Field label="WABA ID">
              <input className={inputCls} value={form.wabaId} onChange={(e) => set("wabaId", e.target.value)} placeholder="1023xxxxxxxxxxx" />
            </Field>
          </div>
          <Field label="Permanent Access Token">
            <input type="password" className={inputCls} value={form.accessToken} onChange={(e) => set("accessToken", e.target.value)} placeholder="EAAG…" />
          </Field>
          <Field label="Webhook Verify Token" hint="Use the same value when configuring the webhook in your Meta App dashboard">
            <input className={inputCls} value={form.verifyToken} onChange={(e) => set("verifyToken", e.target.value)} />
          </Field>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-[15px] font-bold text-slate-900">
            <Bot size={17} className="text-violet-600" /> AI Agent
          </h2>
          <Field label="OpenAI API Key (optional)" hint="With a key, the AI agent uses GPT for replies. Without it, the built-in intent engine answers common questions.">
            <input type="password" className={inputCls} value={form.openaiApiKey} onChange={(e) => set("openaiApiKey", e.target.value)} placeholder="sk-…" />
          </Field>
          <Field label="AI persona / instructions">
            <textarea rows={3} className={`${inputCls} resize-none`} value={form.aiPersona} onChange={(e) => set("aiPersona", e.target.value)} />
          </Field>
          <Field label="Away message">
            <textarea rows={2} className={`${inputCls} resize-none`} value={form.awayMessage} onChange={(e) => set("awayMessage", e.target.value)} />
          </Field>
        </section>
      </div>
    </div>
  );
}
