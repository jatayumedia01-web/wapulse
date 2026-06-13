import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireOrg } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const { orgId } = auth.session;
  const endpoints = await prisma.webhookEndpoint.findMany({ where: { orgId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(endpoints);
}

export async function POST(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const { orgId } = auth.session;

  const body = await req.json();
  if (!body.url?.trim()) return NextResponse.json({ error: "URL is required" }, { status: 400 });
  const endpoint = await prisma.webhookEndpoint.create({
    data: { orgId, url: body.url, events: body.events || "message.received,message.sent", secret: body.secret || "" },
  });
  return NextResponse.json(endpoint, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.webhookEndpoint.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
