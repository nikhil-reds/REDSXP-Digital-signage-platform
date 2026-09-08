import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { apiError, databaseError, readJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/rbac";
import { readPrice, readQuota } from "../route";

const PLAN_INCLUDE = {
  features: { select: { feature: { select: { id: true, key: true, name: true } } } },
  _count: { select: { subscriptions: true } },
} as const;

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const auth = await requireAdmin(request, PERMISSIONS.ADMIN_PLANS_READ);
  if (auth.response) return auth.response;

  const { id } = await params;
  const plan = await prisma.plan.findUnique({ where: { id }, include: PLAN_INCLUDE });
  if (!plan) return apiError("Plan not found.", 404);

  return NextResponse.json({
    success: true,
    data: {
      ...plan,
      features: plan.features.map((link) => link.feature),
      subscriberCount: plan._count.subscriptions,
    },
  });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const auth = await requireAdmin(request, PERMISSIONS.ADMIN_PLANS_WRITE);
  if (auth.response) return auth.response;

  const { id } = await params;
  const existing = await prisma.plan.findUnique({ where: { id }, select: { id: true, isDefault: true } });
  if (!existing) return apiError("Plan not found.", 404);

  const body = await readJson(request);
  const errors: string[] = [];
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) errors.push("Plan name is required.");

  const isDefault = body?.isDefault === true;
  // Exactly one fallback plan, and it can only be moved, never removed —
  // otherwise unsubscribed tenants resolve to nothing and lose every feature.
  if (existing.isDefault && !isDefault) {
    errors.push("Another plan must be made the default before this one can give it up.");
  }

  const data = {
    name,
    description: typeof body?.description === "string" ? body.description.trim() || null : null,
    priceMonthly: readPrice(body?.priceMonthly ?? 0, "Monthly price", errors),
    priceYearly: readPrice(body?.priceYearly ?? 0, "Yearly price", errors),
    maxDevices: readQuota(body?.maxDevices, "Screens", errors),
    maxStorageGb: readQuota(body?.maxStorageGb, "Storage", errors),
    maxUsers: readQuota(body?.maxUsers, "Seats", errors),
    maxRules: readQuota(body?.maxRules, "Sensor rules", errors),
    analyticsRetentionDays: readQuota(body?.analyticsRetentionDays, "Analytics retention", errors),
    sortOrder: readPrice(body?.sortOrder ?? 0, "Sort order", errors),
  };

  if (errors.length > 0) return apiError("Please correct the highlighted fields.", 422, errors);

  try {
    const clash = await prisma.plan.findFirst({
      where: { name, NOT: { id } },
      select: { id: true },
    });
    if (clash) return apiError("A plan with this name already exists.", 409);

    const plan = await prisma.$transaction(async (tx) => {
      if (isDefault && !existing.isDefault) {
        await tx.plan.updateMany({ where: { isDefault: true }, data: { isDefault: false } });
      }
      return tx.plan.update({
        where: { id },
        data: { ...data, isDefault },
        include: PLAN_INCLUDE,
      });
    });

    return NextResponse.json({
      success: true,
      message: `Plan “${plan.name}” updated.`,
      data: {
        ...plan,
        features: plan.features.map((link) => link.feature),
        subscriberCount: plan._count.subscriptions,
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
  const plan = await prisma.plan.findUnique({
    where: { id },
    select: { id: true, name: true, isDefault: true, _count: { select: { subscriptions: true } } },
  });
  if (!plan) return apiError("Plan not found.", 404);

  if (plan.isDefault) {
    return apiError("The default plan cannot be deleted. Make another plan the default first.", 409);
  }
  if (plan._count.subscriptions > 0) {
    return apiError(
      `“${plan.name}” has ${plan._count.subscriptions} subscription(s). Move those tenants to another plan first.`,
      409,
    );
  }

  try {
    await prisma.plan.delete({ where: { id } });
    return NextResponse.json({ success: true, message: `Plan “${plan.name}” deleted.` });
  } catch (error) {
    return databaseError(error);
  }
}
