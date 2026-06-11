import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { recordInbound, processInbound } from "@/lib/automation";

/** Demo helper: simulate a customer replying in this conversation */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { body } = await req.json();
  if (!body?.trim()) return NextResponse.json({ error: "Body required" }, { status: 400 });

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: { contact: true },
  });
  if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { conversationId } = await recordInbound(conversation.contact.phone, conversation.contact.name, body);
  await processInbound(conversationId);
  return NextResponse.json({ ok: true, conversationId });
}
