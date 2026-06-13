import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const orgId = req.headers.get("x-org-id");
  const userId = req.headers.get("x-user-id");
  if (!orgId || !userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, avatarUrl: true, orgId: true, org: { select: { name: true, slug: true, plan: true, logoUrl: true } } },
  });
  return NextResponse.json(user);
}
