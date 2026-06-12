import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/** Get / update custom field values for a contact */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contact = await prisma.contact.findUnique({ where: { id }, select: { attributes: true } });
  if (!contact) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(JSON.parse(contact.attributes || "{}"));
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const updates = await req.json();
  const contact = await prisma.contact.findUnique({ where: { id }, select: { attributes: true } });
  if (!contact) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const merged = { ...JSON.parse(contact.attributes || "{}"), ...updates };
  await prisma.contact.update({ where: { id }, data: { attributes: JSON.stringify(merged) } });
  return NextResponse.json(merged);
}
