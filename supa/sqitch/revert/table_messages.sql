-- Revert moneyfi:table_messages from pg

BEGIN;

ALTER publication supabase_realtime DROP TABLE public.messages;

DROP TABLE IF EXISTS public.messages;

COMMIT;
