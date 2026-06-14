-- Verify moneyfi:seed_advisors on pg

BEGIN;

SELECT * FROM moneyfi.advisors;

ROLLBACK;
