-- Revert moneyfi:table_advisors from pg

BEGIN;

DROP TABLE IF EXISTS moneyfi.advisors;

COMMIT;
