-- Verify moneyfi:table_advisors on pg

BEGIN;

DO $$
BEGIN
    ASSERT EXISTS(
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'advisors'
    ), 'Table public.advisors does not exist';
END $$;

ROLLBACK;
