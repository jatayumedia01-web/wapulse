import { NextRequest, NextResponse } from "next/server";
import { prisma, getUsageLog } from "@/lib/db";
import { getPlanLimits } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const orgId = req.headers.get("x-org-id");
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [org, subscription, usageLog, events] = await Promise.all([
    prisma.organization.findUnique({ where: { id: orgId } }),
    prisma.subscription.findFirst({ where: { orgId }, orderBy: { createdAt: "desc" } }),
    getUsageLog(orgId),
    prisma.billingEvent.findMany({ where: { orgId }, orderBy: { createdAt: "desc" }, take: 10 }),
  ]);

  const contactCount = await prisma.contact.count({ where: { orgId } });
  const plan = org?.plan ?? "FREE";
  const limits = getPlanLimits(plan);

  return NextResponse.json({
    plan,
    subscription,
    limits,
    usage: {
      contacts: contactCount,
      messages: usageLog.messagesSent,
      campaigns: usageLog.campaigns,
      apiCalls: usageLog.apiCalls,
    },
    events,
  });
}
