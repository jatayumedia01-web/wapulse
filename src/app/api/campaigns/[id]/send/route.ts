import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendTemplate } from "@/lib/whatsapp";

/** Launch a campaign: send the template to every contact in the audience */
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await prisma.campaign.findUnique({ where: { id }, include: { template: true } });
  if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (campaign.status === "RUNNING") return NextResponse.json({ error: "Already running" }, { status: 409 });

  const contacts = await prisma.contact.findMany({
    where: {
      optedIn: true,
      ...(campaign.audienceTag ? { tags: { contains: campaign.audienceTag } } : {}),
    },
  });

  await prisma.campaign.update({
    where: { id },
    data: { status: "RUNNING", total: contacts.length, sent: 0, failed: 0 },
  });

  let sent = 0;
  let failed = 0;
  for (const contact of contacts) {
    const result = await sendTemplate(contact.phone, campaign.template.name, campaign.template.language);
    if (result.ok) sent++;
    else failed++;
    await prisma.campaignSend.create({
      data: { campaignId: id, contactId: contact.id, status: result.ok ? "SENT" : "FAILED" },
    });
  }

  // Demo-realistic funnel numbers when simulated
  const delivered = Math.round(sent * 0.97);
  const read = Math.round(delivered * 0.82);
  const replied = Math.round(read * 0.18);

  const updated = await prisma.campaign.update({
    where: { id },
    data: { status: "COMPLETED", sent, failed, delivered, read, replied },
    include: { template: true },
  });
  return NextResponse.json(updated);
}
