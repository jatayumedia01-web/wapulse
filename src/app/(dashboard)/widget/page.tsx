"use client";

import { useEffect, useState } from "react";
import { Copy, Check, MessageCircle, QrCode, Link2 } from "lucide-react";
import { PageHeader, Field, inputCls } from "@/components/ui";

export default function WidgetPage() {
  const [phone, setPhone] = useState("919876543210");
  const [prefill, setPrefill] = useState("Hi! I'd like to know more about your products.");
  const [position, setPosition] = useState<"right" | "left">("right");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => {
        if (s.phoneNumberId) setPhone(s.phoneNumberId);
      });
  }, []);

  const waLink = `https://wa.me/${phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(prefill)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(waLink)}`;

  const widgetSnippet = `<!-- WAPulse WhatsApp Widget -->
<a href="${waLink}" target="_blank" rel="noopener"
   style="position:fixed;bottom:24px;${position}:24px;z-index:9999;
          display:flex;align-items:center;gap:8px;
          background:#25D366;color:#fff;font-family:sans-serif;
          font-size:14px;font-weight:600;padding:12px 18px;
          border-radius:9999px;text-decoration:none;
          box-shadow:0 8px 24px rgba(37,211,102,.4)">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.2c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.4-.1.7.2.3.8 1.4 1.8 2.2 1.2 1.1 2.3 1.4 2.6 1.6.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0 .1 0 .8-.3 1.4Z"/>
  </svg>
  Chat with us
</a>`;

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div>
      <PageHeader
        title="Web Widget & Links"
        subtitle="Bring website visitors into WhatsApp — chat button, wa.me links and QR codes"
      />
      <div className="grid gap-6 p-8 xl:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-[15px] font-bold text-slate-900">Configure</h2>
            <Field label="WhatsApp number" hint="With country code">
              <input className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Field>
            <Field label="Pre-filled message">
              <textarea rows={2} className={`${inputCls} resize-none`} value={prefill} onChange={(e) => setPrefill(e.target.value)} />
            </Field>
            <Field label="Widget position">
              <select className={inputCls} value={position} onChange={(e) => setPosition(e.target.value as "right" | "left")}>
                <option value="right">Bottom right</option>
                <option value="left">Bottom left</option>
              </select>
            </Field>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[15px] font-bold text-slate-900">
                <Link2 size={16} className="text-emerald-600" /> Click-to-chat link
              </h2>
              <button onClick={() => copy(waLink, "link")} className="flex items-center gap-1 text-[12px] font-semibold text-emerald-600">
                {copied === "link" ? <Check size={13} /> : <Copy size={13} />} {copied === "link" ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="break-all rounded-xl bg-slate-50 px-4 py-3 font-mono text-[12px] text-slate-600">{waLink}</p>
            <p className="mt-2 text-[12px] text-slate-400">Use in Instagram bio, email signatures, ads and SMS.</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-[15px] font-bold text-slate-900">
              <QrCode size={16} className="text-emerald-600" /> QR Code
            </h2>
            <div className="flex items-center gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} alt="WhatsApp QR code" className="h-36 w-36 rounded-xl border border-slate-100" />
              <p className="text-[12.5px] leading-relaxed text-slate-500">
                Print on packaging, store displays or business cards. Scanning opens WhatsApp with your pre-filled message.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[15px] font-bold text-slate-900">
                <MessageCircle size={16} className="text-emerald-600" /> Website chat button
              </h2>
              <button onClick={() => copy(widgetSnippet, "widget")} className="flex items-center gap-1 text-[12px] font-semibold text-emerald-600">
                {copied === "widget" ? <Check size={13} /> : <Copy size={13} />} {copied === "widget" ? "Copied" : "Copy snippet"}
              </button>
            </div>
            <p className="mb-3 text-[12.5px] text-slate-500">Paste before <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11.5px]">&lt;/body&gt;</code> on any website:</p>
            <pre className="max-h-72 overflow-auto rounded-xl bg-[#0c1b1e] p-4 font-mono text-[11.5px] leading-relaxed text-emerald-300">
              {widgetSnippet}
            </pre>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-[15px] font-bold text-slate-900">Live preview</h2>
            <div className="relative h-48 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
              <p className="p-4 text-[12px] text-slate-300">your-website.com</p>
              <span
                className={`absolute bottom-4 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-[13px] font-semibold text-white shadow-lg ${position === "right" ? "right-4" : "left-4"}`}
              >
                <MessageCircle size={16} /> Chat with us
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
