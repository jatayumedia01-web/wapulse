import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const orgId = req.headers.get("x-org-id");
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const plan = body.plan ?? "FREE";

  await prisma.organization.update({ where: { id: orgId }, data: { plan } });
  await prisma.setting.upsert({ where: { orgId }, create: { orgId, onboarded: true }, update: { onboarded: true } });

  await prisma.subscription.upsert({
    where: { id: `${orgId}_${plan}` },
    create: { id: `${orgId}_${plan}`, orgId, plan, status: "ACTIVE" },
    update: { plan, status: "ACTIVE" },
  }).catch(async () => {
    // Fallback: create without specific id
    const existing = await prisma.subscription.findFirst({ where: { orgId } });
    if (existing) {
      await prisma.subscription.update({ where: { id: existing.id }, data: { plan, status: "ACTIVE" } });
    } else {
      await prisma.subscription.create({ data: { orgId, plan, status: "ACTIVE" } });
    }
  });

  return NextResponse.json({ ok: true, plan });
}
