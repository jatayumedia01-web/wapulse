"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, Columns } from "lucide-react";
import { PageHeader, Button, Badge, Field, inputCls } from "@/components/ui";

type CustomField = { id: string; name: string; key: string; type: string; options: string };

const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "boolean", label: "Yes/No" },
  { value: "select", label: "Dropdown" },
];

export default function CustomFieldsPage() {
  const [fields, setFields] = useState<CustomField[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("text");
  const [options, setOptions] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const data = await fetch("/api/custom-fields").then((r) => r.json());
    setFields(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function add() {
    if (!name.trim()) { setError("Name required"); return; }
    setSaving(true);
    setError("");
    const res = await fetch("/api/custom-fields", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type, options: options.split(",").map((o) => o.trim()).filter(Boolean) }),
    });
    setSaving(false);
    if (!res.ok) { setError((await res.json()).error); return; }
    setName(""); setType("text"); setOptions("");
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/custom-fields?id=${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <PageHeader
        title="Custom Contact Fields"
        subtitle="Add unlimited custom attributes to every contact — CRM-style data collection"
        action={null}
      />
      <div className="p-8">
        {/* Add form */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-[14px] font-bold text-slate-900">Add New Field</h3>
          <div className="flex flex-wrap items-end gap-3">
            <Field label="Field name">
              <input className={`${inputCls} w-48`} value={name} onChange={(e) => setName(e.target.value)} placeholder="City" />
            </Field>
            <Field label="Type">
              <select className={`${inputCls} w-40`} value={type} onChange={(e) => setType(e.target.value)}>
                {FIELD_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
            {type === "select" && (
              <Field label="Options (comma-separated)">
                <input className={`${inputCls} min-w-48 flex-1`} value={options} onChange={(e) => setOptions(e.target.value)} placeholder="Option A, Option B, Option C" />
              </Field>
            )}
            <Button onClick={add} disabled={saving}>
              <Plus size={14} />{saving ? "Adding…" : "Add Field"}
            </Button>
          </div>
          {error && <p className="mt-2 text-[12.5px] text-rose-600">{error}</p>}
        </div>

        {/* Fields table */}
        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-3.5">
            <div className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
              <Columns size={15} className="text-violet-500" />
              {fields.length} Custom Field{fields.length !== 1 ? "s" : ""}
            </div>
          </div>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-slate-100 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3">Display Name</th>
                <th className="px-5 py-3">Key (used in API / Drip)</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Options</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {fields.map((f) => {
                const opts: string[] = JSON.parse(f.options || "[]");
                return (
                  <tr key={f.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                    <td className="px-5 py-3 font-semibold text-slate-900">{f.name}</td>
                    <td className="px-5 py-3 font-mono text-[11.5px] text-slate-500">{f.key}</td>
                    <td className="px-5 py-3">
                      <Badge tone="violet">{f.type}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      {opts.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {opts.map((o) => <span key={o} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">{o}</span>)}
                        </div>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => remove(f.id)} className="rounded-lg p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-500">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {fields.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-[13px] text-slate-400">
                    No custom fields yet — add your first above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[12px] text-slate-400">
          Custom fields are visible and editable in each contact's profile. They can also be used as merge variables in templates and drip sequences using <code className="font-mono bg-slate-100 px-1 rounded">{"{{field_key}}"}</code> syntax.
        </p>
      </div>
    </div>
  );
}
