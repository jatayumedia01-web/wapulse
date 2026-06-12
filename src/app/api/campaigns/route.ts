import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { launchCampaign } from "@/lib/campaign";

export async function GET() {
  // Auto-launch any scheduled campaigns that are due
  const due = await prisma.campaign.findMany({
    where: { status: "SCHEDULED", scheduledAt: { lte: new Date() } },
  });
  for (const c of due) launchCampaign(c.id).catch(() => {});

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
      retargetOfId: body.retargetOfId || null,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      status: body.scheduledAt ? "SCHEDULED" : "DRAFT",
    },
    include: { template: true },
  });
  return NextResponse.json(campaign, { status: 201 });
}
