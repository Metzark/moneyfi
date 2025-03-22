-- Revert moneyfi:rls_messages from pg

BEGIN;

DROP POLICY "Enable users to view their own data only" ON "public"."messages";
DROP POLICY "Enable users to insert their own data only" ON "public"."messages";

COMMIT;
