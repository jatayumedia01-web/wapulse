import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET ?? "";

const PLAN_MAP: Record<string, string> = {
  [process.env.RAZORPAY_PLAN_STARTER ?? "plan_starter"]: "STARTER",
  [process.env.RAZORPAY_PLAN_GROWTH ?? "plan_growth"]: "GROWTH",
  [process.env.RAZORPAY_PLAN_BUSINESS ?? "plan_business"]: "BUSINESS",
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("x-razorpay-signature");

  if (WEBHOOK_SECRET && sig) {
    const expected = crypto.createHmac("sha256", WEBHOOK_SECRET).update(body).digest("hex");
    if (expected !== sig) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);
  const type = event.event as string;
  const sub = event.payload?.subscription?.entity;
  if (!sub) return NextResponse.json({ ok: true });

  const orgId = sub.notes?.orgId as string | undefined;
  if (!orgId) return NextResponse.json({ ok: true });

  const plan = PLAN_MAP[sub.plan_id] ?? "FREE";

  if (type === "subscription.activated" || type === "subscription.charged") {
    await prisma.organization.update({ where: { id: orgId }, data: { plan } });
    const existing = await prisma.subscription.findFirst({ where: { orgId } });
    const update = { plan, status: "ACTIVE", razorpaySubId: sub.id, currentPeriodEnd: new Date(sub.current_end * 1000) };
    if (existing) await prisma.subscription.update({ where: { id: existing.id }, data: update });
    else await prisma.subscription.create({ data: { orgId, ...update } });
    const rawAmount: number = event.payload?.payment?.entity?.amount ?? 0;
    await prisma.billingEvent.create({ data: { orgId, type, amount: rawAmount / 100, razorpayId: sub.id, meta: JSON.stringify(sub) } });
  }

  if (type === "subscription.cancelled") {
    await prisma.organization.update({ where: { id: orgId }, data: { plan: "FREE" } });
    const existing = await prisma.subscription.findFirst({ where: { orgId } });
    if (existing) await prisma.subscription.update({ where: { id: existing.id }, data: { status: "CANCELLED", cancelAtEnd: false } });
  }

  if (type === "subscription.halted" || type === "payment.failed") {
    const existing = await prisma.subscription.findFirst({ where: { orgId } });
    if (existing) await prisma.subscription.update({ where: { id: existing.id }, data: { status: "PAST_DUE" } });
  }

  return NextResponse.json({ ok: true });
}
