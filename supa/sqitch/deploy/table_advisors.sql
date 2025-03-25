-- Deploy moneyfi:table_advisors to pg

BEGIN;

CREATE TABLE IF NOT EXISTS public.advisors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25) NOT NULL,
    elevenlabs_voice_id VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    persona TEXT NOT NULL,
    full_bio TEXT NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


COMMIT;
