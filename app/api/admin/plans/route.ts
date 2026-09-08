import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { apiError, databaseError, readJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/rbac";

const PLAN_INCLUDE = {
  features: { select: { feature: { select: { id: true, key: true, name: true } } } },
  _count: { select: { subscriptions: true } },
} as const;

/** null / "" / undefined all mean unlimited; anything else must be a non-negative integer. */
export function readQuota(value: unknown, label: string, errors: string[]): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    errors.push(`${label} must be a whole number of 0 or more, or empty for unlimited.`);
    return null;
  }
  return parsed;
}

export function readPrice(value: unknown, label: string, errors: string[]): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    errors.push(`${label} must be a whole number of 0 or more.`);
    return 0;
  }
  return parsed;
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request, PERMISSIONS.ADMIN_PLANS_READ);
  if (auth.response) return auth.response;

  try {
    const plans = await prisma.plan.findMany({
      include: PLAN_INCLUDE,
      orderBy: [{ sortOrder: "asc" }, { priceMonthly: "asc" }],
    });

    return NextResponse.json({
      success: true,
      data: plans.map((plan) => ({
        ...plan,
        features: plan.features.map((link) => link.feature),
        subscriberCount: plan._count.subscriptions,
      })),
    });
  } catch (error) {
    return databaseError(error);
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request, PERMISSIONS.ADMIN_PLANS_WRITE);
  if (auth.response) return auth.response;

  const body = await readJson(request);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const errors: string[] = [];
  if (!name) errors.push("Plan name is required.");

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
    const existing = await prisma.plan.findUnique({ where: { name }, select: { id: true } });
    if (existing) return apiError("A plan with this name already exists.", 409);

    const plan = await prisma.plan.create({ data, include: PLAN_INCLUDE });
    return NextResponse.json(
      {
        success: true,
        message: `Plan “${plan.name}” created.`,
        data: { ...plan, features: [], subscriberCount: 0 },
      },
      { status: 201 },
    );
  } catch (error) {
    return databaseError(error);
  }
}
