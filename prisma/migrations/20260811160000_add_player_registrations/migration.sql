-- CreateEnum
CREATE TYPE "PlayerPlatform" AS ENUM ('LINUX', 'WINDOWS');

-- CreateEnum
CREATE TYPE "PlayerRegistrationStatus" AS ENUM ('DOWNLOADED', 'INSTALLED', 'CLAIMED', 'EXPIRED');

-- AlterTable
ALTER TABLE "devices"
ADD COLUMN "install_id" TEXT,
ADD COLUMN "platform" "PlayerPlatform",
ADD COLUMN "player_registration_id" TEXT;

-- CreateTable
CREATE TABLE "player_registrations" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "agent_user_id" TEXT,
    "platform" "PlayerPlatform" NOT NULL,
    "download_token_hash" TEXT NOT NULL,
    "install_token_hash" TEXT NOT NULL,
    "install_id" TEXT,
    "device_id" TEXT,
    "hostname" TEXT,
    "os_version" TEXT,
    "app_version" TEXT,
    "ip_address" TEXT,
    "status" "PlayerRegistrationStatus" NOT NULL DEFAULT 'DOWNLOADED',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "downloaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "installed_at" TIMESTAMP(3),
    "claimed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "devices_install_id_key" ON "devices"("install_id");

-- CreateIndex
CREATE UNIQUE INDEX "devices_player_registration_id_key" ON "devices"("player_registration_id");

-- CreateIndex
CREATE UNIQUE INDEX "player_registrations_download_token_hash_key" ON "player_registrations"("download_token_hash");

-- CreateIndex
CREATE UNIQUE INDEX "player_registrations_install_token_hash_key" ON "player_registrations"("install_token_hash");

-- CreateIndex
CREATE UNIQUE INDEX "player_registrations_install_id_key" ON "player_registrations"("install_id");

-- CreateIndex
CREATE UNIQUE INDEX "player_registrations_device_id_key" ON "player_registrations"("device_id");

-- CreateIndex
CREATE INDEX "player_registrations_tenant_id_status_idx" ON "player_registrations"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "player_registrations_agent_user_id_idx" ON "player_registrations"("agent_user_id");

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_player_registration_id_fkey" FOREIGN KEY ("player_registration_id") REFERENCES "player_registrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_registrations" ADD CONSTRAINT "player_registrations_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_registrations" ADD CONSTRAINT "player_registrations_agent_user_id_fkey" FOREIGN KEY ("agent_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
