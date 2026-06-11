"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, Copy, Check, KeyRound } from "lucide-react";
import { PageHeader, Button, Modal, Field, inputCls } from "@/components/ui";

type ApiKey = { id: string; name: string; key: string; createdAt: string; lastUsedAt: string | null };

const CURL_EXAMPLE = `curl -X POST https://your-domain.com/api/v1/messages \\
  -H "x-api-key: wap_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "919876543210",
    "type": "text",
    "text": "Hello from WAPulse API!"
  }'`;

const TEMPLATE_EXAMPLE = `{
  "to": "919876543210",
  "type": "template",
  "template": "order_confirmation",
  "language": "en"
}`;

export default function DevelopersPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    setKeys(await (await fetch("/api/keys")).json());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createKey() {
    const res = await fetch("/api/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    setNewKey(data.key);
    setName("");
    load();
  }

  async function removeKey(id: string) {
    await fetch(`/api/keys?id=${id}`, { method: "DELETE" });
    load();
  }

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div>
      <PageHeader
        title="Developer API"
        subtitle="Send WhatsApp messages programmatically — like Gupshup, but yours"
        action={
          <Button onClick={() => { setNewKey(null); setOpen(true); }}>
            <Plus size={15} /> Generate API Key
          </Button>
        }
      />
      <div className="grid gap-6 p-8 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-[15px] font-bold text-slate-900">Your API Keys</h2>
          <div className="space-y-2.5">
            {keys.map((k) => (
              <div key={k.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3">
                <div className="flex items-center gap-3">
                  <KeyRound size={16} className="text-emerald-600" />
                  <div>
                    <p className="text-[13px] font-semibold text-slate-800">{k.name}</p>
                    <p className="font-mono text-[11.5px] text-slate-400">{k.key}</p>
                  </div>
                </div>
                <button onClick={() => removeKey(k.id)} className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-500">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            {keys.length === 0 && <p className="py-8 text-center text-[13px] text-slate-400">No API keys yet</p>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-slate-900">Send a text message</h2>
              <button onClick={() => copy(CURL_EXAMPLE, "curl")} className="flex items-center gap-1 text-[12px] font-semibold text-emerald-600">
                {copied === "curl" ? <Check size={13} /> : <Copy size={13} />} {copied === "curl" ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="overflow-x-auto rounded-xl bg-[#0c1b1e] p-4 font-mono text-[12px] leading-relaxed text-emerald-300">
              {CURL_EXAMPLE}
            </pre>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-3 text-[15px] font-bold text-slate-900">Send a template message</h2>
            <p className="mb-3 text-[12.5px] text-slate-500">
              POST the same endpoint with <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11.5px]">type: template</code>:
            </p>
            <pre className="overflow-x-auto rounded-xl bg-[#0c1b1e] p-4 font-mono text-[12px] leading-relaxed text-sky-300">
              {TEMPLATE_EXAMPLE}
            </pre>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
            <h3 className="text-[13.5px] font-bold text-slate-900">Webhook endpoint</h3>
            <p className="mt-1 text-[12.5px] leading-relaxed text-slate-600">
              Point your Meta App webhook to <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[11.5px]">/api/webhook</code>.
              Incoming messages, delivery receipts and read receipts are processed automatically, and automation rules + the AI agent respond in real time.
            </p>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={newKey ? "API Key Created" : "Generate API Key"}>
        {newKey ? (
          <div>
            <p className="mb-3 text-[13px] text-slate-600">
              Copy this key now — it will not be shown again.
            </p>
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <code className="flex-1 break-all font-mono text-[12px] text-slate-800">{newKey}</code>
              <button onClick={() => copy(newKey, "new")} className="shrink-0 text-emerald-600">
                {copied === "new" ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setOpen(false)}>Done</Button>
            </div>
          </div>
        ) : (
          <div>
            <Field label="Key name">
              <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Production server" />
            </Field>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={createKey}>Generate</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
