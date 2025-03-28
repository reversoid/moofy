-- migrate:up


CREATE TABLE user_changelog_views (
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id)
);

CREATE TABLE changelogs (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

    version VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    release_date TIMESTAMP WITH TIME ZONE NOT NULL,

    has_bugfix BOOLEAN NOT NULL,
    has_feature BOOLEAN NOT NULL,
    has_improvement BOOLEAN NOT NULL
);


CREATE TYPE update_type AS ENUM ('bugfix', 'feature', 'improvement');


CREATE TABLE user_preferences (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notify_update_types update_type[] NOT NULL,
    UNIQUE (user_id)
);


-- migrate:down

DROP TABLE user_changelog_views;
DROP TABLE changelogs;
DROP TABLE user_preferences;
DROP TYPE update_type;
