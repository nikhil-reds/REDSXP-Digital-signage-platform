ALTER TABLE "playlist_items"
  ADD COLUMN IF NOT EXISTS "zone_id" TEXT NOT NULL DEFAULT 'full-screen';
