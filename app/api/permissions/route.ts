import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/admin-auth";
import { apiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { RoleScope } from "@/app/generated/prisma/client";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return apiError("Unauthenticated", 401);
  }

  const { searchParams } = new URL(request.url);
  const scopeParam = searchParams.get("scope")?.toUpperCase();

  let scopeFilter: RoleScope | undefined;
  if (scopeParam === "SYSTEM") scopeFilter = RoleScope.SYSTEM;
  if (scopeParam === "TENANT") scopeFilter = RoleScope.TENANT;

  const permissions = await prisma.permission.findMany({
    where: scopeFilter ? { scope: scopeFilter } : undefined,
    orderBy: [{ resource: "asc" }, { action: "asc" }],
  });

  return NextResponse.json({
    success: true,
    data: permissions,
  });
}
