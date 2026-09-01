import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { apiError, databaseError, readJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/rbac";
import { readFeatureBody } from "../route";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const auth = await requireAdmin(request, PERMISSIONS.ADMIN_PLANS_WRITE);
  if (auth.response) return auth.response;

  const { id } = await params;
  const existing = await prisma.feature.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return apiError("Feature not found.", 404);

  const { errors, data } = readFeatureBody(await readJson(request));
  if (errors.length > 0) return apiError("Please correct the highlighted fields.", 422, errors);

  try {
    const clash = await prisma.feature.findFirst({
      where: { key: data.key, NOT: { id } },
      select: { id: true },
    });
    if (clash) return apiError("A feature with this key already exists.", 409);

    const feature = await prisma.feature.update({
      where: { id },
      data,
      include: {
        plans: { select: { plan: { select: { id: true, name: true } } } },
        _count: { select: { overrides: true } },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Feature “${feature.name}” updated.`,
      data: {
        ...feature,
        plans: feature.plans.map((link) => link.plan),
        overrideCount: feature._count.overrides,
      },
    });
  } catch (error) {
    return databaseError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = await requireAdmin(request, PERMISSIONS.ADMIN_PLANS_WRITE);
  if (auth.response) return auth.response;

  const { id } = await params;
  const feature = await prisma.feature.findUnique({
    where: { id },
    select: { id: true, key: true, name: true, _count: { select: { plans: true, overrides: true } } },
  });
  if (!feature) return apiError("Feature not found.", 404);

  // Deleting a feature that code still calls requireFeature() on turns it off
  // everywhere with no trace. Make the caller detach it first, so the plans it
  // is on are visible at the moment of deciding.
  if (feature._count.plans > 0) {
    return apiError(
      `“${feature.name}” is on ${feature._count.plans} plan(s). Remove it from them first.`,
      409,
    );
  }

  try {
    await prisma.feature.delete({ where: { id } });
    return NextResponse.json({
      success: true,
      message: `Feature “${feature.name}” deleted${feature._count.overrides > 0 ? ` along with ${feature._count.overrides} tenant override(s)` : ""}.`,
    });
  } catch (error) {
    return databaseError(error);
  }
}
