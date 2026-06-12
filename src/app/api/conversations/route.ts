import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");
  const label = req.nextUrl.searchParams.get("label");
  const assignee = req.nextUrl.searchParams.get("assignee");
  const unread = req.nextUrl.searchParams.get("unread");
  const q = req.nextUrl.searchParams.get("q")?.trim();

  const conversations = await prisma.conversation.findMany({
    where: {
      ...(status && status !== "ALL" ? { status } : {}),
      ...(label ? { labels: { contains: label } } : {}),
      ...(assignee ? { assignee } : {}),
      ...(unread === "1" ? { unread: { gt: 0 } } : {}),
      ...(q
        ? {
            contact: {
              OR: [{ name: { contains: q } }, { phone: { contains: q } }],
            },
          }
        : {}),
    },
    include: {
      contact: true,
      messages: { where: { kind: "MESSAGE" }, orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { lastMessageAt: "desc" },
    take: 100,
  });
  return NextResponse.json(conversations);
}
