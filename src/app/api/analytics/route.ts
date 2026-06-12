import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { subDays, startOfDay, format } from "date-fns";

export async function GET() {
  const since = subDays(new Date(), 6);

  const [totalContacts, openConversations, totalMessages, messages, campaigns, sentMessages, deliveredOrRead, readCount, aiMessages, negativeCount] =
    await Promise.all([
      prisma.contact.count(),
      prisma.conversation.count({ where: { status: "OPEN" } }),
      prisma.message.count(),
      prisma.message.findMany({
        where: { createdAt: { gte: startOfDay(since) } },
        select: { createdAt: true, direction: true },
      }),
      prisma.campaign.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { template: true } }),
      prisma.message.count({ where: { direction: "OUT" } }),
      prisma.message.count({ where: { direction: "OUT", status: { in: ["DELIVERED", "READ"] } } }),
      prisma.message.count({ where: { direction: "OUT", status: "READ" } }),
      prisma.message.count({ where: { isAi: true } }),
      prisma.message.count({ where: { sentiment: "negative" } }),
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

  // Agent performance: open/resolved load + avg first response time
  const agents = await prisma.teamMember.findMany();
  const agentStats = await Promise.all(
    agents.map(async (a) => {
      const [open, resolved] = await Promise.all([
        prisma.conversation.count({ where: { assignee: a.name, status: "OPEN" } }),
        prisma.conversation.count({ where: { assignee: a.name, status: "RESOLVED" } }),
      ]);
      const convs = await prisma.conversation.findMany({
        where: { assignee: a.name },
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
