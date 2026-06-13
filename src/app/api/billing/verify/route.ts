import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const orgId = req.headers.get("x-org-id");
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = await req.json();

  const secret = process.env.RAZORPAY_KEY_SECRET ?? "";
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSig = crypto.createHmac("sha256", secret).update(body).digest("hex");

  if (secret && expectedSig !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  const periodEnd = new Date(Date.now() + 30 * 24 * 3600000);

  await prisma.organization.update({ where: { id: orgId }, data: { plan } });
  const existing = await prisma.subscription.findFirst({ where: { orgId } });
  if (existing) {
    await prisma.subscription.update({ where: { id: existing.id }, data: { plan, status: "ACTIVE", razorpaySubId: razorpay_payment_id, currentPeriodEnd: periodEnd } });
  } else {
    await prisma.subscription.create({ data: { orgId, plan, status: "ACTIVE", razorpaySubId: razorpay_payment_id, currentPeriodEnd: periodEnd } });
  }
  await prisma.billingEvent.create({
    data: { orgId, type: "invoice.paid", razorpayId: razorpay_payment_id, amount: 0, meta: JSON.stringify({ plan, orderId: razorpay_order_id }) },
  });

  return NextResponse.json({ ok: true, plan });
}
