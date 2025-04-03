-- migrate:up

ALTER TABLE reviews DROP COLUMN film_kinopoisk_id;
ALTER TABLE films DROP CONSTRAINT "PK_37ec0ffe0011ccbe438a65e3c6e";
ALTER TABLE films ADD CONSTRAINT "PK_films_id" PRIMARY KEY (id);
ALTER TABLE films ADD CONSTRAINT "UNIQ_films_kinopoisk_id" UNIQUE (kinopoisk_id);

-- migrate:down

ALTER TABLE films DROP CONSTRAINT "UNIQ_films_kinopoisk_id";
ALTER TABLE films DROP CONSTRAINT "PK_films_id";
ALTER TABLE films ADD CONSTRAINT "PK_37ec0ffe0011ccbe438a65e3c6e" PRIMARY KEY (kinopoisk_id);
ALTER TABLE reviews ADD COLUMN film_kinopoisk_id VARCHAR(32) NULL;
ALTER TABLE reviews ADD CONSTRAINT fk_reivew_film_kp_id FOREIGN KEY (film_kinopoisk_id) 
          REFERENCES films (kinopoisk_id);
