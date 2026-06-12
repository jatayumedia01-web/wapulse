import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  return NextResponse.json(await prisma.customField.findMany({ orderBy: { createdAt: "asc" } }));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const key = body.name.toLowerCase().replace(/[^a-z0-9_]/g, "_");
  try {
    const field = await prisma.customField.create({
      data: { name: body.name, key, type: body.type ?? "text", options: JSON.stringify(body.options ?? []) },
    });
    return NextResponse.json(field, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Field name already exists" }, { status: 409 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.customField.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
