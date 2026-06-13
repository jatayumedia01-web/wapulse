import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/db";
import { sendText } from "@/lib/whatsapp";
import { dispatchEvent } from "@/lib/webhooks";
import { requireOrg } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const { orgId } = auth.session;
  const orders = await prisma.order.findMany({ where: { orgId }, include: { contact: true }, orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const { orgId } = auth.session;

  const body = await req.json();
  const { contactId, items } = body as { contactId: string; items: Array<{ productId: string; qty: number }> };
  if (!contactId || !items?.length) return NextResponse.json({ error: "contactId and items are required" }, { status: 400 });

  const contact = await prisma.contact.findFirst({ where: { id: contactId, orgId } });
  if (!contact) return NextResponse.json({ error: "Contact not found" }, { status: 404 });

  const products = await prisma.product.findMany({ where: { orgId, id: { in: items.map((i) => i.productId) } } });
  const lineItems = items
    .map((i) => { const p = products.find((x) => x.id === i.productId); return p ? { productId: p.id, name: p.name, qty: i.qty, price: p.price } : null; })
    .filter(Boolean) as Array<{ productId: string; name: string; qty: number; price: number }>;
  if (lineItems.length === 0) return NextResponse.json({ error: "No valid products" }, { status: 400 });

  const total = lineItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const paymentLink = `https://pay.wapulse.app/${randomBytes(6).toString("hex")}`;

  const order = await prisma.order.create({ data: { orgId, contactId, items: JSON.stringify(lineItems), total, paymentLink }, include: { contact: true } });

  const summary = lineItems.map((i) => `• ${i.name} × ${i.qty} — ₹${(i.price * i.qty).toLocaleString()}`).join("\n");
  const message = `🛒 *Order Summary*\n\n${summary}\n\n*Total: ₹${total.toLocaleString()}*\n\nPay securely here:\n${paymentLink}`;
  await sendText(contact.phone, message);

  let conversation = await prisma.conversation.findFirst({ where: { orgId, contactId, status: { not: "RESOLVED" } } });
  if (!conversation) conversation = await prisma.conversation.create({ data: { orgId, contactId } });
  await prisma.message.create({ data: { conversationId: conversation.id, direction: "OUT", body: message, status: "SENT", author: "Commerce" } });
  await prisma.conversation.update({ where: { id: conversation.id }, data: { lastMessageAt: new Date() } });

  dispatchEvent("order.created", { orderId: order.id, contact: contact.phone, total }).catch(() => {});
  return NextResponse.json(order, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  if (!body.id || !body.status) return NextResponse.json({ error: "id and status required" }, { status: 400 });
  const order = await prisma.order.update({ where: { id: body.id }, data: { status: body.status }, include: { contact: true } });
  if (body.status === "PAID") {
    dispatchEvent("order.paid", { orderId: order.id, contact: order.contact.phone, total: order.total }).catch(() => {});
    await sendText(order.contact.phone, `✅ Payment received for your order (₹${order.total.toLocaleString()}). We'll notify you once it ships!`);
  }
  return NextResponse.json(order);
}
