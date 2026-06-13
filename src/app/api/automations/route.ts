import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireOrg } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const { orgId } = auth.session;
  const rules = await prisma.automationRule.findMany({ where: { orgId }, orderBy: [{ priority: "desc" }, { createdAt: "asc" }] });
  return NextResponse.json(rules);
}

export async function POST(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const { orgId } = auth.session;

  const body = await req.json();
  if (!body.name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const rule = await prisma.automationRule.create({
    data: {
      orgId,
      name: body.name,
      trigger: body.trigger || "KEYWORD",
      keywords: body.keywords || "",
      matchType: body.matchType || "contains",
      reply: body.reply || "",
      enabled: body.enabled !== false,
      priority: body.priority ?? 0,
    },
  });
  return NextResponse.json(rule, { status: 201 });
}
