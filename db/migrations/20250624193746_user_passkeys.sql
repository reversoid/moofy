-- migrate:up

CREATE TABLE user_passkeys (
    nickname VARCHAR(32) NOT NULL,
    id VARCHAR(255) PRIMARY KEY,
    public_key bytea NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    webauthn_user_id VARCHAR(255) NOT NULL,
    counter BIGINT NOT NULL,
    device_type VARCHAR(32) NOT NULL,
    backup BOOLEAN NOT NULL,
    transports VARCHAR(16)[],
    UNIQUE (webauthn_user_id, user_id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);


-- migrate:down

DROP TABLE user_passkeys;


