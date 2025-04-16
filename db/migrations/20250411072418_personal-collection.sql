-- migrate:up

CREATE TABLE personal_collections (
    id INTEGER GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
    collection_id INTEGER NOT NULL REFERENCES collections(id)
);

ALTER TABLE reviews ADD COLUMN is_hidden BOOLEAN NOT NULL DEFAULT FALSE;

-- migrate:down

DROP TABLE personal_collections;

ALTER TABLE reviews DROP COLUMN is_hidden;
