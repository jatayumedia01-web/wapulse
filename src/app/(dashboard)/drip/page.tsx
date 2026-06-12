"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, Play, Clock, Tag, Zap, Users, ChevronRight, Pencil } from "lucide-react";
import { PageHeader, Button, Badge, Modal, Field, inputCls } from "@/components/ui";

type DripStep = {
  id?: string;
  stepNumber: number;
  templateId?: string | null;
  template?: { name: string } | null;
  message: string;
  delayValue: number;
  delayUnit: string;
};

type DripSequence = {
  id: string;
  name: string;
  triggerType: string;
  triggerEvent: string;
  triggerTag: string;
  enabled: boolean;
  enrollCount: number;
  steps: DripStep[];
};

type Template = { id: string; name: string; status: string };
type Contact = { id: string; name: string | null; phone: string };

const TRIGGER_ICONS: Record<string, React.ReactNode> = {
  MANUAL: <Play size={15} />,
  EVENT: <Zap size={15} />,
  TAG: <Tag size={15} />,
};

const EVENT_PRESETS = [
  "order.created", "order.paid", "order.shipped",
  "form.submitted", "cart.abandoned", "signup",
];

const DELAY_UNITS = ["minutes", "hours", "days"];

export default function DripPage() {
  const [sequences, setSequences] = useState<DripSequence[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", triggerType: "MANUAL", triggerEvent: "", triggerTag: "" });
  const [steps, setSteps] = useState<DripStep[]>([{ stepNumber: 1, message: "", delayValue: 1, delayUnit: "hours" }]);
  const [enrolOpen, setEnrolOpen] = useState(false);
  const [enrolSeqId, setEnrolSeqId] = useState("");
  const [enrolTag, setEnrolTag] = useState("");
  const [enrolResult, setEnrolResult] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const [s, t, c] = await Promise.all([
      fetch("/api/drip").then((r) => r.json()),
      fetch("/api/templates").then((r) => r.json()),
      fetch("/api/contacts").then((r) => r.json()),
    ]);
    setSequences(s);
    setTemplates(t.filter((x: Template) => x.status === "APPROVED"));
    setContacts(c);
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditId(null);
    setForm({ name: "", triggerType: "MANUAL", triggerEvent: "", triggerTag: "" });
    setSteps([{ stepNumber: 1, message: "", delayValue: 1, delayUnit: "hours" }]);
    setError("");
    setOpen(true);
  }

  function openEdit(s: DripSequence) {
    setEditId(s.id);
    setForm({ name: s.name, triggerType: s.triggerType, triggerEvent: s.triggerEvent, triggerTag: s.triggerTag });
    setSteps(s.steps.length ? s.steps : [{ stepNumber: 1, message: "", delayValue: 1, delayUnit: "hours" }]);
    setError("");
    setOpen(true);
  }

  async function save() {
    if (!form.name.trim()) { setError("Name required"); return; }
    setSaving(true);
    setError("");
    let seqId = editId;
    if (!seqId) {
      const res = await fetch("/api/drip", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { setError((await res.json()).error); setSaving(false); return; }
      seqId = (await res.json()).id;
    } else {
      await fetch(`/api/drip/${seqId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    await fetch(`/api/drip/${seqId}/steps`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ steps }),
    });
    setSaving(false);
    setOpen(false);
    load();
  }

  async function toggle(s: DripSequence) {
    await fetch(`/api/drip/${s.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ enabled: !s.enabled }) });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/drip/${id}`, { method: "DELETE" });
    load();
  }

  async function enrol() {
    setEnrolResult("");
    const res = await fetch(`/api/drip/${enrolSeqId}/enrol`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag: enrolTag || undefined }),
    });
    const data = await res.json();
    setEnrolResult(res.ok ? `Enrolled ${data.enrolled} of ${data.total} contacts` : data.error);
    if (res.ok) { setTimeout(() => setEnrolOpen(false), 1500); load(); }
  }

  function updateStep(i: number, patch: Partial<DripStep>) {
    setSteps(steps.map((s, j) => j === i ? { ...s, ...patch } : s));
  }

  function addStep() {
    setSteps([...steps, { stepNumber: steps.length + 1, message: "", delayValue: 1, delayUnit: "hours" }]);
  }

  return (
    <div>
      <PageHeader
        title="Drip Sequences"
        subtitle="Multi-step automated message journeys with custom delays — nurture leads on autopilot"
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => { setEnrolSeqId(sequences[0]?.id ?? ""); setEnrolTag(""); setEnrolResult(""); setEnrolOpen(true); }}>
              <Users size={14} /> Enrol Contacts
            </Button>
            <Button onClick={openCreate}>
              <Plus size={14} /> New Sequence
            </Button>
          </div>
        }
      />
      <div className="space-y-4 p-8">
        {sequences.map((s) => (
          <div key={s.id} className={`fade-up rounded-2xl border bg-white p-6 ${s.enabled ? "border-slate-200" : "border-slate-100 opacity-60"}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    {TRIGGER_ICONS[s.triggerType]}
                  </span>
                  <h2 className="text-[15px] font-bold text-slate-900">{s.name}</h2>
                  <Badge tone="violet">{s.triggerType}</Badge>
                  <span className="text-[12px] text-slate-400">{s.enrollCount} enrolled</span>
                </div>
                {s.triggerEvent && <p className="ml-11 mt-0.5 font-mono text-[11.5px] text-slate-400">Trigger: {s.triggerEvent}</p>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(s)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><Pencil size={14} /></button>
                <button onClick={() => toggle(s)} className={`relative h-5 w-9 rounded-full transition-colors ${s.enabled ? "bg-emerald-500" : "bg-slate-300"}`}>
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${s.enabled ? "left-[18px]" : "left-0.5"}`} />
                </button>
                <button onClick={() => remove(s.id)} className="rounded-lg p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-500"><Trash2 size={14} /></button>
              </div>
            </div>

            {/* Steps timeline */}
            <div className="mt-5 flex items-start gap-3 overflow-x-auto pb-2">
              {s.steps.map((step, i) => (
                <div key={i} className="flex shrink-0 items-start gap-2">
                  <div className="w-52 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-600">{i + 1}</span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock size={10} /> after {step.delayValue} {step.delayUnit}
                      </span>
                    </div>
                    <p className="line-clamp-3 text-[12.5px] text-slate-700">
                      {step.template ? <span className="font-mono text-[11px] text-violet-600">[{step.template.name}]</span> : step.message}
                    </p>
                  </div>
                  {i < s.steps.length - 1 && <ChevronRight size={16} className="mt-5 shrink-0 text-slate-300" />}
                </div>
              ))}
              {s.steps.length === 0 && <p className="text-[12.5px] text-slate-400">No steps yet — edit to add steps</p>}
            </div>
          </div>
        ))}
        {sequences.length === 0 && <p className="py-16 text-center text-[13px] text-slate-400">No drip sequences yet — create your first one!</p>}
      </div>

      {/* Create / Edit Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title={editId ? "Edit Sequence" : "New Drip Sequence"} wide>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Sequence name">
            <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Post-purchase follow-up" />
          </Field>
          <Field label="Trigger type">
            <select className={inputCls} value={form.triggerType} onChange={(e) => setForm({ ...form, triggerType: e.target.value })}>
              <option value="MANUAL">Manual enrolment</option>
              <option value="EVENT">Event-based</option>
              <option value="TAG">Tag-based</option>
            </select>
          </Field>
        </div>
        {form.triggerType === "EVENT" && (
          <Field label="Trigger event" hint="e.g. order.created, form.submitted, cart.abandoned">
            <select className={inputCls} value={form.triggerEvent} onChange={(e) => setForm({ ...form, triggerEvent: e.target.value })}>
              <option value="">Select event…</option>
              {EVENT_PRESETS.map((ev) => <option key={ev} value={ev}>{ev}</option>)}
            </select>
          </Field>
        )}
        {form.triggerType === "TAG" && (
          <Field label="Trigger tag" hint="Auto-enrol contacts when this tag is added">
            <input className={inputCls} value={form.triggerTag} onChange={(e) => setForm({ ...form, triggerTag: e.target.value })} placeholder="new-lead" />
          </Field>
        )}

        <p className="mb-2 mt-1 text-[13px] font-bold text-slate-800">Steps</p>
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-600">{i + 1}</span>
                {steps.length > 1 && (
                  <button onClick={() => setSteps(steps.filter((_, j) => j !== i))} className="text-slate-300 hover:text-rose-500"><Trash2 size={13} /></button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Field label="Use approved template (optional)">
                    <select className={inputCls} value={step.templateId ?? ""} onChange={(e) => updateStep(i, { templateId: e.target.value || null })}>
                      <option value="">— Plain text message —</option>
                      {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </Field>
                </div>
                {!step.templateId && (
                  <div className="col-span-2">
                    <Field label="Message text">
                      <textarea rows={2} className={`${inputCls} resize-none`} value={step.message}
                        onChange={(e) => updateStep(i, { message: e.target.value })}
                        placeholder="Hi {{name}}, thanks for your order! Here's what to expect…" />
                    </Field>
                  </div>
                )}
                <Field label="Delay">
                  <input type="number" min={1} className={inputCls} value={step.delayValue}
                    onChange={(e) => updateStep(i, { delayValue: parseInt(e.target.value) || 1 })} />
                </Field>
                <Field label="Unit">
                  <select className={inputCls} value={step.delayUnit} onChange={(e) => updateStep(i, { delayUnit: e.target.value })}>
                    {DELAY_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </Field>
              </div>
            </div>
          ))}
        </div>
        <button onClick={addStep} className="mt-3 text-[13px] font-semibold text-emerald-600 hover:text-emerald-700">+ Add step</button>
        {error && <p className="mt-2 text-[12.5px] text-rose-600">{error}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? "Saving…" : editId ? "Save Changes" : "Create Sequence"}</Button>
        </div>
      </Modal>

      {/* Enrol contacts modal */}
      <Modal open={enrolOpen} onClose={() => setEnrolOpen(false)} title="Enrol Contacts into Sequence">
        <Field label="Sequence">
          <select className={inputCls} value={enrolSeqId} onChange={(e) => setEnrolSeqId(e.target.value)}>
            {sequences.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </Field>
        <Field label="Audience tag" hint="Leave empty to select contacts manually. All opted-in contacts with this tag will be enrolled.">
          <input className={inputCls} value={enrolTag} onChange={(e) => setEnrolTag(e.target.value)} placeholder="vip" />
        </Field>
        {!enrolTag && (
          <Field label="Or select contacts">
            <select className={`${inputCls} h-32`} multiple onChange={(e) => {
              const ids = Array.from(e.target.selectedOptions).map((o) => o.value);
              setEnrolTag("");
              fetch(`/api/drip/${enrolSeqId}/enrol`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contactIds: ids }) })
                .then((r) => r.json()).then((d) => setEnrolResult(`Enrolled ${d.enrolled} contact(s)`));
            }}>
              {contacts.filter((c) => c.name).map((c) => <option key={c.id} value={c.id}>{c.name} — +{c.phone}</option>)}
            </select>
          </Field>
        )}
        {enrolResult && <p className="mb-3 rounded-xl bg-emerald-50 px-3 py-2 text-[12.5px] font-semibold text-emerald-700">{enrolResult}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setEnrolOpen(false)}>Close</Button>
          {enrolTag && <Button onClick={enrol}>Enrol by Tag</Button>}
        </div>
      </Modal>
    </div>
  );
}
