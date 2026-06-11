"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Send,
  Sparkles,
  Check,
  CheckCheck,
  Clock,
  Bot,
  User,
  CircleDot,
  Smile,
  Frown,
  FlaskConical,
} from "lucide-react";
import { Badge, Button, inputCls, statusTone } from "@/components/ui";

type Contact = { id: string; name: string | null; phone: string; tags: string; email: string | null };
type Message = {
  id: string;
  direction: "IN" | "OUT";
  body: string;
  status: string;
  sentiment: string | null;
  isAi: boolean;
  createdAt: string;
};
type ConversationListItem = {
  id: string;
  status: string;
  assignee: string | null;
  unread: number;
  aiEnabled: boolean;
  lastMessageAt: string;
  contact: Contact;
  messages: Message[];
};
type ConversationDetail = ConversationListItem & { messages: Message[] };

const FILTERS = ["ALL", "OPEN", "PENDING", "RESOLVED"];

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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ConversationDetail | null>(null);
  const [draft, setDraft] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [simulateText, setSimulateText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadList = useCallback(async () => {
    const res = await fetch(`/api/conversations?status=${filter}`);
    setConversations(await res.json());
  }, [filter]);

  const loadDetail = useCallback(async (id: string) => {
    const res = await fetch(`/api/conversations/${id}`);
    if (res.ok) setDetail(await res.json());
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

  async function sendMessage(body: string) {
    if (!selectedId || !body.trim()) return;
    setSending(true);
    setDraft("");
    setSuggestions([]);
    await fetch(`/api/conversations/${selectedId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
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

  return (
    <div className="flex h-screen">
      {/* Conversation list */}
      <div className="flex w-80 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-4">
          <h1 className="text-lg font-bold text-slate-900">Team Inbox</h1>
          <div className="mt-3 flex gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  filter === f ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3.5 text-left transition-colors ${
                selectedId === c.id ? "bg-emerald-50/70" : "hover:bg-slate-50"
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-[13px] font-bold text-white">
                {initials(c.contact.name, c.contact.phone)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between">
                  <span className="truncate text-[13.5px] font-semibold text-slate-900">
                    {c.contact.name ?? c.contact.phone}
                  </span>
                  <span className="ml-2 shrink-0 text-[11px] text-slate-400">{timeAgo(c.lastMessageAt)}</span>
                </span>
                <span className="mt-0.5 flex items-center justify-between gap-2">
                  <span className="truncate text-[12px] text-slate-500">
                    {c.messages[0]?.body ?? "No messages yet"}
                  </span>
                  {c.unread > 0 && (
                    <span className="flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white">
                      {c.unread}
                    </span>
                  )}
                </span>
              </span>
            </button>
          ))}
          {conversations.length === 0 && (
            <p className="px-4 py-10 text-center text-[13px] text-slate-400">No conversations</p>
          )}
        </div>
      </div>

      {/* Thread */}
      <div className="flex min-w-0 flex-1 flex-col">
        {!detail ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-slate-400">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Send size={24} />
            </span>
            <p className="text-[14px] font-medium">Select a conversation to start messaging</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-[12px] font-bold text-white">
                  {initials(detail.contact.name, detail.contact.phone)}
                </span>
                <div>
                  <p className="text-[14px] font-bold text-slate-900">{detail.contact.name ?? detail.contact.phone}</p>
                  <p className="text-[11.5px] text-slate-400">+{detail.contact.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
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
              <div className="mx-auto max-w-3xl space-y-2.5">
                {detail.messages.map((m) => (
                  <div key={m.id} className={`flex ${m.direction === "OUT" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 shadow-sm ${
                        m.direction === "OUT"
                          ? "rounded-br-md bg-[#d7f8d0] text-slate-800"
                          : "rounded-bl-md bg-white text-slate-800"
                      }`}
                    >
                      {m.isAi && (
                        <span className="mb-1 flex items-center gap-1 text-[10.5px] font-bold text-violet-600">
                          <Bot size={11} /> AI Agent
                        </span>
                      )}
                      <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed">{m.body}</p>
                      <span className="mt-1 flex items-center justify-end gap-1.5">
                        {m.direction === "IN" && m.sentiment === "negative" && <Frown size={12} className="text-rose-500" />}
                        {m.direction === "IN" && m.sentiment === "positive" && <Smile size={12} className="text-emerald-500" />}
                        <span className="text-[10.5px] text-slate-400">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {m.direction === "OUT" && <StatusTicks status={m.status} />}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            </div>

            {suggestions.length > 0 && (
              <div className="flex gap-2 overflow-x-auto border-t border-slate-200 bg-violet-50/60 px-6 py-2.5">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => { setDraft(s); setSuggestions([]); }}
                    className="shrink-0 rounded-full border border-violet-200 bg-white px-3 py-1.5 text-[12px] font-medium text-violet-700 transition-colors hover:bg-violet-100"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div className="border-t border-slate-200 bg-white px-6 py-4">
              <div className="flex items-end gap-2">
                <button
                  onClick={getSuggestions}
                  disabled={loadingSuggest}
                  title="AI reply suggestions"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 transition-colors hover:bg-violet-200 disabled:opacity-50"
                >
                  <Sparkles size={17} className={loadingSuggest ? "animate-pulse" : ""} />
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
                  placeholder="Type a message… (Enter to send)"
                  className={`${inputCls} max-h-32 resize-none`}
                />
                <Button onClick={() => sendMessage(draft)} disabled={sending || !draft.trim()} className="h-10">
                  <Send size={15} /> Send
                </Button>
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <FlaskConical size={13} className="shrink-0 text-amber-500" />
                <input
                  value={simulateText}
                  onChange={(e) => setSimulateText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && simulateInbound()}
                  placeholder="Demo: simulate a customer message (try 'what is the price?')"
                  className="flex-1 rounded-lg border border-dashed border-amber-300 bg-amber-50/50 px-3 py-1.5 text-[12px] text-slate-700 outline-none placeholder:text-amber-600/60 focus:border-amber-400"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Contact panel */}
      {detail && (
        <div className="hidden w-72 shrink-0 flex-col border-l border-slate-200 bg-white xl:flex">
          <div className="flex flex-col items-center border-b border-slate-200 px-6 py-7">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xl font-bold text-white">
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
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">Assignee</p>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
                <User size={15} className="text-slate-400" />
                <span className="text-[13px] font-medium text-slate-700">{detail.assignee ?? "Unassigned"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
