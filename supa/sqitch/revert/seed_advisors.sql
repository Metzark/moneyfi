-- Revert moneyfi:seed_advisors from pg

BEGIN;

DELETE FROM public.messages;
DELETE FROM public.advisors;

COMMIT;
