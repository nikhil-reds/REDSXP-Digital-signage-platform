ALTER TABLE "media"
ADD COLUMN "source_type" TEXT NOT NULL DEFAULT 'upload',
ADD COLUMN "external_url" TEXT;
