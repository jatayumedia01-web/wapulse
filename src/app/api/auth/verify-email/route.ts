import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession, COOKIE_NAME } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  const record = await prisma.passwordReset.findUnique({ where: { token: `verify_${token}` } });
  if (!record || record.expiresAt < new Date() || record.usedAt) {
    return NextResponse.json({ error: "Invalid or expired verification link" }, { status: 400 });
  }
  await prisma.passwordReset.update({ where: { id: record.id }, data: { usedAt: new Date() } });
  const user = await prisma.user.update({
    where: { id: record.userId },
    data: { emailVerified: true },
    include: { org: true },
  });
  sendWelcomeEmail(user.email, user.name, user.org.name).catch(() => {});
  const sessionToken = await createSession(user.id);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, sessionToken, { httpOnly: true, sameSite: "lax", maxAge: 30 * 86400, path: "/" });
  return res;
}
