-- migrate:up

-- Rename columns in film
ALTER TABLE public.film RENAME COLUMN "filmLength" TO film_length;
ALTER TABLE public.film RENAME COLUMN "posterPreviewUrl" TO poster_preview_url;
ALTER TABLE public.film RENAME COLUMN "posterUrl" TO poster_url;

-- Rename columns in review
ALTER TABLE public.review RENAME COLUMN "filmId" TO film_id;
ALTER TABLE public.review RENAME COLUMN "userId" TO user_id;
ALTER TABLE public.review RENAME COLUMN "listId" TO list_id;

-- Rename columns in favorite_list
ALTER TABLE public.favorite_list RENAME COLUMN "userId" TO user_id;
ALTER TABLE public.favorite_list RENAME COLUMN "listId" TO list_id;

-- Rename columns in list
ALTER TABLE public.list RENAME COLUMN "userId" TO user_id;

-- Rename columns in comment
ALTER TABLE public.comment RENAME COLUMN "userId" TO user_id;
ALTER TABLE public.comment RENAME COLUMN "replyToId" TO reply_to_id;
ALTER TABLE public.comment RENAME COLUMN "listId" TO list_id;

-- Rename columns in comment_like
ALTER TABLE public.comment_like RENAME COLUMN "userId" TO user_id;
ALTER TABLE public.comment_like RENAME COLUMN "commentId" TO comment_id;

-- Rename columns in list_like
ALTER TABLE public.list_like RENAME COLUMN "userId" TO user_id;
ALTER TABLE public.list_like RENAME COLUMN "listId" TO list_id;

-- Rename columns in list_view
ALTER TABLE public.list_view RENAME COLUMN "userId" TO user_id;
ALTER TABLE public.list_view RENAME COLUMN "listId" TO list_id;

-- Rename columns in to_watch
ALTER TABLE public.to_watch RENAME COLUMN "userId" TO user_id;
ALTER TABLE public.to_watch RENAME COLUMN "filmId" TO film_id;

-- migrate:down

-- Restore columns in film
ALTER TABLE public.film RENAME COLUMN film_length TO "filmLength";
ALTER TABLE public.film RENAME COLUMN poster_preview_url TO "posterPreviewUrl";
ALTER TABLE public.film RENAME COLUMN poster_url TO "posterUrl";

-- Restore columns in review
ALTER TABLE public.review RENAME COLUMN film_id TO "filmId";
ALTER TABLE public.review RENAME COLUMN user_id TO "userId";
ALTER TABLE public.review RENAME COLUMN list_id TO "listId";

-- Restore columns in favorite_list
ALTER TABLE public.favorite_list RENAME COLUMN user_id TO "userId";
ALTER TABLE public.favorite_list RENAME COLUMN list_id TO "listId";

-- Restore columns in list
ALTER TABLE public.list RENAME COLUMN user_id TO "userId";

-- Restore columns in comment
ALTER TABLE public.comment RENAME COLUMN user_id TO "userId";
ALTER TABLE public.comment RENAME COLUMN reply_to_id TO "replyToId";
ALTER TABLE public.comment RENAME COLUMN list_id TO "listId";

-- Restore columns in comment_like
ALTER TABLE public.comment_like RENAME COLUMN user_id TO "userId";
ALTER TABLE public.comment_like RENAME COLUMN comment_id TO "commentId";

-- Restore columns in list_like
ALTER TABLE public.list_like RENAME COLUMN user_id TO "userId";
ALTER TABLE public.list_like RENAME COLUMN list_id TO "listId";

-- Restore columns in list_view
ALTER TABLE public.list_view RENAME COLUMN user_id TO "userId";
ALTER TABLE public.list_view RENAME COLUMN list_id TO "listId";

-- Restore columns in to_watch
ALTER TABLE public.to_watch RENAME COLUMN user_id TO "userId";
ALTER TABLE public.to_watch RENAME COLUMN film_id TO "filmId";

