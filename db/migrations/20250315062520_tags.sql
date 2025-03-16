-- migrate:up

CREATE TABLE collection_tags (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    collection_id integer NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    name VARCHAR(32) NOT NULL,
    hex_color VARCHAR(7) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,

    UNIQUE (collection_id, name)
);

CREATE TABLE review_tags (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    review_id integer NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    collection_tag_id integer NOT NULL REFERENCES collection_tags(id) ON DELETE CASCADE,

    UNIQUE (review_id, collection_tag_id)
);

-- migrate:down

DROP TABLE review_tags;
DROP TABLE collection_tags;
