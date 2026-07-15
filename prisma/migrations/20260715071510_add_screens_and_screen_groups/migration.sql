-- AlterEnum
ALTER TYPE "DeviceStatus" ADD VALUE 'DELAYED' BEFORE 'OFFLINE';

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('NONE', 'MEDIUM', 'HIGH', 'CRITICAL');

-- AlterTable
ALTER TABLE "devices" ADD COLUMN     "alerts_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "alerts_severity" "AlertSeverity" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "group_id" TEXT,
ADD COLUMN     "storage_percent" INTEGER;

-- CreateTable
CREATE TABLE "device_groups" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "schedule_label" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "current_playlist_id" TEXT,

    CONSTRAINT "device_groups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "device_groups_tenant_id_name_key" ON "device_groups"("tenant_id", "name");

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "device_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_groups" ADD CONSTRAINT "device_groups_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_groups" ADD CONSTRAINT "device_groups_current_playlist_id_fkey" FOREIGN KEY ("current_playlist_id") REFERENCES "playlists"("id") ON DELETE SET NULL ON UPDATE CASCADE;
