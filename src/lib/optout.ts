/**
 * Opt-out / Opt-in management
 * STOP → opt out + confirmation
 * START | SUBSCRIBE | UNSTOP → opt back in
 */
import { prisma } from "./db";
import { sendText } from "./whatsapp";

const STOP_WORDS = ["stop", "unsubscribe", "optout", "opt-out", "cancel"];
const START_WORDS = ["start", "subscribe", "optin", "opt-in", "unstop", "yes"];

export function isOptOut(text: string): boolean {
  return STOP_WORDS.includes(text.trim().toLowerCase());
}

export function isOptIn(text: string): boolean {
  return START_WORDS.includes(text.trim().toLowerCase());
}

/** contactId is the DB id (primary key) — avoids unique-key issues */
export async function handleOptOut(phone: string, conversationId: string, contactId: string): Promise<void> {
  await prisma.contact.update({ where: { id: contactId }, data: { optedIn: false } });
  const msg = "You have been unsubscribed. You will no longer receive promotional messages. Reply START to re-subscribe anytime.";
  const result = await sendText(phone, msg);
  await prisma.message.create({
    data: { conversationId, direction: "OUT", body: msg, status: result.ok ? "SENT" : "FAILED", waMessageId: result.waMessageId || null, author: "System" },
  });
}

export async function handleOptIn(phone: string, conversationId: string, contactId: string): Promise<void> {
  await prisma.contact.update({ where: { id: contactId }, data: { optedIn: true } });
  const msg = "You're now re-subscribed! 🎉 You'll receive updates from us again. Reply STOP anytime to unsubscribe.";
  const result = await sendText(phone, msg);
  await prisma.message.create({
    data: { conversationId, direction: "OUT", body: msg, status: result.ok ? "SENT" : "FAILED", waMessageId: result.waMessageId || null, author: "System" },
  });
}
