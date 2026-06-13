import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const orgId = req.headers.get("x-org-id");
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.setting.upsert({ where: { orgId }, create: { orgId, onboarded: true }, update: { onboarded: true } });
  return NextResponse.json({ ok: true });
}
