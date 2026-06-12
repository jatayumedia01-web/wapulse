import { NextRequest, NextResponse } from "next/server";
import { recordEvent } from "@/lib/events";
import { prisma } from "@/lib/db";

/** Record a custom contact event (for event-based drip triggers, webhooks, analytics) */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { contactId, phone, event, data } = body;

  let resolvedContactId = contactId;
  if (!resolvedContactId && phone) {
    const contact = await prisma.contact.findUnique({ where: { phone } });
    if (!contact) return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    resolvedContactId = contact.id;
  }
  if (!resolvedContactId) return NextResponse.json({ error: "contactId or phone required" }, { status: 400 });
  if (!event?.trim()) return NextResponse.json({ error: "event required" }, { status: 400 });

  await recordEvent(resolvedContactId, event, data ?? {});
  return NextResponse.json({ ok: true });
}
