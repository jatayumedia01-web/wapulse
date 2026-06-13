import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, createSession, generateVerifyToken, slugify, COOKIE_NAME } from "@/lib/auth";
import { sendVerifyEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { name, email, password, businessName } = await req.json();
  if (!name?.trim() || !email?.trim() || !password?.trim() || !businessName?.trim()) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }
  if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });

  // Check email already exists
  const existing = await prisma.user.findFirst({ where: { email: email.toLowerCase() } });
  if (existing) return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });

  // Create org
  let slug = slugify(businessName);
  const slugConflict = await prisma.organization.findUnique({ where: { slug } });
  if (slugConflict) slug = `${slug}-${Date.now().toString(36)}`;

  const org = await prisma.organization.create({ data: { name: businessName, slug } });
  await prisma.setting.create({ data: { orgId: org.id } });

  // Create user
  const passwordHash = await hashPassword(password);
  const verifyToken = generateVerifyToken();
  const user = await prisma.user.create({
    data: { orgId: org.id, name, email: email.toLowerCase(), passwordHash, role: "ADMIN" },
  });

  // Store verify token in password reset table (reuse structure)
  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token: `verify_${verifyToken}`,
      expiresAt: new Date(Date.now() + 24 * 3600000),
    },
  });

  // Send verification email (non-blocking)
  sendVerifyEmail(email, name, verifyToken).catch(() => {});

  // Auto-verify in demo/dev mode
  const isDev = process.env.NODE_ENV !== "production";
  if (isDev) {
    await prisma.user.update({ where: { id: user.id }, data: { emailVerified: true } });
  }

  // Create session
  const token = await createSession(user.id);

  const res = NextResponse.json({ ok: true, orgId: org.id, emailVerified: isDev });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 86400,
    path: "/",
  });
  return res;
}
