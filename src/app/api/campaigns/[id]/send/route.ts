import { NextRequest, NextResponse } from "next/server";
import { launchCampaign } from "@/lib/campaign";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const campaign = await launchCampaign(id);
    return NextResponse.json(campaign);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Launch failed" }, { status: 409 });
  }
}
