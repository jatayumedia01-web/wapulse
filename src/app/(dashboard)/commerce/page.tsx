"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, Package, ShoppingCart, IndianRupee, Send } from "lucide-react";
import { PageHeader, Button, Badge, Modal, Field, inputCls } from "@/components/ui";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  sku: string;
  inStock: boolean;
};
type Contact = { id: string; name: string | null; phone: string };
type Order = {
  id: string;
  items: string;
  total: number;
  status: string;
  paymentLink: string;
  createdAt: string;
  contact: Contact;
};

const ORDER_TONE: Record<string, string> = { PENDING: "amber", PAID: "green", SHIPPED: "blue", CANCELLED: "red" };

export default function CommercePage() {
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [productModal, setProductModal] = useState(false);
  const [orderModal, setOrderModal] = useState(false);
  const [error, setError] = useState("");
  const [pForm, setPForm] = useState({ name: "", description: "", price: "", sku: "", imageUrl: "" });
  const [oForm, setOForm] = useState({ contactId: "", productId: "", qty: 1 });
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    const [p, o, c] = await Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/orders").then((r) => r.json()),
      fetch("/api/contacts").then((r) => r.json()),
    ]);
    setProducts(p);
    setOrders(o);
    setContacts(c);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createProduct() {
    setError("");
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...pForm, price: parseFloat(pForm.price) || 0 }),
    });
    if (!res.ok) {
      setError((await res.json()).error ?? "Failed");
      return;
    }
    setProductModal(false);
    setPForm({ name: "", description: "", price: "", sku: "", imageUrl: "" });
    load();
  }

  async function createOrder() {
    setError("");
    if (!oForm.contactId || !oForm.productId) {
      setError("Select a customer and a product");
      return;
    }
    setCreating(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactId: oForm.contactId, items: [{ productId: oForm.productId, qty: oForm.qty }] }),
    });
    setCreating(false);
    if (!res.ok) {
      setError((await res.json()).error ?? "Failed");
      return;
    }
    setOrderModal(false);
    setOForm({ contactId: "", productId: "", qty: 1 });
    setTab("orders");
    load();
  }

  async function setOrderStatus(id: string, status: string) {
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  }

  async function removeProduct(id: string) {
    await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <PageHeader
        title="Commerce"
        subtitle="Product catalog, WhatsApp orders and payment links"
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => { setError(""); setOrderModal(true); }}>
              <ShoppingCart size={15} /> New Order
            </Button>
            <Button onClick={() => { setError(""); setProductModal(true); }}>
              <Plus size={15} /> Add Product
            </Button>
          </div>
        }
      />
      <div className="p-8">
        <div className="mb-5 flex gap-1.5">
          {(["products", "orders"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-[12.5px] font-semibold capitalize transition-colors ${
                tab === t ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {t} {t === "orders" && orders.length > 0 && `(${orders.length})`}
            </button>
          ))}
        </div>

        {tab === "products" ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map((p) => (
              <div key={p.id} className="fade-up rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Package size={20} />
                  </span>
                  <button onClick={() => removeProduct(p.id)} className="rounded-lg p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-500">
                    <Trash2 size={14} />
                  </button>
                </div>
                <h3 className="mt-3 text-[14.5px] font-bold text-slate-900">{p.name}</h3>
                {p.description && <p className="mt-0.5 line-clamp-2 text-[12.5px] text-slate-500">{p.description}</p>}
                <div className="mt-3 flex items-center justify-between">
                  <p className="flex items-center text-[16px] font-bold text-slate-900">
                    <IndianRupee size={15} />{p.price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2">
                    {p.sku && <span className="font-mono text-[11px] text-slate-400">{p.sku}</span>}
                    <Badge tone={p.inStock ? "green" : "red"}>{p.inStock ? "In stock" : "Out of stock"}</Badge>
                  </div>
                </div>
              </div>
            ))}
            {products.length === 0 && <p className="col-span-full py-16 text-center text-[13px] text-slate-400">No products yet</p>}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11.5px] font-bold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const items: Array<{ name: string; qty: number }> = JSON.parse(o.items);
                  return (
                    <tr key={o.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                      <td className="px-5 py-3.5">
                        <p className="text-[13.5px] font-semibold text-slate-900">{o.contact.name ?? "—"}</p>
                        <p className="text-[12px] text-slate-400">+{o.contact.phone}</p>
                      </td>
                      <td className="px-5 py-3.5 text-[12.5px] text-slate-600">
                        {items.map((i) => `${i.name} × ${i.qty}`).join(", ")}
                      </td>
                      <td className="px-5 py-3.5 text-[13.5px] font-bold text-slate-900">₹{o.total.toLocaleString()}</td>
                      <td className="px-5 py-3.5">
                        <Badge tone={ORDER_TONE[o.status] ?? "slate"}>{o.status}</Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {o.status === "PENDING" && (
                          <Button variant="secondary" onClick={() => setOrderStatus(o.id, "PAID")}>Mark Paid</Button>
                        )}
                        {o.status === "PAID" && (
                          <Button variant="secondary" onClick={() => setOrderStatus(o.id, "SHIPPED")}>Mark Shipped</Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-[13px] text-slate-400">No orders yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={productModal} onClose={() => setProductModal(false)} title="Add Product">
        <Field label="Product name">
          <input className={inputCls} value={pForm.name} onChange={(e) => setPForm({ ...pForm, name: e.target.value })} placeholder="Wireless Earbuds Pro" />
        </Field>
        <Field label="Description">
          <textarea rows={2} className={`${inputCls} resize-none`} value={pForm.description} onChange={(e) => setPForm({ ...pForm, description: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Price (₹)">
            <input type="number" className={inputCls} value={pForm.price} onChange={(e) => setPForm({ ...pForm, price: e.target.value })} placeholder="1999" />
          </Field>
          <Field label="SKU (optional)">
            <input className={inputCls} value={pForm.sku} onChange={(e) => setPForm({ ...pForm, sku: e.target.value })} placeholder="EB-PRO-01" />
          </Field>
        </div>
        {error && <p className="mb-3 text-[12.5px] font-medium text-rose-600">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setProductModal(false)}>Cancel</Button>
          <Button onClick={createProduct}>Save Product</Button>
        </div>
      </Modal>

      <Modal open={orderModal} onClose={() => setOrderModal(false)} title="Create Order">
        <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-[12.5px] leading-relaxed text-emerald-800">
          The order summary + payment link will be sent to the customer on WhatsApp automatically.
        </p>
        <Field label="Customer">
          <select className={inputCls} value={oForm.contactId} onChange={(e) => setOForm({ ...oForm, contactId: e.target.value })}>
            <option value="">Select customer…</option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>{c.name ?? c.phone} (+{c.phone})</option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Field label="Product">
              <select className={inputCls} value={oForm.productId} onChange={(e) => setOForm({ ...oForm, productId: e.target.value })}>
                <option value="">Select product…</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} — ₹{p.price.toLocaleString()}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Qty">
            <input type="number" min={1} className={inputCls} value={oForm.qty} onChange={(e) => setOForm({ ...oForm, qty: Math.max(1, parseInt(e.target.value) || 1) })} />
          </Field>
        </div>
        {error && <p className="mb-3 text-[12.5px] font-medium text-rose-600">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOrderModal(false)}>Cancel</Button>
          <Button onClick={createOrder} disabled={creating}>
            <Send size={14} /> {creating ? "Sending…" : "Create & Send"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
