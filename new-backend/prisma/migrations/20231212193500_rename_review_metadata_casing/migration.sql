-- DropForeignKey
ALTER TABLE "review_metadata" DROP CONSTRAINT "review_metadata_reviewId_fkey";

-- AlterTable
ALTER TABLE "review_metadata" RENAME COLUMN "reviewId" TO "review_id";

-- AddForeignKey
ALTER TABLE "review_metadata" ADD CONSTRAINT "review_metadata_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
