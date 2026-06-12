import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const templates = await prisma.template.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(templates);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name?.trim() || !body.body?.trim()) {
    return NextResponse.json({ error: "Name and body are required" }, { status: 400 });
  }
  const name = body.name.toLowerCase().replace(/[^a-z0-9_]/g, "_");
  try {
    const template = await prisma.template.create({
      data: {
        name,
        category: body.category || "MARKETING",
        language: body.language || "en",
        headerType: body.headerType || "TEXT",
        mediaUrl: body.mediaUrl || "",
        header: body.header || null,
        body: body.body,
        footer: body.footer || null,
        buttons: JSON.stringify(body.buttons ?? []),
        isLTO: body.isLTO ?? false,
        couponCode: body.couponCode ?? "",
        ltoExpiry: body.ltoExpiry ? new Date(body.ltoExpiry) : null,
        status: body.submit ? "APPROVED" : "DRAFT",
      },
    });
    return NextResponse.json(template, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Template name already exists" }, { status: 409 });
  }
}
