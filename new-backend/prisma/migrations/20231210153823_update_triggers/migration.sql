-- RenameForeignKey
ALTER TABLE "film_metadata" RENAME CONSTRAINT "film_metadata_filmId_fkey" TO "film_metadata_film_id_fkey";

-- RenameForeignKey
ALTER TABLE "list_metadata" RENAME CONSTRAINT "list_metadata_listId_fkey" TO "list_metadata_list_id_fkey";

-- RenameForeignKey
ALTER TABLE "user_metadata" RENAME CONSTRAINT "user_metadata_userId_fkey" TO "user_metadata_user_id_fkey";
