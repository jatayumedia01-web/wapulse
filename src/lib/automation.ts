import { prisma, getSettings } from "./db";
import { generateAiReply, detectSentiment, type ChatTurn } from "./ai";
import { sendText, sendInteractiveButtons } from "./whatsapp";
import { dispatchEvent } from "./webhooks";
import { isOptOut, isOptIn, handleOptOut, handleOptIn } from "./optout";

type FlowNode = { id: string; message: string; buttons: Array<{ text: string; next: string | null }> };

function withinWorkingHours(s: { workStart: string; workEnd: string; workDays: string }): boolean {
  const now = new Date();
  const days = s.workDays.split(",").map((d) => parseInt(d.trim(), 10));
  if (!days.includes(now.getDay())) return false;
  const mins = now.getHours() * 60 + now.getMinutes();
  const [sh, sm] = s.workStart.split(":").map(Number);
  const [eh, em] = s.workEnd.split(":").map(Number);
  return mins >= sh * 60 + sm && mins <= eh * 60 + em;
}

async function sendFlowNode(conversationId: string, phone: string, flowId: string, node: FlowNode) {
  const buttons = node.buttons.filter((b) => b.text.trim()).slice(0, 3);
  const result =
    buttons.length > 0
      ? await sendInteractiveButtons(phone, node.message, buttons.map((b, i) => ({ id: `btn_${i}`, title: b.text })))
      : await sendText(phone, node.message);

  const bodyText = buttons.length > 0 ? `${node.message}\n${buttons.map((b) => `▸ ${b.text}`).join("  ")}` : node.message;
  await prisma.message.create({
    data: {
      conversationId,
      direction: "OUT",
      type: buttons.length > 0 ? "interactive" : "text",
      body: bodyText,
      status: result.ok ? "SENT" : "FAILED",
      waMessageId: result.waMessageId || null,
      isAi: false,
      author: "Chatbot Flow",
    },
  });
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { lastMessageAt: new Date(), flowState: JSON.stringify({ flowId, nodeId: node.id }) },
  });
}

async function runFlowEngine(
  conversation: { id: string; flowState: string; contact: { phone: string } },
  text: string
): Promise<boolean> {
  const state = JSON.parse(conversation.flowState || "{}") as { flowId?: string; nodeId?: string };
  if (state.flowId) {
    const flow = await prisma.flow.findUnique({ where: { id: state.flowId } });
    if (flow?.enabled) {
      const nodes: FlowNode[] = JSON.parse(flow.nodes || "[]");
      const current = nodes.find((n) => n.id === state.nodeId);
      const clicked = current?.buttons.find((b) => b.text.trim().toLowerCase() === text.trim().toLowerCase());
      if (clicked) {
        const nextNode = clicked.next ? nodes.find((n) => n.id === clicked.next) : null;
        if (nextNode) {
          await sendFlowNode(conversation.id, conversation.contact.phone, flow.id, nextNode);
          return true;
        }
        await prisma.conversation.update({ where: { id: conversation.id }, data: { flowState: "{}" } });
        return false;
      }
    }
    await prisma.conversation.update({ where: { id: conversation.id }, data: { flowState: "{}" } });
  }

  const flows = await prisma.flow.findMany({ where: { enabled: true } });
  for (const flow of flows) {
    const keywords = flow.keywords.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean);
    if (keywords.some((k) => text.toLowerCase().includes(k))) {
      const nodes: FlowNode[] = JSON.parse(flow.nodes || "[]");
      if (nodes.length === 0) continue;
      await prisma.flow.update({ where: { id: flow.id }, data: { runs: { increment: 1 } } });
      await sendFlowNode(conversation.id, conversation.contact.phone, flow.id, nodes[0]);
      return true;
    }
  }
  return false;
}

export async function processInbound(conversationId: string): Promise<void> {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      contact: true,
      messages: { where: { kind: "MESSAGE" }, orderBy: { createdAt: "desc" }, take: 12 },
    },
  });
  if (!conversation) return;

  const lastInbound = conversation.messages.find((m) => m.direction === "IN");
  if (!lastInbound) return;

  const text = lastInbound.body;

  // Opt-out / opt-in handling — highest priority
  if (isOptOut(text)) {
    await handleOptOut(conversation.contact.phone, conversationId);
    return;
  }
  if (isOptIn(text)) {
    await handleOptIn(conversation.contact.phone, conversationId);
    return;
  }

  // Chatbot flows
  if (await runFlowEngine(conversation, text)) return;

  const rules = await prisma.automationRule.findMany({
    where: { enabled: true },
    orderBy: { priority: "desc" },
  });

  let replyBody: string | null = null;
  let isAi = false;
  let author: string | null = null;

  for (const rule of rules) {
    if (rule.trigger === "KEYWORD" && rule.keywords) {
      const keywords = rule.keywords.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean);
      const t = text.toLowerCase();
      const hit = keywords.some((k) => (rule.matchType === "exact" ? t === k : t.includes(k)));
      if (hit) {
        replyBody = rule.reply;
        author = rule.name;
        await prisma.automationRule.update({ where: { id: rule.id }, data: { hits: { increment: 1 } } });
        break;
      }
    }
    if (rule.trigger === "WELCOME" && conversation.messages.filter((m) => m.direction === "IN").length === 1) {
      replyBody = rule.reply;
      author = rule.name;
      await prisma.automationRule.update({ where: { id: rule.id }, data: { hits: { increment: 1 } } });
      break;
    }
  }

  const settings = await getSettings();
  if (!replyBody && settings.awayEnabled && !withinWorkingHours(settings)) {
    const recentAway = await prisma.message.findFirst({
      where: { conversationId, direction: "OUT", author: "Away Message", createdAt: { gte: new Date(Date.now() - 6 * 3600000) } },
    });
    if (!recentAway) {
      replyBody = settings.awayMessage;
      author = "Away Message";
    } else {
      return;
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
      author = "AI Agent";
      await prisma.automationRule.update({ where: { id: aiRule.id }, data: { hits: { increment: 1 } } });
    }
  }

  if (!replyBody) return;

  const result = await sendText(conversation.contact.phone, replyBody);
  await prisma.message.create({
    data: {
      conversationId,
      direction: "OUT",
      body: replyBody,
      status: result.ok ? "SENT" : "FAILED",
      waMessageId: result.waMessageId || null,
      isAi,
      author,
    },
  });
  await prisma.conversation.update({ where: { id: conversationId }, data: { lastMessageAt: new Date() } });
  dispatchEvent("message.sent", { conversationId, to: conversation.contact.phone, body: replyBody, automated: true }).catch(() => {});
}

async function pickAssignee(): Promise<string | null> {
  const agents = await prisma.teamMember.findMany();
  if (!agents.length) return null;
  const loads = await Promise.all(
    agents.map(async (a) => ({
      name: a.name,
      load: await prisma.conversation.count({ where: { assignee: a.name, status: "OPEN" } }),
    }))
  );
  return loads.sort((a, b) => a.load - b.load)[0].name;
}

export async function recordInbound(
  phone: string,
  name: string | null,
  body: string
): Promise<{ conversationId: string; messageId: string }> {
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
    const settings = await getSettings();
    const assignee = settings.autoAssign ? await pickAssignee() : null;
    conversation = await prisma.conversation.create({ data: { contactId: contact.id, assignee } });
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
  dispatchEvent("message.received", { conversationId: conversation.id, from: phone, name: contact.name, body }).catch(() => {});
  return { conversationId: conversation.id, messageId: message.id };
}
