/**
 * Outgoing webhooks — notify external systems (Zapier, your backend, etc.)
 * about platform events. Fire-and-forget with HMAC-style shared secret header.
 */
import { prisma } from "./db";

export type WebhookEvent =
  | "message.received"
  | "message.sent"
  | "conversation.resolved"
  | "campaign.completed"
  | "order.created"
  | "order.paid";

export async function dispatchEvent(event: WebhookEvent, payload: Record<string, unknown>): Promise<void> {
  const endpoints = await prisma.webhookEndpoint.findMany({ where: { enabled: true } });
  const targets = endpoints.filter((e) => e.events.split(",").map((s) => s.trim()).includes(event));
  if (targets.length === 0) return;

  const body = JSON.stringify({ event, timestamp: new Date().toISOString(), data: payload });
  await Promise.allSettled(
    targets.map(async (endpoint) => {
      try {
        const res = await fetch(endpoint.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-wapulse-event": event,
            ...(endpoint.secret ? { "x-wapulse-secret": endpoint.secret } : {}),
          },
          body,
          signal: AbortSignal.timeout(5000),
        });
        await prisma.webhookEndpoint.update({
          where: { id: endpoint.id },
          data: { lastStatus: res.status, lastFiredAt: new Date() },
        });
      } catch {
        await prisma.webhookEndpoint.update({
          where: { id: endpoint.id },
          data: { lastStatus: -1, lastFiredAt: new Date() },
        });
      }
    })
  );
}
