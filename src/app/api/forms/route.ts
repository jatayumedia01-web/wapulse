import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const forms = await prisma.form.findMany({
    include: { _count: { select: { responses: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(forms);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const form = await prisma.form.create({
    data: {
      name: body.name,
      description: body.description ?? "",
      fields: JSON.stringify(body.fields ?? []),
      enabled: body.enabled ?? true,
    },
    include: { _count: { select: { responses: true } } },
  });
  return NextResponse.json(form, { status: 201 });
}
