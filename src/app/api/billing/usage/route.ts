import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPlanLimits } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const orgId = req.headers.get("x-org-id");
  const orgPlan = req.headers.get("x-org-plan") ?? "FREE";
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const month = new Date().toISOString().slice(0, 7);
  const [usage, contacts, agents, subscription] = await Promise.all([
    prisma.usageLog.findUnique({ where: { orgId_month: { orgId, month } } }),
    prisma.contact.count({ where: { orgId } }),
    prisma.teamMember.count({ where: { orgId } }),
    prisma.subscription.findFirst({ where: { orgId }, orderBy: { createdAt: "desc" } }),
  ]);

  const limits = getPlanLimits(orgPlan);

  return NextResponse.json({
    plan: orgPlan,
    subscription,
    limits,
    usage: {
      contacts,
      agents,
      messagesSent: usage?.messagesSent ?? 0,
      campaigns: usage?.campaigns ?? 0,
    },
  });
}
