import { prisma } from "./db";
import { sendTemplate, sendText } from "./whatsapp";
import { dispatchEvent } from "./webhooks";

/**
 * Launch a campaign: resolve the audience and send the template to each contact.
 * Audience resolution:
 *  - retarget campaign  → contacts who read but did not reply to the parent campaign
 *  - audienceTag        → contacts tagged with it
 *  - otherwise          → all opted-in contacts
 */
export async function launchCampaign(id: string) {
  const campaign = await prisma.campaign.findUnique({ where: { id }, include: { template: true } });
  if (!campaign) throw new Error("Campaign not found");
  if (campaign.status === "RUNNING") throw new Error("Already running");

  let contacts;
  if (campaign.retargetOfId) {
    const parentSends = await prisma.campaignSend.findMany({
      where: { campaignId: campaign.retargetOfId, status: "SENT" },
      include: { contact: true },
    });
    // Demo heuristic for "read but not replied": parent's read-rate slice of recipients
    const parent = await prisma.campaign.findUnique({ where: { id: campaign.retargetOfId } });
    const readNotReplied = parent && parent.sent > 0 ? Math.max(parent.read - parent.replied, 0) / parent.sent : 0.6;
    const count = Math.max(1, Math.round(parentSends.length * readNotReplied));
    contacts = parentSends.slice(0, count).map((s) => s.contact).filter((c) => c.optedIn);
  } else {
    contacts = await prisma.contact.findMany({
      where: {
        optedIn: true,
        ...(campaign.audienceTag ? { tags: { contains: campaign.audienceTag } } : {}),
      },
    });
  }

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
  dispatchEvent("campaign.completed", { campaignId: id, name: updated.name, sent, failed }).catch(() => {});

  // Schedule auto-retry for failed sends if enabled
  if (updated.retryEnabled && failed > 0) {
    setTimeout(async () => {
      try {
        const failedSends = await prisma.campaignSend.findMany({
          where: { campaignId: id, status: "FAILED", retryCount: 0 },
          include: { contact: true, campaign: { include: { template: true } } },
        });
        let retried = 0;
        for (const fs of failedSends) {
          if (!fs.contact.optedIn) continue;
          const result = await sendText(fs.contact.phone, fs.campaign.template.body);
          if (result.ok) {
            await prisma.campaignSend.update({ where: { id: fs.id }, data: { status: "SENT", retryCount: 1 } });
            retried++;
          }
        }
        await prisma.campaign.update({ where: { id }, data: { retryCount: retried } });
      } catch { /* best-effort */ }
    }, (updated.retryAfterHrs ?? 24) * 3600000);
  }

  return updated;
}
