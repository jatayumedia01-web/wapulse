"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Rocket, Loader2 } from "lucide-react";
import { PageHeader, Button, Badge, Modal, Field, inputCls, statusTone } from "@/components/ui";

type Template = { id: string; name: string; status: string };
type Campaign = {
  id: string;
  name: string;
  status: string;
  audienceTag: string;
  total: number;
  sent: number;
  delivered: number;
  read: number;
  replied: number;
  failed: number;
  createdAt: string;
  template: Template;
};

function Funnel({ c }: { c: Campaign }) {
  const stages = [
    { label: "Sent", value: c.sent, color: "bg-emerald-500" },
    { label: "Delivered", value: c.delivered, color: "bg-sky-500" },
    { label: "Read", value: c.read, color: "bg-violet-500" },
    { label: "Replied", value: c.replied, color: "bg-amber-500" },
  ];
  const max = Math.max(c.sent, 1);
  return (
    <div className="grid grid-cols-4 gap-3">
      {stages.map((s) => (
        <div key={s.label}>
          <div className="flex items-baseline justify-between">
            <p className="text-[11px] font-semibold text-slate-400">{s.label}</p>
            <p className="text-[13px] font-bold text-slate-800">{s.value.toLocaleString()}</p>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className={`h-full rounded-full ${s.color}`} style={{ width: `${(s.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [open, setOpen] = useState(false);
  const [launching, setLaunching] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", templateId: "", audienceTag: "" });

  const load = useCallback(async () => {
    const [c, t] = await Promise.all([
      fetch("/api/campaigns").then((r) => r.json()),
      fetch("/api/templates").then((r) => r.json()),
    ]);
    setCampaigns(c);
    setTemplates(t.filter((x: Template) => x.status === "APPROVED"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createCampaign() {
    setError("");
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setError((await res.json()).error ?? "Failed");
      return;
    }
    setOpen(false);
    setForm({ name: "", templateId: "", audienceTag: "" });
    load();
  }

  async function launch(id: string) {
    setLaunching(id);
    await fetch(`/api/campaigns/${id}/send`, { method: "POST" });
    setLaunching(null);
    load();
  }

  return (
    <div>
      <PageHeader
        title="Broadcast Campaigns"
        subtitle="Send approved templates to targeted audience segments"
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus size={15} /> New Campaign
          </Button>
        }
      />
      <div className="space-y-4 p-8">
        {campaigns.map((c) => (
          <div key={c.id} className="fade-up rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-[15px] font-bold text-slate-900">{c.name}</h2>
                  <Badge tone={statusTone(c.status)}>{c.status}</Badge>
                </div>
                <p className="mt-1 text-[12.5px] text-slate-500">
                  Template: <span className="font-mono font-semibold">{c.template.name}</span>
                  {" · "}Audience: {c.audienceTag ? <Badge tone="blue">{c.audienceTag}</Badge> : "All opted-in contacts"}
                  {c.failed > 0 && <span className="text-rose-500"> · {c.failed} failed</span>}
                </p>
              </div>
              {(c.status === "DRAFT" || c.status === "SCHEDULED") && (
                <Button onClick={() => launch(c.id)} disabled={launching === c.id}>
                  {launching === c.id ? <Loader2 size={15} className="animate-spin" /> : <Rocket size={15} />}
                  {launching === c.id ? "Sending…" : "Launch Now"}
                </Button>
              )}
            </div>
            <Funnel c={c} />
          </div>
        ))}
        {campaigns.length === 0 && (
          <p className="py-16 text-center text-[13px] text-slate-400">No campaigns yet — create your first broadcast</p>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New Campaign">
        <Field label="Campaign name">
          <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Summer Sale Blast" />
        </Field>
        <Field label="Template" hint="Only approved templates can be broadcast">
          <select className={inputCls} value={form.templateId} onChange={(e) => setForm({ ...form, templateId: e.target.value })}>
            <option value="">Select a template…</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Audience tag (optional)" hint="Leave empty to send to all opted-in contacts">
          <input className={inputCls} value={form.audienceTag} onChange={(e) => setForm({ ...form, audienceTag: e.target.value })} placeholder="vip" />
        </Field>
        {error && <p className="mb-3 text-[12.5px] font-medium text-rose-600">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={createCampaign}>Create Campaign</Button>
        </div>
      </Modal>
    </div>
  );
}
