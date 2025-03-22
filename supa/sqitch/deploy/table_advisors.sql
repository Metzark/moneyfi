-- Deploy moneyfi:table_advisors to pg

BEGIN;

CREATE TABLE IF NOT EXISTS public.advisors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25) NOT NULL,
    description TEXT NOT NULL,
    persona TEXT NOT NULL,
    image_url VARCHAR(255)
);


COMMIT;
