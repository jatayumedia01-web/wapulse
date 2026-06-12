import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const contacts = await prisma.contact.findMany({ orderBy: { createdAt: "desc" } });
  const esc = (v: string | null) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const rows = [
    "name,phone,email,tags,optedIn",
    ...contacts.map((c) => [esc(c.name), c.phone, esc(c.email), esc(c.tags), c.optedIn].join(",")),
  ];
  return new NextResponse(rows.join("\n"), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="wapulse-contacts.csv"`,
    },
  });
}
