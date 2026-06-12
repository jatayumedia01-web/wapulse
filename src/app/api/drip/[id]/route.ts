import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const sequence = await prisma.dripSequence.update({
    where: { id },
    data: {
      name: body.name ?? undefined,
      triggerType: body.triggerType ?? undefined,
      triggerEvent: body.triggerEvent ?? undefined,
      triggerTag: body.triggerTag ?? undefined,
      enabled: typeof body.enabled === "boolean" ? body.enabled : undefined,
    },
    include: { steps: { orderBy: { stepNumber: "asc" }, include: { template: true } } },
  });
  return NextResponse.json(sequence);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.dripSequence.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
