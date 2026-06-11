"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, CheckCheck } from "lucide-react";
import { PageHeader, Button, Badge, Modal, Field, inputCls, statusTone } from "@/components/ui";

type Template = {
  id: string;
  name: string;
  category: string;
  language: string;
  header: string | null;
  body: string;
  footer: string | null;
  buttons: string;
  status: string;
};

const CATEGORY_TONE: Record<string, string> = {
  MARKETING: "violet",
  UTILITY: "blue",
  AUTHENTICATION: "amber",
};

function WhatsAppPreview({ t }: { t: Template }) {
  const buttons: Array<{ text: string }> = JSON.parse(t.buttons || "[]");
  return (
    <div className="chat-bg rounded-xl p-4">
      <div className="max-w-[260px] rounded-xl rounded-tl-sm bg-white p-3 shadow-sm">
        {t.header && <p className="mb-1.5 text-[13px] font-bold text-slate-900">{t.header}</p>}
        <p className="whitespace-pre-wrap text-[12.5px] leading-relaxed text-slate-700">{t.body}</p>
        {t.footer && <p className="mt-1.5 text-[11px] text-slate-400">{t.footer}</p>}
        {buttons.length > 0 && (
          <div className="mt-2 space-y-1 border-t border-slate-100 pt-2">
            {buttons.map((b, i) => (
              <p key={i} className="rounded-lg bg-sky-50 py-1.5 text-center text-[12px] font-semibold text-sky-600">
                {b.text}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    category: "MARKETING",
    header: "",
    body: "",
    footer: "",
    buttonText: "",
  });

  const load = useCallback(async () => {
    setTemplates(await (await fetch("/api/templates")).json());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createTemplate(submit: boolean) {
    setError("");
    const res = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        category: form.category,
        header: form.header,
        body: form.body,
        footer: form.footer,
        buttons: form.buttonText ? [{ type: "QUICK_REPLY", text: form.buttonText }] : [],
        submit,
      }),
    });
    if (!res.ok) {
      setError((await res.json()).error ?? "Failed");
      return;
    }
    setOpen(false);
    setForm({ name: "", category: "MARKETING", header: "", body: "", footer: "", buttonText: "" });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/templates/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <PageHeader
        title="Message Templates"
        subtitle="Pre-approved templates for campaigns and notifications. Use {{1}}, {{2}} for variables."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus size={15} /> New Template
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-5 p-8 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((t) => (
          <div key={t.id} className="fade-up overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-start justify-between px-5 pt-4">
              <div>
                <p className="font-mono text-[13px] font-bold text-slate-900">{t.name}</p>
                <div className="mt-1.5 flex gap-1.5">
                  <Badge tone={CATEGORY_TONE[t.category]}>{t.category}</Badge>
                  <Badge tone={statusTone(t.status)}>{t.status}</Badge>
                  <Badge>{t.language}</Badge>
                </div>
              </div>
              <button
                onClick={() => remove(t.id)}
                className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="p-4">
              <WhatsAppPreview t={t} />
            </div>
          </div>
        ))}
        {templates.length === 0 && (
          <p className="col-span-full py-16 text-center text-[13px] text-slate-400">No templates yet — create your first one</p>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create Template" wide>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Template name" hint="Lowercase letters, numbers, underscores">
            <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="order_update" />
          </Field>
          <Field label="Category">
            <select className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="MARKETING">Marketing</option>
              <option value="UTILITY">Utility</option>
              <option value="AUTHENTICATION">Authentication</option>
            </select>
          </Field>
        </div>
        <Field label="Header (optional)">
          <input className={inputCls} value={form.header} onChange={(e) => setForm({ ...form, header: e.target.value })} placeholder="Order Confirmed ✅" />
        </Field>
        <Field label="Body" hint="Use {{1}}, {{2}} as variables">
          <textarea
            rows={4}
            className={`${inputCls} resize-none`}
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder="Hi {{1}}, your order {{2}} has shipped!"
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Footer (optional)">
            <input className={inputCls} value={form.footer} onChange={(e) => setForm({ ...form, footer: e.target.value })} placeholder="Reply STOP to opt out" />
          </Field>
          <Field label="Button text (optional)">
            <input className={inputCls} value={form.buttonText} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} placeholder="Track Order" />
          </Field>
        </div>
        {error && <p className="mb-3 text-[12.5px] font-medium text-rose-600">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => createTemplate(false)}>Save as Draft</Button>
          <Button onClick={() => createTemplate(true)}>
            <CheckCheck size={15} /> Submit for Approval
          </Button>
        </div>
      </Modal>
    </div>
  );
}
