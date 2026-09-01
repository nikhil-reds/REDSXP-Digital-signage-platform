import { NextRequest, NextResponse } from "next/server";
import { apiError, databaseError, readJson } from "@/lib/api";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/app/generated/prisma/client";

const PAGE_SIZE = 10;
const BYTES_PER_GB = 1024 ** 3;
const STATUS_FILTERS = new Set(["ALL", "ACTIVE", "TRIAL", "PAST_DUE", "SUSPENDED"]);

type RowStatus = "Active" | "Trial" | "Past Due" | "Suspended";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// The table's status column blends tenant lifecycle (ACTIVE/SUSPENDED) with the
// billing state of the tenant's latest subscription (TRIAL/PAST_DUE).
function statusWhere(status: string): Prisma.TenantWhereInput {
  switch (status) {
    case "SUSPENDED":
      return { status: "SUSPENDED" };
    case "TRIAL":
      return { status: "ACTIVE", subscriptions: { some: { status: "TRIAL" } } };
    case "PAST_DUE":
      return { status: "ACTIVE", subscriptions: { some: { status: "PAST_DUE" } } };
    case "ACTIVE":
      return {
        status: "ACTIVE",
        subscriptions: { none: { status: { in: ["TRIAL", "PAST_DUE"] } } },
      };
    default:
      return {};
  }
}

