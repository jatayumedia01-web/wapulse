import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  const contacts = await prisma.contact.findMany({
    where: q
      ? { OR: [{ name: { contains: q } }, { phone: { contains: q } }, { tags: { contains: q } }] }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json(contacts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.phone?.trim()) return NextResponse.json({ error: "Phone is required" }, { status: 400 });
  const phone = body.phone.replace(/[^\d+]/g, "");
  try {
    const contact = await prisma.contact.create({
      data: {
        phone,
        name: body.name || null,
        email: body.email || null,
        tags: body.tags || "",
      },
    });
    return NextResponse.json(contact, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Contact with this phone already exists" }, { status: 409 });
  }
}
