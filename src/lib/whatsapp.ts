/**
 * WhatsApp Cloud API client (Meta Graph API v21.0).
 *
 * When credentials are missing or demoMode is enabled, all sends are
 * simulated locally so the entire product works out-of-the-box without
 * a Meta business account.
 */
import { getSettings } from "./db";

const GRAPH = "https://graph.facebook.com/v21.0";

export type SendResult = {
  ok: boolean;
  waMessageId: string;
  simulated: boolean;
  error?: string;
};

type TemplateComponent = {
  type: string;
  sub_type?: string;
  index?: number;
  parameters: Array<Record<string, unknown>>;
};

function fakeId() {
  return `wamid.SIM${Date.now()}${Math.random().toString(36).slice(2, 10)}`;
}

async function graphPost(path: string, token: string, payload: unknown): Promise<SendResult> {
  try {
    const res = await fetch(`${GRAPH}/${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      return { ok: false, waMessageId: "", simulated: false, error: data?.error?.message ?? `HTTP ${res.status}` };
    }
    return { ok: true, waMessageId: data?.messages?.[0]?.id ?? fakeId(), simulated: false };
  } catch (e) {
    return { ok: false, waMessageId: "", simulated: false, error: e instanceof Error ? e.message : "Network error" };
  }
}

async function liveCredentials() {
  const s = await getSettings();
  const live = !s.demoMode && s.accessToken && s.phoneNumberId;
  return { live, token: s.accessToken, phoneNumberId: s.phoneNumberId };
}

export async function sendText(to: string, body: string): Promise<SendResult> {
  const { live, token, phoneNumberId } = await liveCredentials();
  if (!live) return { ok: true, waMessageId: fakeId(), simulated: true };
  return graphPost(`${phoneNumberId}/messages`, token, {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "text",
    text: { preview_url: true, body },
  });
}

export async function sendTemplate(
  to: string,
  templateName: string,
  language: string,
  components: TemplateComponent[] = []
): Promise<SendResult> {
  const { live, token, phoneNumberId } = await liveCredentials();
  if (!live) return { ok: true, waMessageId: fakeId(), simulated: true };
  return graphPost(`${phoneNumberId}/messages`, token, {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: { name: templateName, language: { code: language }, components },
  });
}

export async function sendInteractiveButtons(
  to: string,
  body: string,
  buttons: Array<{ id: string; title: string }>
): Promise<SendResult> {
  const { live, token, phoneNumberId } = await liveCredentials();
  if (!live) return { ok: true, waMessageId: fakeId(), simulated: true };
  return graphPost(`${phoneNumberId}/messages`, token, {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: body },
      action: { buttons: buttons.map((b) => ({ type: "reply", reply: b })) },
    },
  });
}

export async function markAsRead(waMessageId: string): Promise<void> {
  const { live, token, phoneNumberId } = await liveCredentials();
  if (!live) return;
  await graphPost(`${phoneNumberId}/messages`, token, {
    messaging_product: "whatsapp",
    status: "read",
    message_id: waMessageId,
  });
}
