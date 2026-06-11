import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const campaigns = await prisma.campaign.findMany({
    include: { template: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(campaigns);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name?.trim() || !body.templateId) {
    return NextResponse.json({ error: "Name and template are required" }, { status: 400 });
  }
  const campaign = await prisma.campaign.create({
    data: {
      name: body.name,
      templateId: body.templateId,
      audienceTag: body.audienceTag || "",
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      status: body.scheduledAt ? "SCHEDULED" : "DRAFT",
    },
    include: { template: true },
  });
  return NextResponse.json(campaign, { status: 201 });
}
