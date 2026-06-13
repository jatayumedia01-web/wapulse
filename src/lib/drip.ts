/**
 * Drip Sequence Engine
 * - Enrol a contact into a sequence (manual or event-triggered)
 * - processDueSteps(): send the next message to each due enrolment (call from a cron or on-demand)
 */
import { prisma } from "./db";
import { sendText, sendTemplate } from "./whatsapp";

export async function enrolContact(sequenceId: string, contactId: string): Promise<void> {
  const sequence = await prisma.dripSequence.findUnique({
    where: { id: sequenceId },
    include: { steps: { orderBy: { stepNumber: "asc" } } },
  });
  if (!sequence?.enabled || sequence.steps.length === 0) return;

  const firstStep = sequence.steps[0];
  const nextSendAt = calcNextSend(firstStep.delayValue, firstStep.delayUnit);

  await prisma.dripEnrolment.upsert({
    where: { sequenceId_contactId: { sequenceId, contactId } },
    create: { sequenceId, contactId, currentStep: 0, nextSendAt, status: "ACTIVE" },
    update: { currentStep: 0, nextSendAt, status: "ACTIVE" },
  });
  await prisma.dripSequence.update({ where: { id: sequenceId }, data: { enrollCount: { increment: 1 } } });
}

function calcNextSend(value: number, unit: string): Date {
  const ms = unit === "days" ? value * 86400000 : unit === "hours" ? value * 3600000 : value * 60000;
  return new Date(Date.now() + ms);
}

export async function processDueSteps(): Promise<number> {
  const due = await prisma.dripEnrolment.findMany({
    where: { status: "ACTIVE", nextSendAt: { lte: new Date() } },
    include: {
      contact: true,
      sequence: { include: { steps: { orderBy: { stepNumber: "asc" } } } },
    },
  });

  let sent = 0;
  for (const enrolment of due) {
    const steps = enrolment.sequence.steps;
    const stepIdx = enrolment.currentStep;
    if (stepIdx >= steps.length) {
      await prisma.dripEnrolment.update({ where: { id: enrolment.id }, data: { status: "COMPLETED" } });
      continue;
    }
    const step = steps[stepIdx] as typeof steps[0] & { template?: { name: string; language: string; body: string } | null };
    const contact = enrolment.contact;

    if (!contact.optedIn) {
      await prisma.dripEnrolment.update({ where: { id: enrolment.id }, data: { status: "CANCELLED" } });
      continue;
    }

    let result;
    let body: string;
    if (step.templateId && step.template) {
      result = await sendTemplate(contact.phone, step.template.name, step.template.language);
      body = step.template.body;
    } else {
      body = step.message;
      result = await sendText(contact.phone, body);
    }

    // Record in conversation
    let conversation = await prisma.conversation.findFirst({
      where: { orgId: contact.orgId, contactId: contact.id, status: { not: "RESOLVED" } },
    });
    if (!conversation) conversation = await prisma.conversation.create({ data: { orgId: contact.orgId, contactId: contact.id } });
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        direction: "OUT",
        body,
        status: result.ok ? "SENT" : "FAILED",
        waMessageId: result.waMessageId || null,
        author: `Drip: ${enrolment.sequence.name}`,
      },
    });
    await prisma.conversation.update({ where: { id: conversation.id }, data: { lastMessageAt: new Date() } });

    const nextStepIdx = stepIdx + 1;
    if (nextStepIdx >= steps.length) {
      await prisma.dripEnrolment.update({ where: { id: enrolment.id }, data: { currentStep: nextStepIdx, status: "COMPLETED" } });
    } else {
      const nextStep = steps[nextStepIdx];
      await prisma.dripEnrolment.update({
        where: { id: enrolment.id },
        data: { currentStep: nextStepIdx, nextSendAt: calcNextSend(nextStep.delayValue, nextStep.delayUnit) },
      });
    }
    sent++;
  }
  return sent;
}

/** Fire event-based drip triggers */
export async function fireEventTriggers(event: string, contactId: string): Promise<void> {
  const sequences = await prisma.dripSequence.findMany({
    where: { enabled: true, triggerType: "EVENT", triggerEvent: event },
  });
  for (const seq of sequences) {
    await enrolContact(seq.id, contactId).catch(() => {});
  }
}
