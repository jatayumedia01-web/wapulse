import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireOrg } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const { orgId } = auth.session;
  const templates = await prisma.template.findMany({ where: { orgId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(templates);
}

export async function POST(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const { orgId } = auth.session;

  const body = await req.json();
  if (!body.name?.trim() || !body.body?.trim()) {
    return NextResponse.json({ error: "Name and body are required" }, { status: 400 });
  }
  const name = body.name.toLowerCase().replace(/[^a-z0-9_]/g, "_");
  try {
    const template = await prisma.template.create({
      data: {
        orgId, name,
        category: body.category || "MARKETING",
        language: body.language || "en",
        headerType: body.headerType || "TEXT",
        mediaUrl: body.mediaUrl || "",
        header: body.header || null,
        body: body.body,
        footer: body.footer || null,
        buttons: body.buttons ? JSON.stringify(body.buttons) : "[]",
        carouselCards: body.carouselCards ? JSON.stringify(body.carouselCards) : "[]",
        isLTO: !!body.isLTO,
        ltoExpiry: body.ltoExpiry ? new Date(body.ltoExpiry) : null,
        couponCode: body.couponCode || "",
        status: "DRAFT",
      },
    });
    return NextResponse.json(template, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Template with this name already exists" }, { status: 409 });
  }
}
