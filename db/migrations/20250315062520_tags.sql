-- migrate:up

CREATE TABLE collection_tags (
    id integer PRIMARY KEY,
    collection_id integer NOT NULL REFERENCES collections(id),
    name VARCHAR(32) NOT NULL,
    hsl_color VARCHAR(32) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,

    UNIQUE (collection_id, name)
);

CREATE TABLE review_tags (
    id integer PRIMARY KEY,
    review_id integer NOT NULL REFERENCES reviews(id),
    collection_tag_id integer NOT NULL REFERENCES collection_tags(id),

    UNIQUE (review_id, collection_tag_id)
);

-- migrate:down

DROP TABLE review_tags;
DROP TABLE collection_tags;
