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

  return NextResponse.json({
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
