import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "rubenius_session";

/**
 * Next 16's proxy is documented as an *optimistic* check and explicitly "not
 * intended [...] as a full session management or authorization solution"
 * (node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md).
 *
 * So this file does one job: send a signed-in human to the portal that matches
 * their role scope, and everyone else to /login. It is a redirect for humans.
 * Authorization proper lives in the route handlers, behind requireAdmin() and
 * requirePermission() in lib/admin-auth.ts — see docs/rbac-completion-plan.md.
 */
function loginRedirect(request: NextRequest, clearSession = false) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set(
    "next",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );

  const response = NextResponse.redirect(loginUrl);
  if (clearSession) {
    response.cookies.set(SESSION_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
  }
  return response;
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return loginRedirect(request);

  try {
    const session = await prisma.session.findUnique({
      where: {
        tokenHash: createHash("sha256").update(token).digest("hex"),
      },
      select: {
        expiresAt: true,
        user: { select: { status: true, role: { select: { scope: true } } } },
      },
    });

    if (
      !session ||
      session.expiresAt <= new Date() ||
      session.user.status !== "ACTIVE"
    ) {
      return loginRedirect(request, true);
    }

    // Scope, never role name. Roles are unique per (tenantId, name), so a tenant
    // can create one called "ADMIN" or "SUPER_ADMIN" — and the old
    // `role.name.includes("ADMIN")` check would have routed its members into the
    // platform admin panel.
    const isSystemScope = session.user.role.scope === "SYSTEM";

    if (request.nextUrl.pathname.startsWith("/admin") && !isSystemScope) {
      return NextResponse.redirect(new URL("/agent", request.url));
    }
    if (request.nextUrl.pathname.startsWith("/agent") && isSystemScope) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Unable to verify dashboard session.", error);
    return loginRedirect(request);
  }
}

export const config = {
  matcher: ["/admin/:path*", "/agent/:path*"],
};
