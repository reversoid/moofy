-- migrate:up

CREATE TABLE to_watch_collections (
    id INTEGER GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
    collection_id INTEGER NOT NULL REFERENCES collections(id)
);

CREATE TABLE watched_reviews (
    id INTEGER GENERATED ALWAYS AS IDENTITY,
    review_id INTEGER NOT NULL UNIQUE REFERENCES reviews(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- migrate:down

DROP TABLE watched_reviews;
DROP TABLE to_watch_collections;
