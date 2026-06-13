"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Send,
  Sparkles,
  Check,
  CheckCheck,
  Clock,
  Bot,
  CircleDot,
  Smile,
  Frown,
  FlaskConical,
  Search,
  StickyNote,
  Tag,
  X,
  Zap,
  Filter,
  ChevronDown,
  ListFilter,
} from "lucide-react";
import { Badge, Button, inputCls, statusTone } from "@/components/ui";

type Contact = { id: string; name: string | null; phone: string; tags: string; email: string | null };
type Message = {
  id: string;
  direction: "IN" | "OUT";
  kind: string;
  body: string;
  status: string;
  sentiment: string | null;
  isAi: boolean;
  author: string | null;
  createdAt: string;
};
type ConversationListItem = {
  id: string;
  status: string;
  assignee: string | null;
  labels: string;
  unread: number;
  aiEnabled: boolean;
  lastMessageAt: string;
  contact: Contact;
  messages: Message[];
};
type ConversationDetail = ConversationListItem & { messages: Message[] };
type QuickReply = { id: string; shortcut: string; body: string };
type TeamMember = { id: string; name: string; role: string };

const FILTERS = ["ALL", "OPEN", "PENDING", "RESOLVED"];
const LABEL_PRESETS = ["hot-lead", "vip", "complaint", "follow-up", "payment"];

