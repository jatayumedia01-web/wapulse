import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const rule = await prisma.automationRule.update({
    where: { id },
    data: {
      name: body.name ?? undefined,
      keywords: body.keywords ?? undefined,
      reply: body.reply ?? undefined,
      enabled: typeof body.enabled === "boolean" ? body.enabled : undefined,
      priority: body.priority ?? undefined,
    },
  });
  return NextResponse.json(rule);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.automationRule.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
