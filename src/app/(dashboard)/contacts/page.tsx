"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Search, Trash2, UserCheck, UserX } from "lucide-react";
import { PageHeader, Button, Badge, Modal, Field, inputCls } from "@/components/ui";

type Contact = {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  tags: string;
  optedIn: boolean;
  createdAt: string;
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", tags: "" });
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch(`/api/contacts?q=${encodeURIComponent(query)}`);
    setContacts(await res.json());
  }, [query]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  async function createContact() {
    setError("");
    const res = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setError((await res.json()).error ?? "Failed");
      return;
    }
    setOpen(false);
    setForm({ name: "", phone: "", email: "", tags: "" });
    load();
  }

  async function toggleOptIn(c: Contact) {
    await fetch(`/api/contacts/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optedIn: !c.optedIn }),
    });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/contacts/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <PageHeader
        title="Contacts"
        subtitle={`${contacts.length} contacts in your audience`}
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus size={15} /> Add Contact
          </Button>
        }
      />
      <div className="p-8">
        <div className="relative mb-5 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, phone or tag…"
            className={`${inputCls} pl-9`}
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11.5px] font-bold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Tags</th>
                <th className="px-5 py-3">Opt-in</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                  <td className="px-5 py-3.5">
                    <p className="text-[13.5px] font-semibold text-slate-900">{c.name ?? "—"}</p>
                    <p className="text-[12px] text-slate-400">{c.email ?? "no email"}</p>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-slate-600">+{c.phone}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {c.tags.split(",").filter(Boolean).map((t) => (
                        <Badge key={t} tone="blue">{t.trim()}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => toggleOptIn(c)}
                      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold transition-colors ${
                        c.optedIn ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                      }`}
                    >
                      {c.optedIn ? <UserCheck size={13} /> : <UserX size={13} />}
                      {c.optedIn ? "Opted in" : "Opted out"}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => remove(c.id)}
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {contacts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-[13px] text-slate-400">
                    No contacts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Contact">
        <Field label="Full name">
          <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ravi Kumar" />
        </Field>
        <Field label="WhatsApp number" hint="Include country code, e.g. 919876543210">
          <input className={inputCls} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="919876543210" />
        </Field>
        <Field label="Email (optional)">
          <input className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="ravi@example.com" />
        </Field>
        <Field label="Tags" hint="Comma separated — used for campaign audience targeting">
          <input className={inputCls} value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="vip, lead" />
        </Field>
        {error && <p className="mb-3 text-[12.5px] font-medium text-rose-600">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={createContact}>Save Contact</Button>
        </div>
      </Modal>
    </div>
  );
}
