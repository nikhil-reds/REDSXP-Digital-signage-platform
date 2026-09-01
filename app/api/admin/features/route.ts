import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { apiError, databaseError, readJson } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/rbac";
import { FeatureKind } from "@/app/generated/prisma/client";

/** snake_case, because keys end up as string literals in code and in the UI. */
const KEY_PATTERN = /^[a-z][a-z0-9_]*$/;

export function readFeatureBody(body: Record<string, unknown> | null) {
  const errors: string[] = [];

  const key = typeof body?.key === "string" ? body.key.trim() : "";
  if (!key) errors.push("Feature key is required.");
  else if (!KEY_PATTERN.test(key)) {
    errors.push("Feature key must be snake_case: lowercase letters, digits and underscores.");
  }

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) errors.push("Feature name is required.");

  const kind = body?.kind === "FLAG" ? FeatureKind.FLAG : FeatureKind.ENTITLEMENT;

  // enabled and rolloutPct are meaningful only for flags. Storing them on an
  // entitlement would create a second, invisible switch nobody looks for.
  let enabled: boolean | null = null;
  let rolloutPct: number | null = null;
  if (kind === FeatureKind.FLAG) {
    enabled = body?.enabled === undefined ? true : body.enabled === true;
    if (body?.rolloutPct === null || body?.rolloutPct === undefined || body?.rolloutPct === "") {
      rolloutPct = 100;
    } else {
      const parsed = Number(body.rolloutPct);
      if (!Number.isInteger(parsed) || parsed < 0 || parsed > 100) {
        errors.push("Rollout must be a whole number between 0 and 100.");
      } else {
        rolloutPct = parsed;
      }
    }
  }

  return {
    errors,
    data: {
      key,
      name,
      description:
        typeof body?.description === "string" ? body.description.trim() || null : null,
      kind,
      enabled,
      rolloutPct,
    },
  };
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request, PERMISSIONS.ADMIN_PLANS_READ);
  if (auth.response) return auth.response;

  const kindParam = request.nextUrl.searchParams.get("kind");
  const kind =
    kindParam === "FLAG"
      ? FeatureKind.FLAG
      : kindParam === "ENTITLEMENT"
        ? FeatureKind.ENTITLEMENT
        : undefined;

  try {
    const features = await prisma.feature.findMany({
      where: kind ? { kind } : undefined,
      include: {
        plans: { select: { plan: { select: { id: true, name: true } } } },
        _count: { select: { overrides: true } },
      },
      orderBy: [{ kind: "asc" }, { key: "asc" }],
    });

    return NextResponse.json({
      success: true,
      data: features.map((feature) => ({
        ...feature,
        plans: feature.plans.map((link) => link.plan),
        overrideCount: feature._count.overrides,
      })),
    });
  } catch (error) {
    return databaseError(error);
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request, PERMISSIONS.ADMIN_PLANS_WRITE);
  if (auth.response) return auth.response;

  const { errors, data } = readFeatureBody(await readJson(request));
  if (errors.length > 0) return apiError("Please correct the highlighted fields.", 422, errors);

  try {
    const existing = await prisma.feature.findUnique({
      where: { key: data.key },
      select: { id: true },
    });
    if (existing) return apiError("A feature with this key already exists.", 409);

    const feature = await prisma.feature.create({ data });
    return NextResponse.json(
      {
        success: true,
        message: `Feature “${feature.name}” created.`,
        data: { ...feature, plans: [], overrideCount: 0 },
      },
      { status: 201 },
    );
  } catch (error) {
    return databaseError(error);
  }
}
