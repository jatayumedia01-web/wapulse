import { NextRequest, NextResponse } from "next/server";
import { getAuthContextFromRequest, COOKIE_NAME } from "@/lib/auth";

const PUBLIC_PATHS = [
  "/auth/",
  "/api/auth/",
  "/api/webhook",
  "/api/billing/webhook",
];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next();
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon") || pathname === "/") return NextResponse.next();

  const auth = await getAuthContextFromRequest(req);

  if (!auth) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/superadmin") && auth.role !== "SUPER_ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const headers = new Headers(req.headers);
  headers.set("x-org-id", auth.orgId);
  headers.set("x-user-id", auth.userId);
  headers.set("x-user-role", auth.role);
  headers.set("x-org-plan", auth.plan);

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
