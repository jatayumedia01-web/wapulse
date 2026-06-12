import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const members = await prisma.teamMember.findMany({ orderBy: { createdAt: "asc" } });
  const withLoad = await Promise.all(
    members.map(async (m) => ({
      ...m,
      openConversations: await prisma.conversation.count({ where: { assignee: m.name, status: "OPEN" } }),
      resolvedTotal: await prisma.conversation.count({ where: { assignee: m.name, status: "RESOLVED" } }),
    }))
  );
  return NextResponse.json(withLoad);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name?.trim() || !body.email?.trim()) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }
  try {
    const member = await prisma.teamMember.create({
      data: { name: body.name, email: body.email, role: body.role || "AGENT" },
    });
    return NextResponse.json(member, { status: 201 });
  } catch {
    return NextResponse.json({ error: "A member with this email already exists" }, { status: 409 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.teamMember.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
