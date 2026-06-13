import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/db";
import { requireOrg } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const { orgId } = auth.session;
  const keys = await prisma.apiKey.findMany({ where: { orgId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(keys.map((k) => ({ ...k, key: k.key.slice(0, 12) + "••••••••" + k.key.slice(-4) })));
}

export async function POST(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const { orgId } = auth.session;

  const body = await req.json();
  const key = `wap_${randomBytes(24).toString("hex")}`;
  const created = await prisma.apiKey.create({ data: { orgId, name: body.name || "Default key", key } });
  return NextResponse.json({ ...created, key }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.apiKey.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
