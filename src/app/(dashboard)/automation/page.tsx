"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, Bot, MessageCircle, Hand, Zap } from "lucide-react";
import { PageHeader, Button, Badge, Modal, Field, inputCls } from "@/components/ui";

type Rule = {
  id: string;
  name: string;
  trigger: string;
  keywords: string;
  matchType: string;
  reply: string;
  enabled: boolean;
  priority: number;
  hits: number;
};

const TRIGGER_META: Record<string, { label: string; icon: typeof Bot; tone: string; iconCls: string; desc: string }> = {
  KEYWORD: { label: "Keyword", icon: Zap, tone: "blue", iconCls: "bg-sky-50 text-sky-600", desc: "Replies when message contains keywords" },
  WELCOME: { label: "Welcome", icon: Hand, tone: "green", iconCls: "bg-emerald-50 text-emerald-600", desc: "First message from a new customer" },
  AWAY: { label: "Away", icon: MessageCircle, tone: "amber", iconCls: "bg-amber-50 text-amber-600", desc: "Outside business hours" },
  AI_AGENT: { label: "AI Agent", icon: Bot, tone: "violet", iconCls: "bg-violet-50 text-violet-600", desc: "AI answers anything not matched above" },
};

export default function AutomationPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", trigger: "KEYWORD", keywords: "", reply: "", priority: 5 });

  const load = useCallback(async () => {
    setRules(await (await fetch("/api/automations")).json());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createRule() {
    setError("");
    const res = await fetch("/api/automations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setError((await res.json()).error ?? "Failed");
      return;
    }
    setOpen(false);
    setForm({ name: "", trigger: "KEYWORD", keywords: "", reply: "", priority: 5 });
    load();
  }

  async function toggle(rule: Rule) {
    await fetch(`/api/automations/${rule.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !rule.enabled }),
    });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/automations/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <PageHeader
        title="Automation & Chatbot"
        subtitle="Rules run on every inbound message — highest priority first, AI agent as fallback"
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus size={15} /> New Rule
          </Button>
        }
      />
      <div className="space-y-3.5 p-8">
        {rules.map((r) => {
          const meta = TRIGGER_META[r.trigger] ?? TRIGGER_META.KEYWORD;
          const Icon = meta.icon;
          return (
            <div key={r.id} className={`fade-up rounded-2xl border bg-white p-5 transition-opacity ${r.enabled ? "border-slate-200" : "border-slate-100 opacity-60"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.iconCls}`}>
                    <Icon size={18} />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-[14.5px] font-bold text-slate-900">{r.name}</h2>
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                      <span className="text-[11.5px] font-medium text-slate-400">{r.hits.toLocaleString()} hits</span>
                    </div>
                    <p className="mt-0.5 text-[12px] text-slate-400">{meta.desc}</p>
                    {r.keywords && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {r.keywords.split(",").filter(Boolean).map((k) => (
                          <span key={k} className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11.5px] text-slate-600">
                            {k.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    {r.reply && (
                      <p className="mt-2 max-w-2xl rounded-lg bg-emerald-50/70 px-3 py-2 text-[12.5px] leading-relaxed text-slate-600">
                        {r.reply}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => toggle(r)}
                    className={`relative h-5 w-9 rounded-full transition-colors ${r.enabled ? "bg-emerald-500" : "bg-slate-300"}`}
                  >
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${r.enabled ? "left-[18px]" : "left-0.5"}`} />
                  </button>
                  <button onClick={() => remove(r.id)} className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-500">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {rules.length === 0 && <p className="py-16 text-center text-[13px] text-slate-400">No automation rules yet</p>}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New Automation Rule">
        <Field label="Rule name">
          <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Pricing questions" />
        </Field>
        <Field label="Trigger">
          <select className={inputCls} value={form.trigger} onChange={(e) => setForm({ ...form, trigger: e.target.value })}>
            <option value="KEYWORD">Keyword match</option>
            <option value="WELCOME">Welcome (first message)</option>
            <option value="AI_AGENT">AI Agent (smart fallback)</option>
          </select>
        </Field>
        {form.trigger === "KEYWORD" && (
          <Field label="Keywords" hint="Comma separated — matches if message contains any">
            <input className={inputCls} value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} placeholder="price, pricing, cost" />
          </Field>
        )}
        {form.trigger !== "AI_AGENT" && (
          <Field label="Auto-reply message">
            <textarea rows={3} className={`${inputCls} resize-none`} value={form.reply} onChange={(e) => setForm({ ...form, reply: e.target.value })} placeholder="Our plans start at ₹999/month…" />
          </Field>
        )}
        {error && <p className="mb-3 text-[12.5px] font-medium text-rose-600">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={createRule}>Create Rule</Button>
        </div>
      </Modal>
    </div>
  );
}
