import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { suggestReplies, type ChatTurn } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const { conversationId } = await req.json();
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  const history: ChatTurn[] = messages
    .reverse()
    .map((m) => ({ role: m.direction === "IN" ? ("user" as const) : ("assistant" as const), content: m.body }));
  const suggestions = await suggestReplies(history);
  return NextResponse.json({ suggestions });
}
