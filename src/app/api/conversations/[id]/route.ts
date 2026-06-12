import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      contact: true,
      messages: { orderBy: { createdAt: "asc" }, take: 200 },
    },
  });
  if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.conversation.update({ where: { id }, data: { unread: 0 } });
  return NextResponse.json(conversation);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (typeof body.status === "string") data.status = body.status;
  if (typeof body.assignee === "string" || body.assignee === null) data.assignee = body.assignee;
  if (typeof body.aiEnabled === "boolean") data.aiEnabled = body.aiEnabled;
  if (typeof body.labels === "string") data.labels = body.labels;
  const conversation = await prisma.conversation.update({ where: { id }, data });
  return NextResponse.json(conversation);
}
