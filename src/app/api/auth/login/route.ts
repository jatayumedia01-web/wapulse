import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, createSession, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email?.trim() || !password?.trim()) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: { email: email.toLowerCase() },
    include: { org: true },
  });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
  if (!user.emailVerified) {
    return NextResponse.json({ error: "Please verify your email first. Check your inbox." }, { status: 403 });
  }

  const token = await createSession(user.id);

  const res = NextResponse.json({
    ok: true,
    orgId: user.orgId,
    role: user.role,
    onboarded: await prisma.setting.findUnique({ where: { orgId: user.orgId } }).then((s) => s?.onboarded ?? false),
  });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 86400,
    path: "/",
  });
  return res;
}
