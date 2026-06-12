import { NextRequest, NextResponse } from "next/server";
import { enrolContact } from "@/lib/drip";
import { prisma } from "@/lib/db";

/** Enrol one or many contacts into a drip sequence */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { contactIds, tag } = body as { contactIds?: string[]; tag?: string };

  let ids: string[] = contactIds ?? [];
  if (tag) {
    const contacts = await prisma.contact.findMany({ where: { tags: { contains: tag }, optedIn: true } });
    ids = [...new Set([...ids, ...contacts.map((c) => c.id)])];
  }
  if (!ids.length) return NextResponse.json({ error: "No contacts specified" }, { status: 400 });

  const results = await Promise.allSettled(ids.map((cid) => enrolContact(id, cid)));
  const enrolled = results.filter((r) => r.status === "fulfilled").length;
  return NextResponse.json({ enrolled, total: ids.length });
}
