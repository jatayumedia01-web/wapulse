"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, GitBranch, ArrowRight, Pencil } from "lucide-react";
import { PageHeader, Button, Badge, Modal, Field, inputCls } from "@/components/ui";

type FlowButton = { text: string; next: string | null };
type FlowNode = { id: string; message: string; buttons: FlowButton[] };
type Flow = {
  id: string;
  name: string;
  keywords: string;
  nodes: string;
  enabled: boolean;
  runs: number;
};

const EMPTY_NODE = (id: string): FlowNode => ({ id, message: "", buttons: [] });

export default function FlowsPage() {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [keywords, setKeywords] = useState("");
  const [nodes, setNodes] = useState<FlowNode[]>([EMPTY_NODE("n1")]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setFlows(await (await fetch("/api/flows")).json());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditId(null);
    setName("");
    setKeywords("");
    setNodes([EMPTY_NODE("n1")]);
    setError("");
    setOpen(true);
  }

  function openEdit(flow: Flow) {
    setEditId(flow.id);
    setName(flow.name);
    setKeywords(flow.keywords);
    const parsed: FlowNode[] = JSON.parse(flow.nodes || "[]");
    setNodes(parsed.length ? parsed : [EMPTY_NODE("n1")]);
    setError("");
    setOpen(true);
  }

  async function save() {
    setError("");
    if (!name.trim()) {
      setError("Flow name is required");
      return;
    }
    const cleanNodes = nodes
      .filter((n) => n.message.trim())
      .map((n) => ({ ...n, buttons: n.buttons.filter((b) => b.text.trim()) }));
    if (cleanNodes.length === 0) {
      setError("Add at least one step with a message");
      return;
    }
    const payload = { name, keywords, nodes: cleanNodes };
    const res = editId
      ? await fetch(`/api/flows/${editId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      : await fetch("/api/flows", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) {
      setError((await res.json()).error ?? "Failed");
      return;
    }
    setOpen(false);
    load();
  }

  async function toggle(flow: Flow) {
    await fetch(`/api/flows/${flow.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !flow.enabled }),
    });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/flows/${id}`, { method: "DELETE" });
    load();
  }

  function updateNode(idx: number, patch: Partial<FlowNode>) {
    setNodes(nodes.map((n, i) => (i === idx ? { ...n, ...patch } : n)));
  }

  function addNode() {
    setNodes([...nodes, EMPTY_NODE(`n${nodes.length + 1}`)]);
  }

  function updateButton(nodeIdx: number, btnIdx: number, patch: Partial<FlowButton>) {
    setNodes(
      nodes.map((n, i) =>
        i === nodeIdx ? { ...n, buttons: n.buttons.map((b, j) => (j === btnIdx ? { ...b, ...patch } : b)) } : n
      )
    );
  }

  return (
    <div>
      <PageHeader
        title="Chatbot Flows"
        subtitle="Multi-step button-based conversations — triggered by keywords, navigated by button taps"
        action={
          <Button onClick={openCreate}>
            <Plus size={15} /> New Flow
          </Button>
        }
      />
      <div className="space-y-4 px-8 pb-8">
        {flows.map((f) => {
          const flowNodes: FlowNode[] = JSON.parse(f.nodes || "[]");
          return (
            <div key={f.id} className={`fade-up rounded-2xl border bg-white p-6 ${f.enabled ? "border-slate-200" : "border-slate-100 opacity-60"}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <GitBranch size={18} />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-[14.5px] font-bold text-slate-900">{f.name}</h2>
                      <Badge tone="green">{flowNodes.length} steps</Badge>
                      <span className="text-[11.5px] font-medium text-slate-400">{f.runs} runs</span>
                    </div>
                    {f.keywords && (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        <span className="text-[11.5px] text-slate-400">Triggers:</span>
                        {f.keywords.split(",").filter(Boolean).map((k) => (
                          <span key={k} className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11.5px] text-slate-600">{k.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(f)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => toggle(f)}
                    className={`relative h-5 w-9 rounded-full transition-colors ${f.enabled ? "bg-emerald-500" : "bg-slate-300"}`}
                  >
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${f.enabled ? "left-[18px]" : "left-0.5"}`} />
                  </button>
                  <button onClick={() => remove(f.id)} className="rounded-lg p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-500">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Flow visualization */}
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {flowNodes.map((n, i) => (
                  <div key={n.id} className="flex shrink-0 items-center gap-3">
                    <div className="w-56 rounded-xl border border-teal-100 bg-teal-50/50 p-3">
                      <p className="mb-1 font-mono text-[10px] font-bold uppercase text-teal-600">Step {n.id}</p>
                      <p className="line-clamp-2 text-[12px] text-slate-700">{n.message}</p>
                      {n.buttons.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {n.buttons.map((b, j) => (
                            <p key={j} className="flex items-center justify-between rounded-md bg-white px-2 py-1 text-[11px] font-medium text-slate-600">
                              {b.text}
                              {b.next && <span className="font-mono text-[10px] text-teal-500">→ {b.next}</span>}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                    {i < flowNodes.length - 1 && <ArrowRight size={16} className="shrink-0 text-slate-300" />}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {flows.length === 0 && <p className="py-16 text-center text-[13px] text-slate-400">No flows yet — build your first chatbot journey</p>}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? "Edit Flow" : "New Chatbot Flow"} wide>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Flow name">
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Main Menu" />
          </Field>
          <Field label="Trigger keywords" hint="Comma separated">
            <input className={inputCls} value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="menu, start, help" />
          </Field>
        </div>

        <p className="mb-2 text-[12.5px] font-bold text-slate-700">Steps</p>
        <div className="space-y-3">
          {nodes.map((n, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-teal-600">Step {n.id}</span>
                {nodes.length > 1 && (
                  <button onClick={() => setNodes(nodes.filter((_, j) => j !== i))} className="text-slate-300 hover:text-rose-500">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
              <textarea
                rows={2}
                className={`${inputCls} resize-none`}
                value={n.message}
                onChange={(e) => updateNode(i, { message: e.target.value })}
                placeholder="Bot message for this step…"
              />
              <div className="mt-2 space-y-1.5">
                {n.buttons.map((b, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <input
                      className={`${inputCls} flex-1`}
                      value={b.text}
                      onChange={(e) => updateButton(i, j, { text: e.target.value })}
                      placeholder="Button text"
                    />
                    <select
                      className={`${inputCls} w-36`}
                      value={b.next ?? ""}
                      onChange={(e) => updateButton(i, j, { next: e.target.value || null })}
                    >
                      <option value="">End flow</option>
                      {nodes.filter((x) => x.id !== n.id).map((x) => (
                        <option key={x.id} value={x.id}>→ Step {x.id}</option>
                      ))}
                    </select>
                    <button onClick={() => updateNode(i, { buttons: n.buttons.filter((_, k) => k !== j) })} className="text-slate-300 hover:text-rose-500">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                {n.buttons.length < 3 && (
                  <button
                    onClick={() => updateNode(i, { buttons: [...n.buttons, { text: "", next: null }] })}
                    className="text-[12px] font-semibold text-teal-600 hover:text-teal-700"
                  >
                    + Add button
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <button onClick={addNode} className="mt-3 text-[13px] font-semibold text-emerald-600 hover:text-emerald-700">
          + Add step
        </button>
        {error && <p className="mt-3 text-[12.5px] font-medium text-rose-600">{error}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={save}>{editId ? "Save Changes" : "Create Flow"}</Button>
        </div>
      </Modal>
    </div>
  );
}
