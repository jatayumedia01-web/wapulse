import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { processDueSteps } from "@/lib/drip";
import { requireOrg } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const { orgId } = auth.session;
  const sequences = await prisma.dripSequence.findMany({
    where: { orgId },
    include: { steps: { orderBy: { stepNumber: "asc" }, include: { template: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(sequences);
}

export async function POST(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const { orgId } = auth.session;

  const body = await req.json();
  if (!body.name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const sequence = await prisma.dripSequence.create({
    data: {
      orgId, name: body.name,
      triggerType: body.triggerType ?? "MANUAL",
      triggerEvent: body.triggerEvent ?? "",
      triggerTag: body.triggerTag ?? "",
      enabled: body.enabled ?? true,
    },
    include: { steps: { orderBy: { stepNumber: "asc" } } },
  });
  return NextResponse.json(sequence, { status: 201 });
}

export async function PUT() {
  const sent = await processDueSteps();
  return NextResponse.json({ sent });
}
