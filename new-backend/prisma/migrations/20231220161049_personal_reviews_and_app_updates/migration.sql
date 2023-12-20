-- AlterTable
ALTER TABLE "user_metadata" ADD COLUMN     "seen_last_updated" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "personal_review" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "film_id" VARCHAR(32) NOT NULL,
    "description" VARCHAR(400),
    "score" SMALLINT,

    CONSTRAINT "personal_review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_updates" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_updates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "personal_review" ADD CONSTRAINT "personal_review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "personal_review" ADD CONSTRAINT "personal_review_film_id_fkey" FOREIGN KEY ("film_id") REFERENCES "film"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
