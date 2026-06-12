/**
 * Contact Event Bus — record events for any contact and fire drip triggers + outgoing webhooks
 */
import { prisma } from "./db";
import { fireEventTriggers } from "./drip";
import { dispatchEvent } from "./webhooks";

export async function recordEvent(
  contactId: string,
  event: string,
  data: Record<string, unknown> = {}
): Promise<void> {
  await prisma.contactEvent.create({ data: { contactId, event, data: JSON.stringify(data) } });
  // Fire drip triggers async
  fireEventTriggers(event, contactId).catch(() => {});
  // Fire outgoing webhooks
  const contact = await prisma.contact.findUnique({ where: { id: contactId } });
  dispatchEvent(event as Parameters<typeof dispatchEvent>[0], { contactId, phone: contact?.phone, ...data }).catch(() => {});
}
