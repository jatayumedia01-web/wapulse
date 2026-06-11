import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendText } from "@/lib/whatsapp";

/** Agent sends an outbound message in a conversation */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { body } = await req.json();
  if (!body?.trim()) return NextResponse.json({ error: "Message body required" }, { status: 400 });

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: { contact: true },
  });
  if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const result = await sendText(conversation.contact.phone, body);
  const message = await prisma.message.create({
    data: {
      conversationId: id,
      direction: "OUT",
      body,
      status: result.ok ? "SENT" : "FAILED",
      waMessageId: result.waMessageId || null,
      meta: JSON.stringify({ simulated: result.simulated, error: result.error }),
    },
  });
  await prisma.conversation.update({ where: { id }, data: { lastMessageAt: new Date() } });

  // In demo mode, simulate delivery/read receipts shortly after send
  if (result.simulated) {
    setTimeout(async () => {
      await prisma.message.update({ where: { id: message.id }, data: { status: "DELIVERED" } }).catch(() => {});
    }, 1200);
    setTimeout(async () => {
      await prisma.message.update({ where: { id: message.id }, data: { status: "READ" } }).catch(() => {});
    }, 3500);
  }

  return NextResponse.json(message);
}
