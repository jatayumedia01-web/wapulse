/**
 * Helper to extract orgId/userId from middleware-injected headers in API routes.
 * The middleware validates the session and injects x-org-id, x-user-id, x-user-role, x-org-plan.
 */
import { NextRequest, NextResponse } from "next/server";

export type OrgSession = {
  userId: string;
  orgId: string;
  role: string;
  orgPlan: string;
};

export async function requireOrg(req: NextRequest): Promise<{ session: OrgSession } | { error: NextResponse }> {
  const orgId = req.headers.get("x-org-id");
  const userId = req.headers.get("x-user-id");
  const role = req.headers.get("x-user-role") ?? "AGENT";
  const orgPlan = req.headers.get("x-org-plan") ?? "FREE";

  if (!orgId || !userId) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  return { session: { orgId, userId, role, orgPlan } };
}
