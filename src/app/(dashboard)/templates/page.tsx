"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, CheckCheck, Image as ImageIcon, Link2, Phone, Tag, Timer } from "lucide-react";
import { PageHeader, Button, Badge, Modal, Field, inputCls, statusTone } from "@/components/ui";

type TemplateButton = { type: string; text: string };
type Template = {
  id: string;
  name: string;
  category: string;
  language: string;
  headerType: string;
  mediaUrl: string;
  header: string | null;
  body: string;
  footer: string | null;
  buttons: string;
  status: string;
  isLTO: boolean;
  couponCode: string;
  ltoExpiry: string | null;
};

const CATEGORY_TONE: Record<string, "blue" | "green" | "amber" | "red" | "violet" | "slate"> = {
  MARKETING: "violet",
  UTILITY: "blue",
  AUTHENTICATION: "amber",
};

function ButtonIcon({ type }: { type: string }) {
  if (type === "URL") return <Link2 size={11} />;
  if (type === "PHONE") return <Phone size={11} />;
  return null;
}

function WhatsAppPreview({ t }: { t: Template }) {
  const buttons: TemplateButton[] = JSON.parse(t.buttons || "[]");
  return (
    <div className="chat-bg rounded-xl p-4">
      <div className="max-w-[260px] overflow-hidden rounded-xl rounded-tl-sm bg-white shadow-sm">
        {t.headerType === "IMAGE" && (
          <div className="flex h-28 items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-200">
            {t.mediaUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={t.mediaUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <ImageIcon size={28} className="text-emerald-500" />
            )}
          </div>
        )}
        <div className="p-3">
          {t.header && t.headerType === "TEXT" && <p className="mb-1.5 text-[13px] font-bold text-slate-900">{t.header}</p>}
          <p className="whitespace-pre-wrap text-[12.5px] leading-relaxed text-slate-700">{t.body}</p>
          {t.footer && <p className="mt-1.5 text-[11px] text-slate-400">{t.footer}</p>}
          {t.isLTO && t.couponCode && (
            <div className="mt-2 flex items-center justify-between rounded-lg border border-dashed border-amber-400 bg-amber-50 px-2.5 py-1.5">
              <p className="text-[11px] text-amber-700">Coupon code</p>
              <p className="font-mono text-[12px] font-bold text-amber-800">{t.couponCode}</p>
            </div>
          )}
          {buttons.length > 0 && (
            <div className="mt-2 space-y-1 border-t border-slate-100 pt-2">
              {buttons.map((b, i) => (
                <p key={i} className="flex items-center justify-center gap-1.5 rounded-lg bg-sky-50 py-1.5 text-center text-[12px] font-semibold text-sky-600">
                  <ButtonIcon type={b.type} /> {b.text}
                </p>
              ))}
            </div>
          )}
        </div>
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
    headerType: "TEXT",
    mediaUrl: "",
    header: "",
    body: "",
    footer: "",
    isLTO: false,
    couponCode: "",
    ltoExpiry: "",
  });
  const [buttons, setButtons] = useState<TemplateButton[]>([]);

  const load = useCallback(async () => {
    const d = await (await fetch("/api/templates")).json();
    setTemplates(Array.isArray(d) ? d : []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createTemplate(submit: boolean) {
    setError("");
    const res = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, buttons: buttons.filter((b) => b.text.trim()), submit }),
    });
    if (!res.ok) {
      setError((await res.json()).error ?? "Failed");
      return;
    }
    setOpen(false);
    setForm({ name: "", category: "MARKETING", headerType: "TEXT", mediaUrl: "", header: "", body: "", footer: "", isLTO: false, couponCode: "", ltoExpiry: "" });
    setButtons([]);
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
        subtitle="Pre-approved templates with media headers, variables and buttons. Use {{1}}, {{2}} for variables."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus size={15} /> New Template
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-5 p-8 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((t) => (
          <div key={t.id} className="fade-up overflow-hidden glass-card">
            <div className="flex items-start justify-between px-5 pt-4">
              <div>
                <p className="font-mono text-[13px] font-bold text-slate-900">{t.name}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <Badge tone={CATEGORY_TONE[t.category]}>{t.category}</Badge>
                  <Badge tone={statusTone(t.status)}>{t.status}</Badge>
                  {t.headerType !== "TEXT" && <Badge tone="green">{t.headerType}</Badge>}
                  {t.isLTO && <Badge tone="amber"><Timer size={11} /> LTO</Badge>}
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
        <div className="grid grid-cols-2 gap-4">
          <Field label="Header type">
            <select className={inputCls} value={form.headerType} onChange={(e) => setForm({ ...form, headerType: e.target.value })}>
              <option value="TEXT">Text</option>
              <option value="IMAGE">Image</option>
              <option value="VIDEO">Video</option>
              <option value="DOCUMENT">Document</option>
              <option value="CAROUSEL">Carousel (multi-card)</option>
            </select>
          </Field>
          {form.headerType === "TEXT" ? (
            <Field label="Header text (optional)">
              <input className={inputCls} value={form.header} onChange={(e) => setForm({ ...form, header: e.target.value })} placeholder="Order Confirmed ✅" />
            </Field>
          ) : (
            <Field label="Media URL">
              <input className={inputCls} value={form.mediaUrl} onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })} placeholder="https://…/banner.jpg" />
            </Field>
          )}
        </div>
        <Field label="Body" hint="Use {{1}}, {{2}} as variables">
          <textarea
            rows={4}
            className={`${inputCls} resize-none`}
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder="Hi {{1}}, your order {{2}} has shipped!"
          />
        </Field>
        <Field label="Footer (optional)">
          <input className={inputCls} value={form.footer} onChange={(e) => setForm({ ...form, footer: e.target.value })} placeholder="Reply STOP to opt out" />
        </Field>

        {/* LTO Section */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
          <label className="flex cursor-pointer items-center gap-2 text-[13px] font-semibold text-amber-800">
            <input type="checkbox" checked={form.isLTO} onChange={(e) => setForm({ ...form, isLTO: e.target.checked })} />
            <Timer size={14} className="text-amber-600" /> Limited Time Offer (LTO) template
          </label>
          {form.isLTO && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Field label="Coupon code">
                <input className={inputCls} value={form.couponCode} onChange={(e) => setForm({ ...form, couponCode: e.target.value })} placeholder="SAVE20" />
              </Field>
              <Field label="Offer expires">
                <input type="datetime-local" className={inputCls} value={form.ltoExpiry} onChange={(e) => setForm({ ...form, ltoExpiry: e.target.value })} />
              </Field>
            </div>
          )}
        </div>

        <p className="mb-2 text-[12.5px] font-semibold text-slate-700">Buttons (max 3)</p>
        <div className="space-y-2">
          {buttons.map((b, i) => (
            <div key={i} className="flex items-center gap-2">
              <select
                className={`${inputCls} w-40`}
                value={b.type}
                onChange={(e) => setButtons(buttons.map((x, j) => (j === i ? { ...x, type: e.target.value } : x)))}
              >
                <option value="QUICK_REPLY">Quick reply</option>
                <option value="URL">Visit URL</option>
                <option value="PHONE">Call phone</option>
              </select>
              <input
                className={`${inputCls} flex-1`}
                value={b.text}
                onChange={(e) => setButtons(buttons.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))}
                placeholder="Button text"
              />
              <button onClick={() => setButtons(buttons.filter((_, j) => j !== i))} className="text-slate-300 hover:text-rose-500">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {buttons.length < 3 && (
            <button
              onClick={() => setButtons([...buttons, { type: "QUICK_REPLY", text: "" }])}
              className="text-[12.5px] font-semibold text-emerald-600 hover:text-emerald-700"
            >
              + Add button
            </button>
          )}
        </div>
        {error && <p className="my-3 text-[12.5px] font-medium text-rose-600">{error}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => createTemplate(false)}>Save as Draft</Button>
          <Button onClick={() => createTemplate(true)}>
            <CheckCheck size={15} /> Submit for Approval
          </Button>
        </div>
      </Modal>
    </div>
  );
}
