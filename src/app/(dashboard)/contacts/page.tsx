"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Search, Trash2, UserCheck, UserX,
  Upload, Download, MessageSquare, Send, X, Clock,
  ShoppingCart, MessageCircle, Zap, GitBranch,
} from "lucide-react";
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

type QuickReply = { id: string; shortcut: string; body: string };
type TimelineItem = { id: string; type: string; title: string; detail: string; status?: string; createdAt: string };

export default function ContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", tags: "" });
  const [error, setError] = useState("");
  const [importResult, setImportResult] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Direct message panel
  const [msgContact, setMsgContact] = useState<Contact | null>(null);
  const [msgBody, setMsgBody] = useState("");
  const [sending, setSending] = useState(false);
  const [msgResult, setMsgResult] = useState<{ ok: boolean; text: string } | null>(null);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [showQR, setShowQR] = useState(false);
  const [timelineContact, setTimelineContact] = useState<Contact | null>(null);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);

  const load = useCallback(async () => {
    const res = await fetch(`/api/contacts?q=${encodeURIComponent(query)}`);
    setContacts(await res.json());
  }, [query]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  useEffect(() => {
    fetch("/api/quick-replies").then((r) => r.json()).then(setQuickReplies);
  }, []);

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

  async function handleImport(file: File) {
    const text = await file.text();
    const res = await fetch("/api/contacts/import", { method: "POST", body: text });
    const data = await res.json();
    setImportResult(res.ok ? `Imported ${data.imported} contacts (${data.skipped} skipped)` : data.error);
    setTimeout(() => setImportResult(""), 4000);
    load();
  }

  async function openTimeline(c: Contact) {
    setTimelineContact(c);
    setMsgContact(null);
    const data = await fetch(`/api/contacts/${c.id}/timeline`).then((r) => r.json());
    setTimelineItems(data);
  }

  function openMsg(c: Contact) {
    setMsgContact(c);
    setMsgBody("");
    setMsgResult(null);
    setShowQR(false);
  }

  async function sendDirectMessage() {
    if (!msgContact || !msgBody.trim()) return;
    setSending(true);
    setMsgResult(null);
    try {
      // find or create conversation then send
      const res = await fetch("/api/contacts/" + msgContact.id + "/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: msgBody }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsgResult({ ok: true, text: "Message sent! Opening conversation…" });
        setTimeout(() => {
          setMsgContact(null);
          router.push("/inbox");
        }, 1200);
      } else {
        setMsgResult({ ok: false, text: data.error ?? "Failed to send" });
      }
    } catch {
      setMsgResult({ ok: false, text: "Network error" });
    }
    setSending(false);
  }

  const filteredQR = msgBody.startsWith("/")
    ? quickReplies.filter((q) => q.shortcut.includes(msgBody.slice(1).toLowerCase()))
    : [];

  return (
    <div className="flex h-screen flex-col">
      <PageHeader
        title="Contacts"
        subtitle={`${contacts.length} contacts in your audience`}
        action={
          <div className="flex gap-2">
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])}
            />
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>
              <Upload size={14} /> Import CSV
            </Button>
            <Button variant="secondary" onClick={() => window.open("/api/contacts/export", "_blank")}>
              <Download size={14} /> Export
            </Button>
            <Button onClick={() => setOpen(true)}>
              <Plus size={15} /> Add Contact
            </Button>
          </div>
        }
      />

      <div className="flex min-h-0 flex-1">
        {/* Contact table */}
        <div className={`flex flex-1 flex-col overflow-y-auto p-8 transition-all ${msgContact ? "xl:pr-4" : ""}`}>
          {importResult && (
            <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-2.5 text-[12.5px] font-semibold text-emerald-700">{importResult}</p>
          )}
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
                  <tr
                    key={c.id}
                    className={`border-b border-slate-100 last:border-0 transition-colors ${
                      msgContact?.id === c.id ? "bg-emerald-50" : "hover:bg-slate-50/60"
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => openMsg(c)}
                        className="flex items-center gap-2.5 text-left"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-[11px] font-bold text-white">
                          {(c.name ?? c.phone).slice(0, 2).toUpperCase()}
                        </span>
                        <span>
                          <p className="text-[13.5px] font-semibold text-slate-900 hover:text-emerald-700">
                            {c.name ?? "—"}
                          </p>
                          <p className="text-[12px] text-slate-400">{c.email ?? "no email"}</p>
                        </span>
                      </button>
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
                          c.optedIn
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                        }`}
                      >
                        {c.optedIn ? <UserCheck size={13} /> : <UserX size={13} />}
                        {c.optedIn ? "Opted in" : "Opted out"}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openTimeline(c)}
                          title="View timeline"
                          className="rounded-lg p-2 text-sky-500 transition-colors hover:bg-sky-50 hover:text-sky-700"
                        >
                          <Clock size={15} />
                        </button>
                        <button
                          onClick={() => openMsg(c)}
                          title="Send message"
                          className="rounded-lg p-2 text-emerald-500 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <MessageSquare size={15} />
                        </button>
                        <button
                          onClick={() => remove(c.id)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
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

        {/* Direct message slide-in panel */}
        {msgContact && (
          <div className="fade-up flex w-full max-w-sm shrink-0 flex-col border-l border-slate-200 bg-white xl:w-96">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-[12px] font-bold text-white">
                  {(msgContact.name ?? msgContact.phone).slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <p className="text-[14px] font-bold text-slate-900">{msgContact.name ?? "Unknown"}</p>
                  <p className="text-[12px] text-slate-400">+{msgContact.phone}</p>
                </div>
              </div>
              <button onClick={() => setMsgContact(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X size={16} />
              </button>
            </div>

            {/* Contact info */}
            <div className="border-b border-slate-100 px-5 py-3">
              <div className="flex flex-wrap gap-1.5">
                {msgContact.tags.split(",").filter(Boolean).map((t) => (
                  <Badge key={t} tone="blue">{t.trim()}</Badge>
                ))}
                {!msgContact.optedIn && <Badge tone="red">Opted out</Badge>}
              </div>
              {msgContact.email && (
                <p className="mt-1 text-[11.5px] text-slate-400">{msgContact.email}</p>
              )}
            </div>

            {/* Message area */}
            <div className="flex-1 overflow-y-auto p-5">
              <p className="mb-3 text-[12.5px] font-semibold text-slate-700">Quick Replies</p>
              <div className="mb-4 flex flex-wrap gap-1.5">
                {quickReplies.slice(0, 6).map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setMsgBody(q.body)}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11.5px] font-semibold text-emerald-700 hover:bg-emerald-100"
                  >
                    /{q.shortcut}
                  </button>
                ))}
              </div>

              <p className="mb-2 text-[12px] font-semibold text-slate-600">Message</p>

              {/* Quick reply dropdown from "/" typing */}
              {filteredQR.length > 0 && (
                <div className="mb-2 rounded-xl border border-slate-200 bg-white shadow-lg">
                  {filteredQR.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => setMsgBody(q.body)}
                      className="flex w-full items-baseline gap-2 px-3 py-2 text-left hover:bg-emerald-50"
                    >
                      <span className="font-mono text-[11px] font-bold text-emerald-600">/{q.shortcut}</span>
                      <span className="truncate text-[12px] text-slate-600">{q.body}</span>
                    </button>
                  ))}
                </div>
              )}

              <textarea
                value={msgBody}
                onChange={(e) => { setMsgBody(e.target.value); setShowQR(false); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendDirectMessage();
                  }
                }}
                rows={5}
                placeholder={"Type a message… (or / for quick replies)\n\nEnter to send"}
                className={`${inputCls} resize-none`}
              />

              {msgResult && (
                <p className={`mt-2 rounded-lg px-3 py-2 text-[12.5px] font-semibold ${
                  msgResult.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"
                }`}>
                  {msgResult.text}
                </p>
              )}
            </div>

            {/* Send button */}
            <div className="border-t border-slate-200 px-5 py-4">
              {!msgContact.optedIn && (
                <p className="mb-3 rounded-xl bg-amber-50 px-3 py-2 text-[12px] text-amber-700">
                  ⚠️ This contact has opted out — message will be simulated only.
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => router.push("/inbox")}
                  className="flex-1 rounded-lg border border-slate-200 py-2.5 text-[12.5px] font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Open Inbox
                </button>
                <Button
                  onClick={sendDirectMessage}
                  disabled={sending || !msgBody.trim()}
                  className="flex-1"
                >
                  <Send size={14} /> {sending ? "Sending…" : "Send"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Timeline drawer */}
      {timelineContact && (
        <div className="fade-up flex w-full max-w-sm shrink-0 flex-col border-l border-slate-200 bg-white xl:w-96">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-[12px] font-bold text-white">
                {(timelineContact.name ?? timelineContact.phone).slice(0, 2).toUpperCase()}
              </span>
              <div>
                <p className="text-[14px] font-bold text-slate-900">{timelineContact.name ?? "Unknown"}</p>
                <p className="text-[12px] text-slate-400">Activity Timeline</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => { openMsg(timelineContact); setTimelineContact(null); }} title="Send message" className="rounded-lg p-1.5 text-emerald-500 hover:bg-emerald-50">
                <MessageSquare size={15} />
              </button>
              <button onClick={() => setTimelineContact(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X size={16} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {timelineItems.length === 0 && (
              <p className="py-12 text-center text-[13px] text-slate-400">No activity yet</p>
            )}
            <div className="relative border-l-2 border-slate-100 pl-5">
              {timelineItems.map((item) => {
                const icon =
                  item.type === "order" ? <ShoppingCart size={12} /> :
                  item.type === "conversation" ? <MessageCircle size={12} /> :
                  item.type === "drip" ? <GitBranch size={12} /> :
                  <Zap size={12} />;
                const color =
                  item.type === "order" ? "bg-amber-500" :
                  item.type === "conversation" ? "bg-emerald-500" :
                  item.type === "drip" ? "bg-violet-500" : "bg-sky-500";
                return (
                  <div key={item.id} className="relative mb-5">
                    <span className={`absolute -left-[26px] flex h-5 w-5 items-center justify-center rounded-full text-white ${color}`}>
                      {icon}
                    </span>
                    <p className="text-[13px] font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-[11.5px] text-slate-500">{item.detail}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">{new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
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
