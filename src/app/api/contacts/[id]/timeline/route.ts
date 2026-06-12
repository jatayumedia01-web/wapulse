import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/** Full activity timeline for a contact */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [conversations, orders, events, dripEnrolments] = await Promise.all([
    prisma.conversation.findMany({
      where: { contactId: id },
      include: { messages: { where: { kind: "MESSAGE" }, orderBy: { createdAt: "desc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({ where: { contactId: id }, orderBy: { createdAt: "desc" } }),
    prisma.contactEvent.findMany({ where: { contactId: id }, orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.dripEnrolment.findMany({
      where: { contactId: id },
      include: { sequence: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  type TimelineItem = {
    id: string;
    type: string;
    title: string;
    detail: string;
    status?: string;
    createdAt: Date;
  };

  const items: TimelineItem[] = [
    ...conversations.map((c) => ({
      id: c.id,
      type: "conversation",
      title: "Conversation",
      detail: c.messages[0]?.body ?? "No messages",
      status: c.status,
      createdAt: c.createdAt,
    })),
    ...orders.map((o) => ({
      id: o.id,
      type: "order",
      title: `Order — ₹${o.total.toLocaleString()}`,
      detail: o.status,
      status: o.status,
      createdAt: o.createdAt,
    })),
    ...events.map((e) => ({
      id: e.id,
      type: "event",
      title: e.event,
      detail: e.data,
      createdAt: e.createdAt,
    })),
    ...dripEnrolments.map((d) => ({
      id: d.id,
      type: "drip",
      title: `Drip: ${d.sequence.name}`,
      detail: `Step ${d.currentStep} · ${d.status}`,
      status: d.status,
      createdAt: d.createdAt,
    })),
  ];

  items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return NextResponse.json(items);
}
