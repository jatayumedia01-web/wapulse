import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/** Replace all steps for a sequence */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { steps } = await req.json();
  await prisma.dripStep.deleteMany({ where: { sequenceId: id } });
  if (steps?.length) {
    await prisma.dripStep.createMany({
      data: steps.map((s: { templateId?: string; message?: string; delayValue?: number; delayUnit?: string }, i: number) => ({
        sequenceId: id,
        stepNumber: i + 1,
        templateId: s.templateId || null,
        message: s.message || "",
        delayValue: s.delayValue ?? 1,
        delayUnit: s.delayUnit ?? "hours",
      })),
    });
  }
  const updated = await prisma.dripSequence.findUnique({
    where: { id },
    include: { steps: { orderBy: { stepNumber: "asc" }, include: { template: true } } },
  });
  return NextResponse.json(updated);
}
