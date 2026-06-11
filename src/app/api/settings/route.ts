import { NextRequest, NextResponse } from "next/server";
import { prisma, getSettings } from "@/lib/db";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({
    ...settings,
    accessToken: settings.accessToken ? "••••" + settings.accessToken.slice(-4) : "",
    openaiApiKey: settings.openaiApiKey ? "••••" + settings.openaiApiKey.slice(-4) : "",
  });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  await getSettings();
  const data: Record<string, unknown> = {};
  for (const key of ["businessName", "phoneNumberId", "wabaId", "verifyToken", "aiPersona", "awayMessage"]) {
    if (typeof body[key] === "string") data[key] = body[key];
  }
  // Secrets: only update when a real (non-masked) value is provided
  for (const key of ["accessToken", "openaiApiKey"]) {
    if (typeof body[key] === "string" && !body[key].startsWith("••••")) data[key] = body[key];
  }
  if (typeof body.demoMode === "boolean") data.demoMode = body.demoMode;
  const settings = await prisma.setting.update({ where: { id: 1 }, data });
  return NextResponse.json({ ok: true, demoMode: settings.demoMode });
}
