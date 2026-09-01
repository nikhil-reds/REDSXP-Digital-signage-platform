import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { apiError, databaseError, readJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/rbac";

type Params = { params: Promise<{ id: string }> };

/**
 * Replaces a plan's entitlements wholesale. The admin UI edits a checkbox
 * matrix, so it always knows the complete desired set — sending the whole set
 * avoids an add/remove diff protocol and makes the write idempotent.
 */
export async function PUT(request: NextRequest, { params }: Params) {
  const auth = await requireAdmin(request, PERMISSIONS.ADMIN_PLANS_WRITE);
  if (auth.response) return auth.response;

  const { id } = await params;
  const plan = await prisma.plan.findUnique({ where: { id }, select: { id: true, name: true } });
  if (!plan) return apiError("Plan not found.", 404);

  const body = await readJson(request);
  const featureIds = Array.isArray(body?.featureIds)
    ? body.featureIds.filter((value): value is string => typeof value === "string")
    : null;
  if (!featureIds) return apiError("featureIds must be an array of feature ids.", 422);

  try {
    const known = await prisma.feature.findMany({
      where: { id: { in: featureIds } },
      select: { id: true },
    });
    if (known.length !== new Set(featureIds).size) {
      return apiError("One or more features no longer exist.", 422);
    }

    await prisma.$transaction([
      prisma.planFeature.deleteMany({ where: { planId: id } }),
      prisma.planFeature.createMany({
        data: known.map((feature) => ({ planId: id, featureId: feature.id })),
        skipDuplicates: true,
      }),
    ]);

    const updated = await prisma.plan.findUnique({
      where: { id },
      include: { features: { select: { feature: { select: { id: true, key: true, name: true } } } } },
    });

    return NextResponse.json({
      success: true,
      message: `Entitlements updated for “${plan.name}”.`,
      data: { ...updated, features: updated?.features.map((link) => link.feature) ?? [] },
    });
  } catch (error) {
    return databaseError(error);
  }
}
