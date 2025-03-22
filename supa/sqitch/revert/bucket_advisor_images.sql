-- Revert moneyfi:bucket_advisor_images from pg

BEGIN;

DELETE FROM storage.objects WHERE bucket_id = 'advisors_images';
DELETE FROM storage.buckets WHERE id = 'advisors_images';

COMMIT;
