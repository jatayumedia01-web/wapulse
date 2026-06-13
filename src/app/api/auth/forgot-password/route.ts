import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateResetToken } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const user = await prisma.user.findFirst({ where: { email: email?.toLowerCase() } });
  // Always return OK to prevent email enumeration
  if (!user) return NextResponse.json({ ok: true });
  const token = generateResetToken();
  await prisma.passwordReset.create({
    data: { userId: user.id, token: `reset_${token}`, expiresAt: new Date(Date.now() + 3600000) },
  });
  sendPasswordResetEmail(user.email, user.name, token).catch(() => {});
  return NextResponse.json({ ok: true });
}
