-- Revert moneyfi:bucket_advisor_audio from pg

BEGIN;

DROP POLICY IF EXISTS "Allow authenticated users to upload files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to read files" ON storage.objects;

DELETE FROM storage.objects WHERE bucket_id = 'advisor_audio';
DELETE FROM storage.buckets WHERE id = 'advisor_audio';

COMMIT;
