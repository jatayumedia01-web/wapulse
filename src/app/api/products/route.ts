import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireOrg } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const { orgId } = auth.session;
  const products = await prisma.product.findMany({ where: { orgId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const { orgId } = auth.session;

  const body = await req.json();
  if (!body.name?.trim() || typeof body.price !== "number") {
    return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
  }
  const product = await prisma.product.create({
    data: { orgId, name: body.name, description: body.description || "", price: body.price, currency: body.currency || "INR", imageUrl: body.imageUrl || "", sku: body.sku || "", inStock: body.inStock ?? true },
  });
  return NextResponse.json(product, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const auth = await requireOrg(req);
  if ("error" in auth) return auth.error;
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
