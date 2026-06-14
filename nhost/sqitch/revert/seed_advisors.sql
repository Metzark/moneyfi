-- Revert moneyfi:seed_advisors from pg

BEGIN;

DELETE FROM moneyfi.messages;
DELETE FROM moneyfi.advisors;

COMMIT;
