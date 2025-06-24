-- migrate:up

CREATE TABLE user_passkeys (
    id VARCHAR(255) PRIMARY KEY,
    public_key bytea NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    webauthn_user_id VARCHAR(255) NOT NULL,
    counter BIGINT NOT NULL,
    deviceType VARCHAR(32) NOT NULL,
    backup BOOLEAN NOT NULL,
    transports VARCHAR(16)[],
    UNIQUE (webauthn_user_id, user_id)
);


-- migrate:down

DROP TABLE user_passkeys;


