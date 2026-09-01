-- Plans & features: the Feature / PlanFeature / TenantFeature tables, plus the
-- Plan columns the /admin/plans UI has always displayed but never had.
-- See docs/plans-and-features-plan.md §3.
--
-- Hand-trimmed from `prisma migrate diff`, which also wanted to drop columns
-- that exist in the database but not in schema.prisma:
--
--   devices.app_install_path, display_count, last_heartbeat_at, mac_address,
--     screen_resolution, timezone
--   player_registrations.arch, build_version, display_count, mac_address,
--     pairing_code (+ its unique index), screen_resolution, timezone
--   permissions.resource/action DROP DEFAULT
--
-- That is pre-existing drift, unrelated to this change and carrying live player
-- data, so none of it is included here. It needs deciding separately: either
-- add those fields back to schema.prisma or write a deliberate migration that
-- drops them. Until then `prisma migrate dev` will keep offering to delete them.

-- CreateEnum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'FeatureKind') THEN
    CREATE TYPE "FeatureKind" AS ENUM ('ENTITLEMENT', 'FLAG');
  END IF;
END
$$;

-- AlterTable: plans
-- Quotas become nullable, where null means unlimited. The table is empty today,
-- so this is free now and a data migration later.
ALTER TABLE "plans" ADD COLUMN IF NOT EXISTS "analytics_retention_days" INTEGER;
ALTER TABLE "plans" ADD COLUMN IF NOT EXISTS "is_default" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "plans" ADD COLUMN IF NOT EXISTS "sort_order" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "plans" ALTER COLUMN "max_devices" DROP NOT NULL;
ALTER TABLE "plans" ALTER COLUMN "max_storage_gb" DROP NOT NULL;
ALTER TABLE "plans" ALTER COLUMN "max_users" DROP NOT NULL;
ALTER TABLE "plans" ALTER COLUMN "max_rules" DROP NOT NULL;

-- At most one plan may be the no-subscription fallback.
CREATE UNIQUE INDEX IF NOT EXISTS "plans_is_default_key"
  ON "plans"("is_default") WHERE "is_default";

-- CreateTable: features
CREATE TABLE IF NOT EXISTS "features" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "kind" "FeatureKind" NOT NULL DEFAULT 'ENTITLEMENT',
    "enabled" BOOLEAN,
    "rollout_pct" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "features_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "features_key_key" ON "features"("key");

-- rollout_pct is a percentage or nothing; anything else silently mis-buckets.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'features_rollout_pct_range') THEN
    ALTER TABLE "features" ADD CONSTRAINT "features_rollout_pct_range"
      CHECK ("rollout_pct" IS NULL OR ("rollout_pct" >= 0 AND "rollout_pct" <= 100));
  END IF;
END
$$;

-- CreateTable: plan_features
CREATE TABLE IF NOT EXISTS "plan_features" (
    "plan_id" TEXT NOT NULL,
    "feature_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plan_features_pkey" PRIMARY KEY ("plan_id","feature_id")
);

-- CreateTable: tenant_features
CREATE TABLE IF NOT EXISTS "tenant_features" (
    "tenant_id" TEXT NOT NULL,
    "feature_id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_features_pkey" PRIMARY KEY ("tenant_id","feature_id")
);

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'plan_features_plan_id_fkey') THEN
    ALTER TABLE "plan_features" ADD CONSTRAINT "plan_features_plan_id_fkey"
      FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'plan_features_feature_id_fkey') THEN
    ALTER TABLE "plan_features" ADD CONSTRAINT "plan_features_feature_id_fkey"
      FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tenant_features_tenant_id_fkey') THEN
    ALTER TABLE "tenant_features" ADD CONSTRAINT "tenant_features_tenant_id_fkey"
      FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tenant_features_feature_id_fkey') THEN
    ALTER TABLE "tenant_features" ADD CONSTRAINT "tenant_features_feature_id_fkey"
      FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END
$$;
