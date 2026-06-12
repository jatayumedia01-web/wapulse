import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const flows = await prisma.flow.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(flows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const flow = await prisma.flow.create({
    data: {
      name: body.name,
      keywords: body.keywords || "",
      nodes: JSON.stringify(body.nodes ?? []),
      enabled: body.enabled ?? true,
    },
  });
  return NextResponse.json(flow, { status: 201 });
}
