-- RenameForeignKey
ALTER TABLE "review" RENAME CONSTRAINT "review_filmId_fkey" TO "review_film_id_fkey";

-- RenameForeignKey
ALTER TABLE "to_watch" RENAME CONSTRAINT "to_watch_filmId_fkey" TO "to_watch_film_id_fkey";
