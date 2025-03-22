-- Deploy moneyfi:rls_messages to pg

BEGIN;

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable users to view their own data only"
ON public.messages
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
    (SELECT auth.uid()) = user_id
);

CREATE POLICY "Enable users to insert their own data only"
ON public.messages
AS PERMISSIVE
FOR INSERT
TO public
WITH CHECK (
    (SELECT auth.uid()) = user_id
);

COMMIT;
