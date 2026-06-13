import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireOrg } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const { orgId } = auth.session;

  const members = await prisma.teamMember.findMany({ where: { orgId }, orderBy: { createdAt: "asc" } });
  const withLoad = await Promise.all(
    members.map(async (m) => ({
      ...m,
      openConversations: await prisma.conversation.count({ where: { orgId, assignee: m.name, status: "OPEN" } }),
      resolvedTotal: await prisma.conversation.count({ where: { orgId, assignee: m.name, status: "RESOLVED" } }),
    }))
  );
  return NextResponse.json(withLoad);
}

export async function POST(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const { orgId } = auth.session;

  const body = await req.json();
  if (!body.name?.trim() || !body.email?.trim()) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }
  try {
    const member = await prisma.teamMember.create({
      data: { orgId, name: body.name, email: body.email, role: body.role || "AGENT" },
    });
    return NextResponse.json(member, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Email already exists in team" }, { status: 409 });
  }
}
