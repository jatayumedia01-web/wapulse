import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireOrg } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const { orgId } = auth.session;
  const replies = await prisma.quickReply.findMany({ where: { orgId }, orderBy: { shortcut: "asc" } });
  return NextResponse.json(replies);
}

export async function POST(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const { orgId } = auth.session;

  const body = await req.json();
  if (!body.shortcut?.trim() || !body.body?.trim()) {
    return NextResponse.json({ error: "Shortcut and message are required" }, { status: 400 });
  }
  const shortcut = body.shortcut.toLowerCase().replace(/[^a-z0-9-_/]/g, "");
  try {
    const reply = await prisma.quickReply.create({ data: { orgId, shortcut, body: body.body } });
    return NextResponse.json(reply, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Shortcut already exists" }, { status: 409 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.quickReply.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
