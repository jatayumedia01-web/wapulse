"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, Timer, CheckCircle2, Inbox } from "lucide-react";
import { PageHeader, Button, Badge, Modal, Field, inputCls } from "@/components/ui";

type Member = {
  id: string;
  name: string;
  email: string;
  role: string;
  openConversations: number;
  resolvedTotal: number;
};
type AgentStat = { name: string; open: number; resolved: number; avgResponseMins: number };

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<AgentStat[]>([]);
  const [autoAssign, setAutoAssign] = useState(true);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", role: "AGENT" });

  const load = useCallback(async () => {
    const [team, analytics, settings] = await Promise.all([
      fetch("/api/team").then((r) => r.json()),
      fetch("/api/analytics").then((r) => r.json()),
      fetch("/api/settings").then((r) => r.json()),
    ]);
    setMembers(Array.isArray(team) ? team : []);
    setStats(analytics.agents ?? []);
    setAutoAssign(settings.autoAssign);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function addMember() {
    setError("");
    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setError((await res.json()).error ?? "Failed");
      return;
    }
    setOpen(false);
    setForm({ name: "", email: "", role: "AGENT" });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/team?id=${id}`, { method: "DELETE" });
    load();
  }

  async function toggleAutoAssign() {
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ autoAssign: !autoAssign }),
    });
    setAutoAssign(!autoAssign);
  }

  return (
    <div>
      <PageHeader
        title="Team"
        subtitle="Agents, roles, workload distribution and performance"
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus size={15} /> Add Member
          </Button>
        }
      />
      <div className="space-y-6 px-8 py-7">
        <div className="flex items-center justify-between bg-white/90 backdrop-blur border border-white/80 shadow-lg shadow-indigo-50 rounded-2xl px-6 py-4">
          <div>
            <p className="text-[14px] font-bold text-slate-900">Auto-assignment (round-robin)</p>
            <p className="text-[12.5px] text-slate-500">New conversations are automatically assigned to the agent with the lightest workload</p>
          </div>
          <button
            onClick={toggleAutoAssign}
            className={`relative h-6 w-11 rounded-full transition-colors ${autoAssign ? "bg-emerald-500" : "bg-slate-300"}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${autoAssign ? "left-[22px]" : "left-0.5"}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {members.map((m) => {
            const stat = stats.find((s) => s.name === m.name);
            return (
              <div key={m.id} className="fade-up bg-white/90 backdrop-blur border border-white/80 shadow-lg shadow-indigo-50 rounded-2xl p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 text-[14px] font-bold text-white">
                      {m.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
                    </span>
                    <div>
                      <p className="text-[14px] font-bold text-slate-900">{m.name}</p>
                      <p className="text-[12px] text-slate-400">{m.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge tone={m.role === "ADMIN" ? "violet" : "slate"}>{m.role}</Badge>
                    <button onClick={() => remove(m.id)} className="rounded-lg p-1 text-slate-300 hover:bg-rose-50 hover:text-rose-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                  <div className="text-center">
                    <p className="flex items-center justify-center gap-1 text-[17px] font-bold text-slate-900">
                      <Inbox size={14} className="text-emerald-500" /> {m.openConversations}
                    </p>
                    <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">Open</p>
                  </div>
                  <div className="text-center">
                    <p className="flex items-center justify-center gap-1 text-[17px] font-bold text-slate-900">
                      <CheckCircle2 size={14} className="text-sky-500" /> {m.resolvedTotal}
                    </p>
                    <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">Resolved</p>
                  </div>
                  <div className="text-center">
                    <p className="flex items-center justify-center gap-1 text-[17px] font-bold text-slate-900">
                      <Timer size={14} className="text-amber-500" /> {stat?.avgResponseMins ?? 0}m
                    </p>
                    <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">Avg Reply</p>
                  </div>
                </div>
              </div>
            );
          })}
          {members.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-white" style={{ background: "linear-gradient(135deg,#8b5cf6,#d946ef)", boxShadow: "0 8px 24px rgba(139,92,246,0.3)" }}>
                <Plus size={28} />
              </div>
              <p className="text-[15px] font-bold text-slate-700">No team members yet</p>
              <p className="mt-1 text-[13px] text-slate-400">Add agents to manage conversations together</p>
            </div>
          )}
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Team Member">
        <Field label="Full name">
          <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Priya Sharma" />
        </Field>
        <Field label="Email">
          <input className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="priya@company.com" />
        </Field>
        <Field label="Role">
          <select className={inputCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="AGENT">Agent</option>
            <option value="ADMIN">Admin</option>
          </select>
        </Field>
        {error && <p className="mb-3 text-[12.5px] font-medium text-rose-600">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={addMember}>Add Member</Button>
        </div>
      </Modal>
    </div>
  );
}
