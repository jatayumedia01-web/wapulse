import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { launchCampaign } from "@/lib/campaign";
import { requireOrg } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const { orgId } = auth.session;

  // Auto-launch scheduled campaigns that are due
  const due = await prisma.campaign.findMany({
    where: { orgId, status: "SCHEDULED", scheduledAt: { lte: new Date() } },
  });
  for (const c of due) launchCampaign(c.id).catch(() => {});

  const campaigns = await prisma.campaign.findMany({
    where: { orgId },
    include: { template: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(campaigns);
}

export async function POST(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const { orgId } = auth.session;

  const body = await req.json();
  if (!body.name?.trim() || !body.templateId) {
    return NextResponse.json({ error: "Name and template are required" }, { status: 400 });
  }
  const campaign = await prisma.campaign.create({
    data: {
      orgId,
      name: body.name,
      templateId: body.templateId,
      audienceTag: body.audienceTag || "",
      retargetOfId: body.retargetOfId || null,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      retryEnabled: !!body.retryEnabled,
      retryAfterHrs: body.retryAfterHrs ?? 24,
      status: body.scheduledAt ? "SCHEDULED" : "DRAFT",
    },
    include: { template: true },
  });
  return NextResponse.json(campaign, { status: 201 });
}