function initials(name: string | null, phone: string) {
  if (name) return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return phone.slice(-2);
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

function StatusTicks({ status }: { status: string }) {
  if (status === "READ") return <CheckCheck size={14} className="text-sky-500" />;
  if (status === "DELIVERED") return <CheckCheck size={14} className="text-slate-400" />;
  if (status === "SENT") return <Check size={14} className="text-slate-400" />;
  if (status === "FAILED") return <span className="text-[10px] font-bold text-rose-500">!</span>;
  return <Clock size={13} className="text-slate-400" />;
}

export default function InboxPage() {
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [filterLabel, setFilterLabel] = useState("");
  const [filterAssignee, setFilterAssignee] = useState("");
  const [filterUnread, setFilterUnread] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ConversationDetail | null>(null);
  const [draft, setDraft] = useState("");
  const [noteMode, setNoteMode] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [simulateText, setSimulateText] = useState("");
  const [sending, setSending] = useState(false);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [showQuick, setShowQuick] = useState(false);
  const [labelInput, setLabelInput] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadList = useCallback(async () => {
    const params = new URLSearchParams({ status: filter, q: search });
    if (filterLabel) params.set("label", filterLabel);
    if (filterAssignee) params.set("assignee", filterAssignee);
    if (filterUnread) params.set("unread", "1");
    const res = await fetch(`/api/conversations?${params}`);
    setConversations(await res.json());
  }, [filter, search, filterLabel, filterAssignee, filterUnread]);

  const loadDetail = useCallback(async (id: string) => {
    const res = await fetch(`/api/conversations/${id}`);
    if (res.ok) setDetail(await res.json());
  }, []);

  useEffect(() => {
    fetch("/api/quick-replies").then((r) => r.json()).then(setQuickReplies);
    fetch("/api/team").then((r) => r.json()).then(setTeam);
  }, []);

  useEffect(() => {
    loadList();
    const t = setInterval(loadList, 5000);
    return () => clearInterval(t);
  }, [loadList]);

  useEffect(() => {
    if (!selectedId) return;
    loadDetail(selectedId);
    const t = setInterval(() => loadDetail(selectedId), 4000);
    return () => clearInterval(t);
  }, [selectedId, loadDetail]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [detail?.messages.length]);

  // "/" quick reply palette
  useEffect(() => {
    setShowQuick(draft.startsWith("/"));
  }, [draft]);

  const filteredQuick = draft.startsWith("/")
    ? quickReplies.filter((q) => q.shortcut.includes(draft.slice(1).toLowerCase()))
    : quickReplies;

  async function sendMessage(body: string) {
    if (!selectedId || !body.trim()) return;
    setSending(true);
    setDraft("");
    setSuggestions([]);
    await fetch(`/api/conversations/${selectedId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body, kind: noteMode ? "NOTE" : "MESSAGE" }),
    });
    setNoteMode(false);
    await loadDetail(selectedId);
    await loadList();
    setSending(false);
  }

  async function getSuggestions() {
    if (!selectedId) return;
    setLoadingSuggest(true);
    const res = await fetch("/api/ai/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: selectedId }),
    });
    const data = await res.json();
    setSuggestions(data.suggestions ?? []);
    setLoadingSuggest(false);
  }

  async function simulateInbound() {
    if (!selectedId || !simulateText.trim()) return;
    const text = simulateText;
    setSimulateText("");
    await fetch(`/api/conversations/${selectedId}/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: text }),
    });
    await loadDetail(selectedId);
    await loadList();
  }

  async function patchConversation(data: Record<string, unknown>) {
    if (!selectedId) return;
    await fetch(`/api/conversations/${selectedId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await loadDetail(selectedId);
    await loadList();
  }

  function toggleLabel(label: string) {
    if (!detail) return;
    const labels = detail.labels.split(",").map((l) => l.trim()).filter(Boolean);
    const next = labels.includes(label) ? labels.filter((l) => l !== label) : [...labels, label];
    patchConversation({ labels: next.join(",") });
  }

  const detailLabels = detail?.labels.split(",").map((l) => l.trim()).filter(Boolean) ?? [];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Conversation list */}
      <div className="flex w-[300px] shrink-0 flex-col border-r border-white/40" style={{ background: "rgba(255,255,255,0.82)", backdropFilter: "blur(24px)" }}>
        {/* Header */}
        <div className="px-4 pt-5 pb-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-[17px] font-bold text-slate-900">Inbox</h1>
            <span className="flex h-6 w-6 items-center justify-center rounded-full gradient-emerald text-[10px] font-bold text-white shadow-md shadow-emerald-200">
              {conversations.filter(c => c.unread > 0).length || conversations.length}
            </span>
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or phone…"
              className="input-glass w-full py-2 pl-8 pr-3 text-[12.5px]"
            />
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex gap-1">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
                    filter === f
                      ? "gradient-emerald text-white shadow-md shadow-emerald-200"
                      : "text-slate-500 hover:bg-white/80"
                  }`}
                >
                  {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${showAdvanced || filterLabel || filterAssignee || filterUnread ? "bg-violet-100 text-violet-700" : "text-slate-400 hover:bg-white/80"}`}
            >
              <ListFilter size={12} /> Filter
            </button>
          </div>
          {showAdvanced && (
            <div className="mt-2 space-y-2 glass-sm rounded-2xl p-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">Label</p>
                  <select className="input-glass w-full py-1.5 px-2 text-[11.5px] text-slate-700" value={filterLabel} onChange={(e) => setFilterLabel(e.target.value)}>
                    <option value="">Any</option>
                    {LABEL_PRESETS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">Assignee</p>
                  <select className="input-glass w-full py-1.5 px-2 text-[11.5px] text-slate-700" value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)}>
                    <option value="">Anyone</option>
                    {team.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-[11.5px] text-slate-600">
                <input type="checkbox" checked={filterUnread} onChange={(e) => setFilterUnread(e.target.checked)} className="rounded" />
                Unread only
              </label>
              {(filterLabel || filterAssignee || filterUnread) && (
                <button onClick={() => { setFilterLabel(""); setFilterAssignee(""); setFilterUnread(false); }} className="text-[11px] font-semibold text-rose-500 hover:text-rose-700">
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`flex w-full items-start gap-3 rounded-2xl px-3 py-3 mb-1 text-left transition-all duration-200 ${
                selectedId === c.id
                  ? "bg-gradient-to-r from-emerald-50 to-blue-50 shadow-sm border border-emerald-100/60"
                  : "hover:bg-white/70"
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl gradient-emerald text-[12px] font-bold text-white shadow-md shadow-emerald-200">
                {initials(c.contact.name, c.contact.phone)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between">
                  <span className="truncate text-[13px] font-semibold text-slate-900">
                    {c.contact.name ?? c.contact.phone}
                  </span>
                  <span className="ml-2 shrink-0 text-[10.5px] text-slate-400">{timeAgo(c.lastMessageAt)}</span>
                </span>
                <span className="mt-0.5 flex items-center justify-between gap-2">
                  <span className="truncate text-[12px] text-slate-500 leading-tight">
                    {c.messages[0]?.body ?? "No messages yet"}
                  </span>
                  {c.unread > 0 && (
                    <span className="flex h-4 min-w-[16px] shrink-0 items-center justify-center rounded-full gradient-emerald px-1 text-[9px] font-bold text-white shadow-sm">
                      {c.unread}
                    </span>
                  )}
                </span>
                {(c.labels || c.assignee) && (
                  <span className="mt-1 flex flex-wrap items-center gap-1">
                    {c.assignee && <Badge tone="violet">{c.assignee}</Badge>}
                    {c.labels.split(",").filter(Boolean).slice(0, 1).map((l) => (
                      <Badge key={l} tone="amber">{l.trim()}</Badge>
                    ))}
                  </span>
                )}
              </span>
            </button>
          ))}
          {conversations.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-[13px] font-medium text-slate-400">No conversations</p>
            </div>
          )}
        </div>
      </div>

      {/* Thread */}
      <div className="flex min-w-0 flex-1 flex-col">
        {!detail ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-slate-400">
            <div className="float-anim flex h-20 w-20 items-center justify-center rounded-3xl gradient-emerald shadow-2xl shadow-emerald-200">
              <Send size={28} className="text-white" />
            </div>
            <div className="text-center">
              <p className="text-[16px] font-bold text-slate-700">Select a conversation</p>
              <p className="mt-1 text-[13px] text-slate-400">Pick a chat from the left to start messaging</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-white/40 bg-white/85 px-6 py-3.5 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl gradient-emerald text-[12px] font-bold text-white shadow-md shadow-emerald-200">
                  {initials(detail.contact.name, detail.contact.phone)}
                </span>
                <div>
                  <p className="text-[14px] font-bold text-slate-900">{detail.contact.name ?? detail.contact.phone}</p>
                  <p className="text-[11.5px] text-slate-400">+{detail.contact.phone}</p>
                </div>
                <div className="ml-2 flex items-center gap-1.5">
                  {detailLabels.map((l) => (
                    <button key={l} onClick={() => toggleLabel(l)} className="group flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 hover:bg-amber-100">
                      {l} <X size={10} className="opacity-0 group-hover:opacity-100" />
                    </button>
                  ))}
                  <div className="relative">
                    <button onClick={() => setLabelInput(!labelInput)} className="flex items-center gap-1 rounded-full border border-dashed border-slate-300 px-2 py-0.5 text-[11px] font-semibold text-slate-400 hover:border-amber-400 hover:text-amber-600">
                      <Tag size={10} /> Label
                    </button>
                    {labelInput && (
                      <div className="absolute left-0 top-7 z-20 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                        {LABEL_PRESETS.map((l) => (
                          <button
                            key={l}
                            onClick={() => { toggleLabel(l); setLabelInput(false); }}
                            className={`block w-full rounded-lg px-2.5 py-1.5 text-left text-[12px] font-medium hover:bg-slate-50 ${detailLabels.includes(l) ? "text-amber-600" : "text-slate-600"}`}
                          >
                            {detailLabels.includes(l) ? "✓ " : ""}{l}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={detail.assignee ?? ""}
                  onChange={(e) => patchConversation({ assignee: e.target.value || null })}
                  className="input-glass rounded-xl px-3 py-1.5 text-[12px] font-semibold text-slate-600"
                >
                  <option value="">Unassigned</option>
                  {team.map((m) => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
                <Badge tone={statusTone(detail.status)}>{detail.status}</Badge>
                {detail.status !== "RESOLVED" ? (
                  <Button variant="secondary" onClick={() => patchConversation({ status: "RESOLVED" })}>
                    <Check size={14} /> Resolve
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={() => patchConversation({ status: "OPEN" })}>
                    <CircleDot size={14} /> Reopen
                  </Button>
                )}
              </div>
            </div>

            <div className="chat-bg flex-1 overflow-y-auto px-8 py-6">
              <div className="mx-auto max-w-3xl space-y-3">
                {detail.messages.map((m) =>
                  m.kind === "NOTE" ? (
                    <div key={m.id} className="flex justify-center">
                      <div className="max-w-[80%] glass-sm rounded-2xl border border-amber-200/60 px-4 py-2.5">
                        <p className="flex items-center gap-1.5 text-[10.5px] font-bold text-amber-700">
                          <StickyNote size={11} /> Private note · {m.author ?? "Agent"}
                        </p>
                        <p className="mt-0.5 whitespace-pre-wrap text-[13px] text-amber-900">{m.body}</p>
                      </div>
                    </div>
                  ) : (
                    <div key={m.id} className={`flex ${m.direction === "OUT" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                          m.direction === "OUT"
                            ? "rounded-br-sm bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-emerald-200"
                            : "rounded-bl-sm bg-white/90 text-slate-800 shadow-slate-200/60 backdrop-blur-sm border border-white/60"
                        }`}
                      >
                        {m.direction === "OUT" && m.author && m.author !== "Agent" && (
                          <span className={`mb-1 flex items-center gap-1 text-[10.5px] font-bold ${m.isAi ? "text-white/80" : "text-white/80"}`}>
                            {m.isAi ? <Bot size={11} /> : <Zap size={11} />} {m.author}
                          </span>
                        )}
                        <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed">{m.body}</p>
                        <span className="mt-1.5 flex items-center justify-end gap-1.5">
                          {m.direction === "IN" && m.sentiment === "negative" && <Frown size={12} className="text-rose-400" />}
                          {m.direction === "IN" && m.sentiment === "positive" && <Smile size={12} className="text-emerald-500" />}
                          <span className={`text-[10px] ${m.direction === "OUT" ? "text-white/70" : "text-slate-400"}`}>
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {m.direction === "OUT" && <StatusTicks status={m.status} />}
                        </span>
                      </div>
                    </div>
                  )
                )}
                <div ref={bottomRef} />
              </div>
            </div>

            {suggestions.length > 0 && (
              <div className="flex gap-2 overflow-x-auto border-t border-white/40 bg-violet-50/60 px-6 py-2.5 backdrop-blur-sm">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => { setDraft(s); setSuggestions([]); }}
                    className="shrink-0 rounded-2xl border border-violet-200 bg-white/80 px-3.5 py-1.5 text-[12px] font-medium text-violet-700 shadow-sm backdrop-blur-sm transition-all hover:bg-violet-50 hover:-translate-y-px"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {showQuick && filteredQuick.length > 0 && (
              <div className="border-t border-white/40 bg-white/80 px-5 py-2.5 backdrop-blur-sm">
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Quick replies</p>
                <div className="max-h-36 space-y-0.5 overflow-y-auto">
                  {filteredQuick.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => { setDraft(q.body); setShowQuick(false); }}
                      className="flex w-full items-baseline gap-2.5 rounded-xl px-3 py-2 text-left transition-all hover:bg-emerald-50"
                    >
                      <span className="shrink-0 font-mono text-[11px] font-bold text-emerald-600">{q.shortcut}</span>
                      <span className="truncate text-[12px] text-slate-600">{q.body}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={`border-t px-5 py-4 backdrop-blur-xl ${noteMode ? "border-amber-200/60 bg-amber-50/60" : "border-white/40 bg-white/80"}`}>
              <div className="flex items-end gap-2">
                <button
                  onClick={getSuggestions}
                  disabled={loadingSuggest}
                  title="AI reply suggestions"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 border border-violet-100 transition-all hover:bg-violet-100 hover:shadow-md disabled:opacity-50"
                >
                  <Sparkles size={16} className={loadingSuggest ? "animate-pulse" : ""} />
                </button>
                <button
                  onClick={() => setNoteMode(!noteMode)}
                  title="Private note (not sent to customer)"
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition-all ${
                    noteMode ? "gradient-amber text-white border-amber-300 shadow-md shadow-amber-200" : "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100"
                  }`}
                >
                  <StickyNote size={16} />
                </button>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(draft);
                    }
                  }}
                  rows={1}
                  placeholder={noteMode ? "Write a private note for your team…" : "Type a message… ('/' for quick replies, Enter to send)"}
                  className="input-glass flex-1 max-h-32 resize-none px-4 py-2.5 text-[13.5px]"
                />
                <Button onClick={() => sendMessage(draft)} disabled={sending || !draft.trim()} className="h-10 rounded-2xl px-5">
                  <Send size={15} /> {noteMode ? "Note" : "Send"}
                </Button>
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <FlaskConical size={13} className="shrink-0 text-amber-500" />
                <input
                  value={simulateText}
                  onChange={(e) => setSimulateText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && simulateInbound()}
                  placeholder="Demo: simulate a customer message…"
                  className="flex-1 input-glass px-3 py-1.5 text-[12px] border-dashed border-amber-300"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Contact panel */}
      {detail && (
        <div className="hidden w-[260px] shrink-0 flex-col border-l border-white/40 xl:flex" style={{ background: "rgba(255,255,255,0.82)", backdropFilter: "blur(24px)" }}>
          <div className="flex flex-col items-center border-b border-white/40 px-5 py-6">
            <span className="flex h-14 w-14 items-center justify-center rounded-3xl gradient-emerald text-[18px] font-bold text-white shadow-xl shadow-emerald-200">
              {initials(detail.contact.name, detail.contact.phone)}
            </span>
            <p className="mt-3 text-[15px] font-bold text-slate-900">{detail.contact.name ?? "Unknown"}</p>
            <p className="text-[12.5px] text-slate-400">+{detail.contact.phone}</p>
            {detail.contact.email && <p className="mt-0.5 text-[12px] text-slate-400">{detail.contact.email}</p>}
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {detail.contact.tags.split(",").filter(Boolean).map((t) => (
                <Badge key={t} tone="blue">{t.trim()}</Badge>
              ))}
            </div>
          </div>
          <div className="space-y-5 px-6 py-5">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">AI Auto-Reply</p>
              <button
                onClick={() => patchConversation({ aiEnabled: !detail.aiEnabled })}
                className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 transition-colors ${
                  detail.aiEnabled ? "border-violet-200 bg-violet-50" : "border-slate-200 bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                  <Bot size={15} className={detail.aiEnabled ? "text-violet-600" : "text-slate-400"} />
                  {detail.aiEnabled ? "AI Agent active" : "AI Agent paused"}
                </span>
                <span
                  className={`relative h-5 w-9 rounded-full transition-colors ${detail.aiEnabled ? "bg-violet-500" : "bg-slate-300"}`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
                      detail.aiEnabled ? "left-[18px]" : "left-0.5"
                    }`}
                  />
                </span>
              </button>
            </div>
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">Labels</p>
              <div className="flex flex-wrap gap-1.5">
                {LABEL_PRESETS.map((l) => (
                  <button
                    key={l}
                    onClick={() => toggleLabel(l)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                      detailLabels.includes(l)
                        ? "bg-amber-400 text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-amber-100 hover:text-amber-700"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
