/**
 * AI engine: auto-replies, smart reply suggestions and sentiment analysis.
 * Uses OpenAI when an API key is configured in Settings, otherwise falls
 * back to a built-in intent engine so the product is fully functional
 * without any external dependency.
 */
import { getSettings } from "./db";

export type ChatTurn = { role: "user" | "assistant"; content: string };

const NEGATIVE = ["angry", "refund", "worst", "bad", "terrible", "complaint", "cancel", "broken", "not working", "scam", "late", "delay", "disappointed"];
const POSITIVE = ["thanks", "thank you", "great", "awesome", "love", "perfect", "good", "amazing", "super", "nice"];

export function detectSentiment(text: string): "positive" | "neutral" | "negative" {
  const t = text.toLowerCase();
  const neg = NEGATIVE.filter((w) => t.includes(w)).length;
  const pos = POSITIVE.filter((w) => t.includes(w)).length;
  if (neg > pos) return "negative";
  if (pos > neg) return "positive";
  return "neutral";
}

const INTENTS: Array<{ match: RegExp; reply: (name?: string) => string }> = [
  {
    match: /\b(hi|hello|hey|namaste|hai)\b/i,
    reply: (n) => `Hello${n ? " " + n : ""}! 👋 Welcome — how can I help you today? You can ask about pricing, orders, or talk to our team.`,
  },
  {
    match: /price|pricing|cost|charge|plan/i,
    reply: () => "Our plans start at ₹999/month for the Starter pack and ₹2,499/month for Growth (unlimited agents + automation). Want me to share a detailed comparison?",
  },
  {
    match: /order|delivery|track|shipment|status/i,
    reply: () => "I can help you track your order! Please share your order ID (e.g. ORD-12345) and I'll fetch the latest status for you.",
  },
  {
    match: /refund|return|cancel/i,
    reply: () => "I'm sorry to hear that. I've flagged this conversation for our support team — refunds are processed within 5–7 business days. Could you share your order ID so we can speed this up?",
  },
  {
    match: /human|agent|support|talk|call/i,
    reply: () => "Sure — connecting you to a human agent now. Someone from our team will reply here within a few minutes. 🙋",
  },
  {
    match: /thank|thanks/i,
    reply: () => "You're most welcome! Is there anything else I can help you with? 😊",
  },
];

function builtInReply(history: ChatTurn[], contactName?: string): string {
  const last = history.filter((h) => h.role === "user").at(-1)?.content ?? "";
  for (const intent of INTENTS) {
    if (intent.match.test(last)) return intent.reply(contactName);
  }
  return "Thanks for your message! I've shared this with our team — meanwhile, could you tell me a bit more about what you're looking for?";
}

async function openaiChat(apiKey: string, system: string, history: ChatTurn[]): Promise<string | null> {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 200,
        messages: [{ role: "system", content: system }, ...history.slice(-10)],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

export async function generateAiReply(history: ChatTurn[], contactName?: string): Promise<{ reply: string; engine: "openai" | "builtin" }> {
  const settings = await getSettings();
  if (settings.openaiApiKey) {
    const system = `${settings.aiPersona}\nBusiness: ${settings.businessName}. Keep replies short (under 60 words), warm and WhatsApp-friendly.`;
    const reply = await openaiChat(settings.openaiApiKey, system, history);
    if (reply) return { reply, engine: "openai" };
  }
  return { reply: builtInReply(history, contactName), engine: "builtin" };
}

export async function suggestReplies(history: ChatTurn[]): Promise<string[]> {
  const settings = await getSettings();
  if (settings.openaiApiKey) {
    const reply = await openaiChat(
      settings.openaiApiKey,
      "Suggest exactly 3 short reply options (under 20 words each) an agent could send next. Return them separated by newlines, no numbering.",
      history
    );
    if (reply) {
      const lines = reply.split("\n").map((l) => l.replace(/^[-*\d.)\s]+/, "").trim()).filter(Boolean);
      if (lines.length >= 2) return lines.slice(0, 3);
    }
  }
  const last = history.filter((h) => h.role === "user").at(-1)?.content ?? "";
  const sentiment = detectSentiment(last);
  if (sentiment === "negative") {
    return [
      "I'm really sorry about this — let me fix it for you right away.",
      "Could you share your order ID? I'll escalate this immediately.",
      "I understand your frustration. A senior agent will call you within 30 minutes.",
    ];
  }
  return [
    "Sure! Let me get that information for you.",
    "Thanks for reaching out — happy to help! 😊",
    "Could you share a few more details so I can assist better?",
  ];
}
