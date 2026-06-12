import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const endpoints = await prisma.webhookEndpoint.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(endpoints);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.url?.trim()) return NextResponse.json({ error: "URL is required" }, { status: 400 });
  const endpoint = await prisma.webhookEndpoint.create({
    data: {
      url: body.url,
      events: body.events || "message.received,message.sent",
      secret: body.secret || "",
    },
  });
  return NextResponse.json(endpoint, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.webhookEndpoint.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
