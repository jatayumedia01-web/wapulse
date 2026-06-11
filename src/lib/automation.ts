/**
 * Automation engine — runs on every inbound message.
 * Priority: keyword rules → AI agent (if enabled for conversation).
 */
import { prisma } from "./db";
import { generateAiReply, detectSentiment, type ChatTurn } from "./ai";
import { sendText } from "./whatsapp";

export async function processInbound(conversationId: string): Promise<void> {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      contact: true,
      messages: { orderBy: { createdAt: "desc" }, take: 12 },
    },
  });
  if (!conversation) return;

  const lastInbound = conversation.messages.find((m) => m.direction === "IN");
  if (!lastInbound) return;

  const rules = await prisma.automationRule.findMany({
    where: { enabled: true },
    orderBy: { priority: "desc" },
  });

  const text = lastInbound.body.toLowerCase();
  let replyBody: string | null = null;
  let isAi = false;

  for (const rule of rules) {
    if (rule.trigger === "KEYWORD" && rule.keywords) {
      const keywords = rule.keywords.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean);
      const hit = keywords.some((k) => (rule.matchType === "exact" ? text === k : text.includes(k)));
      if (hit) {
        replyBody = rule.reply;
        await prisma.automationRule.update({ where: { id: rule.id }, data: { hits: { increment: 1 } } });
        break;
      }
    }
    if (rule.trigger === "WELCOME" && conversation.messages.filter((m) => m.direction === "IN").length === 1) {
      replyBody = rule.reply;
      await prisma.automationRule.update({ where: { id: rule.id }, data: { hits: { increment: 1 } } });
      break;
    }
  }

  if (!replyBody && conversation.aiEnabled) {
    const aiRule = rules.find((r) => r.trigger === "AI_AGENT");
    if (aiRule) {
      const history: ChatTurn[] = [...conversation.messages]
        .reverse()
        .map((m) => ({ role: m.direction === "IN" ? ("user" as const) : ("assistant" as const), content: m.body }));
      const { reply } = await generateAiReply(history, conversation.contact.name ?? undefined);
      replyBody = reply;
      isAi = true;
      await prisma.automationRule.update({ where: { id: aiRule.id }, data: { hits: { increment: 1 } } });
    }
  }

  if (!replyBody) return;

  const result = await sendText(conversation.contact.phone, replyBody);
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      direction: "OUT",
      type: "text",
      body: replyBody,
      status: result.ok ? "SENT" : "FAILED",
      waMessageId: result.waMessageId || null,
      isAi,
    },
  });
  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { lastMessageAt: new Date() },
  });
}

export async function recordInbound(phone: string, name: string | null, body: string): Promise<{ conversationId: string; messageId: string }> {
  const contact = await prisma.contact.upsert({
    where: { phone },
    create: { phone, name },
    update: name ? { name } : {},
  });

  let conversation = await prisma.conversation.findFirst({
    where: { contactId: contact.id, status: { not: "RESOLVED" } },
    orderBy: { lastMessageAt: "desc" },
  });
  if (!conversation) {
    conversation = await prisma.conversation.create({ data: { contactId: contact.id } });
  }

  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      direction: "IN",
      body,
      status: "DELIVERED",
      sentiment: detectSentiment(body),
    },
  });
  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { lastMessageAt: new Date(), unread: { increment: 1 }, status: "OPEN" },
  });
  return { conversationId: conversation.id, messageId: message.id };
}
