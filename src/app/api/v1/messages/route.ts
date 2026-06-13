import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendText, sendTemplate } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) return NextResponse.json({ error: "Missing x-api-key header" }, { status: 401 });

  const keyRecord = await prisma.apiKey.findUnique({ where: { key: apiKey } });
  if (!keyRecord) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  await prisma.apiKey.update({ where: { id: keyRecord.id }, data: { lastUsedAt: new Date() } });

  const { orgId } = keyRecord;
  const body = await req.json().catch(() => null);
  if (!body?.to) return NextResponse.json({ error: "'to' is required" }, { status: 400 });

  const phone = String(body.to).replace(/[^\d+]/g, "");
  const type = body.type ?? "text";

  let result;
  let messageBody: string;

  if (type === "template") {
    const template = await prisma.template.findFirst({ where: { orgId, name: body.template ?? "" } });
    if (!template) return NextResponse.json({ error: `Template '${body.template}' not found` }, { status: 404 });
    if (template.status !== "APPROVED") return NextResponse.json({ error: "Template is not approved" }, { status: 422 });
    result = await sendTemplate(phone, template.name, body.language ?? template.language);
    messageBody = template.body;
  } else {
    if (!body.text?.trim()) return NextResponse.json({ error: "'text' is required for text messages" }, { status: 400 });
    result = await sendText(phone, body.text);
    messageBody = body.text;
  }

  if (!result.ok) return NextResponse.json({ error: result.error ?? "Send failed" }, { status: 502 });

  const contact = await prisma.contact.upsert({
    where: { orgId_phone: { orgId, phone } },
    create: { orgId, phone },
    update: {},
  });
  let conversation = await prisma.conversation.findFirst({ where: { orgId, contactId: contact.id, status: { not: "RESOLVED" } } });
  if (!conversation) conversation = await prisma.conversation.create({ data: { orgId, contactId: contact.id } });

  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id, direction: "OUT", type, body: messageBody, status: "SENT",
      waMessageId: result.waMessageId,
      meta: JSON.stringify({ via: "api", keyId: keyRecord.id, simulated: result.simulated }),
    },
  });
  await prisma.conversation.update({ where: { id: conversation.id }, data: { lastMessageAt: new Date() } });

  return NextResponse.json({ id: message.id, waMessageId: result.waMessageId, status: "sent", simulated: result.simulated });
}
