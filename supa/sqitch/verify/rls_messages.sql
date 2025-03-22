-- Verify moneyfi:rls_messages on pg

BEGIN;

SELECT has_table_privilege('messages', 'select');
SELECT has_table_privilege('messages', 'insert');

ROLLBACK;
