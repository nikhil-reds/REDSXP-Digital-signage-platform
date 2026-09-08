-- AlterTable
ALTER TABLE "devices"
ADD COLUMN "screen_resolution" TEXT,
ADD COLUMN "display_count" INTEGER,
ADD COLUMN "timezone" TEXT,
ADD COLUMN "mac_address" TEXT,
ADD COLUMN "app_install_path" TEXT,
ADD COLUMN "last_heartbeat_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "player_registrations"
ADD COLUMN "screen_resolution" TEXT,
ADD COLUMN "display_count" INTEGER,
ADD COLUMN "timezone" TEXT,
ADD COLUMN "mac_address" TEXT,
ADD COLUMN "build_version" TEXT,
ADD COLUMN "arch" TEXT;
