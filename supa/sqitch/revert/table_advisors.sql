-- Revert moneyfi:table_advisors from pg

BEGIN;

DROP TABLE IF EXISTS public.advisors;

COMMIT;
