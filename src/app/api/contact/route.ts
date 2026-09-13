import { NextRequest, NextResponse } from "next/server";
import { sendContactMessage } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  const { name, email, company, subject, message } = body as {
    name?: string; email?: string; company?: string; subject?: string; message?: string;
  };

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  await sendContactMessage({
    name: name.trim(),
    email: email.trim(),
    company: company?.trim(),
    subject: subject?.trim() || "General enquiry",
    message: message.trim(),
  }).catch((err) => console.error("[contact] failed to send email", err));

  return NextResponse.json({ ok: true });
}
