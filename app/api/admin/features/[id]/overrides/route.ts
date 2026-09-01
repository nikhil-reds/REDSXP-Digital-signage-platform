import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { apiError, databaseError, readJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/rbac";

type Params = { params: Promise<{ id: string }> };

/** Every tenant override on one feature — what the flag table's override cell opens. */
export async function GET(request: NextRequest, { params }: Params) {
  const auth = await requireAdmin(request, PERMISSIONS.ADMIN_PLANS_READ);
  if (auth.response) return auth.response;

  const { id } = await params;
  const feature = await prisma.feature.findUnique({
    where: { id },
    select: { id: true, key: true, name: true },
  });
  if (!feature) return apiError("Feature not found.", 404);

  try {
    const [overrides, tenants] = await Promise.all([
      prisma.tenantFeature.findMany({
        where: { featureId: id },
        select: {
          enabled: true,
          note: true,
          updatedAt: true,
          tenant: { select: { id: true, name: true, slug: true } },
        },
        orderBy: { updatedAt: "desc" },
      }),
      // The drawer needs somewhere to add an override from.
      prisma.tenant.findMany({ select: { id: true, name: true, slug: true }, orderBy: { name: "asc" } }),
    ]);

    return NextResponse.json({ success: true, data: { feature, overrides, tenants } });
  } catch (error) {
    return databaseError(error);
  }
}

/**
 * Set or clear one tenant's override. `enabled: null` removes the row, which is
 * the "no opinion" case — deliberately distinct from an explicit `false`, which
 * turns the feature off for a tenant whose plan would otherwise grant it.
 */
export async function PUT(request: NextRequest, { params }: Params) {
  const auth = await requireAdmin(request, PERMISSIONS.ADMIN_PLANS_WRITE);
  if (auth.response) return auth.response;

  const { id } = await params;
  const feature = await prisma.feature.findUnique({ where: { id }, select: { id: true, name: true } });
  if (!feature) return apiError("Feature not found.", 404);

  const body = await readJson(request);
  const tenantId = typeof body?.tenantId === "string" ? body.tenantId.trim() : "";
  if (!tenantId) return apiError("tenantId is required.", 422);

  const enabled = body?.enabled === null ? null : body?.enabled === true;
  const note = typeof body?.note === "string" ? body.note.trim() || null : null;

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true, name: true },
    });
    if (!tenant) return apiError("Tenant not found.", 404);

    if (enabled === null) {
      await prisma.tenantFeature.deleteMany({ where: { tenantId, featureId: id } });
      return NextResponse.json({
        success: true,
        message: `Override cleared for ${tenant.name} — it now follows its plan.`,
      });
    }

    await prisma.tenantFeature.upsert({
      where: { tenantId_featureId: { tenantId, featureId: id } },
      update: { enabled, note },
      create: { tenantId, featureId: id, enabled, note },
    });

    return NextResponse.json({
      success: true,
      message: `“${feature.name}” forced ${enabled ? "on" : "off"} for ${tenant.name}.`,
    });
  } catch (error) {
    return databaseError(error);
  }
}
