import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * CSV import. Expected header: name,phone,email,tags
 * Body: raw CSV text.
 */
export async function POST(req: NextRequest) {
  const text = await req.text();
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return NextResponse.json({ error: "CSV must have a header and at least one row" }, { status: 400 });

  const header = lines[0].toLowerCase().split(",").map((h) => h.trim());
  const phoneIdx = header.indexOf("phone");
  if (phoneIdx === -1) return NextResponse.json({ error: "CSV must include a 'phone' column" }, { status: 400 });
  const nameIdx = header.indexOf("name");
  const emailIdx = header.indexOf("email");
  const tagsIdx = header.indexOf("tags");

  let imported = 0;
  let skipped = 0;
  for (const line of lines.slice(1)) {
    const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
    const phone = (cols[phoneIdx] ?? "").replace(/[^\d+]/g, "");
    if (!phone) {
      skipped++;
      continue;
    }
    const data = {
      name: nameIdx >= 0 ? cols[nameIdx] || null : null,
      email: emailIdx >= 0 ? cols[emailIdx] || null : null,
      tags: tagsIdx >= 0 ? (cols.slice(tagsIdx).join(",") || "") : "",
    };
    await prisma.contact.upsert({
      where: { phone },
      create: { phone, ...data },
      update: data,
    });
    imported++;
  }
  return NextResponse.json({ imported, skipped });
}
