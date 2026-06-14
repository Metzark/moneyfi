-- Deploy moneyfi:schema_moneyfi to pg

BEGIN;

CREATE SCHEMA IF NOT EXISTS moneyfi;

COMMIT;
