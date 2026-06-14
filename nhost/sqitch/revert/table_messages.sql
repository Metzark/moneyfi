-- Revert moneyfi:table_messages from pg

BEGIN;

DROP TABLE IF EXISTS moneyfi.messages;

COMMIT;
