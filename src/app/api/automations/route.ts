import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const rules = await prisma.automationRule.findMany({ orderBy: [{ priority: "desc" }, { createdAt: "asc" }] });
  return NextResponse.json(rules);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const rule = await prisma.automationRule.create({
    data: {
      name: body.name,
      trigger: body.trigger || "KEYWORD",
      keywords: body.keywords || "",
      matchType: body.matchType || "contains",
      reply: body.reply || "",
      priority: body.priority ?? 0,
      enabled: body.enabled ?? true,
    },
  });
  return NextResponse.json(rule, { status: 201 });
}
