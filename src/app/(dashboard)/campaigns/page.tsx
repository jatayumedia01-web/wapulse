"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Rocket, Loader2, RefreshCcw, CalendarClock } from "lucide-react";
import { PageHeader, Button, Badge, Modal, Field, inputCls, statusTone } from "@/components/ui";

type Template = { id: string; name: string; status: string };
type Campaign = {
  id: string;
  name: string;
  status: string;
  audienceTag: string;
  retargetOfId: string | null;
  scheduledAt: string | null;
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
  const [form, setForm] = useState({ name: "", templateId: "", audienceTag: "", scheduledAt: "", retargetOfId: "", retryEnabled: false, retryAfterHrs: 24 });

  const load = useCallback(async () => {
    const [c, t] = await Promise.all([
      fetch("/api/campaigns").then((r) => r.json()),
      fetch("/api/templates").then((r) => r.json()),
    ]);
    setCampaigns(Array.isArray(c) ? c : []);
    setTemplates(Array.isArray(t) ? t.filter((x: Template) => x.status === "APPROVED") : []);
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
    setForm({ name: "", templateId: "", audienceTag: "", scheduledAt: "", retargetOfId: "", retryEnabled: false, retryAfterHrs: 24 });
    load();
  }

  function openRetarget(c: Campaign) {
    setError("");
    setForm({
      name: `Re: ${c.name} (read, not replied)`,
      templateId: "",
      audienceTag: "",
      scheduledAt: "",
      retargetOfId: c.id,
      retryEnabled: false,
      retryAfterHrs: 24,
    });
    setOpen(true);
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
          <div key={c.id} className="fade-up bg-white/90 backdrop-blur border border-white/80 shadow-lg shadow-indigo-50 rounded-2xl p-6">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-[15px] font-bold text-slate-900">{c.name}</h2>
                  <Badge tone={statusTone(c.status)}>{c.status}</Badge>
                </div>
                <p className="mt-1 text-[12.5px] text-slate-500">
                  Template: <span className="font-mono font-semibold">{c.template.name}</span>
                  {" · "}Audience:{" "}
                  {c.retargetOfId ? (
                    <Badge tone="violet">retarget: read-not-replied</Badge>
                  ) : c.audienceTag ? (
                    <Badge tone="blue">{c.audienceTag}</Badge>
                  ) : (
                    "All opted-in contacts"
                  )}
                  {c.scheduledAt && c.status === "SCHEDULED" && (
                    <span className="ml-1 inline-flex items-center gap-1 text-violet-600">
                      <CalendarClock size={12} /> {new Date(c.scheduledAt).toLocaleString()}
                    </span>
                  )}
                  {c.failed > 0 && <span className="text-rose-500"> · {c.failed} failed</span>}
                </p>
              </div>
              <div className="flex gap-2">
                {c.status === "COMPLETED" && (
                  <Button variant="secondary" onClick={() => openRetarget(c)}>
                    <RefreshCcw size={14} /> Retarget
                  </Button>
                )}
                {(c.status === "DRAFT" || c.status === "SCHEDULED") && (
                  <Button onClick={() => launch(c.id)} disabled={launching === c.id}>
                    {launching === c.id ? <Loader2 size={15} className="animate-spin" /> : <Rocket size={15} />}
                    {launching === c.id ? "Sending…" : "Launch Now"}
                  </Button>
                )}
              </div>
            </div>
            <Funnel c={c} />
          </div>
        ))}
        {campaigns.length === 0 && (
          <p className="py-16 text-center text-[13px] text-slate-400">No campaigns yet — create your first broadcast</p>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={form.retargetOfId ? "Retargeting Campaign" : "New Campaign"}>
        {form.retargetOfId && (
          <p className="mb-4 rounded-xl bg-violet-50 px-4 py-3 text-[12.5px] leading-relaxed text-violet-800">
            Audience: contacts who <b>read but didn&apos;t reply</b> to the original campaign.
          </p>
        )}
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
        {!form.retargetOfId && (
          <Field label="Audience tag (optional)" hint="Leave empty to send to all opted-in contacts">
            <input className={inputCls} value={form.audienceTag} onChange={(e) => setForm({ ...form, audienceTag: e.target.value })} placeholder="vip" />
          </Field>
        )}
        <Field label="Schedule (optional)" hint="Leave empty to launch manually">
          <input
            type="datetime-local"
            className={inputCls}
            value={form.scheduledAt}
            onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
          />
        </Field>
        <div className="flex items-center gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-[13px] text-slate-700">
            <input type="checkbox" checked={form.retryEnabled} onChange={(e) => setForm({ ...form, retryEnabled: e.target.checked })} />
            Auto-retry failed sends
          </label>
          {form.retryEnabled && (
            <div className="flex items-center gap-2 text-[13px] text-slate-600">
              after
              <input
                type="number" min={1} max={168} className={`${inputCls} w-20`}
                value={form.retryAfterHrs}
                onChange={(e) => setForm({ ...form, retryAfterHrs: parseInt(e.target.value) || 24 })}
              />
              hours
            </div>
          )}
        </div>
        {error && <p className="mb-3 text-[12.5px] font-medium text-rose-600">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={createCampaign}>Create Campaign</Button>
        </div>
      </Modal>
    </div>
  );
}
