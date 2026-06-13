import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const role = req.headers.get("x-user-role");
  if (role !== "SUPER_ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const orgs = await prisma.organization.findMany({
    include: {
      users: { select: { id: true, name: true, email: true, role: true, createdAt: true } },
      subscriptions: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: { select: { contacts: true, campaigns: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orgs);
}
