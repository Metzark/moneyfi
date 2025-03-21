-- Verify moneyfi:table_messages on pg

BEGIN;

DO $$
BEGIN
    ASSERT EXISTS(
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'messages'
    ), 'Table public.messages does not exist';
END $$;

ROLLBACK;
