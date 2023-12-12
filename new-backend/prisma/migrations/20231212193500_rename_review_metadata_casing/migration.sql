/*
  Warnings:

  - The primary key for the `review_metadata` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `reviewId` on the `review_metadata` table. All the data in the column will be lost.
  - Added the required column `review_id` to the `review_metadata` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "review_metadata" DROP CONSTRAINT "review_metadata_reviewId_fkey";

-- AlterTable
ALTER TABLE "review_metadata" DROP CONSTRAINT "review_metadata_pkey",
DROP COLUMN "reviewId",
ADD COLUMN     "review_id" INTEGER NOT NULL,
ADD CONSTRAINT "review_metadata_pkey" PRIMARY KEY ("review_id");

-- AddForeignKey
ALTER TABLE "review_metadata" ADD CONSTRAINT "review_metadata_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
