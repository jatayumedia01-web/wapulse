import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireOrg } from "@/lib/api-auth";

async function getOrgSettings(orgId: string) {
  return prisma.setting.upsert({
    where: { orgId },
    create: { orgId },
    update: {},
  });
}

export async function GET(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const { orgId } = auth.session;
  const settings = await getOrgSettings(orgId);
  return NextResponse.json({
    ...settings,
    accessToken: settings.accessToken ? "••••" + settings.accessToken.slice(-4) : "",
    openaiApiKey: settings.openaiApiKey ? "••••" + settings.openaiApiKey.slice(-4) : "",
  });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const { orgId } = auth.session;

  const body = await req.json();
  await getOrgSettings(orgId);
  const data: Record<string, unknown> = {};
  for (const key of ["businessName", "phoneNumberId", "wabaId", "verifyToken", "aiPersona", "awayMessage", "workStart", "workEnd", "workDays"]) {
    if (typeof body[key] === "string") data[key] = body[key];
  }
  for (const key of ["awayEnabled", "autoAssign"]) {
    if (typeof body[key] === "boolean") data[key] = body[key];
  }
  for (const key of ["accessToken", "openaiApiKey"]) {
    if (typeof body[key] === "string" && !body[key].startsWith("••••")) data[key] = body[key];
  }
  if (typeof body.demoMode === "boolean") data.demoMode = body.demoMode;
  if (typeof body.onboarded === "boolean") data.onboarded = body.onboarded;
  const settings = await prisma.setting.update({ where: { orgId }, data });
  return NextResponse.json({ ok: true, demoMode: settings.demoMode });
}
