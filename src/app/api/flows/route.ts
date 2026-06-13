import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireOrg } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const { orgId } = auth.session;
  const flows = await prisma.flow.findMany({ where: { orgId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(flows);
}

export async function POST(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const { orgId } = auth.session;

  const body = await req.json();
  if (!body.name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const flow = await prisma.flow.create({
    data: { orgId, name: body.name, keywords: body.keywords || "", nodes: JSON.stringify(body.nodes ?? []), enabled: body.enabled ?? true },
  });
  return NextResponse.json(flow, { status: 201 });
}