function rowStatus(
  tenantStatus: "ACTIVE" | "SUSPENDED",
  subscriptionStatus?: "ACTIVE" | "PAST_DUE" | "CANCELLED" | "TRIAL",
): RowStatus {
  if (tenantStatus === "SUSPENDED") return "Suspended";
  if (subscriptionStatus === "TRIAL") return "Trial";
  if (subscriptionStatus === "PAST_DUE") return "Past Due";
  return "Active";
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const search = request.nextUrl.searchParams.get("search")?.trim() || "";
  const status = request.nextUrl.searchParams.get("status") || "ALL";
  const plan = request.nextUrl.searchParams.get("plan") || "ALL";
  const requestedPage = Number(request.nextUrl.searchParams.get("page") || "1");
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  if (!STATUS_FILTERS.has(status)) return apiError("Invalid status filter.", 422);

  const where: Prisma.TenantWhereInput = {
    ...statusWhere(status),
    ...(plan !== "ALL" ? { subscriptions: { some: { plan: { name: plan } } } } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
            { customDomain: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  try {
    const [tenants, total, suspended, trial, pastDue, planOptions] = await prisma.$transaction([
      prisma.tenant.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: {
          id: true,
          name: true,
          slug: true,
          customDomain: true,
          status: true,
          createdAt: true,
          subscriptions: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: {
              status: true,
              plan: { select: { name: true, priceMonthly: true, maxStorageGb: true } },
            },
          },
        },
      }),
      prisma.tenant.count({ where }),
      prisma.tenant.count({ where: statusWhere("SUSPENDED") }),
      prisma.tenant.count({ where: statusWhere("TRIAL") }),
      prisma.tenant.count({ where: statusWhere("PAST_DUE") }),
      prisma.plan.findMany({ orderBy: { priceMonthly: "asc" }, select: { id: true, name: true } }),
    ]);

    // Screen and storage usage are aggregated separately so the tenant page stays
    // one query per metric instead of one per row.
    const tenantIds = tenants.map((tenant) => tenant.id);
    const [deviceCounts, mediaUsage] = await Promise.all([
      tenantIds.length
        ? prisma.device.groupBy({
            by: ["tenantId", "status"],
            where: { tenantId: { in: tenantIds } },
            _count: { _all: true },
          })
        : Promise.resolve([]),
      tenantIds.length
        ? prisma.media.groupBy({
            by: ["tenantId"],
            where: { tenantId: { in: tenantIds } },
            _sum: { sizeBytes: true },
          })
        : Promise.resolve([]),
    ]);

    const screens = new Map<string, { active: number; total: number }>();
    for (const group of deviceCounts) {
      const entry = screens.get(group.tenantId) ?? { active: 0, total: 0 };
      entry.total += group._count._all;
      if (group.status === "ONLINE") entry.active += group._count._all;
      screens.set(group.tenantId, entry);
    }

    const storage = new Map<string, number>(
      mediaUsage.map((group) => [
        group.tenantId,
        Number(group._sum.sizeBytes ?? BigInt(0)) / BYTES_PER_GB,
      ]),
    );

    const rows = tenants.map((tenant) => {
      const subscription = tenant.subscriptions[0];
      const billable = subscription?.status === "ACTIVE" || subscription?.status === "PAST_DUE";
      const tenantScreens = screens.get(tenant.id) ?? { active: 0, total: 0 };

      return {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        customDomain: tenant.customDomain,
        status: rowStatus(tenant.status, subscription?.status),
        plan: subscription?.plan.name ?? null,
        mrr: billable ? subscription.plan.priceMonthly : 0,
        screensActive: tenantScreens.active,
        screensTotal: tenantScreens.total,
        storageUsedGb: Number((storage.get(tenant.id) ?? 0).toFixed(2)),
        storageLimitGb: subscription?.plan.maxStorageGb ?? null,
        createdAt: tenant.createdAt,
      };
    });

    const overall = await prisma.tenant.count();

    return NextResponse.json({
      success: true,
      data: {
        tenants: rows,
        pagination: {
          page,
          pageSize: PAGE_SIZE,
          total,
          totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
        },
        summary: {
          total: overall,
          active: overall - suspended - trial - pastDue,
          trial,
          pastDue,
          suspended,
        },
        planOptions,
      },
    });
  } catch (error) {
    return databaseError(error);
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const body = await readJson(request);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const slug = typeof body?.slug === "string" && body.slug.trim() ? slugify(body.slug) : slugify(name);
  const customDomain = typeof body?.customDomain === "string" ? body.customDomain.trim() : "";
  const brandLogoUrl = typeof body?.brandLogoUrl === "string" ? body.brandLogoUrl.trim() : "";
  const primaryColor = typeof body?.primaryColor === "string" ? body.primaryColor.trim() : "#1A4E8C";
  const planId = typeof body?.planId === "string" ? body.planId.trim() : "";
  const trialEndDate = typeof body?.trialEndDate === "string" ? body.trialEndDate.trim() : "";
  const trialEndsAt = trialEndDate ? new Date(trialEndDate) : null;

  const errors = [
    ...(!name ? ["Tenant name is required."] : []),
    ...(!slug ? ["A valid slug is required."] : []),
    ...(!/^#[0-9a-fA-F]{6}$/.test(primaryColor) ? ["Primary color must be a hex value like #1A4E8C."] : []),
    ...(trialEndsAt && Number.isNaN(trialEndsAt.getTime()) ? ["Trial end date is invalid."] : []),
    ...(trialEndDate && !planId ? ["Select a plan before setting a trial end date."] : []),
  ];
  if (errors.length) return apiError("Validation failed.", 422, errors);

  try {
    if (await prisma.tenant.findUnique({ where: { slug }, select: { id: true } })) {
      return apiError("A tenant with this slug already exists.", 409);
    }

    const plan = planId
      ? await prisma.plan.findUnique({ where: { id: planId }, select: { id: true } })
      : null;
    if (planId && !plan) return apiError("The selected plan no longer exists.", 422);

    const tenant = await prisma.$transaction(async (tx) => {
      const created = await tx.tenant.create({
        data: {
          name,
          slug,
          primaryColor,
          ...(customDomain ? { customDomain } : {}),
          ...(brandLogoUrl ? { brandLogoUrl } : {}),
        },
        select: { id: true, name: true, slug: true, customDomain: true, status: true },
      });

      if (plan) {
        await tx.subscription.create({
          data: {
            tenantId: created.id,
            planId: plan.id,
            status: trialEndsAt ? "TRIAL" : "ACTIVE",
            startDate: new Date(),
            ...(trialEndsAt ? { endDate: trialEndsAt } : {}),
          },
        });
      }

      await tx.auditLog.create({
        data: {
          tenantId: auth.admin.tenantId,
          userId: auth.admin.id,
          action: "TENANT_CREATED",
          description: `Created tenant ${name} (${slug})`,
          ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
          userAgent: request.headers.get("user-agent"),
        },
      });

      return created;
    });

    return NextResponse.json(
      { success: true, message: "Tenant created successfully.", data: { tenant } },
      { status: 201 },
    );
  } catch (error) {
    return databaseError(error);
  }
}
