import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ log: ["error"] });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/** Get org settings — returns defaults if not yet configured.
 *  Pass orgId to get a specific org's settings, or omit/use "_fallback" to get the first available. */
export async function getSettings(orgId?: string) {
  if (!orgId || orgId === "_fallback") {
    const s = await prisma.setting.findFirst();
    return s ?? { orgId: "", businessName: "", phoneNumberId: "", wabaId: "", accessToken: "", verifyToken: "wapulse_verify", openaiApiKey: "", aiPersona: "You are a helpful assistant.", awayMessage: "We'll get back to you soon.", awayEnabled: false, workStart: "09:00", workEnd: "19:00", workDays: "1,2,3,4,5,6", autoAssign: true, demoMode: true, onboarded: false, id: "" };
  }
  let s = await prisma.setting.findUnique({ where: { orgId } });
  if (!s) {
    s = await prisma.setting.create({ data: { orgId } });
  }
  return s;
}

/** Get current month usage log, creating if missing */
export async function getUsageLog(orgId: string) {
  const month = new Date().toISOString().slice(0, 7); // YYYY-MM
  return prisma.usageLog.upsert({
    where: { orgId_month: { orgId, month } },
    create: { orgId, month },
    update: {},
  });
}

/** Increment a usage counter */
export async function incrementUsage(orgId: string, field: "messagesSent" | "campaigns" | "apiCalls", by = 1) {
  const month = new Date().toISOString().slice(0, 7);
  await prisma.usageLog.upsert({
    where: { orgId_month: { orgId, month } },
    create: { orgId, month, [field]: by },
    update: { [field]: { increment: by } },
  });
}
