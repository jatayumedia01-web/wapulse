/**
 * Auth helpers — session management, password hashing, tenant resolution.
 * Uses JWT stored in a secure httpOnly cookie. No external auth provider needed.
 */
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

export const COOKIE_NAME = "wapulse_session";
const SESSION_TTL_DAYS = 30;

// ── Password ─────────────────────────────────────────────────────────────────

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// ── Session ───────────────────────────────────────────────────────────────────

function randomToken(bytes = 48): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Buffer.from(arr).toString("hex");
}

export async function createSession(userId: string): Promise<string> {
  const token = randomToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 86400000);
  await prisma.session.create({ data: { userId, token, expiresAt } });
  return token;
}

export async function deleteSession(token: string): Promise<void> {
  await prisma.session.deleteMany({ where: { token } });
}

// ── Current User / Org (Server-side) ─────────────────────────────────────────

export type AuthContext = {
  userId: string;
  orgId: string;
  role: string;
  plan: string;
};

export async function getAuthContext(): Promise<AuthContext | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return resolveToken(token);
}

export async function getAuthContextFromRequest(req: NextRequest): Promise<AuthContext | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return resolveToken(token);
}

async function resolveToken(token: string): Promise<AuthContext | null> {
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: { include: { org: true } } },
  });
  if (!session || session.expiresAt < new Date()) return null;
  const { user } = session;
  if (!user.emailVerified && user.role !== "SUPER_ADMIN") return null;
  return { userId: user.id, orgId: user.orgId, role: user.role, plan: user.org.plan };
}

// ── Plan limits ───────────────────────────────────────────────────────────────

export const PLAN_LIMITS: Record<string, { contacts: number; messages: number; agents: number; campaigns: number; drip: number; api: boolean; ai: boolean }> = {
  FREE:       { contacts: 250,    messages: 1000,   agents: 1,  campaigns: 2,   drip: 0,   api: false, ai: false },
  STARTER:    { contacts: 2000,   messages: 10000,  agents: 3,  campaigns: 10,  drip: 3,   api: false, ai: false },
  GROWTH:     { contacts: 15000,  messages: 50000,  agents: 10, campaigns: 50,  drip: 20,  api: true,  ai: true  },
  BUSINESS:   { contacts: 100000, messages: 500000, agents: 50, campaigns: 999, drip: 999, api: true,  ai: true  },
  ENTERPRISE: { contacts: -1,     messages: -1,     agents: -1, campaigns: -1,  drip: -1,  api: true,  ai: true  },
};

export function getPlanLimits(plan: string) {
  return PLAN_LIMITS[plan] ?? PLAN_LIMITS.FREE;
}

// ── Email verification token ──────────────────────────────────────────────────

export function generateVerifyToken(): string {
  return randomToken(24);
}

export function generateResetToken(): string {
  return randomToken(24);
}

// ── Org slug ──────────────────────────────────────────────────────────────────

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
}
