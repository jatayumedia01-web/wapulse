import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { verifySessionToken } from "@/lib/auth-server";
import { prisma } from "@/lib/db";

const PLAN_PRICES: Record<string, { amount: number; name: string }> = {
  STARTER:    { amount: 99900,  name: "WAPulse Starter"  },
  GROWTH:     { amount: 299900, name: "WAPulse Growth"   },
  BUSINESS:   { amount: 799900, name: "WAPulse Business" },
  ENTERPRISE: { amount: 0,      name: "WAPulse Enterprise" },
};

export async function POST(req: NextRequest) {
  const token = req.cookies.get("wp_session")?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = await req.json();
  const planData = PLAN_PRICES[plan];
  if (!planData) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  const rzpKey = process.env.RAZORPAY_KEY_ID;
  const rzpSecret = process.env.RAZORPAY_KEY_SECRET;

  if (!rzpKey || !rzpSecret) {
    return NextResponse.json({ error: "Razorpay not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env" }, { status: 503 });
  }

  const razorpay = new Razorpay({ key_id: rzpKey, key_secret: rzpSecret });
  const order = await razorpay.orders.create({
    amount: planData.amount,
    currency: "INR",
    receipt: `wp_${session.orgId}_${Date.now()}`,
    notes: { orgId: session.orgId, plan },
  });

  return NextResponse.json({ orderId: order.id, amount: planData.amount, currency: "INR", plan, planName: planData.name, keyId: rzpKey });
}
