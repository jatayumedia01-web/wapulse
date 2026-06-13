import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();
  if (!password || password.length < 8) return NextResponse.json({ error: "Password too short" }, { status: 400 });
  const record = await prisma.passwordReset.findUnique({ where: { token: `reset_${token}` } });
  if (!record || record.expiresAt < new Date() || record.usedAt) {
    return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });
  }
  const hash = await hashPassword(password);
  await prisma.user.update({ where: { id: record.userId }, data: { passwordHash: hash } });
  await prisma.passwordReset.update({ where: { id: record.id }, data: { usedAt: new Date() } });
  // Invalidate all sessions
  await prisma.session.deleteMany({ where: { userId: record.userId } });
  return NextResponse.json({ ok: true });
}
