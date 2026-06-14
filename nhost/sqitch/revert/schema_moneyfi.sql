-- Revert moneyfi:schema_moneyfi from pg

BEGIN;

DROP SCHEMA IF EXISTS moneyfi;

COMMIT;
