import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { recordEvent } from "@/lib/events";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const responses = await prisma.formResponse.findMany({
    where: { formId: id },
    include: { contact: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(responses);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { contactId, answers } = await req.json();
  if (!contactId || !answers) return NextResponse.json({ error: "contactId and answers required" }, { status: 400 });

  const response = await prisma.formResponse.create({
    data: { formId: id, contactId, answers: JSON.stringify(answers) },
    include: { contact: true, form: true },
  });
  // Upsert answers into contact attributes
  const contact = await prisma.contact.findUnique({ where: { id: contactId }, select: { attributes: true } });
  if (contact) {
    const merged = { ...JSON.parse(contact.attributes || "{}"), ...answers };
    await prisma.contact.update({ where: { id: contactId }, data: { attributes: JSON.stringify(merged) } });
  }
  await recordEvent(contactId, "form.submitted", { formId: id, formName: response.form.name });
  return NextResponse.json(response, { status: 201 });
}
