-- AlterTable
ALTER TABLE "player_registrations"
ADD COLUMN "pairing_code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "player_registrations_pairing_code_key" ON "player_registrations"("pairing_code");
