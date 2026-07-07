import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "rubenius_session";

function loginRedirect(request, clearSession = false) {
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

export async function proxy(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return loginRedirect(request);

  try {
    const session = await prisma.session.findUnique({
      where: {
        tokenHash: createHash("sha256").update(token).digest("hex"),
      },
      select: {
        expiresAt: true,
        user: { select: { status: true, role: { select: { name: true } } } },
      },
    });

    if (
      !session ||
      session.expiresAt <= new Date() ||
      session.user.status !== "ACTIVE"
    ) {
      return loginRedirect(request, true);
    }

    const isAdmin = session.user.role.name.includes("ADMIN");
    if (request.nextUrl.pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/agent", request.url));
    }
    if (request.nextUrl.pathname.startsWith("/agent") && isAdmin) {
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
