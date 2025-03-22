-- Verify moneyfi:seed_advisors on pg

BEGIN;

SELECT * FROM public.advisors;

ROLLBACK;
