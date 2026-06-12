import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name?.trim() || typeof body.price !== "number") {
    return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
  }
  const product = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description || "",
      price: body.price,
      currency: body.currency || "INR",
      imageUrl: body.imageUrl || "",
      sku: body.sku || "",
      inStock: body.inStock ?? true,
    },
  });
  return NextResponse.json(product, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
