import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { recordInbound, processInbound } from "@/lib/automation";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const verifyToken = params.get("hub.verify_token");
  if (params.get("hub.mode") === "subscribe" && verifyToken) {
    const setting = await prisma.setting.findFirst({ where: { verifyToken } });
    if (setting) {
      return new NextResponse(params.get("hub.challenge") ?? "", { status: 200 });
    }
  }
  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

type WebhookValue = {
  contacts?: Array<{ profile?: { name?: string }; wa_id?: string }>;
  messages?: Array<{
    from: string; id: string; type: string;
    text?: { body: string }; button?: { text: string };
    interactive?: { button_reply?: { title: string }; list_reply?: { title: string } };
  }>;
  statuses?: Array<{ id: string; status: string }>;
};

export async function POST(req: NextRequest) {
  const payload = await req.json().catch(() => null);
  if (!payload) return NextResponse.json({ ok: false }, { status: 400 });

  // Determine which org this webhook belongs to via phone number ID in metadata
  const phoneNumberId = payload.entry?.[0]?.changes?.[0]?.value?.metadata?.phone_number_id;
  let orgId: string | undefined;
  if (phoneNumberId) {
    const setting = await prisma.setting.findFirst({ where: { phoneNumberId } });
    orgId = setting?.orgId;
  }
  if (!orgId) {
    const setting = await prisma.setting.findFirst();
    orgId = setting?.orgId;
  }

  const entries = payload.entry ?? [];
  for (const entry of entries) {
    for (const change of entry.changes ?? []) {
      const value: WebhookValue = change.value ?? {};
      for (const msg of value.messages ?? []) {
        const name = value.contacts?.find((c) => c.wa_id === msg.from)?.profile?.name ?? null;
        const body =
          msg.text?.body ?? msg.button?.text ?? msg.interactive?.button_reply?.title ?? msg.interactive?.list_reply?.title ?? `[${msg.type}]`;
        const { conversationId } = await recordInbound(msg.from, name, body, orgId);
        processInbound(conversationId).catch(() => {});
      }
      for (const st of value.statuses ?? []) {
        const map: Record<string, string> = { sent: "SENT", delivered: "DELIVERED", read: "READ", failed: "FAILED" };
        const status = map[st.status];
        if (status) await prisma.message.updateMany({ where: { waMessageId: st.id }, data: { status } });
      }
    }
  }
  return NextResponse.json({ ok: true });
}
