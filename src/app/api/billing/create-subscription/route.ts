import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const RAZORPAY_KEY = process.env.RAZORPAY_KEY_ID ?? "";
const RAZORPAY_SECRET = process.env.RAZORPAY_KEY_SECRET ?? "";

const PLAN_IDS: Record<string, string> = {
  STARTER: process.env.RAZORPAY_PLAN_STARTER ?? "",
  GROWTH: process.env.RAZORPAY_PLAN_GROWTH ?? "",
  BUSINESS: process.env.RAZORPAY_PLAN_BUSINESS ?? "",
};

export async function POST(req: NextRequest) {
  const orgId = req.headers.get("x-org-id");
  const userId = req.headers.get("x-user-id");
  if (!orgId || !userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = await req.json();
  if (!PLAN_IDS[plan]) {
    // Demo mode: no Razorpay configured, just activate the plan directly
    await prisma.organization.update({ where: { id: orgId }, data: { plan } });
    await prisma.setting.upsert({ where: { orgId }, create: { orgId, onboarded: true }, update: { onboarded: true } });
    const existing = await prisma.subscription.findFirst({ where: { orgId } });
    if (existing) await prisma.subscription.update({ where: { id: existing.id }, data: { plan, status: "ACTIVE" } });
    else await prisma.subscription.create({ data: { orgId, plan, status: "ACTIVE" } });
    return NextResponse.json({ ok: true, demo: true });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Create Razorpay subscription
  const auth = Buffer.from(`${RAZORPAY_KEY}:${RAZORPAY_SECRET}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/subscriptions", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      plan_id: PLAN_IDS[plan],
      customer_notify: 1,
      quantity: 1,
      total_count: 12,
      notes: { orgId, plan },
    }),
  });
  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: data.error?.description ?? "Razorpay error" }, { status: 400 });

  return NextResponse.json({
    razorpaySubId: data.id,
    razorpayKeyId: RAZORPAY_KEY,
    plan,
    customerEmail: user.email,
    customerName: user.name,
  });
}
