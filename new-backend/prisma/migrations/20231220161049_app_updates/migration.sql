-- AlterTable
ALTER TABLE "user_metadata" ADD COLUMN     "seen_last_update" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "app_updates" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_updates_pkey" PRIMARY KEY ("id")
);
