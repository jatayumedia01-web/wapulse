import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendText } from "@/lib/whatsapp";
import { requireOrg } from "@/lib/api-auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const { orgId } = auth.session;

  const { id } = await params;
  const { body } = await req.json();
  if (!body?.trim()) return NextResponse.json({ error: "Message body required" }, { status: 400 });

  const contact = await prisma.contact.findFirst({ where: { id, orgId } });
  if (!contact) return NextResponse.json({ error: "Contact not found" }, { status: 404 });

  let conversation = await prisma.conversation.findFirst({
    where: { orgId, contactId: id, status: { not: "RESOLVED" } },
    orderBy: { lastMessageAt: "desc" },
  });
  if (!conversation) {
    conversation = await prisma.conversation.create({ data: { orgId, contactId: id } });
  }

  const result = await sendText(contact.phone, body);

  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id, direction: "OUT", body,
      status: result.ok ? "SENT" : "FAILED",
      waMessageId: result.waMessageId || null,
      author: "Agent",
      meta: JSON.stringify({ simulated: result.simulated, via: "contacts-page" }),
    },
  });
  await prisma.conversation.update({ where: { id: conversation.id }, data: { lastMessageAt: new Date() } });

  if (result.simulated) {
    setTimeout(async () => {
      await prisma.message.update({ where: { id: message.id }, data: { status: "DELIVERED" } }).catch(() => {});
    }, 1200);
    setTimeout(async () => {
      await prisma.message.update({ where: { id: message.id }, data: { status: "READ" } }).catch(() => {});
    }, 3500);
  }

  return NextResponse.json({ ok: true, conversationId: conversation.id, messageId: message.id, simulated: result.simulated });
}
