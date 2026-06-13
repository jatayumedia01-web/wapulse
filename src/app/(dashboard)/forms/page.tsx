"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, Eye, FileText } from "lucide-react";
import { PageHeader, Button, Badge, Modal, Field, inputCls } from "@/components/ui";

type FormField = { label: string; key: string; type: string; required: boolean };
type FormItem = { id: string; name: string; description: string; fields: string; enabled: boolean; _count: { responses: number } };
type FormResponse = { id: string; contact: { name: string | null; phone: string }; answers: string; createdAt: string };

const FIELD_TYPES = ["text", "number", "email", "phone", "select", "date"];

export default function FormsPage() {
  const [forms, setForms] = useState<FormItem[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [fields, setFields] = useState<FormField[]>([{ label: "Name", key: "name", type: "text", required: true }]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [viewResponses, setViewResponses] = useState<string | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);

  const load = useCallback(async () => {
    const data = await fetch("/api/forms").then((r) => r.json());
    setForms(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function loadResponses(id: string) {
    setViewResponses(id);
    const data = await fetch(`/api/forms/${id}/responses`).then((r) => r.json());
    setResponses(data);
  }

  async function save() {
    if (!form.name.trim()) { setError("Name required"); return; }
    setSaving(true);
    const res = await fetch("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, fields }),
    });
    setSaving(false);
    if (!res.ok) { setError((await res.json()).error); return; }
    setOpen(false);
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/forms/${id}`, { method: "DELETE" });
    load();
  }

  function updateField(i: number, patch: Partial<FormField>) {
    setFields(fields.map((f, j) => j === i ? { ...f, ...patch } : f));
  }

  return (
    <div>
      <PageHeader
        title="WhatsApp Forms"
        subtitle="Collect structured data from contacts via conversational lead forms"
        action={<Button onClick={() => { setForm({ name: "", description: "" }); setFields([{ label: "Name", key: "name", type: "text", required: true }]); setError(""); setOpen(true); }}><Plus size={14} /> New Form</Button>}
      />
      <div className="grid gap-4 p-8 sm:grid-cols-2 lg:grid-cols-3">
        {forms.map((f) => {
          const flds: FormField[] = JSON.parse(f.fields || "[]");
          return (
            <div key={f.id} className="fade-up flex flex-col bg-white/90 backdrop-blur border border-white/80 shadow-lg shadow-indigo-50 rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FileText size={16} />
                  </span>
                  <div>
                    <p className="text-[14px] font-bold text-slate-900">{f.name}</p>
                    <p className="text-[11.5px] text-slate-400">{flds.length} fields · {f._count.responses} responses</p>
                  </div>
                </div>
                <Badge tone={f.enabled ? "green" : "slate"}>{f.enabled ? "Active" : "Draft"}</Badge>
              </div>
              {f.description && <p className="mt-2 text-[12.5px] text-slate-500">{f.description}</p>}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {flds.map((fl, i) => (
                  <span key={i} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                    {fl.label}{fl.required ? "*" : ""}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex gap-2 pt-4">
                <Button variant="secondary" className="flex-1" onClick={() => loadResponses(f.id)}>
                  <Eye size={13} /> Responses
                </Button>
                <button onClick={() => remove(f.id)} className="rounded-xl p-2 text-slate-300 hover:bg-rose-50 hover:text-rose-500"><Trash2 size={14} /></button>
              </div>
            </div>
          );
        })}
        {forms.length === 0 && <p className="col-span-3 py-16 text-center text-[13px] text-slate-400">No forms yet — create your first lead form!</p>}
      </div>

      {/* Create form modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="New WhatsApp Form" wide>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Form name"><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Lead Qualification" /></Field>
          <Field label="Description"><input className={inputCls} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Collect lead details" /></Field>
        </div>
        <p className="mb-2 mt-3 text-[13px] font-bold text-slate-800">Fields</p>
        <div className="space-y-2">
          {fields.map((field, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto] items-end gap-2">
              <Field label={i === 0 ? "Label" : ""}>
                <input className={inputCls} value={field.label} onChange={(e) => { updateField(i, { label: e.target.value, key: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "_") }); }} placeholder="Full Name" />
              </Field>
              <Field label={i === 0 ? "Type" : ""}>
                <select className={inputCls} value={field.type} onChange={(e) => updateField(i, { type: e.target.value })}>
                  {FIELD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <div className={i === 0 ? "mb-[1px] mt-6" : ""}>
                <label className="flex cursor-pointer items-center gap-1.5 text-[11px] text-slate-500">
                  <input type="checkbox" checked={field.required} onChange={(e) => updateField(i, { required: e.target.checked })} />Required
                </label>
              </div>
              <button onClick={() => setFields(fields.filter((_, j) => j !== i))} className={`${i === 0 ? "mt-6" : ""} text-slate-300 hover:text-rose-500`}><Trash2 size={13} /></button>
            </div>
          ))}
        </div>
        <button onClick={() => setFields([...fields, { label: "", key: "", type: "text", required: false }])} className="mt-3 text-[13px] font-semibold text-emerald-600 hover:text-emerald-700">+ Add field</button>
        {error && <p className="mt-2 text-[12.5px] text-rose-600">{error}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Create Form"}</Button>
        </div>
      </Modal>

      {/* Responses modal */}
      {viewResponses && (
        <Modal open={true} onClose={() => setViewResponses(null)} title="Form Responses" wide>
          {responses.length === 0 ? (
            <p className="py-8 text-center text-[13px] text-slate-400">No responses yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px]">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-slate-500">
                    <th className="pb-2 pr-4 font-semibold">Contact</th>
                    <th className="pb-2 pr-4 font-semibold">Answers</th>
                    <th className="pb-2 font-semibold">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((r) => {
                    const answers = JSON.parse(r.answers || "{}");
                    return (
                      <tr key={r.id} className="border-b border-slate-50">
                        <td className="py-2 pr-4">
                          <p className="font-semibold text-slate-900">{r.contact.name ?? "Unknown"}</p>
                          <p className="font-mono text-[11px] text-slate-400">+{r.contact.phone}</p>
                        </td>
                        <td className="py-2 pr-4">
                          {Object.entries(answers).map(([k, v]) => (
                            <span key={k} className="mr-2 rounded-full bg-slate-100 px-2 py-0.5 text-[11px]">
                              <b>{k}:</b> {String(v)}
                            </span>
                          ))}
                        </td>
                        <td className="py-2 text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <Button variant="secondary" onClick={() => setViewResponses(null)}>Close</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
