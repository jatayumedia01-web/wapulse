/**
 * Server-side auth helpers — re-exports from auth.ts for backward compat.
 */
export { createSession, deleteSession as destroySession, generateVerifyToken, generateResetToken } from "./auth";
export { sendVerifyEmail, sendPasswordResetEmail, sendInvitationEmail, sendWelcomeEmail } from "./email";

import { prisma } from "./db";

export async function verifySessionToken(token: string) {
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: { include: { org: true } } },
  });
  if (!session || session.expiresAt < new Date()) return null;
  const setting = await prisma.setting.findUnique({ where: { orgId: session.user.orgId } });
  return {
    userId: session.user.id,
    orgId: session.user.orgId,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
    orgName: session.user.org.name,
    orgPlan: session.user.org.plan,
    onboardingDone: setting?.onboarded ?? false,
  };
}
