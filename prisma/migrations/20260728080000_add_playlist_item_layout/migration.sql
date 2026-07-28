ALTER TABLE "playlist_items"
  ADD COLUMN IF NOT EXISTS "fit" TEXT NOT NULL DEFAULT 'scale-down',
  ADD COLUMN IF NOT EXISTS "object_position" TEXT NOT NULL DEFAULT 'center';
