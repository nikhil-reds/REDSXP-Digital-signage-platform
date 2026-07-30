-- Baseline objects that already exist in the live database.
-- Mark this migration as applied on existing databases; do not run it there.

CREATE TYPE "TicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

CREATE TABLE "player_media_sync" (
    "media_id" TEXT NOT NULL,
    "local_path" TEXT,
    "sync_status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "sync_error" TEXT,
    "sync_attempts" INTEGER NOT NULL DEFAULT 0,
    "synced_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "player_media_sync_pkey" PRIMARY KEY ("media_id")
);

CREATE TABLE "player_playlist_render" (
    "playlist_id" TEXT NOT NULL,
    "source_hash" TEXT,
    "render_status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "render_error" TEXT,
    "render_attempts" INTEGER NOT NULL DEFAULT 0,
    "output_path" TEXT,
    "duration_sec" INTEGER,
    "rendered_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "s3_key" TEXT,
    "s3_url" TEXT,

    CONSTRAINT "player_playlist_render_pkey" PRIMARY KEY ("playlist_id")
);

CREATE TABLE "tickets" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "user_id" TEXT,
    "assigned_to_id" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "TicketPriority" NOT NULL DEFAULT 'MEDIUM',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "tickets" ADD CONSTRAINT "tickets_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "tickets" ADD CONSTRAINT "tickets_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tickets" ADD CONSTRAINT "tickets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
