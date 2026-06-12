import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendInteractiveList } from "@/lib/whatsapp";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { body, buttonLabel = "Choose an option", sections } = await req.json();
  if (!body?.trim() || !sections?.length) {
    return NextResponse.json({ error: "body and sections required" }, { status: 400 });
  }

  const conversation = await prisma.conversation.findUnique({ where: { id }, include: { contact: true } });
  if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const result = await sendInteractiveList(conversation.contact.phone, body, buttonLabel, sections);

  const messageBody = `${body}\n${sections.flatMap((s: { title: string; rows: Array<{ title: string }> }) => s.rows).map((r: { title: string }) => `  · ${r.title}`).join("\n")}`;
  await prisma.message.create({
    data: {
      conversationId: id,
      direction: "OUT",
      type: "list",
      body: messageBody,
      status: result.ok ? "SENT" : "FAILED",
      waMessageId: result.waMessageId || null,
      author: "Agent",
    },
  });
  await prisma.conversation.update({ where: { id }, data: { lastMessageAt: new Date() } });
  return NextResponse.json({ ok: result.ok, simulated: result.simulated });
}
