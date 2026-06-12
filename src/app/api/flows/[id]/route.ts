import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const flow = await prisma.flow.update({
    where: { id },
    data: {
      name: body.name ?? undefined,
      keywords: body.keywords ?? undefined,
      nodes: body.nodes ? JSON.stringify(body.nodes) : undefined,
      enabled: typeof body.enabled === "boolean" ? body.enabled : undefined,
    },
  });
  return NextResponse.json(flow);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.flow.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
