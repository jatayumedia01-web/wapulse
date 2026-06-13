import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireOrg } from "@/lib/api-auth";
import { subDays, startOfDay, format } from "date-fns";

export async function GET(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const { orgId } = auth.session;

  const since = subDays(new Date(), 6);

  const [totalContacts, openConversations, totalMessages, messages, campaigns, sentMessages, deliveredOrRead, readCount, aiMessages, negativeCount] =
    await Promise.all([
      prisma.contact.count({ where: { orgId } }),
      prisma.conversation.count({ where: { orgId, status: "OPEN" } }),
      prisma.message.count({ where: { conversation: { orgId } } }),
      prisma.message.findMany({
        where: { conversation: { orgId }, createdAt: { gte: startOfDay(since) } },
        select: { createdAt: true, direction: true },
      }),
      prisma.campaign.findMany({ where: { orgId }, orderBy: { createdAt: "desc" }, take: 5, include: { template: true } }),
      prisma.message.count({ where: { conversation: { orgId }, direction: "OUT" } }),
      prisma.message.count({ where: { conversation: { orgId }, direction: "OUT", status: { in: ["DELIVERED", "READ"] } } }),
      prisma.message.count({ where: { conversation: { orgId }, direction: "OUT", status: "READ" } }),
      prisma.message.count({ where: { conversation: { orgId }, isAi: true } }),
      prisma.message.count({ where: { conversation: { orgId }, sentiment: "negative" } }),
    ]);

  const days: Record<string, { date: string; inbound: number; outbound: number }> = {};
  for (let i = 6; i >= 0; i--) {
    const key = format(subDays(new Date(), i), "MMM d");
    days[key] = { date: key, inbound: 0, outbound: 0 };
  }
  for (const m of messages) {
    const key = format(m.createdAt, "MMM d");
    if (days[key]) {
      if (m.direction === "IN") days[key].inbound++;
      else days[key].outbound++;
    }
  }

  const agents = await prisma.teamMember.findMany({ where: { orgId } });
  const agentStats = await Promise.all(
    agents.map(async (a) => {
      const [open, resolved] = await Promise.all([
        prisma.conversation.count({ where: { orgId, assignee: a.name, status: "OPEN" } }),
        prisma.conversation.count({ where: { orgId, assignee: a.name, status: "RESOLVED" } }),
      ]);
      const convs = await prisma.conversation.findMany({
        where: { orgId, assignee: a.name },
        include: { messages: { where: { kind: "MESSAGE" }, orderBy: { createdAt: "asc" }, take: 10 } },
        take: 50,
      });
      const responseTimes: number[] = [];
      for (const c of convs) {
        const firstIn = c.messages.find((m) => m.direction === "IN");
        const firstOut = firstIn ? c.messages.find((m) => m.direction === "OUT" && m.createdAt > firstIn.createdAt) : null;
        if (firstIn && firstOut) responseTimes.push(firstOut.createdAt.getTime() - firstIn.createdAt.getTime());
      }
      const avgMs = responseTimes.length ? responseTimes.reduce((s, t) => s + t, 0) / responseTimes.length : 0;
      return { name: a.name, role: a.role, open, resolved, avgResponseMins: Math.round(avgMs / 60000) };
    })
  );

  return NextResponse.json({
    agents: agentStats,
    totals: {
      contacts: totalContacts,
      openConversations,
      messages: totalMessages,
      deliveryRate: sentMessages ? Math.round((deliveredOrRead / sentMessages) * 100) : 0,
      readRate: sentMessages ? Math.round((readCount / sentMessages) * 100) : 0,
      aiHandled: aiMessages,
      negativeAlerts: negativeCount,
    },
    timeline: Object.values(days),
    recentCampaigns: campaigns,
  });
}
