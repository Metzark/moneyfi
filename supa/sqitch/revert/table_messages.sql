-- Revert moneyfi:table_messages from pg

BEGIN;

DROP TABLE IF EXISTS public.messages;

COMMIT;
