import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { processDueSteps } from "@/lib/drip";

export async function GET() {
  const sequences = await prisma.dripSequence.findMany({
    include: { steps: { orderBy: { stepNumber: "asc" }, include: { template: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(sequences);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const sequence = await prisma.dripSequence.create({
    data: {
      name: body.name,
      triggerType: body.triggerType ?? "MANUAL",
      triggerEvent: body.triggerEvent ?? "",
      triggerTag: body.triggerTag ?? "",
      enabled: body.enabled ?? true,
    },
    include: { steps: { orderBy: { stepNumber: "asc" } } },
  });
  return NextResponse.json(sequence, { status: 201 });
}

/** Trigger drip step processing (call from cron or manually) */
export async function PUT() {
  const sent = await processDueSteps();
  return NextResponse.json({ sent });
}
