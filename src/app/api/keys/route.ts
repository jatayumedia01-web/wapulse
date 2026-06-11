import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/db";

export async function GET() {
  const keys = await prisma.apiKey.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(
    keys.map((k) => ({ ...k, key: k.key.slice(0, 12) + "••••••••" + k.key.slice(-4) }))
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const key = `wap_${randomBytes(24).toString("hex")}`;
  const created = await prisma.apiKey.create({
    data: { name: body.name || "Default key", key },
  });
  // Full key returned exactly once at creation time
  return NextResponse.json({ ...created, key }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.apiKey.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
